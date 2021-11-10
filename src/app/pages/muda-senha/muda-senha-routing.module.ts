import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MudaSenhaComponent } from './muda-senha.component';

const routes: Routes = [
  {
    path: "",
    component: MudaSenhaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MudaSenhaRoutingModule { }
