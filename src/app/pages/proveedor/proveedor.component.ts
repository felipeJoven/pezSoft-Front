import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Proveedor } from '../../components/models/proveedor';
import { ProveedorService } from '../../components/services/proveedor.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit, OnDestroy {

  proveedor: Proveedor[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  selectedProveedor: any = null;
  private subscriptions = new Subscription();
  private filtroSubject = new Subject<string>();

  constructor(
    private proveedorService: ProveedorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerProveedores();
    this.setupFiltroSubscription();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedProveedor = null;
  }

  hideAddModal(isClosed: boolean): void {
    this.displayAddEditModal = !isClosed;
    if (isClosed) {
      this.obtenerProveedores();
    }
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerProveedores(filtro);
      })
    );
  }

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerProveedores(filtro: string = ''): void {
    this.subscriptions.add(
      this.proveedorService.obtenerProveedores(filtro).subscribe({
        next: (proveedor) => {
          this.proveedor = proveedor;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          console.error('Error al obtener proveedores:', error);
        }
      })
    );
  }

  verTipoIdentificacion(tipoIdentificacionId: number): string {
    return tipoIdentificacionId === 1 ? 'NIT' :
      tipoIdentificacionId === 2 ? 'Cédula de ciudadanía' :
        tipoIdentificacionId === 3 ? 'Cédula de extranjería' :
          'Tipo desconocido';
  }

  verTipoProvedor(tipoProvedorId: number): string {
    return tipoProvedorId === 1 ? 'Peces' :
      tipoProvedorId === 2 ? 'Alimentos' :
        'Tipo desconocido';
  }

  guardar_editarProveedorList(newData: Proveedor): void {
    if (this.selectedProveedor && newData.id === this.selectedProveedor.id) {
      const proveedorIndex = this.proveedor.findIndex(data => data.id === newData.id);
      if (proveedorIndex !== -1) {
        this.proveedor[proveedorIndex] = newData;
      }
    }
    this.obtenerProveedores();
  }

  showEdit(id: number): void {
    this.displayAddEditModal = true;
    this.selectedProveedor = id;
  }

  eliminar(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar este proveedor?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.subscriptions.add(
          this.proveedorService.eliminarProveedor(id).subscribe({
            next: (response: string) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: response
              });
              this.proveedor = this.proveedor.filter(e => e.id !== id);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Ocurrió un error al eliminar el registro'
              });
            },
            complete: () => {
              this.obtenerProveedores();
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
