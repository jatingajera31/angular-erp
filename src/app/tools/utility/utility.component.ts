import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.css']
})
export class UtilityComponent implements OnInit {

  client_id:any = null;
  short_code:any = null;
  sales_executive_id:any = null;
  clients:any = [];
  staffs:any = [];
  locations:any = [];
  projects:any = [];
  constructor(private toastr: ToastService, private loader: LoaderService, private apiService: ApiService) {
    this.getClients();
    this.getStaff();
  }

  ngOnInit(): void {
  }

  getClients() {
    this.loader.start();
    this.apiService.getClients({}).subscribe(data => {
      this.clients = data['data'];
      this.loader.stop();
    });
  }

  getShortCode() {
    let row = this.clients.find((item:any) => { return (item.id == this.client_id) });
    this.short_code = (row) ? row.short_code: null;
    this.sales_executive_id = (row) ? row.executive_id: null;
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getLocation() {
    this.apiService.getLocation({parent_id: this.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getProject() {
    this.apiService.getProject({client_id: this.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
