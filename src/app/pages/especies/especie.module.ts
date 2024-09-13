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
import { EspecieComponent } from './especie.component';
import { AgregarEditarEspecieModule } from '../../components/modal/agregar-editar-especies/agregar-editar-especie.module';


@NgModule({
  declarations: [
    EspecieComponent
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
    AgregarEditarEspecieModule
],
  providers: [
    ConfirmationService,
    MessageService
  ]
})

export class EspecieModule { }
