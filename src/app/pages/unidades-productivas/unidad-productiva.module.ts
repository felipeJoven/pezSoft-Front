import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadProductivaComponent } from './unidad-productiva.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { HttpClientModule } from "@angular/common/http";
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AgregarEditarUnidadPModule } from '../../components/modal/agregar-editar-unidades-productivas/agregar-editar-unidad-productiva.module';

@NgModule({
  declarations: [
    UnidadProductivaComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    HttpClientModule,
    TableModule,
    BrowserAnimationsModule,
    FormsModule,
    DialogModule,
    AgregarEditarUnidadPModule  
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
})

export class UnidadProductivaModule { }