import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SidenavComponent,
    SublevelMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[SidenavComponent]
})
export class SidenavModule { }
