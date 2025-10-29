import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpBase } from '../../services/httpbase.service';
import { ConfigService } from '../services/config.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
})
export class HorizontalMenuComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public menuItems: any = [];
  public config: any = {};
  level: number = 0;
  transparentBGClass = '';
  menuPosition = 'Side';

  layoutSub: Subscription;

  constructor(
    private http: HttpBase,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.config = this.configService.templateConf;
  }

  ngOnInit() {
    let m  = this.http.getUserMenu();
    // let m  = HROUTES
    m = JSON.parse( JSON.stringify( m))
    console.log(m);

    this.menuItems = m;

  }
  MakeMenu(menu: any) {
    for (let i = 0; i < menu.length; i++) {
      let m = menu[i];
      if (m.submenu.length > 0) {
        m = Object.assign(
          {
            path: '',
            title: '',
            icon: 'ft-arrow-right submenu-icon',
            class: 'has-sub',
            badge: '',
            badgeClass: '',
            isExternalLink: false,
          },
          {
            path: m.Url,
            title: m.MenuItem,
            submenu: m.submenu,
          }
        );
        m.submenu = this.MakeMenu(m.submenu);
      } else {
        m = Object.assign(
          {
            path: '',
            title: '',
            icon: 'ft-home',
            class: 'dropdown nav-item',
            isExternalLink: false,
            submenu: [],
          },
          {
            path: m.Url,
            title: m.MenuItem,
          }
        );
      }
    }
    return menu;
  }

  ngAfterViewInit() {
    this.layoutSub = this.configService.templateConf$.subscribe(
      (templateConf) => {
        if (templateConf) {
          this.config = templateConf;
        }
        this.loadLayout();
        this.cdr.markForCheck();
      }
    );
  }

  loadLayout() {
    if (
      this.config.layout.menuPosition &&
      this.config.layout.menuPosition.toString().trim() != ''
    ) {
      this.menuPosition = this.config.layout.menuPosition;
    }

    if (this.config.layout.variant === 'Transparent') {
      this.transparentBGClass = this.config.layout.sidebar.backgroundColor;
    } else {
      this.transparentBGClass = '';
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }
}
