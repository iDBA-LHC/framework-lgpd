import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataMapFormComponent } from './data-map-form.component';


const routes: Routes = [{
  path: "",
  component: DataMapFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataMapFormRoutingModule { }
