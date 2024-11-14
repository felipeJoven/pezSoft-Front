import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';

import { MortalidadComponent } from './mortalidad.component';
import { AgregarEditarMortalidadModule } from '../../components/modal/agregar-editar-mortalidades/agregar-editar-mortalidad.module';
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [
        MortalidadComponent
    ],
    imports: [
        ToastModule,
        ConfirmDialogModule,        
        FormsModule,        
        TableModule,
        ButtonModule,
        BrowserAnimationsModule,        
        RouterLink,
        AgregarEditarMortalidadModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ]
})
export class MortalidadModule { }