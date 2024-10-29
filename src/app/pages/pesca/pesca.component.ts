import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Pesca } from '../../components/models/pesca';
import { PescaService } from '../../components/services/pesca.service';


@Component({
  selector: 'app-pesca',
  templateUrl: './pesca.component.html',
  styleUrls: ['./pesca.component.css']
})
export class PescaComponent {

  pescas: Pesca[] = [];
  displayAddEditModal = false;
  selectedPesca: any = null;
  subscriptions: Subscription[] = [];
  PSubscription: Subscription = new Subscription();

  constructor(
    private pescaService: PescaService,
    private confirationService: ConfirmationService,
    private messageService: MessageService
  ){}

  ngOnInit(): void {
    this.obtenerPesca();
  }

  showAddModal(){
    this.displayAddEditModal = true;
    this.selectedPesca = null;
  }

  hideAddModal(isClosed: boolean){
    this.obtenerPesca();
    this.displayAddEditModal = !isClosed;
  }

  guardaroEditarPescaList(newData: any){
    if(this.selectedPesca && newData.id === this.selectedPesca.id){
      const pescaIndex = this.pescas.findIndex(data => data.id === newData.id);
      this.pescas[pescaIndex] = newData;
    }
  }

  eliminar(id: number): void{
    this.confirationService.confirm({
      message: '¿Quieres Eliminar este Registro?',
        header: 'Confirmacion de Eliminar Registro',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.pescaService.eliminarPesca(id).subscribe(
            response => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registro Elimindo' })
              this.obtenerPesca();
            },
            error => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error })
            }
          )
        }
    })
  }

  showEdit(id: number){
    this.displayAddEditModal = true;
    this.selectedPesca = id;
  }

  obtenerPesca():void{
    this.pescaService.obtenerPesca().subscribe(pesca =>{

      this.pescas = pesca;
      console.log(this.pescas);
      
    });

    this.subscriptions.push(this.PSubscription)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
