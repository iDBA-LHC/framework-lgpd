import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmModalComponent } from "./confirm-modal.component";
import { MatButtonModule, MatDialogModule } from "@angular/material";

@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ConfirmModalModule {}
