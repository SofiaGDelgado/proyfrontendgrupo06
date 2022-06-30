
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
import { FooterComponent } from './components/footer/footer.component';
// Dependencias para el calendario
import { CalendarModule, DateAdapter } from 'angular-calendar'; 
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CommonModule } from '@angular/common'; //Se importa para que no salte errores con [view]
  //Dependencias para poner en idioma español el calendario
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
//
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
    FormEmpleadoComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    AvatarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BrowserAnimationsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    NgbModule,
  ],
  providers: [ LoginService,
 ],
  bootstrap: [AppComponent]
})
export class AppModule { }
