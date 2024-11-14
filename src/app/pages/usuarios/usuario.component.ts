
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { UsuarioService } from '../../components/services/usuario.service';
import { Usuario } from '../../components/models/usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, OnDestroy{

  usuario: Usuario[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  usuarioSeleccionado: any = null;
  private subscriptions = new Subscription();
  private filtroSubject = new Subject<string>();

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios()
    this.setupFiltroSubscription();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.usuarioSeleccionado = null;
  }

  hideAddModal(isClosed: boolean) {
    this.displayAddEditModal = !isClosed;
    if (isClosed) {
      this.obtenerUsuarios();
    }
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerUsuarios(filtro);
      })
    );
  }

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerUsuarios(filtro: string = ''): void {
    this.subscriptions.add(
      this.usuarioService.obtenerUsuarios(filtro).subscribe({
        next: (usuario) => {
          this.usuario = usuario;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
          console.log('Error al obtener usuarios:' + error);
          
        }        
      })
    );
  }

  agregarEditarUsuario(newData: Usuario): void {
    if (this.usuarioSeleccionado && newData.id == this.usuarioSeleccionado.id) {
      const usuarioIndex = this.usuario.findIndex(data => data.id === newData.id);
      if (usuarioIndex !== -1) {
        this.usuario[usuarioIndex] = newData;
      }
    }
    this.obtenerUsuarios();
  }

  showEdit(id: number) {
    this.displayAddEditModal = true;
    this.usuarioSeleccionado = id;
  }

  eliminarUsuario(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres eliminar este usuario?',
      header: 'Confirmación de eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.subscriptions.add(
          this.usuarioService.eliminarUsuario(id).subscribe({
            next: (response: string) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: response
              });
              this.usuario = this.usuario.filter(e => e.id !== id);
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'Ocurrió un error al eliminar el registro'
              });
            },
            complete: () => {
              this.obtenerUsuarios();
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