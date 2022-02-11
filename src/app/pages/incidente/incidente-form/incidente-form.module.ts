import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenteFormComponent } from './incidente-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncidenteFormRoutingModule } from './incidente-form-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgxMatMomentModule} from '@angular-material-components/moment-adapter';

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
  ]
})
export class IncidenteFormModule { }
