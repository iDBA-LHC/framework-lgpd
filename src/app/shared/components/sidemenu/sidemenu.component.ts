import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.css"],
})
export class SidemenuComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  appitems = [
    {
      label: "Usuário",
      link: "/usuario",
      icon: "account_circle",
    },
  ];

  config = {
    paddingAtStart: true,
    classname: "my-custom-class",
    fontColor: "#fff",
    selectedListFontColor: "#ffffff",
  };

  selectedItem(event) {
    if (event.link == "/logout") {
      this.authService.logout();
      return;
    }

    this.router.navigate([event.link]);
  }
}