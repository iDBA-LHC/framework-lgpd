import { NgModule } from '@angular/core';
import { RelatorioRIPDComponent } from './relatorio-ripd.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
      path: "",
      component: RelatorioRIPDComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelatorioRIPDRoutingModule { }
