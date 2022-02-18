import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IncidenteListComponent } from './incidente-list.component';
import { IncidenteListRoutingModule } from './incidente-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker'
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter'
import { ReactiveFormsModule } from '@angular/forms';
import localeBr from '@angular/common/locales/br';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeBr, 'pt-BR');


@NgModule({
  declarations: [IncidenteListComponent],
  imports: [
    CommonModule, IncidenteListRoutingModule, SharedModule, ReactiveFormsModule
  ],
  providers:
  [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    { provide: LOCALE_ID,      useValue: 'pt-BR' }, 
    { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
    DatePipe
  ]
})
export class IncidenteListModule { }
