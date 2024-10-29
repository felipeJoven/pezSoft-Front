import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { EspecieComponent } from './pages/especies/especie.component';
import { UsuarioComponent } from './pages/usuarios/usuario.component';
import { UnidadProductivaComponent } from './pages/unidades-productivas/unidad-productiva.component';
import { ProveedorComponent } from './pages/proveedores/proveedor.component';
import { LoteComponent } from './pages/lotes/lote.component';
import { authGuard } from './components/services/guards/auth.guard';
import { adminGuard } from './components/services/guards/admin.guard';
import { PescaComponent } from './pages/pesca/pesca.component';
import { MortalidadComponent } from './pages/mortalidad/mortalidad.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent, canActivate: [authGuard]  },
  { path: 'usuario', component: UsuarioComponent, canActivate: [adminGuard]  },
  { path: 'especie', component: EspecieComponent, canActivate: [authGuard]  },
  { path: 'unidad-productiva', component: UnidadProductivaComponent, canActivate: [authGuard]  },
  { path: 'proveedor', component: ProveedorComponent, canActivate: [authGuard]  },
  { path: 'lote', component: LoteComponent, canActivate: [authGuard]  },
  { path: 'pesca', component: PescaComponent, canActivate: [authGuard]  },
  { path: 'mortalidad', component: MortalidadComponent, canActivate: [authGuard]  },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutesModule { }