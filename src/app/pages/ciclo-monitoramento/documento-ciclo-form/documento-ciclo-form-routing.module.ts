import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentoCicloFormComponent } from './documento-ciclo-form.component';

const routes: Routes = [{
  path: "",
  component: DocumentoCicloFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentoCicloFormRoutingModule { }
