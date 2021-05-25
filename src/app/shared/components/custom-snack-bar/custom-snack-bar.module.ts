import { MatIconModule } from "@angular/material/icon";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomSnackBarComponent } from "./custom-snack-bar.component";

@NgModule({
  declarations: [CustomSnackBarComponent],
  imports: [CommonModule, MatIconModule],
  exports: [CustomSnackBarComponent],
})
export class CustomSnackBarModule {}
