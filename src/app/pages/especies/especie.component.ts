import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Especie } from '../../components/models/especie';
import { EspecieService } from '../../components/services/especie.service';

@Component({
  selector: 'app-especie',
  templateUrl: './especie.component.html',
  styleUrls: ['./especie.component.css']
})
export class EspecieComponent implements OnInit, OnDestroy {

  especie: Especie[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  especieSeleccionada: any = null;
  private subscriptions = new Subscription();
  private filtroSubject = new Subject<string>();

  constructor(
    private especieService: EspecieService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerEspecies();
    this.setupFiltroSubscription();
  }

  showAddModal(): void {
    this.displayAddEditModal = true;
    this.especieSeleccionada = null;
  }

  hideAddModal(isClosed: boolean): void {
    this.displayAddEditModal = !isClosed;
    if (isClosed) {
      this.obtenerEspecies();
    }
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerEspecies(filtro);
      })
    );
  }

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerEspecies(filtro: string = ''): void {
    this.subscriptions.add(
      this.especieService.obtenerEspecies(filtro).subscribe({
        next: (especie) => {
          this.especie = especie;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          console.error('Error al obtener especies:', error);
        }
      })
    );
  }

  agregarEditarEspecie(newData: Especie): void {
    if (this.especieSeleccionada && newData.id === this.especieSeleccionada.id) {
      const especieIndex = this.especie.findIndex(data => data.id === newData.id);
      if (especieIndex !== -1) {
        this.especie[especieIndex] = newData;
      }
    }
    this.obtenerEspecies();
  }

  showEdit(id: number): void {
    this.displayAddEditModal = true;
    this.especieSeleccionada = id;
  }

  eliminarEspecie(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar esta especie?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.subscriptions.add(
          this.especieService.eliminarEspecie(id).subscribe({
            next: (response: string) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: response
              });
              this.especie = this.especie.filter(e => e.id !== id);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Ocurrió un error al eliminar el registro'
              });
            },
            complete: () => {
              this.obtenerEspecies();
            }
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}