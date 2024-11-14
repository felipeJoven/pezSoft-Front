import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {MessageService} from 'primeng/api';

import { LoteService } from '../../services/lote.service';
import { Especie } from '../../models/especie';
import { EspecieService } from '../../services/especie.service';
import { UnidadProductiva } from '../../models/unidad-productiva';
import { UnidadProductivaService } from '../../services/unidad-productiva.service';
import { Proveedor } from '../../models/proveedor';
import { ProveedorService } from '../../services/proveedor.service';

@Component({
  selector: 'app-agregar-editar-lote',
  templateUrl: './agregar-editar-lote.component.html',
  styleUrls: ['./agregar-editar-lote.component.css']
})
export class AgregarEditarLoteComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() loteSeleccionado: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  
  modalType = "Guardar";
  loteForm = this.fb.group({
    lote: ["", Validators.required],
    numeroPeces: [0, Validators.required],
    fechaSiembra:["", Validators.required],
    especieId: [0, Validators.required],
    unidadProductivaId: [0, Validators.required],
    proveedorId: [0, Validators.required]
  });
  especie: Especie[] = [];
  unidadProductiva: UnidadProductiva[] = [];
  proveedor: Proveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    private provedorService: ProveedorService,
    private especieService: EspecieService,
    private unidadPService: UnidadProductivaService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerLote();    
    this.obtenerEspecies();
    this.obtenerUnidadesProductivas();
    this.obtenerProveedores();
  }

  ngOnChanges(): void {
    if (this.loteSeleccionado) {
      this.modalType = 'Actualizar';
      this.loteForm.patchValue(this.loteSeleccionado);
    } else {
      this.loteForm.reset();
      this.modalType = 'Guardar';
    }
  }

  obtenerLote() {
    if (this.displayAddEditModal && this.loteSeleccionado) {
      this.loteService.obtenerLotePorId(this.loteSeleccionado).subscribe(
        response =>{
          this.loteForm.get('lote')?.setValue(response.lote);
          this.loteForm.get('numeroPeces')?.setValue(response.numeroPeces);                    
          this.loteForm.get('fechaSiembra')?.setValue(response.fechaSiembra);
          this.loteForm.controls['especieId'].setValue(response.especieId);
          this.loteForm.controls['unidadProductivaId'].setValue(response.unidadProductivaId);
          this.loteForm.controls['proveedorId'].setValue(response.proveedorId);
        }
      )
    }
  }

  obtenerEspecies() {
    this.especieService.obtenerEspecies().subscribe({
      next: (response) => {
        this.especie = response;
      },
      error: (error) => {
        console.log("Error al obtener especies: ", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las especies' });
      }
    });            
  }

  obtenerUnidadesProductivas() {
    this.unidadPService.obtenerUnidadesProductivas().subscribe({
      next: (response) => {
        this.unidadProductiva = response.filter((unidad) => unidad.estado === 0 );
      },
      error: (error) => {
        console.log("Error al obtener unidades productivas: ", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las unidades productivas' });
      }
    });            
  }
  
  obtenerProveedores() {
    this.provedorService.obtenerProveedores().subscribe({
      next: (response) => {
        this.proveedor = response;
      },
      error: (error) => {
        console.log("Error al obtener proveedores: ", error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los proveedores' });
      }
    });            
  }

  modalLote() {
    const loteData = {
      lote: this.loteForm.get('lote')?.value,
      fechaSiembra: this.loteForm.get('fechaSiembra')?.value,
      numeroPeces: this.loteForm.get('numeroPeces')?.value,
      especieId: this.loteForm.get('especieId')?.value,
      unidadProductivaId: this.loteForm.get('unidadProductivaId')?.value,
      proveedorId: this.loteForm.get('proveedorId')?.value
    };    
    const loteId = this.loteSeleccionado ? (typeof this.loteSeleccionado === 'object' ? this.loteSeleccionado.id : this.loteSeleccionado) : null;
    this.loteService.agregarEditarLote(loteData, loteId).subscribe({
      next: (response: any) => {
        this.clickAddEdit.emit(response);
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message });
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Ocurrió un error al procesar la solicitud' });
      }
    });
  }

  closeModal() {
    this.loteForm.reset();
    this.clickClose.emit(true);
  }
}