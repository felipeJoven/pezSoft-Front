import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { Rol } from '../../models/rol';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-agregar-editar-usuario',
  templateUrl: './agregar-editar-usuario.component.html',
  styleUrls: ['./agregar-editar-usuario.component.css']
})
export class AgregarEditarUsuarioComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedUsuario: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();

  modalType = "Guardar";
  isPassword: boolean = false;
  usuarioForm = this.fb.group({
    usuario: ["", Validators.required],
    password: [null, Validators.required],
    confirmPassword: [null, Validators.required],
    nombre: ["", Validators.required],
    apellido: ["", Validators.required],
    telefono: [0, Validators.required],
    email: ["", Validators.required],
    rolId: [0, Validators.required]
  })
  rol: Rol[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerRoles();
  }

  ngOnChanges(): void {
    if (this.selectedUsuario) {
      this.modalType = "Actualizar";
      this.usuarioForm.patchValue(this.selectedUsuario);
    } else {
      this.usuarioForm.reset();
      this.modalType = 'Guardar'
    }
  }

  obtenerUsuario() {
    if (this.displayAddEditModal && this.selectedUsuario) {
      const usuarioId = typeof this.selectedUsuario === 'object' ? this.selectedUsuario.id : this.selectedUsuario;
      this.usuarioService.obtenerUsuarioPorId(usuarioId).subscribe(
        response => {
          this.usuarioForm.get('usuario')?.setValue(response.usuario);
          this.usuarioForm.get('nombre')?.setValue(response.nombre);
          this.usuarioForm.get('apellido')?.setValue(response.apellido);
          this.usuarioForm.get('telefono')?.setValue(response.telefono);
          this.usuarioForm.get('email')?.setValue(response.email);
          this.usuarioForm.controls['rolId'].setValue(response.rolId);
        }
      )
    }
  }

  obtenerRoles() {
    this.rolService.obtenerRoles().subscribe({
      next: (response) => {
        this.rol = response;
      },
      error: (error) => {
        console.error("Error al obtener roles: ", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los roles' });
      }
    });
  }

  agregarEditarUsuario() {
    const usuarioData = {
      usuario: this.usuarioForm.get('usuario')?.value,
      password: this.usuarioForm.get('password')?.value ? this.usuarioForm.get('password')?.value : null,
      confirmPassword: this.usuarioForm.get('confirmPassword')?.value ? this.usuarioForm.get('confirmPassword')?.value : null,
      nombre: this.usuarioForm.get('nombre')?.value,
      apellido: this.usuarioForm.get('apellido')?.value,
      email: this.usuarioForm.get('email')?.value,
      telefono: this.usuarioForm.get('telefono')?.value,
      rolId: this.usuarioForm.get('rolId')?.value
    }
    const usuarioId = this.selectedUsuario ? (typeof this.selectedUsuario === 'object' ? this.selectedUsuario.id : this.selectedUsuario) : null;
    this.usuarioService.agregarEditarUsuario(usuarioData, usuarioId).subscribe({
      next: (response) => {
        this.clickAddEdit.emit(response);
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Ocurrió un error al procesar la solicitud' });
      }
    });
  }

  closeModal() {
    this.usuarioForm.reset();
    this.clickClose.emit(true);
  }
}