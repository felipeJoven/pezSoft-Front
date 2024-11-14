import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Lote } from '../../components/models/lote';
import { LoteService } from '../../components/services/lote.service';

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})
export class LoteComponent implements OnInit, OnDestroy {

  lote: Lote[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  loteSeleccionado: any = null;
  private subscriptions = new Subscription();
  private filtroSubject = new Subject<string>();
  
  constructor(
    private loteService: LoteService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerLotes();
    this.setupFiltroSubscription();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.loteSeleccionado = null;
  }

  hideAddModal(isClosed: boolean): void {
    this.displayAddEditModal = !isClosed;
    if (isClosed) {
      this.obtenerLotes();
    }
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerLotes(filtro);
      })
    );
  }

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerLotes(filtro: string = ''): void {
    this.subscriptions.add(
      this.loteService.obtenerLotes(filtro).subscribe({
        next: (lote) => {
          this.lote = lote;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          console.log('Error al obtener lotes', error);          
        }
      })
    );    
  }

  agregarEditarLote(newData: Lote): void {
    if (this.loteSeleccionado && newData.id === this.loteSeleccionado.id) {
      const loteIndex = this.lote.findIndex(data => data.id === newData.id);
      if (loteIndex !== 1) {
        this.lote[loteIndex] = newData;
      }
    }
  }

  eliminarLote(id: number): void {
    this.confirmationService.confirm({
      message: 'Quieres eliminar este lote)',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.loteService.eliminarLote(id).subscribe({
          next: (response: string) => {
            this.messageService.add({
              severity: 'success',
              detail: 'Éxito',              
            });
            this.lote = this.lote.filter( e => e.id !== id);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Ocurrió un error al eliminar el registro'
            });
          },
          complete: () => {
            this.obtenerLotes();
          }
        })
      }
    })
  }

  showEdit(id: number) {
    this.displayAddEditModal = true;
    this.loteSeleccionado = id;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}