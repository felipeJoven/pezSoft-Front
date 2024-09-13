import { Component,EventEmitter,Input,OnChanges,OnInit,Output } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import { EspecieService } from '../../services/especie.service';

@Component({
  selector: 'app-agregar-editar-especie',
  templateUrl: './agregar-editar-especie.component.html',
  styleUrls: ['./agregar-editar-especie.component.css']
})
export class AgregarEditarEspecieComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedEspecie: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Guardar";

  especieForm = this.fb.group({
    especie: ["", Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private especieService: EspecieService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.obtenerEspecies();
  }

  ngOnChanges(): void {
    if(this.selectedEspecie){
      this.modalType = 'Actualizar';
      this.especieForm.patchValue(this.selectedEspecie);
    }else{
      this.especieForm.reset();
      this.modalType = 'Guardar';
    }
  }

  obtenerEspecies(){
    if(this.displayAddEditModal && this.selectedEspecie){
      const especieId = typeof this.selectedEspecie === 'object' ? this.selectedEspecie.id : this.selectedEspecie;
      this.especieService.obtenerEspeciePorId(especieId).subscribe(
        response => {
          this.especieForm.get('especie')?.setValue(response.especie);
        }
      )
    }
  }

  agregarEditarEspecie() {
    const especieData = {
      especie: this.especieForm.get('especie')?.value
    };
    const especieId = this.selectedEspecie ? (typeof this.selectedEspecie === 'object' ? this.selectedEspecie.id : this.selectedEspecie) : null;
    this.especieService.agregarEditarEspecie(especieData, especieId).subscribe({
      next: (response: any) => {
        this.clickAddEdit.emit(response);
        this.closeModal();
        this.messageService.add({severity: 'success', summary: 'Éxito', detail: response.message});
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: error.message || 'Ocurrió un error al procesar la solicitud'});
      }
    });
  }
  
  closeModal(){
    this.especieForm.reset();
    this.clickClose.emit(true);
  }
}
