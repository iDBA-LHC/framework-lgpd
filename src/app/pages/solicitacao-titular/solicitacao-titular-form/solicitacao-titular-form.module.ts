import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SolicitacaoTitularFormComponent } from './solicitacao-titular-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SolicitacaoTitularFormRoutingModule } from './solicitacao-titular-form-routing.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
//import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import localeBr from '@angular/common/locales/br';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeBr, 'pt-BR');

export const options: Partial<IConfig> = {
  decimalMarker: ",",
  validation: false,
  showMaskTyped: true,
};

@NgModule({
  declarations: [SolicitacaoTitularFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    //NgxMatMomentModule,
    SolicitacaoTitularFormRoutingModule,
    NgxMaskModule.forRoot(options),
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
export class SolicitacaoTitularFormModule { }
