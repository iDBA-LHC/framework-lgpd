import { AuthService } from "./../../../services/auth.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItems } from './models/menu-items';

@Component({
  selector: "app-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.css"],
})
export class SidemenuComponent implements OnInit {
  constructor(private authService: AuthService, 
              private router: Router) {}

  menuItems: MenuItems;

  menu = [];

  ngOnInit() {
    this.menuItems = new MenuItems(this.authService);
    this.menu = this.menuItems.menuItems;
  }

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

    this.router.navigate(["/" + event.link]);
  }
}