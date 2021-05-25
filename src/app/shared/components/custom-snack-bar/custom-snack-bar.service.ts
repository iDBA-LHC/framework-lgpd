import { CustomSnackBarComponent } from "./custom-snack-bar.component";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable({
  providedIn: "root",
})
export class CustomSnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, snackType: string = "Success") {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      duration: 3 * 1000,
      verticalPosition: "top",
      data: { message: message, snackType: snackType },
    });
  }
}
