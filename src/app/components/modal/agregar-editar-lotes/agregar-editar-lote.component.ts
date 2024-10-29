import { Component,EventEmitter,Input,OnChanges,OnInit,Output, SimpleChanges } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { LoteService } from '../../services/lote.service';
import {MessageService} from 'primeng/api';
import { Proveedor } from '../../models/proveedor';
import { Especie } from '../../models/especie';
import { UnidadProductiva } from '../../models/unidad-productiva';
import { ProveedorService } from '../../services/proveedor.service';
import { EspecieService } from '../../services/especie.service';
import { UnidadProductivaService } from '../../services/unidad-productiva.service';


@Component({
  selector: 'app-agregar-editar-lote',
  templateUrl: './agregar-editar-lote.component.html',
  styleUrls: ['./agregar-editar-lote.component.css']
})
export class AgregarEditarLoteComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedLote: any = null;
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
  ){ }

  ngOnInit(): void {
    this.obtenerLote();    
    this.obtenerEspecies();
    this.obtenerUnidadProductiva();
    this.obtenerProveedores();
  }

  ngOnChanges(): void {
    if (this.selectedLote) {
      this.modalType = 'Actualizar';
      this.loteForm.patchValue(this.selectedLote);
    } else {
      this.loteForm.reset();
      this.modalType = 'Guardar';
    }
  }

  obtenerLote(){
    if (this.displayAddEditModal && this.selectedLote) {
      this.loteService.obtenerLotePorId(this.selectedLote).subscribe(
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

  obtenerEspecies(){
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

  obtenerUnidadProductiva(){
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
  
  obtenerProveedores(){
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

  agregarEditarLote(){
    const loteData = {
      lote: this.loteForm.get('lote')?.value,
      fechaSiembra: this.loteForm.get('fechaSiembra')?.value,
      numeroPeces: this.loteForm.get('numeroPeces')?.value,
      especieId: this.loteForm.get('especieId')?.value,
      unidadProductivaId: this.loteForm.get('unidadProductivaId')?.value,
      proveedorId: this.loteForm.get('proveedorId')?.value
    };    
    const loteId = this.selectedLote ? (typeof this.selectedLote === 'object' ? this.selectedLote.id : this.selectedLote) : null;
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