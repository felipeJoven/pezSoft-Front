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
  rol: Rol[] = [];
  @Input() displayAddEditModal: boolean = true;
  @Input() selectedUsuario: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Guardar";

  form = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
    nombre: ["", Validators.required],
    apellido: ["", Validators.required],
    telefono: [0, Validators.required],
    email: ["", Validators.required],
    rol: [0, Validators.required],
  })

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private rolService: RolService
  ){}

  ngOnInit(): void {
    this.getRol();
  }

  onKeyPress(event: KeyboardEvent) {
    // Obtiene el código de la tecla presionada
    const keyCode = event.which || event.keyCode;
  
    // Permite solo números (0-9)
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  ngOnChanges(): void {
    if(this.selectedUsuario){
      this.modalType = "Actualizar";
      this.form.patchValue(this.selectedUsuario);
    }else {
      this.modalType = 'Guardar'
      this.form.reset();
    }
  }

  closeModal(){
    this.form.reset();
    this.clickClose.emit(true);
  }
  
  obtenerUsuarios(){
    if(this.displayAddEditModal && this.selectedUsuario){
      this.usuarioService.obtenerUsuarioPorId(this.selectedUsuario).subscribe(
        response => {
          this.form.get('username')?.setValue(response.usuario);
          this.form.get('nombre')?.setValue(response.nombre);
          this.form.get('apellido')?.setValue(response.apellido);
          this.form.get('telefono')?.setValue(response.telefono);
          this.form.get('email')?.setValue(response.email);
          this.form.controls['rol']?.setValue(response.rol.id);
        }
      )
    }
  }

  getRol(){
    this.rolService.obtenerRoles().subscribe(
      response => {
        this.rol = response
      }
    )
  }

  agregarEditarUsuario(){
    const usersData = {
      nombre: this.form.get('nombre')?.value,
      apellido: this.form.get('apellido')?.value,
      username: this.form.get('username')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      confirmPassword: this.form.get('confirmPassword')?.value,
      telefono: this.form.get('telefono')?.value,
      rolId: this.form.get('rol')?.value
    }    
    this.usuarioService.agregarEditarUsuario(usersData, this.selectedUsuario).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.clickAddEdit.emit(response);
        this.closeModal();
        const msg = this.modalType === 'Guardar' ? 'Registro Guardado' : 'Registro Actualizado';
        this.messageService.add({severity: 'success', summary: 'Exitoso', detail: msg});
      },
      error: (error) => {
        console.error('Error del servidor:', error);
        const errorMessage = error.error?.message || error.statusText || 'Error inesperado';
        this.messageService.add({severity: 'error', summary: 'Error', detail: errorMessage});
      },
      complete: () => {
        console.log('Proceso completado');
      }
    });
  }  
}

