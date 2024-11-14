import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

import { ProveedorComponent } from './proveedor.component';
import { AgregarEditarProveedorModule } from '../../components/modal/agregar-editar-proveedores/agregar-editar-proveedor.module';

@NgModule({
  declarations: [
    ProveedorComponent
  ],
  imports: [
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    TableModule,
    ButtonModule,
    BrowserAnimationsModule,
    AgregarEditarProveedorModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})
export class ProveedorModule { }