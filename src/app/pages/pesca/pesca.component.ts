import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Pesca } from '../../components/models/pesca';
import { PescaService } from '../../components/services/pesca.service';

@Component({
  selector: 'app-pesca',
  templateUrl: './pesca.component.html',
  styleUrls: ['./pesca.component.css']
})
export class PescaComponent {

  pesca: Pesca[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  pescaSeleccionada: any = null;
  private subscriptions = new Subscription();
  private filtroSubject = new Subject<string>();

  constructor(
    private pescaService: PescaService,
    private confirationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerPescas();
    this.setupFiltroSubscription();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.pescaSeleccionada = null;
  }

  hideAddModal(isClosed: boolean) {
    this.obtenerPescas();
    this.displayAddEditModal = !isClosed;
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerPescas(filtro);
      })
    );
  } 

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerPescas(filtro: string = ''): void {
    this.subscriptions.add(
      this.pescaService.obtenerPescas(filtro).subscribe({
        next: (pesca) => {
          this.pesca = pesca;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          console.log('Error al obtener pescas', error);

        }
      })
    );
  }

  agregarEditarPesca(newData: Pesca): void {
    if (this.pescaSeleccionada && newData.id === this.pescaSeleccionada.id) {
      const pescaIndex = this.pesca.findIndex(data => data.id === newData.id);
      if (pescaIndex !== 1) {
        this.pesca[pescaIndex] = newData;
      }
    }
  }

  eliminarPesca(id: number): void {
    this.confirationService.confirm({
      message: '¿Quieres Eliminar este Registro?',
      header: 'Confirmacion de Eliminar Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.pescaService.eliminarPesca(id).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message })
            this.obtenerPescas();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
          }
        });
      }
    })
  }

  showEdit(id: number) {
    this.displayAddEditModal = true;
    this.pescaSeleccionada = id;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}