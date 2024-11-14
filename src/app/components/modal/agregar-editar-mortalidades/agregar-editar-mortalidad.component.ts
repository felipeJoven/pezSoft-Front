import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {MessageService} from 'primeng/api';

import { MortalidadService } from '../../services/mortalidad.service';
import { Lote } from '../../models/lote';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-agregar-editar-mortalidad',
  templateUrl: './agregar-editar-mortalidad.component.html',
  styleUrls: ['./agregar-editar-mortalidad.component.css']
})
export class AgregarEditarMortalidadComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() mortalidadSeleccionada: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  
  modalType = "Guardar";
  mortalidadForm = this.fb.group({
    pecesMuertos: [0, Validators.required],
    observacion: ["", Validators.required],
    loteId: [0, Validators.required]    
  });
  lote: Lote[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private mortalidadService: MortalidadService,
    private loteService: LoteService
  ) { }

  ngOnInit(): void {
    this.obtenerMortalidad();
    this.obtenerLotes();
  }

  ngOnChanges(): void {
    if (this.mortalidadSeleccionada) {
      this.modalType = 'Actualizar';
      this.mortalidadForm.patchValue(this.mortalidadSeleccionada);
    } else {
      this.mortalidadForm.reset();
      this.modalType = 'Guardar';
    }
  }

  modalMortalidad() {
    const mortalidadData = {
      pecesMuertos: this.mortalidadForm.get('pecesMuertos')?.value,
      observacion: this.mortalidadForm.get('observacion')?.value,      
      loteId: this.mortalidadForm.get('loteId')?.value
    };    
    const mortalidadId = this.mortalidadSeleccionada ? (typeof this.mortalidadSeleccionada === 'object' ? this.mortalidadSeleccionada.id : this.mortalidadSeleccionada) : null ;
    this.mortalidadService.agregarEditarMortalidad(mortalidadData, mortalidadId).subscribe({
      next: (response: any) => {
        this.clickAddEdit.emit(response);
        this.closeModal();        
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message });                
      },      
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message || 'Ocurrió un error al procesar la solicitud' });
      }
    });
  }

  obtenerMortalidad() {
    if (this.displayAddEditModal && this.mortalidadSeleccionada) {
      this.mortalidadService.obtenerMortalidadPorId(this.mortalidadSeleccionada).subscribe({
        next: (response) => {
            this.mortalidadForm.patchValue({
               pecesMuertos: response.pecesMuertos,
               observacion: response.observacion,
               loteId: response.loteId
            });
         },
         error: (error) => {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener los datos de mortalidad' });
         }
    });
   }
}

  obtenerLotes() {
    this.loteService.obtenerLotes().subscribe({
      next: (response) => {
        this.lote = response;
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los lotes' });
        console.log("Error al obtener lotes: ", error);        
      }
    });
  }

  closeModal() {
    this.mortalidadForm.reset();
    this.clickClose.emit(true);
  }
}