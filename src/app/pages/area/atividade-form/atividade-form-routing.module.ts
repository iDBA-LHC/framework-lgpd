import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AtividadeFormComponent } from './atividade-form.component';


const routes: Routes = [{
  path: "",
  component: AtividadeFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadeFormRoutingModule { }
