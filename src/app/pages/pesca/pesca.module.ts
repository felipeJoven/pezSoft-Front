import { NgModule } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PescaComponent } from './pesca.component';
import { AgregarEditarPescaModule } from '../../components/modal/agregar-editar-pescas/agregar-editar-pesca.module';
import { RouterLink } from '@angular/router';

@NgModule({
    declarations: [
        PescaComponent
    ],
    imports: [        
        ToastModule,
        ConfirmDialogModule,        
        FormsModule,        
        TableModule,
        ButtonModule,
        BrowserAnimationsModule,        
        RouterLink,
        AgregarEditarPescaModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ]
})
export class PescaModule { }