import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

import { UnidadProductivaComponent } from './unidad-productiva.component';
import { AgregarEditarUnidadPModule } from '../../components/modal/agregar-editar-unidades-productivas/agregar-editar-unidad-productiva.module';

@NgModule({
  declarations: [
    UnidadProductivaComponent
  ],
  imports: [
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    TableModule,
    ButtonModule,
    BrowserAnimationsModule,
    AgregarEditarUnidadPModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})

export class UnidadProductivaModule { }