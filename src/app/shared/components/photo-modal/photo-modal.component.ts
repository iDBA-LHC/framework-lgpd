import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-photo-modal",
  templateUrl: "./photo-modal.component.html",
  styleUrls: ["./photo-modal.component.css"],
})
export class PhotoModalComponent implements OnInit {
  imageUrl: string;

  constructor(public dialogRef: MatDialogRef<PhotoModalComponent>) {}

  ngOnInit() {}

  onNoClick() {
    this.dialogRef.close();
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
}
