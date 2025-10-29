import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpBase } from "../../../services/httpbase.service";
import { MyToastService } from "../../../services/toaster.server";
import { ProcessProductComponent } from "../process-product/process-product.component";
import { OperationsListSettings } from "./operations.setting";

@Component({
  selector: "app-operations",
  templateUrl: "./operations.component.html",
  styleUrls: ["./operations.component.scss"],
})
export class OperationsComponent implements OnInit {
  @ViewChild("dataList") dataList;
  public settings = OperationsListSettings
  public Filter = {
   dept_id: '0'

  };
  filterList = 'dept_id=0'
  Dept:any = {};
  constructor(
    private http: HttpBase,
    private router: Router,
    private myToaster: MyToastService
  ) { }

   ngOnInit() {

    this.filterList = 'isposted = 0 and dept_id=' + this.http.getUserDeptID()
    this.http.getData('depts/' + this.http.getUserDeptID()).then((r:any)=>{
      this.Dept = r;
    })
  }



  FilterData() {
    let filter = "1=1"
    if (!(this.Filter.dept_id == "-1" )) {
       filter += " and  (dept_id = " + this.Filter.dept_id + ")";
    }


    this.filterList = filter;

    setTimeout(() => {
      this.dataList.realoadTable();

    }, 100);

  }
  Clicked(e) {
    console.log(e.data.order_id);
    if (e.action === 'process') {
      if (e.data.isposted =='1'){
        this.myToaster.Error("Can't edit completed order", 'Error');
        return;
      }
      this.http.openModal(ProcessProductComponent,{ID:e.data.detailid} ).then(r=>{
        this.dataList.realoadTable();
      })



    }

  }

}

