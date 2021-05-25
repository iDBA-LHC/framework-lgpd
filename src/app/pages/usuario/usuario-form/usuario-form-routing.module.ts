import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form.component';

const routes: Routes = [
  {
    path: "",
    component: UsuarioFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioFormRoutingModule { }
