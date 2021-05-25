import { Component, OnInit, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material";

@Component({
  selector: "app-custom-snack-bar",
  templateUrl: "./custom-snack-bar.component.html",
  styleUrls: ["./custom-snack-bar.component.css"],
})
export class CustomSnackBarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {}

  get icon() {
    switch (this.data.snackType) {
      case "Success":
        return "check_circle";
      case "Error":
        return "error";
      case "Warn":
        return "warning";
      case "Info":
        return "help";
    }
  }

  get color() {
    switch (this.data.snackType) {
      case "Success":
        return "primary";
      case "Error":
        return "warn";
      case "Warn":
        return "accent";
      case "Info":
        return "info";
    }
  }
}
