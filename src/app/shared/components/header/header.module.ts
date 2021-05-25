import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule, MatButtonToggleModule } from "@angular/material";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./header.component";
import { MatButtonModule } from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatSidenavModule,
    FlexLayoutModule,
    RouterModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule {}
