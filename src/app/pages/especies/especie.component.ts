import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Especie } from '../../components/models/especie';
import { EspecieService } from '../../components/services/especie.service';

@Component({
  selector: 'app-especie',
  templateUrl: './especie.component.html',
  styleUrls: ['./especie.component.css']
})
export class EspecieComponent implements OnInit, OnDestroy {

  especie: Especie[] = [];
  displayAddEditModal = false;
  selectedEspecie: any = null;
  subscriptions: Subscription[] = [];
  EsSubscription: Subscription = new Subscription();

  constructor(
    private especieService: EspecieService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ){

  }
  ngOnInit(): void {
    this.obtenerEspecies();
  }

  showAddModal(){
    this.displayAddEditModal = true;
    this.selectedEspecie = null;
  }

  hideAddModal(isClosed: boolean) {
    this.obtenerEspecies();
    this.displayAddEditModal = !isClosed;
  }

  guardar_editarEspecieList(newData: any){
    if(this.selectedEspecie && newData.id == this.selectedEspecie.id){
      const especiesIndex = this.especie.findIndex(data => data.id === newData.id);
      this.especie[especiesIndex] = newData;
    }
  }

  eliminar(id: number): void{
    this.confirmationService.confirm({
      message: '¿Quieres Eliminar este Registro?',
      header: 'Confirmacion de Eliminar Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.especieService.eliminarEspecie(id).subscribe(
          response => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registro Elimindo' })
            this.obtenerEspecies();
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
          }
        )
      },
    })
  };

  showEdit(id: number){
    this.displayAddEditModal = true;
    this.selectedEspecie = id;
  }
  obtenerEspecies(): void{
    this.especieService.obtenerEspecies().subscribe(especie => {
      this.especie = especie;
      console.log(this.especie);
    });
    this.subscriptions.push(this.EsSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
