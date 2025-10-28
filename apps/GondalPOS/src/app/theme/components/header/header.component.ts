import {
  Component,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { AppSettings } from "../../../app.settings";
import { Settings } from "../../../app.settings.model";
import { MenuService } from "../menu/menu.service";
import { HttpBase } from "../../../services/httpbase.service";
import { UPLOADS_URL } from "./../../../config/constants";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService],
  animations: [
    trigger("showInfo", [
      state("1", style({ transform: "rotate(180deg)" })),
      state("0", style({ transform: "rotate(0deg)" })),
      transition("1 => 0", animate("400ms")),
      transition("0 => 1", animate("400ms")),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu = true;
  public showInfoContent = false;
  public Branchesinfo: any = [];
  public settings: Settings;
  public cordin = false;
  public date = "";
  IMAGE_URL = UPLOADS_URL;
  branchid = JSON.parse(localStorage.getItem("currentUser") || "{}").branchid;
  public menuItems: Array<any>;
  constructor(
    public appSettings: AppSettings,
    public menuService: MenuService,
    private http: HttpBase
  ) {
    this.settings = this.appSettings.settings;
    this.menuItems = this.menuService.getHorizontalMenuItems();
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.showHorizontalMenu = false;
    }
    this.date = JSON.parse(localStorage.getItem("currentUser") || "{}").date;
    console.log(this.date);

    this.http
      .getData("business/" + this.http.getBusinessID())
      .then((r: any) => {
        this.settings.name = r.BusinessName;
        this.settings.address = r.Address + ", " + r.City;
        this.settings.phoneno = r.Phone;
        console.log(r);
      });
  }

  public closeSubMenus() {
    const menu = document.querySelector("#menu0");
    if (menu) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < menu.children.length; i++) {
        const child = menu.children[i].children[1];
        if (child) {
          if (child.classList.contains("show")) {
            child.classList.remove("show");
            menu.children[i].children[0].classList.add("collapsed");
          }
        }
      }
    }
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.showHorizontalMenu = false;
    } else {
      this.showHorizontalMenu = true;
    }
  }
}
