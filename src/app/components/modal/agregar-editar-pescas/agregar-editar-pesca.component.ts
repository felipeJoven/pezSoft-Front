import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { PescaService } from '../../services/pesca.service';
import { Lote } from '../../models/lote';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-agregar-editar-pesca',
  templateUrl: './agregar-editar-pesca.component.html',
  styleUrls: ['./agregar-editar-pesca.component.css']
})
export class AgregarEditarPescaComponent implements OnInit, OnChanges {

  @Input() displayAddEditModal: boolean = true;
  @Input() pescaSeleccionada: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();

  modalType = "Guardar";
  pescaForm = this.fb.group({
    pecesPescados: [0, Validators.required],
    pesoPromedio: [0, Validators.required],
    loteId: [0, Validators.required]
  });
  lote: Lote[] = [];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private pescaService: PescaService,
    private loteService: LoteService
  ) { }

  ngOnInit(): void {
    this.obtenerPesca();
    this.obtenerLotes();
  }

  ngOnChanges(): void {
    if (this.pescaSeleccionada) {
      this.modalType = 'Actualizar';
      this.pescaForm.patchValue(this.pescaSeleccionada);
    } else {
      this.pescaForm.reset();
      this.modalType = 'Guardar';
    }
  }

  modalPesca() {
    const pescaData = {
      pecesPescados: this.pescaForm.get('pecesPescados')?.value,
      pesoPromedio: this.pescaForm.get('pesoPromedio')?.value,
      loteId: this.pescaForm.get('loteId')?.value
    };
    const pescaId = this.pescaSeleccionada ? (typeof this.pescaSeleccionada === 'object' ? this.pescaSeleccionada.id : this.pescaSeleccionada) : null;
    this.pescaService.agregarEditarPesca(pescaData, pescaId).subscribe({
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

  obtenerPesca() {
    if (this.displayAddEditModal && this.pescaSeleccionada) {
      this.pescaService.obtenerPescaPorId(this.pescaSeleccionada).subscribe({
        next: (response) => {
          this.pescaForm.patchValue({
            pecesPescados: response.pecesPescados,
            pesoPromedio: response.pesoPromedio,
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
    this.pescaForm.reset();
    this.clickClose.emit(true);
  }
}