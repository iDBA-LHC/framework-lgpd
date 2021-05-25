import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarTituloComponent } from './listar-titulo.component';
import { MatDialogModule, MatButtonModule, MatTableModule, MatSortModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [ListarTituloComponent],
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    SharedModule, 
    BrowserModule, 
    MatTableModule, 
    MatSortModule
  ]
})
export class ListarTituloModule { }
