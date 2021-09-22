import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentoPlanoFormComponent } from './documento-plano-form.component';


const routes: Routes = [{
  path: "",
  component: DocumentoPlanoFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentoPlanoFormRoutingModule { }
