import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessoFormComponent } from './processo-form.component';


const routes: Routes = [{
  path: "",
  component: ProcessoFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessoFormRoutingModule { }
