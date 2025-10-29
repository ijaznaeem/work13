import { Component, Input, OnInit } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-items-list",
  templateUrl: "./items-list.component.html",
  styleUrls: ["./items-list.component.scss"],
})
export class ItemsListComponent implements OnInit {

  @Input() group: string = '';

  setting = {
    Columns: [
      {
        fldName: "group",
        label: "Item Group",
      },

      {
        fldName: "item",
        label: "List Item",
      },
    ],
    Actions: [

      {
        action: "edit",
        icon: "pencil",
        title: "Edit",
        color: "warning",
      },
      {
        action: "delete",
        icon: "trash",
        title: "Delete",
        color: "danger",
      },
    ],

  };

  model: any = {};
  data: any = [];
  constructor(
    private http: HttpBase,
  ) { }

  ngOnInit() {
    if (this.group !== '') {
      this.LoadData();
      this.ResetModel();
    }
  }

  LoadData() {
    this.http.getData("itemslist?filter=group='" + this.group + "'").then((data: any) => {
      this.data = data
    })
  }
  AddItem() {
    let url = 'itemslist'
    if (this.model.id) {
      url += '/' + this.model.id;
    }
    this.http.postData(url, this.model).then((response: any) => {
      this.LoadData();
      this.ResetModel();
    })
  }

  ActionClicked(e) {
    if (e.action === 'edit') {
      this.model = e.data;


    }
  }
  ResetModel() {
    this.model = {};
    this.model.group = this.group;
  }
}
