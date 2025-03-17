import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieListComponent } from './cookie-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CookieListRoutingModule } from './cookie-list-routing.module';
import { InfoBoxComponent } from './info-box/info-box.component';



@NgModule({
  declarations: [CookieListComponent, InfoBoxComponent],
  imports: [CommonModule, CookieListRoutingModule, SharedModule],
})
export class CookieListModule { }
