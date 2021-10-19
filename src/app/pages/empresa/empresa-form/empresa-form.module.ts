import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaFormComponent } from './empresa-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpresaFormRoutingModule } from './empresa-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';

export const options: Partial<IConfig> = {
  decimalMarker: ",",
  validation: false,
  showMaskTyped: true,
};


@NgModule({
  declarations: [EmpresaFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmpresaFormRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(options),
  ],
})

export class EmpresaFormModule { }
