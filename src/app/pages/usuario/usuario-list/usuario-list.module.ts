import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioListComponent } from './usuario-list.component';
import { UsuarioListRoutingModule } from './usuario-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [UsuarioListComponent],
  imports: [CommonModule, UsuarioListRoutingModule, SharedModule],
})
export class UsuarioListModule { }
