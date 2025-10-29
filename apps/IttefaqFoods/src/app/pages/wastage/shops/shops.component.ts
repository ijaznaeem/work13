import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-shops",
  templateUrl: "./shops.component.html",
  styleUrls: ["./shops.component.scss"],
})
export class ShopsComponent implements OnInit {
  public form = {
    title: "Shops",
    tableName: "shops",
    pk: "ShopID",
    columns: [

      {
        fldName: "ShopName",
        control: "input",
        type: "text",
        label: "Shop Name",
        required: true,
        size: 12,
      },
      {
        fldName: "Area",
        control: "input",
        type: "text",
        label: "Area",
        size: 6,
      },
      {
        fldName: "MobileNo",
        control: "input",
        type: "text",
        label: "Mobile No",
        size: 6,
      },
      {
        fldName: "MobileNo",
        control: "input",
        type: "text",
        label: "Mobile No",
        size: 6,
      },
      {
        fldName: "Rate",
        control: "input",
        type: "number",
        label: "Rate",
        size: 6,
      },
      {
        fldName: "Balance",
        control: "input",
        type: "number",
        label: "Balance",
        size: 6,
      },
    ],
  };
  public list = {
    tableName: "shops",
    pk: "ShopID",
    columns: [

      {
        fldName: "ShopName",
        label: "Shop Name",
        required: true,
      },

      {
        fldName: "Area",
        label: "Area",
      },

      {
        fldName: "MobileNo",
        label: "WhatsApp No",
      },
      {
        fldName: "Rate",
        label: "Rate",
      },
      {
        fldName: "Balance",
        label: "Balance",
      },
    ],
  };
  constructor() {}

  ngOnInit() {

  }
}
