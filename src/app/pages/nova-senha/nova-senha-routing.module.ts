import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { NovaSenhaComponent } from './nova-senha.component';

const routes: Routes = [
  {
    path: ":id?",
    component: NovaSenhaComponent,
  },
  {
    path: "",
    component: NovaSenhaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NovaSenhaRoutingModule {}