import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadadosListRoutingModule } from './metadados-list-routing.module';
import { MetadadosListComponent } from './metadados-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [MetadadosListComponent],
    imports: [
        CommonModule, MetadadosListRoutingModule, SharedModule
    ]
})

export class MetadadosListModule {}