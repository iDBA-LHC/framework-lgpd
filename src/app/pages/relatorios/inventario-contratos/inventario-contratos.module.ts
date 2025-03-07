import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InventarioContratosRoutingModule } from './inventario-contratos-routing.module';
import { InventarioContratosComponent } from './inventario-contratos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from 'saturn-datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { DateFormaPipeModule } from 'src/app/shared/components/pipe/date-format-pipe.module';
import localeBr from '@angular/common/locales/br';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeBr, 'pt-BR');



@NgModule({
  declarations: [InventarioContratosComponent],
  imports: [
    CommonModule, InventarioContratosRoutingModule, ReactiveFormsModule, SharedModule, DateFormaPipeModule
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
export class InventarioContratosModule { }
