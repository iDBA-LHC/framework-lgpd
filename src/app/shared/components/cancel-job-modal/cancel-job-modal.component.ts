import { Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material";
import { MatDialogRef } from "@angular/material";
import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-cancel-job-modal",
  templateUrl: "./cancel-job-modal.component.html",
  styleUrls: ["./cancel-job-modal.component.css"]
})
export class CancelJobModalComponent implements OnInit {
  cancelForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CancelJobModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CancelDialogData,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.cancelForm = this.formBuilder.group({
      reason: ["", Validators.required]
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  processCancel() {
    if (this.cancelForm.valid) {
      this.dialogRef.close(this.cancelForm.get("reason").value);
    }
  }
}

export interface CancelDialogData {
  title: string;
}
