import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmeacaListComponent } from './ameaca-list.component';


const routes: Routes = [
  {
      path: "",
      component: AmeacaListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmeacaListRoutingModule { }
