import { Validators } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material";
import { MatDialogRef } from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";

@Component({
  selector: "app-update-price-modal",
  templateUrl: "./update-price-modal.component.html",
  styleUrls: ["./update-price-modal.component.css"],
})
export class UpdatePriceModalComponent implements OnInit {
  newPriceForm: FormGroup;

  currencyOpts = {
    prefix: "R$",
    decimal: ",",
    thousands: "",
    align: "left",
  };

  constructor(
    public dialogRef: MatDialogRef<UpdatePriceModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdatePriceDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.newPriceForm = this.formBuilder.group({
      newPrice: [this.data.newPrice, Validators.required],
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  processNewPrice() {
    if (this.newPriceForm.valid) {
      this.dialogRef.close(this.newPriceForm.get("newPrice").value);
    }
  }
}

export interface UpdatePriceDialogData {
  title: string;
  newPrice: number;
}
