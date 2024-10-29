import { Component,EventEmitter,Input,OnChanges,OnInit,Output, SimpleChanges } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';

import { MortalidadService } from '../../services/mortalidad.service';
import { Lote } from '../../models/lote';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-add-edit-mortalidad',
  templateUrl: './agregar-editar-mortalidad.component.html',
  styleUrls: ['./agregar-editar-mortalidad.component.css']
})
export class AgregarEditarMortalidadComponent {

  lotes: Lote[] = [];

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedMortalidad: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Guardar";

  form = this.fb.group({
    animalesMuertos: [0, Validators.required],
    observacion: ["", Validators.required],
    lote: [0, Validators.required]    
  });

  constructor(
    private fb: FormBuilder,
    private mortalidadService: MortalidadService,
    private loteService: LoteService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {

    this.getLote();
    this.obtenerMortalidad();
  }

  ngOnChanges(): void {
    if (this.selectedMortalidad) {
      this.modalType = 'Actualizar';
      this.form.patchValue(this.selectedMortalidad);
    } else {
      this.form.reset();
      this.modalType = 'Guardar';
    }
  }

  closeModal(){
    this.form.reset();
    this.clickClose.emit(true);
  }

  obtenerMortalidad(){
    if (this.displayAddEditModal && this.selectedMortalidad) {
      this.mortalidadService.obtenerMortalidadPorId(this.selectedMortalidad).subscribe(
        response =>{
          this.form.get('animalesMuertos')?.setValue(response.animalesMuertos);          
          this.form.get('observacion')?.setValue(response.observacion);
          this.form.controls['lote'].setValue(response.lote.id);          
        }
      )
    }
  }

  addEditMortalidad(){
    const mortalidadData = {
      animalesMuertos: this.form.get('animalesMuertos')?.value,
      observacion: this.form.get('observacion')?.value,      
      loteId: this.form.get('lote')?.value
    }
    
    this.mortalidadService.addEditMortalidad(mortalidadData, this.selectedMortalidad).subscribe(
      response =>{
        this.clickAddEdit.emit(response);
        this.closeModal();
        const msg = this.modalType === 'Guardar' ? 'Registro Guardado' : 'Registro Actualizado';
        this.messageService.add({severity: 'success', summary: 'Success', detail: msg});
        console.log(this.modalType);
        
      },
      
      error => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: error});
      }
    )
  }

  getLote(){
    this.loteService.obtenerLotes().subscribe(
      response => {
        this.lotes = response
      }
    )
  }
}
