import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum Buttons {
  First= 1,
  Previous= 2,
  Next= 3,
  Last= 4,
}  ;


@Component({
  selector: 'ft-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css'],
})


export class NavigatorComponent {
  @Input() disabled: boolean = false;

  @Output()
  ClickAction: EventEmitter<any> = new EventEmitter<any>();

  ButtonClicked(button: Buttons){
    this.ClickAction.emit({ Button:button  });
  }
}
