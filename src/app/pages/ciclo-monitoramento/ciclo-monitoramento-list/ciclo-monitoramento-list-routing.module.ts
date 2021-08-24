import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CicloMonitoramentoListComponent } from './ciclo-monitoramento-list.component';


const routes: Routes = [{
  path: "",
  component: CicloMonitoramentoListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CicloMonitoramentoListRoutingModule { }
