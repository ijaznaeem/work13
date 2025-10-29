import { Component, OnInit } from "@angular/core";
import { HttpBase } from "../../../services/httpbase.service";

@Component({
  selector: "app-labreport-templates",
  templateUrl: "./labreport-templates.component.html",
  styleUrls: ["./labreport-templates.component.scss"],
})
export class LabreportTemplatesComponent implements OnInit {
  public model = {
    test_id: "",
    obs_id: "",
  };
  test_list: any = [];
  obs_list: any = [];
  setting = {
    crud: true,
    Columns: [
      {
        fldName: "obs_name",
        label: "Obs Name",
      },
      {
        fldName: "unit",
        label: "Unit",
      },
      {
        fldName: "normal_range",
        label: "Normal Range",
      },



    ],
    Actions: [
      {
        action: "delete",
        icon: "trash",
        title: "Delete",
        color: "danger",
      },
    ],
  };
  data: any = [];
  obs: any = [];
  public test:any = {};

  constructor(
    private http: HttpBase
  ) { }

  ngOnInit() {
    this.http.getData('qrylabtests?orderby=test_name').then((data) => {
      this.test_list = data;
    });
    this.http.getData('labtest_obs').then((data) => {
      this.obs_list = data;
    });

  }
  TestSelected(e){
    if (e.itemData){
      this.test = e.itemData

    this.http.getData('qrylabreport_templates?filter=test_id='+ e.itemData.test_id).then(response => {
      this.data = response;
    })
    } else {
        this.test = {};
    }
  }
  ObsSelected(e){
    if (e.itemData){
      this.obs = e.itemData
    } else {
        this.obs = {};
    }
  }
  AddToTemplate() {

  }
  ActionClicked(e) {

  }
}
