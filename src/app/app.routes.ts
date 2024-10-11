import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { EspecieComponent } from './pages/especies/especie.component';
import { UsuarioComponent } from './pages/usuarios/usuario.component';
import { UnidadProductivaComponent } from './pages/unidades-productivas/unidad-productiva.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'especie', component: EspecieComponent },
  { path: 'unidad-productiva', component: UnidadProductivaComponent },
  { path: 'proveedor', component: ProveedorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutesModule { }
