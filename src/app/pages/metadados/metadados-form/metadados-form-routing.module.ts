import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetadadosFormComponent } from './metadados-form.component';

const routes: Routes = [
    {
        path: "",
        component: MetadadosFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MetadadosFormRoutingModule {}