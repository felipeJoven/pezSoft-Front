import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ProveedorComponent } from './proveedor.component';
import { AgregarEditarProveedorModule } from '../../components/modal/agergar-editar-proveedores/agregar-editar-proveedor.module';

@NgModule({
  declarations: [
    ProveedorComponent
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
    AgregarEditarProveedorModule
  ],
  providers: [ConfirmationService,
  MessageService]
})
export class ProveedorModule { }
