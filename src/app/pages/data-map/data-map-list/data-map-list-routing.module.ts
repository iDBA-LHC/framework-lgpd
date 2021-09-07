import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataMapListComponent } from './data-map-list.component';


const routes: Routes = [{
  path: "",
  component: DataMapListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DataMapListRoutingModule { }
