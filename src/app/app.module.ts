import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutesModule } from './app.routes.js';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavModule } from './components/sidenav/sidenav.module';

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { BodyModule } from './components/body/body.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './components/services/auth/auth.service';
import { Interceptor } from './components/interceptor/interceptor.js';
import { LoginModule } from './pages/login/login.module.js';
import { UsuarioModule } from './pages/usuarios/usuario.module.js';
import { EspecieModule } from './pages/especies/especie.module.js';
import { UnidadProductivaModule } from './pages/unidades-productivas/unidad-productiva.module.js';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
  ],
  imports: [
    SidenavModule,
    BrowserModule,
    AppRoutesModule,
    BrowserAnimationsModule,
    BodyModule,
    HttpClientModule,
    LoginModule,
    UsuarioModule,
    EspecieModule,
    UnidadProductivaModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: Interceptor, 
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
