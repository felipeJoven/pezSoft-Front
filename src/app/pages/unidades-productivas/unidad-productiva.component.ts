import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { UnidadProductiva } from '../../components/models/unidad-productiva';
import { UnidadProductivaService } from '../../components/services/unidad-productiva.service';

@Component({
  selector: 'app-unidad-productiva',
  templateUrl: './unidad-productiva.component.html',
  styleUrls: ['./unidad-productiva.component.css']
})
export class UnidadProductivaComponent implements OnInit, OnDestroy {
  
  unidad: UnidadProductiva[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  selectedUnidad: any = null;
  private subscriptions: Subscription = new Subscription();
  private filtroSubject = new Subject<string>();

  constructor(
    private unidadProductivaService: UnidadProductivaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerUnidadesProductivas();
    this.setupFiltroSubscription();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedUnidad = null;
  }

  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
    if (isClosed) {
      this.obtenerUnidadesProductivas();
    }
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerUnidadesProductivas(filtro);
      })
    );
  }

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerUnidadesProductivas(filtro: string = ''): void {
    this.subscriptions.add(
      this.unidadProductivaService.obtenerUnidadesProductivas(filtro).subscribe({
        next: (unidades) => {
          this.unidad = unidades;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          console.error('Error al obtener unidades:', error);
        }
      })
    );
  }

  verEstado(estado: number): string {
    return estado === 0 ? 'Disponible' : 'Ocupada';
  }

  agregarEditarUnidad(newData: UnidadProductiva): void {
    if (this.selectedUnidad && newData.id === this.selectedUnidad.id) {
      const unidadIndex = this.unidad.findIndex(data => data.id === newData.id);
      if (unidadIndex !== -1) {
        this.unidad[unidadIndex] = newData;
      }
    }
    this.obtenerUnidadesProductivas();
  }

  showEdit(id: number): void {
    this.displayAddEditModal = true;
    this.selectedUnidad = id;
  }

  eliminarUnidad(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar esta unidad productiva?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.subscriptions.add(
          this.unidadProductivaService.eliminarUnidadProductiva(id).subscribe({
            next: (response: string) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: response
              });
              this.unidad = this.unidad.filter(u => u.id !== id);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Ocurrió un error al eliminar el registro'
              });
            },
            complete: () => {
              this.obtenerUnidadesProductivas();
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