import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { PrincipalAdmiComponent } from './components/principal-admi/principal-admi.component';
import { PrincipalParticipanteComponent } from './components/principal-participante/principal-participante.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RegistroReunionesComponent } from './components/registro-reuniones/registro-reuniones.component';
import { EstadisticaComponent } from './components/estadistica/estadistica.component';
import { GestionEmpleadosComponent } from './components/gestion-empleados/gestion-empleados.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AudienciasComponent } from './components/audiencias/audiencias.component';

const routes: Routes = [
   {path: 'login', component: LoginComponent, pathMatch: 'full' },
   {path: 'principal', component: PrincipalComponent, pathMatch: 'full' },

  
    {path: 'principal/Administrador', component: PrincipalAdmiComponent, pathMatch: 'full' },
    {path: 'principal/Administrador/registroReuniones', component: RegistroReunionesComponent, pathMatch: 'full' },
    {path: 'principal/Administrador/estadistica', component: EstadisticaComponent, pathMatch: 'full' },
    {path: 'principal/Administrador/gestioEmpleados', component: GestionEmpleadosComponent, pathMatch: 'full' },

    {path: 'principal/Participante', component: PrincipalParticipanteComponent, pathMatch: 'full' },
    {path: 'principal/Participante/audiencias', component: AudienciasComponent, pathMatch: 'full' },
    {path: 'principal/Participante/agenda', component: AgendaComponent, pathMatch: 'full' },

  {path: 'calendar', component: CalendarComponent, pathMatch: 'full' },
  {path: '**', pathMatch: 'prefix', redirectTo: 'principal',},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
