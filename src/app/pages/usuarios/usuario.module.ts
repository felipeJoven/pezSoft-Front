import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';

import { UsuarioComponent } from './usuario.component';
import { AgregarEditarUsuarioModule } from '../../components/modal/agregar-editar-usuarios/agregar-editar-usuario.module';

@NgModule({
  declarations: [
    UsuarioComponent
  ],
  imports: [
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    TableModule,
    ButtonModule,
    BrowserAnimationsModule,  
    AgregarEditarUsuarioModule
  ],
  providers: [
    ConfirmationService,
    MessageService
  ]
})

export class UsuarioModule { }