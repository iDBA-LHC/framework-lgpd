import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CookieListComponent } from './cookie-list.component';

const routes: Routes = [
  {
    path: "",
    component: CookieListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CookieListRoutingModule { }
