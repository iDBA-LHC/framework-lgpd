import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaListComponent } from './empresa-list.component';
import { EmpresaListRoutingModule } from './empresa-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> = {
  decimalMarker: ",",
  validation: false,
  showMaskTyped: true,
};

@NgModule({
  declarations: [EmpresaListComponent],
  imports: [
    CommonModule, EmpresaListRoutingModule, SharedModule, NgxMaskModule.forRoot(options),
  ]
})
export class EmpresaListModule { }
