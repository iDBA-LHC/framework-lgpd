import { UpdatePriceModalModule } from "./components/update-price-modal/update-price-modal.module";
import { CustomSnackBarModule } from "./components/custom-snack-bar/custom-snack-bar.module";
import { ConfirmModalModule } from "./components/confirm-modal/confirm-modal.module";
import { PhotoModalModule } from "./components/photo-modal/photo-modal.module";
import { SidemenuModule } from "./components/sidemenu/sidemenu.module";
import { HeaderModule } from "./components/header/header.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import {
  MatAutocompleteModule,
  MatToolbarModule,
  MatSidenavModule,
  MatMenuModule,
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatStepperModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatTreeModule,
  MatTooltipModule,
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatButtonToggleModule,
} from "@angular/material";
import { CancelJobModalModule } from "./components/cancel-job-modal/cancel-job-modal.module";
import { MatTableExporterModule } from "mat-table-exporter";

@NgModule({
  declarations: [],
  imports: [CommonModule, HeaderModule, SidemenuModule],
  exports: [
    HeaderModule,
    SidemenuModule,
    PhotoModalModule,
    CancelJobModalModule,
    ConfirmModalModule,
    UpdatePriceModalModule,
    MatFormFieldModule,
    FlexLayoutModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    CustomSnackBarModule,
    MatTableExporterModule, 
  ],
})
export class SharedModule {}