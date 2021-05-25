import { SharedModule } from "./../../shared/shared.module";
import { SignInRoutingModule } from "./sign-in-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SignInComponent } from "./sign-in.component";

@NgModule({
  declarations: [SignInComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SignInRoutingModule,
    SharedModule,
  ],
})
export class SignInModule {}
