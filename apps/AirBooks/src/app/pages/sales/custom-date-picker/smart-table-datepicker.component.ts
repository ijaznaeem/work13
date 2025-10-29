import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';

@Component({
  template: `
  <input [ngClass]="inputClass"
            #name
            type="date"
            class="form-control short-input"
            [name]="cell.getId()"
            [disabled]="!cell.isEditable()"
            [placeholder]="cell.getTitle()"
            (click)="onClick.emit($event)"
            (keyup)="updateValue()"
            [(ngModel)] = "cell.newValue"
            (keydown.enter)="onEdited.emit($event)"
            (keydown.esc)="onStopEditing.emit()">
  `,
})
export class SmartTableDatepickerComponent
extends DefaultEditor implements AfterViewInit {

  @ViewChild('name') name: ElementRef;


  constructor() {
    super();
  }

  ngAfterViewInit() {
    if (this.cell.newValue !== '') {
      this.name.nativeElement.value = this.getDate();

    }
  }

  updateValue() {
    const name = this.name.nativeElement.value;
    this.cell.newValue = `${name}`;
  }

  getDate(): string {
    return (this.cell.getValue())
  }


}
