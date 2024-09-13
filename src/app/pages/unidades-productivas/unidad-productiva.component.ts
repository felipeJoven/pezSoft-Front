import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UnidadProductiva } from '../../components/models/unidad-productiva';
import { UnidadProductivaService } from '../../components/services/unidad-productiva.service';

@Component({
  selector: 'app-unidad-productiva',
  templateUrl: './unidad-productiva.component.html',
  styleUrls: ['./unidad-productiva.component.css']
})
export class UnidadProductivaComponent implements OnInit, OnDestroy {

  unidad: UnidadProductiva[] = [];
  displayAddEditModal = false;
  selectedUnidadP: any = null;
  subscriptions: Subscription[] = [];
  UpSubscription: Subscription = new Subscription();


  constructor(
    private unidadproductivaService: UnidadProductivaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.obtenerUnidadProductiva();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.selectedUnidadP = null;
  }

  hideAddModal(isClosed: boolean) {
    this.obtenerUnidadProductiva();
    this.displayAddEditModal = !isClosed;
  }

  guardar_editarUnidadPList(newData: any) {
    if (this.selectedUnidadP && newData.id === this.selectedUnidadP.id) {
      const uniadPIndex = this.unidad.findIndex(data => data.id === newData.id);
      this.unidad[uniadPIndex] = newData;
    }
  }

  eliminar(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres Eliminar este Registro?',
      header: 'Confirmacion de Eliminar Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.unidadproductivaService.eliminarUnidadProductiva(id).subscribe(
          response => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registro Elimindo' })
            this.obtenerUnidadProductiva();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
          }
        )
      },
    }
    )
  };

  showEdit(id: number){
    this.displayAddEditModal = true;
    this.selectedUnidadP = id;
  }

  obtenerUnidadProductiva(): void {
    this.unidadproductivaService.obtenerUnidadProductiva().subscribe(unidadP => {

      this.unidad = unidadP;
      console.log(this.unidad);
    });

    this.subscriptions.push(this.UpSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

