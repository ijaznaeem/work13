import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AddInputFld } from '../../../../../../../libs/future-tech-lib/src/lib/components/crud-form/crud-form-helper';
import { HttpBase } from '../../../services/httpbase.service';
import { MyToastService } from '../../../services/toaster.server';
import { ROUTES } from '../../../shared/vertical-menu/vertical-menu-routes.config';
interface MenuItem {
  page_id: string;
  page: string;
  create: boolean;
  view: boolean;
  edit: boolean;
  delete: boolean;
  full_access: boolean;
}
@Component({
  selector: 'app-usergroups',
  templateUrl: './usergroups.component.html',
  styleUrls: ['./usergroups.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsergroupsComponent implements OnInit {
  @ViewChild('treeview')
  public tree;

  acctModel: any = {
    group_id: '',
    group: '',
  };
  public GroupData: any = [];
  public Groupfields: Object = { text: 'group_name', value: 'group_id' };
  branchid: any = -1;
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

  public field: Object;

  public form = {
    title: 'User Groups',
    tableName: 'usergroups',
    pk: 'group_id',
    columns: [AddInputFld('group_name', 'Group Name', 6)],
  };
  public list = {
    tableName: 'usergroups',
    pk: 'group_id',
    columns: [
      { fldName: 'group_id', label: 'ID' },
      { fldName: 'group_name', label: 'Group Name' },
    ],
  };
  public btnsave = false;
  public customerinfo: any = [];

  menuItems: MenuItem[] = [];
  group_id: '';
  groups: any = [];

  constructor(private http: HttpBase, private myToaster: MyToastService) {}

  ngOnInit() {
    this.branchid = this.http.getBranch_id();
    if (this.branchid == null) {
      this.branchid = -1;
    }

    this.field = {
      dataSource: this.menuData,
      id: 'id',
      text: 'title',
      child: 'submenu',
    };

    this.LoadData();

    this.http.getData('usergroups').then((grp) => {
      this.groups = grp;
    });
    this.LoadActionsData('');
  }
  LoadActionsData(v) {
    this.menuItems = [];
    if (v == '') {
      return;
    }
    this.http.getData('usergrouprights?filter=group_id=' + v).then((r: any) => {
      r.forEach((e) => {
        this.menuItems.push({
          page_id: e.page_id,
          page: this.FindPage(e.page_id),
          create: e.add_ == 0 ? false : true,
          edit: e.edit == 0 ? false : true,
          view: e.view == 0 ? false : true,
          delete: e.del == 0 ? false : true,
          full_access: e.full == 0 ? false : true,
        });
      });
    });

    console.log(this.menuItems);
  }
  FindPage(id) {
    let Routes = ROUTES;
    for (let index = 0; index < Routes.length; index++) {
      if (Routes[index].id == id) {
        return Routes[index].title;
      }
      if (Routes[index].submenu.length > 0) {
        for (let j = 0; j < Routes[index].submenu.length; j++) {
          if (Routes[index].submenu[j].id == id) {
            return Routes[index].submenu[j].title;
          }
        }
      }
    }
    return '';
  }

  SaveActions() {
    console.log(this.menuItems);
    this.http
      .postTask('savegrouprights', {
        group_id: this.group_id,
        rights: this.menuItems,
      })
      .then((r) => {
        this.myToaster.Sucess('Saved successfully', 'Save');
      })
      .catch((e) => {
        this.myToaster.Error('Error in saving data', 'Error');
      });
  }

  LoadData() {
    this.http.getData('usergroups').then((data) => {
      this.data = data;
      this.GroupData = data;
    });
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

  // getAllNodes() {
  //   let parentdata: any = [];
  //   let alldata: any = [];
  //   console.log(this.tree.getAllCheckedNodes());
  //   if (this.tree.checkedNodes.length > 0) {
  //     for (let i = 0; i < this.tree.getAllCheckedNodes().length; i++) {
  //       this.pagesids.filter((res) => {
  //         if (res.id == this.tree.getAllCheckedNodes()[i]) {
  //           if (res.pid != undefined) parentdata.push(res.pid);
  //         }
  //       });
  //     }

  //     for (let i = 0; i < this.tree.getAllCheckedNodes().length; i++) {
  //       alldata.push(this.tree.getAllCheckedNodes()[i]);
  //     }

  //     for (let i = 0; i < parentdata.length; i++) {
  //       alldata.push(parentdata[i]);
  //     }
  //     alldata = this.removeDups(alldata);

  //     return alldata;
  //   }
  // }

  public SaveData1() {
    const data: any = this.tree.getAllCheckedNodes();
    console.log(data);
    // this.http
    //   .getData('deleteall/usergrouprights/group_id/' + this.rightgroupid)
    //   .then(
    //     (res) => {
    this.http
      .postTask('grouprights', { group_id: this.rightgroupid, data: data })
      .then(
        (res) => {
          this.cancel();
          this.myToaster.Sucess('Saved successfully', 'Save');
        },
        (err) => {
          console.log(err);
          this.myToaster.Error('Some Thing Went Wrong', '');
        }
      );
    //   },
    //   (err) => {
    //     this.myToaster.Error(err.message, 'Delete');
    //   }
    // );
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
    let checkedNodes: any = [];
    if (event.value != null && event.value != '') {
      this.http
        .getData('usergrouprights?filter=group_id=' + event.value)
        .then((data: any) => {
          for (let j = 0; j < data.length; j++) {
            checkedNodes.push(data[j].page_id);
          }

          console.log(checkedNodes);
          this.tree.checkedNodes = checkedNodes;
        });
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
