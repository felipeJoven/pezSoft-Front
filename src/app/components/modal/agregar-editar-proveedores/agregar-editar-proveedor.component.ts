import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { ProveedorService } from '../../services/proveedor.service';
import { TipoIdentificacion } from '../../models/tipo-identificacion';
import { TipoIdentificacionService } from '../../services/tipo-identificacion.service';
import { TipoProveedor } from '../../models/tipo-proveedor';
import { TipoProveedorService } from '../../services/tipo-proveedor.service';

@Component({
  selector: 'app-agregar-editar-proveedor',
  templateUrl: './agregar-editar-proveedor.component.html',
  styleUrls: ['./agregar-editar-proveedor.component.css']
})

export class AgregarEditarProveedorComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() proveedorSeleccionado: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();

  modalType = "Guardar";
  proveedorForm = this.fb.group({
    nombre: ["", Validators.required],
    apellido: ["", Validators.required],
    telefono: [0, Validators.required],
    email: ["", Validators.required],
    direccion: ["", Validators.required],
    razonSocial: ["", Validators.required],
    numeroIdentificacion: [0, Validators.required],
    tipoIdentificacionId: [0, Validators.required],
    tipoProveedorId: [0, Validators.required]
  })
  tipoIdentificacion: TipoIdentificacion[] = [];
  tipoProveedor: TipoProveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private messageService: MessageService,
    private tipoProveedorService: TipoProveedorService,
    private tipoIdentificacionService: TipoIdentificacionService
  ) { }

  ngOnInit(): void {
    this.obtenerProveedor();
    this.obtenerTipoIdentificaciones();
    this.obtenerTipoProveedores();
  }

  ngOnChanges(): void {
    if (this.proveedorSeleccionado) {
      this.modalType = 'Actualizar';
      this.proveedorForm.patchValue(this.proveedorSeleccionado);
    } else {
      this.proveedorForm.reset();
      this.modalType = 'Guardar';
    }
  }

  obtenerProveedor() {
    if (this.displayAddEditModal && this.proveedorSeleccionado) {
      const proveedorId = typeof this.proveedorSeleccionado === 'object' ? this.proveedorSeleccionado.id : this.proveedorSeleccionado;
      this.proveedorService.obtenerProveedorPorId(proveedorId).subscribe(
        response => {                  
          this.proveedorForm.get('razonSocial')?.setValue(response.razonSocial);
          this.proveedorForm.get('nombre')?.setValue(response.nombre);
          this.proveedorForm.get('apellido')?.setValue(response.apellido);
          this.proveedorForm.get('telefono')?.setValue(response.telefono);
          this.proveedorForm.get('email')?.setValue(response.email);
          this.proveedorForm.get('direccion')?.setValue(response.direccion);
          this.proveedorForm.get('numeroIdentificacion')?.setValue(response.numeroIdentificacion);
          this.proveedorForm.controls['tipoIdentificacionId'].setValue(response.tipoIdentificacionId);                    
          this.proveedorForm.controls['tipoProveedorId'].setValue(response.tipoProveedorId);          
        }
      )
    }
  }
  
  obtenerTipoIdentificaciones() {
    this.tipoIdentificacionService.obtenerTipoIdentificaciones().subscribe({
      next: (response) => {      
        this.tipoIdentificacion = response;
      },
      error: (error) => {
        console.error("Error al obtener tipos de identificación: ", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de identificación' });
      }
    });
  }

  obtenerTipoProveedores() {
    this.tipoProveedorService.obtenerTipoProveedores().subscribe({
      next: (response) => {        
        this.tipoProveedor = response;
      },
      error: (error) => {
        console.error("Error al obtener tipos de proveedor: ", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de proveedor' });      
      }
    });   
  }

  modalProveedor() {
    const proveedorData = {
      nombre: this.proveedorForm.get('nombre')?.value,
      apellido: this.proveedorForm.get('apellido')?.value,
      telefono: this.proveedorForm.get('telefono')?.value,
      email: this.proveedorForm.get('email')?.value,
      direccion: this.proveedorForm.get('direccion')?.value,
      razonSocial: this.proveedorForm.get('razonSocial')?.value,
      numeroIdentificacion: this.proveedorForm.get('numeroIdentificacion')?.value,
      tipoIdentificacionId: this.proveedorForm.get('tipoIdentificacionId')?.value,
      tipoProveedorId: this.proveedorForm.get('tipoProveedorId')?.value
    };       
    const proveedorId = this.proveedorSeleccionado ? (typeof this.proveedorSeleccionado === 'object' ? this.proveedorSeleccionado.id : this.proveedorSeleccionado) : null;
    this.proveedorService.agregarEditarProveedor(proveedorData, proveedorId).subscribe({
      next: (response: any) => {
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
    this.proveedorForm.reset();
    this.clickClose.emit(true);
  }
}
