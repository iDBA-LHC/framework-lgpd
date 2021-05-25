import { CategoryFormRoutingModule } from "./category-form-routing.module";
import { SharedModule } from "./../../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryFormComponent } from "./category-form.component";

@NgModule({
  declarations: [CategoryFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoryFormRoutingModule,
    SharedModule,
  ],
})
export class CategoryFormModule {}
