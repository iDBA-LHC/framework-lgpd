import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmeacaFormComponent } from './ameaca-form.component';

const routes: Routes = [
  {
      path: "",
      component: AmeacaFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmeacaFormRoutingModule { }
