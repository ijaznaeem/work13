import { Component, OnInit } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';

interface Department {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  title: string;
  path: string;
  parentId: number | null;
  assigned?: boolean;
}

@Component({
  selector: 'app-department-menu-access',
  templateUrl: './department-menu-access.component.html',
  styleUrls: ['./department-menu-access.component.scss'],
})
export class DepartmentMenuAccessComponent implements OnInit {
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;
  menuItems: MenuItem[] = [];
  loading = false;

  constructor(private http: HttpBase) {}

  ngOnInit(): void {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.http.getData('Departments').then((data: any) => {
      this.departments = data;
    });
  }

  onSelectDepartment(departmentId: number) {
    this.selectedDepartmentId = +departmentId;
    this.fetchMenuItemsForDepartment(this.selectedDepartmentId);
  }

  fetchMenuItemsForDepartment(departmentId: number) {
    this.loading = true;
    this.http.getData('MenuItems').then((allItems: any) => {
      if (!this.selectedDepartmentId) return;
      this.http
        .getData(`department`, {
          filter: `DepartmentID = ${this.selectedDepartmentId}`,
        })
        .then((assignedIds: any) => {
          this.menuItems = allItems.map((item) => ({
            ...item,
            assigned: assignedIds.includes(item.MenuID),
          }));
          this.loading = false;
        });

      this.menuItems = allItems.map((item: any) => ({
        ...item,
        assigned: false, // Default to false, will be updated later
      }));
      this.http
        .getData(`DepartmentMenuAccess`, {
          filter: ' DepartmentID =' + departmentId,
        })
        .then((items: any) => {
          this.menuItems = items;
          this.loading = false;
        });
    });
  }

  toggleAccess(menuItem: MenuItem) {
    if (!this.selectedDepartmentId) return;

  }

  getNestedMenuItems(parentId: number | null = null): MenuItem[] {
    return this.menuItems.filter((m) => m.parentId === parentId);
  }
}
