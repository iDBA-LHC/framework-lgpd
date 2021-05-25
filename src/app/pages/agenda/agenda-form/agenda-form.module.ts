import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgendaFormRoutingModule } from './agenda-form-routing.module';
import { AgendaFormComponent } from './agenda-form.component';
import { FormsModule } from '@angular/forms';
import localeBr from "@angular/common/locales/pt"
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

registerLocaleData(localeBr);

@NgModule({
  declarations: [AgendaFormComponent],
  imports: [
    CommonModule, AgendaFormRoutingModule, SharedModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ]
})
export class AgendaFormModule { }
