import { RouteInfo } from './vertical-menu.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',     title: 'Dashboard', icon: 'ft-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/data/contacts', title: 'Contacts List', icon: 'ft-user', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/data/bisp', title: 'BISP List', icon: 'ft-dollar-sign', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[0,1],
  },
  {
    path: '/data/users', title: 'Users List', icon: 'ft-user', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [],  Rights:[1],
  },



];
