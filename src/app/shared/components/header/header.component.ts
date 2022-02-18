import { AppComponent } from "./../../../app.component";
import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  ambiente: String;
  @Output("sideNav") sideNav: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private authService: AuthService,
    public RightSidenavComponent: AppComponent
  ) {}

  ngOnInit() {
    this.ambiente = environment.envDesc;
  }

  onLogout() {
    this.authService.logout();
  }

  public get name() {
    var nomeAux = this.authService.getLoggedUserName();
    var iAux = nomeAux.indexOf(" ");
    if (iAux != -1)
    {
      nomeAux = nomeAux.substring(0,iAux);
    }
    return nomeAux;
  }

  public get userId()
  {
    return this.authService.getLoggedUserId();
  }

  toggleSidenav() {
    this.sideNav.emit();
  }
}
