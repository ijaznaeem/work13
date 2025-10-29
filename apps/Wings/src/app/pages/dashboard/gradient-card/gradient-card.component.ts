import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
export enum CardStyle {
  GradientKingYna = 'gradient-king-yna',
  GradientMint = 'gradient-mint',
  GradientPurpleLove = 'gradient-purple-love',
  GradientIbizaSunset = 'gradient-ibiza-sunset',
}
export interface CardData {
  Caption?: string;
  Value?: any;
  Style?: CardStyle; // Using an object to hold CSS styles
}

@Component({
  selector: 'app-gradient-card',
  templateUrl: './gradient-card.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class GradientCardComponent implements OnInit {
  @Input() Caption = '';
  @Input() Value = '';
  @Input() Style = CardStyle.GradientIbizaSunset;

  constructor(private http: HttpBase) {}

  ngOnInit() {
//    console.log(this.Style);
  }
}
