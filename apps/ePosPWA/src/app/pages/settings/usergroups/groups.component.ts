import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import {
  AddInputFld,
} from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { ROUTES } from '../../../shared/vertical-menu/vertical-menu-routes.config';
import { Groups } from '../../../factories/constants';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupsComponent implements OnInit {
  @ViewChild('treeview')
  public tree;

  acctModel: any = {
    groupid: '',
    group: '',
  };
  public GroupData = Groups;
  public Groupfields: Object = { text: 'GroupName', value: 'GroupID' };
  public data: any = [];
  public pagesids: any = [];
  public menuData: any = ROUTES;

  public treeData = {
    dataSource: this.pagesids,
    id: 'id',
    parentID: 'pid',
    text: 'name',
    hasChildren: 'hasChild',
  };

  public field: Object;;

  public btnsave = false;
  public customerinfo: any = [];
  constructor(private http: HttpBase, private myToaster: MyToastService) { }

  ngOnInit() {

    this.field = { dataSource: this.menuData, id: 'id', text: 'title', child: 'submenu' }

    this.LoadData();
  }

  LoadData() {

  }
  public nodeChecked(args): void {
    if (this.tree.checkedNodes.length > 0) {
      this.btnsave = true;
    } else {
      this.btnsave = false;
    }
    console.log(this.tree.getAllCheckedNodes());

  }
  cancel() {
    this.tree.uncheckAll();
    this.btnsave = false;
    this.rightgroupid = '';
    this.expand = true;
    this.pagesids = [...this.pagesids];
    this.expandandColaps();
    this.refreshpagesid();
  }

  rightgroupid: '';


  public SaveData() {
    const data: any = this.tree.getAllCheckedNodes();
    console.log(data);
    this.http
      .getData('deleteall/usergrouprights/groupid/' + this.rightgroupid)
      .then(
        (res) => {
          this.http.postTask('grouprights', {GroupID: this.rightgroupid, data: data}).then(
            (res) => {
              this.cancel();
              this.myToaster.Sucess('Saved successfully', 'Save');
            },
            (err) => {
              console.log(err);
              this.myToaster.Error('Some Thing Went Wrong', '');
            }
          );
        },
        (err) => {
          this.myToaster.Error(err.message, 'Delete');
        }
      );

  }

  removeDups(arr) {
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    arr = [];
    for (let key in obj) {
      arr.push(key);
    }
    return arr;
  }
  GroupSelect(event) {
    let checkedNodes :any = []
    if (event.value != null && event.value != '') {

      this.http
        .getData('usergrouprights?filter=groupid=' + event.value)
        .then((data: any) => {

            for (let j = 0; j < data.length; j++) {
              checkedNodes.push(data[j].pageid)
          }

          console.log(checkedNodes);
          this.tree.checkedNodes = checkedNodes;

        })

    }
  }
  refreshpagesid() {
    for (let j = 0; j < this.pagesids.length; j++) {
      if (
        this.pagesids[j].pid != undefined &&
        this.pagesids[j].hasChild == undefined
      ) {
        this.pagesids[j].isChecked = false;
      } else if (
        this.pagesids[j].pid == undefined &&
        this.pagesids[j].hasChild === false
      ) {
        this.pagesids[j].isChecked = false;
      }
    }
    this.pagesids = [...this.pagesids];
  }
  CheckAll() {
    this.tree.checkAll();
  }
  UnCheckAll() {
    this.tree.uncheckAll();
    this.tree.checkedNodes = [];
    this.expandandColaps();
    this.refreshpagesid();
  }
  public expand = false;
  expandandColaps() {
    if (this.expand == false) {
      this.expand = true;
      document.getElementById('expand')!.textContent = 'Collapse Rights';
      document.getElementById('expand')!.classList.add('btn-primary');
      document.getElementById('expand')!.classList.remove('btn-danger');
      this.tree.expandAll();
    } else {
      this.expand = false;
      document.getElementById('expand')!.classList.add('btn-danger');
      document.getElementById('expand')!.classList.remove('btn-primary');
      document.getElementById('expand')!.textContent = 'Expand Rights';
      this.tree.collapseAll();
    }
  }
}
