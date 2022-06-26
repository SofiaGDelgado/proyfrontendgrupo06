
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { PrincipalAdmiComponent } from './components/principal-admi/principal-admi.component';
import { PrincipalParticipanteComponent } from './components/principal-participante/principal-participante.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { HeaderComponent } from './components/header/header.component';

import { AvatarModule } from 'ngx-avatar';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AudienciasComponent } from './components/audiencias/audiencias.component';
import { EstadisticaComponent } from './components/estadistica/estadistica.component';
import { GestionEmpleadosComponent } from './components/gestion-empleados/gestion-empleados.component';
import { RegistroReunionesComponent } from './components/registro-reuniones/registro-reuniones.component';
import { FormEmpleadoComponent } from './components/form-empleado/form-empleado.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PrincipalAdmiComponent,
    PrincipalParticipanteComponent,
    PrincipalComponent,
    HeaderComponent,
    CalendarComponent,
    AgendaComponent,
    AudienciasComponent,
    EstadisticaComponent,
    GestionEmpleadosComponent,
    RegistroReunionesComponent,
    FormEmpleadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    AvatarModule

  ],
  providers: [ LoginService,
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
