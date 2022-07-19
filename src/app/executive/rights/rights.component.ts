import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-rights',
  templateUrl: './rights.component.html',
  styleUrls: ['./rights.component.css']
})
export class RightsComponent implements OnInit {

  staffs : any[] = [];
  rights : any[] = [];
  selectedUser = '';
  checkedAll = false;
  checkedAllView = false;
  checkedAllAdd = false;
  checkedAllEdit = false;
  checkedAllDelete = false;
  checkedAllPrint = false;
  checkedAllApprove = false;
  constructor(private toastr: ToastService, private apiService: ApiService, private loader: LoaderService) {
    this.getStaffs();
  }

  ngOnInit(): void {
    this.rights.push({
      name: 'Account',
      items: [{
        name: 'Account',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      },{
        name: 'Account Info',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }]
    }, {
      name: 'Product',
      items: [{
        name: 'Product',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      },{
        name: 'Service',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }]
    }, {
      name: 'Executive Data',
      items: [{
        name: 'Executive Data',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }]
    }, {
      name: 'Tools',
      items: [{
        name: 'Yield Master',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }, {
        name: 'Additional Warranty',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }, {
        name: 'SC Planner',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }, {
        name: 'Distance Variable',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }, {
        name: 'Supply Life Variable',
        All: false,
        View: false,
        Add: false,
        Edit: false,
        Delete: false,
        Print: false,
        Approve: false
      }]
    });
  }

  changeAll() {
    this.rights.forEach((row: any) => {
      row.items.forEach((item: any) => {
        if (this.checkedAll) {
          item.All = true;
          item.View = true;
          item.Add = true;
          item.Edit = true;
          item.Delete = true;
          item.Print = true;
          item.Approve = true;
          this.checkedAllView = true;
          this.checkedAllAdd = true;
          this.checkedAllEdit = true;
          this.checkedAllDelete = true;
          this.checkedAllPrint = true;
          this.checkedAllApprove = true;
        } else {
          item.All = false;
          item.View = false;
          item.Add = false;
          item.Edit = false;
          item.Delete = false;
          item.Print = false;
          item.Approve = false;
          this.checkedAllView = false;
          this.checkedAllAdd = false;
          this.checkedAllEdit = false;
          this.checkedAllDelete = false;
          this.checkedAllPrint = false;
          this.checkedAllApprove = false;
        }
      });
    });
  }

  changeOtherCheckBox() {
    this.rights.forEach((row: any) => {
      row.items.forEach((item: any) => {
        if (this.checkedAllView) {
          item.View = true;
        } else {
          item.View = false;
        }
        if (this.checkedAllAdd) {
          item.Add = true;
        } else {
          item.Add = false;
        }
        if (this.checkedAllEdit) {
          item.Edit = true;
        } else {
          item.Edit = false;
        }
        if (this.checkedAllDelete) {
          item.Delete = true;
        } else {
          item.Delete = false;
        }
        if (this.checkedAllPrint) {
          item.Print = true;
        } else {
          item.Print = false;
        }
        if (this.checkedAllApprove) {
          item.Approve = true;
        } else {
          item.Approve = false;
        }
      });
    });
  }

  changeAllRights() {
    this.rights.forEach((row: any) => {
      row.items.forEach((item: any) => {
        if (item.All) {
          item.View = true;
          item.Add = true;
          item.Edit = true;
          item.Delete = true;
          item.Print = true;
          item.Approve = true;
        } else {
          item.View = false;
          item.Add = false;
          item.Edit = false;
          item.Delete = false;
          item.Print = false;
          item.Approve = false;
        }
      });
    });
    this.changeRights();
  }

  changeRights() {
    let countRow = 0;
    let countAll = 0;
    let countView = 0;
    let countAdd = 0;
    let countEdit = 0;
    let countDelete = 0;
    let countPrint = 0;
    let countApprove = 0;
    this.rights.forEach((row: any) => {
      row.items.forEach((item: any) => {
        countRow++;
        if (item.View) {
          countView++;
        }
        if (item.Add) {
          countAdd++;
        }
        if (item.Edit) {
          countEdit++;
        }
        if (item.Delete) {
          countDelete++;
        }
        if (item.Print) {
          countPrint++;
        }
        if (item.Approve) {
          countApprove++;
        }
        item.All = (item.View && item.Add && item.Edit && item.Delete && item.Print && item.Approve);
        if (item.All) {
          countAll++;
        }
      });
    });
    this.checkedAll = (countAll == countRow);
    this.checkedAllView = (countView == countRow);
    this.checkedAllAdd = (countAdd == countRow);
    this.checkedAllEdit = (countEdit == countRow);
    this.checkedAllDelete = (countDelete == countRow);
    this.checkedAllPrint = (countPrint == countRow);
    this.checkedAllApprove = (countApprove == countRow);
  }

  getStaffs() {
    this.loader.start();
    this.apiService.getStaffs({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
      this.loader.stop();
    });
  }

  saveRights() {
    if (!this.selectedUser || this.selectedUser == '') {
      this.toastr.error('ERROR', 'Please select one executive.'); 
      return;
    }
    this.loader.start();
    setTimeout(() => {
      this.toastr.success('SUCCESS', 'Executive Updated Successfully.'); 
      this.loader.stop();
    },1000);
  }

}
