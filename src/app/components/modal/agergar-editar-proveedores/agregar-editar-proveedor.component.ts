import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TipoProveedor } from '../../models/tipo-proveedor';
import { TipoIdentificacion } from '../../models/tipo-identificacion';

import { ProveedorService } from '../../services/proveedor.service';
import { TipoProveedorService } from '../../services/tipo-proveedor.service';
import { TipoIdentificacionService } from '../../services/tipo-identificacion.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-agregar-editar-proveedor',
  templateUrl: './agregar-editar-proveedor.component.html',
  styleUrls: ['./agregar-editar-proveedor.component.css']
})

export class AgregarEditarProveedorComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedProveedor: any = null;
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
    tipoIdentificacion: [0, Validators.required],
    tipoProveedor: [0, Validators.required],
  })
  tipoIdentificacion: TipoIdentificacion[] = [];
  tipoProveedor: TipoProveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private proveedorService: ProveedorService,
    private tipoProveedorService: TipoProveedorService,
    private tipoIdentificacionService: TipoIdentificacionService
  ) { }

  ngOnInit(): void {
    this.obtenerProveedor();
    this.obtenerTipoIdentificaciones();
    this.obtenerTipoProveedores();
  }

  ngOnChanges(): void {
    if (this.selectedProveedor) {
      this.modalType = 'Actualizar';
      this.proveedorForm.patchValue(this.selectedProveedor);
    } else {
      this.proveedorForm.reset();
      this.modalType = 'Guardar';
    }
  }

  obtenerProveedor() {
    if (this.displayAddEditModal && this.selectedProveedor) {
      const proveedorId = typeof this.selectedProveedor === 'object' ? this.selectedProveedor.id : this.selectedProveedor;
      this.proveedorService.obtenerProveedorPorId(proveedorId).subscribe(
        response => {          
          console.log('id:', response.id); 
          console.log('Identificacion del proveedor:', response.numeroIdentificacion); 
          console.log('tipo de Identificacion:', response.tipoIdentificacionId); 
          console.log('tipo de proveedor:', response.tipoProveedorId); 
          this.proveedorForm.get('razonSocial')?.setValue(response.razonSocial);
          this.proveedorForm.get('nombre')?.setValue(response.nombre);
          this.proveedorForm.get('apellido')?.setValue(response.apellido);
          this.proveedorForm.get('telefono')?.setValue(response.telefono);
          this.proveedorForm.get('email')?.setValue(response.email);
          this.proveedorForm.get('direccion')?.setValue(response.direccion);
          this.proveedorForm.get('numeroIdentificacion')?.setValue(response.numeroIdentificacion);
          this.proveedorForm.controls['tipoIdentificacion'].setValue(response.tipoIdentificacionId?.id);
          this.proveedorForm.controls['tipoProveedor'].setValue(response.tipoProveedorId?.id);          
        }
      )
    }
  }
  
  obtenerTipoIdentificaciones() {
    this.tipoIdentificacionService.obtenerTipoIdentificaciones().subscribe({
      next: (response) => {
        console.log("Tipos de Identificación obtenidos:", response);
        this.tipoIdentificacion = response;
      },
      error: (error) => {
        console.error("Error al obtener tipos de identificación:", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de identificación' });
      }
    });
  }

  obtenerTipoProveedores() {
    this.tipoProveedorService.obtenerTipoProveedores().subscribe({
      next: (response) => {
        console.log("Tipos de Proveedor obtenidos:", response);
        this.tipoProveedor = response;
      },
      error: (error) => {
        console.error("Error al obtener tipos de proveedor:", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los tipos de proveedor' });      
      }
    });   
  }

  agregarEditarProveedor() {
    const proveedorData = {
      nombre: this.proveedorForm.get('nombre')?.value,
      apellido: this.proveedorForm.get('apellido')?.value,
      telefono: this.proveedorForm.get('telefono')?.value,
      email: this.proveedorForm.get('email')?.value,
      direccion: this.proveedorForm.get('direccion')?.value,
      razonSocial: this.proveedorForm.get('razonSocial')?.value,
      numeroIdentificacion: this.proveedorForm.get('numeroIdentificacion')?.value,
      tipoIdentificacionId: this.proveedorForm.get('tipoIdentificacion')?.value,
      tipoProveedorId: this.proveedorForm.get('tipoProveedor')?.value
    };    
    const proveedorId = this.selectedProveedor ? (typeof this.selectedProveedor === 'object' ? this.selectedProveedor.id : this.selectedProveedor) : null;
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
