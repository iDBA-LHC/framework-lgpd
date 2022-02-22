import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { IncidenteFormComponent } from './incidente-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncidenteFormRoutingModule } from './incidente-form-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxMatMomentModule} from '@angular-material-components/moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import localeBr from '@angular/common/locales/br';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeBr, 'pt-BR');


export const options: Partial<IConfig> = {
  showMaskTyped: true,
};

@NgModule({
  declarations: [IncidenteFormComponent],
  imports: [
    CommonModule,
    SharedModule, 
    IncidenteFormRoutingModule,
    ReactiveFormsModule,
    NgxMatMomentModule,
    NgxMaskModule.forRoot(options)
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
export class IncidenteFormModule { }
