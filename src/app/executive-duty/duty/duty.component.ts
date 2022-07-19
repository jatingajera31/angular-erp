import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-duty',
  templateUrl: './duty.component.html',
  styleUrls: ['./duty.component.css']
})
export class DutyComponent implements OnInit {

  staffs : any[] = [];
  selectedService = '';
  constructor(private toastr: ToastService, private apiService: ApiService, private loader: LoaderService) {
    this.getStaffStatus();
  }

  ngOnInit(): void {
  }

  getStaffStatus() {
    this.loader.start();
    this.apiService.getStaffStatus({status: this.selectedService}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
      this.loader.stop();
    });
  }

  updateStatus(i:any, status:any) {
    this.staffs[i].status = status;
  }

  saveStatus() {
    this.loader.start();
    let users = [];
    for(let i in this.staffs) {
      users.push({ id: this.staffs[i].id, status: this.staffs[i].status });
    }

    this.apiService.saveStaffStatus({users: users}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'OnDuty Updated Successfully.'); 
      }
      this.loader.stop();
    });
  }

}
