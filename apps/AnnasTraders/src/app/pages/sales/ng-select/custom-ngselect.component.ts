import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  selector: 'app-custom-select-editor',
  template: `
    <ng-select
      [items]="dropdownList"
      bindLabel="ProductName"
      bindValue="ProductID"
      [(ngModel)]="cell.newValue"
      [clearable]="false"
    >
    </ng-select>
  `,
  styles: [
    `
      ng-select {
        width: 100%;
      }
    `,
  ],
})
export class CustomSelectEditorComponent
  extends DefaultEditor
  implements OnInit
{
  dropdownList: any[] = [];

  ngOnInit() {
    // Get the provided list from settings
    if (this.cell.getColumn().editor.config) {
      this.dropdownList = this.cell.getColumn().editor.config.list || [];
    }

    // Preselect the current value
    if (this.cell.newValue) {
      this.cell.newValue = this.dropdownList.find(
        (item) => item.ProductID === this.cell.newValue
      )?.ProductID;
    }
  }
}
