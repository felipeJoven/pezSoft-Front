import { Component, } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { Mortalidad } from '../../components/models/mortalidad';
import { MortalidadService } from '../../components/services/mortalidad.service';

@Component({
  selector: 'app-mortalidad',
  templateUrl: './mortalidad.component.html',
  styleUrls: ['./mortalidad.component.css']
})
export class MortalidadComponent {

  mortalidad: Mortalidad[] = [];
  filtro: string = '';
  displayAddEditModal = false;
  mortalidadSeleccionada: any = null;
  private subscriptions = new Subscription();
  private filtroSubject = new Subject<string>();

  constructor(
    private mortalidadService: MortalidadService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  
  ngOnInit(): void {
    this.obtenerMortalidades();
  }

  showAddModal() {
    this.displayAddEditModal = true;
    this.mortalidadSeleccionada = null;
  }

  hideAddModal(isClosed: boolean) {
    this.obtenerMortalidades();
    this.displayAddEditModal = !isClosed;
  }

  setupFiltroSubscription(): void {
    this.subscriptions.add(
      this.filtroSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(filtro => {
        this.obtenerMortalidades(filtro);
      })
    );
  } 

  onFiltroChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filtroSubject.next(inputElement.value);
  }

  obtenerMortalidades(filtro: string = ''): void {
    this.subscriptions.add(
      this.mortalidadService.obtenerMortalidades(filtro).subscribe({
        next: (mortalidad) => {
          this.mortalidad = mortalidad;     
        },
        error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
            console.log('Error al obtener mortalidades', error);
            
        }
      })
    );
  }


  agregarEditarMortalidad(newData: any) {
    if (this.mortalidadSeleccionada && newData.id === this.mortalidadSeleccionada.id) {
      const mortalidadIndex = this.mortalidad.findIndex(data => data.id === newData.id);
      this.mortalidad[mortalidadIndex] = newData;
    }
  }

  eliminar(id: number): void {
    this.confirmationService.confirm({
      message: '¿Quieres Eliminar este Registro?',
      header: 'Confirmacion de Eliminar Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mortalidadService.eliminarMortalidad(id).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message })
            this.obtenerMortalidades();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error || 'Error desconocido' });
            console.log('Error al obtener mortalidades', error);
          }
        })
      }
    });
  }

  showEdit(id: number) {
    this.displayAddEditModal = true;
    this.mortalidadSeleccionada = id;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}