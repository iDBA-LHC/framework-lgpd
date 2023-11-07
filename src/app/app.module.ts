import { PhotoModalComponent } from "./shared/components/photo-modal/photo-modal.component";
import { ConfirmModalComponent } from "./shared/components/confirm-modal/confirm-modal.component";
import { CustomSnackBarComponent } from "./shared/components/custom-snack-bar/custom-snack-bar.component";
import { AuthGuard } from "./guards/auth.guard";
import { MatPaginatorIntlPTBR } from "./shared/utils/mat-paginator-intl-pt-br";
import { SharedModule } from "./shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSidenavModule } from "@angular/material/sidenav";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { NgxMaskModule, IConfig } from "ngx-mask";
import { MatPaginatorIntl, MAT_DATE_LOCALE } from "@angular/material";
import { NgxCurrencyModule } from "ngx-currency";
import { UpdatePriceModalComponent } from "./shared/components/update-price-modal/update-price-modal.component";
import { PopupModule } from './shared/popup.module';
import { StorageServiceModule} from 'angular-webstorage-service';
import { AuthMeuUsuarioGuard } from './guards/auth-meu-usuario.guard';
import { AuthTokenInterceptor } from './shared/utils/auth-token-interceptor';
import { ɵb } from "ng-material-multilevel-menu";

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      const tokenResponse = JSON.parse(window.localStorage.getItem("auth"));
      if (tokenResponse) {
        return tokenResponse.token;
      }
    },
    whitelistedDomains: ["localhost:8080", "{PROD_ENV}"],
  };
}

export const options: Partial<IConfig> = {
  decimalMarker: ",",
  validation: false,
  showMaskTyped: true,
};

export function tokenGetter() {
  return localStorage.getItem("jwt_token");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StorageServiceModule,
    SharedModule,
    MatSidenavModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    NgxMaskModule.forRoot(options),
    NgxCurrencyModule,
    PopupModule,
  ],
  providers: [
    ɵb,
    AuthGuard,
    AuthMeuUsuarioGuard,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPTBR },
    { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CustomSnackBarComponent,
    ConfirmModalComponent,
    PhotoModalComponent,
    UpdatePriceModalComponent,

  ],
})
export class AppModule {}