import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetadadosListComponent } from './metadados-list.component';

const routes: Routes = [
    {
        path: "",
        component: MetadadosListComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MetadadosListRoutingModule {}