import { Injectable } from "@angular/core";
import { Settings } from "./app.settings.model";
import { HttpBase } from "./services/httpbase.service";

@Injectable()
export class AppSettings {
  public settings = new Settings(
    "GPOS",
    "",
    "",
    "",
    {
      menu: "vertical", // horizontal , vertical
      menuType: "default", // default, compact, mini
      showMenu: true,
      navbarIsFixed: true,
      footerIsFixed: false,
      sidebarIsFixed: true,
      showSideChat: false,
      sideChatIsHoverable: true,
      skin: "combined", // light , dark, blue, green, combined, purple, orange, brown, grey, pink
    }
  );
  constructor(private http: HttpBase) {
    let b = this.http.getData('business/' + this.http.getBusinessID()).then((r:any) =>{
      this.settings.title = r.BusinessName;
      this.settings.address = r.Address;
      this.settings.phoneno = r.PhoneNo;
      console.log(r);
    })
  }
}
