
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../components/services/usuario.service';
import { Usuario } from '../../components/models/usuario';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  usuario: Usuario[] = [];
  displayAddEditModal = false;
  selectedUsuario: any = null;
  subscriptions: Subscription[] = [];
  UsSubscription: Subscription = new Subscription();

  constructor(
    private usuarioService: UsuarioService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios()
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedUsuario = null;
  }

  hideAddModal(isClosed: boolean) {
    this.obtenerUsuarios();
    this.displayAddEditModal = !isClosed;
  }

  obtenerUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(usuario => {
      this.usuario = usuario
        ;
      console.log(this.usuario);
    });
    this.subscriptions.push(this.UsSubscription)
  }

  guardar_editarUsuarioList(newData: any) {
    if (this.selectedUsuario && newData.id == this.selectedUsuario.id) {
      const usersIndex = this.usuario.findIndex(data => data.id === newData.id);
      this.usuario[usersIndex] = newData;
    }
  }

  showEdit(id: number) {
    this.displayAddEditModal = true;
    this.selectedUsuario = id;
  }

  eliminar(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres Eliminar este Registro?',
      header: 'Confirmacion de Eliminar Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usuarioService.eliminarUsuario(id).subscribe(
          response => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registro Elimindo' })
            this.obtenerUsuarios();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
          }
        )
      },
    })
  };
}