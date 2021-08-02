import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratoFormComponent } from './contrato-form.component';


const routes: Routes = [{
  path: "",
  component: ContratoFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoFormRoutingModule { }
