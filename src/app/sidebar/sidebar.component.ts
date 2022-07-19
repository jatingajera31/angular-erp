import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  selectedTab = 1;
  count = 0;
  demo = {
    approval: 0,
    dispatch: 0,
    dispatch_return: 0,
    disapproval: 0
  }
  sample = {
    approval: 0,
    dispatch: 0,
    dispatch_return: 0,
    disapproval: 0
  }
  spare = {
    approval: 0,
    dispatch: 0,
    dispatch_return: 0,
    disapproval: 0
  }
  constructor(private apiService: ApiService) {
    this.getCount();
    this.getDemoCount();
    this.getSampleCount();
    this.getSpareCount();
    
    this.apiService.changeCount.subscribe((result) => {
      if (result == 'Demo') {
        this.getDemoCount();
      }
      if (result == 'Sample') {
        this.getSampleCount();
      }
      if (result == 'Spare') {
        this.getSpareCount();
      }
      if (result == 'GRNApproval') {
        this.getCount();
      }
    });
  }

  ngOnInit(): void {
    
  }

  getCount() {
    this.apiService.approvalCount({status: 'Pending'}).subscribe((data:any) => {
      this.count = data['data'];
    });
  }

  getDemoCount() {
    this.apiService.getDemoCount({}).subscribe((data:any) => {
      this.demo = data['data'];
    });
  }

  getSampleCount() {
    this.apiService.getSampleCount({}).subscribe((data:any) => {
      this.sample = data['data'];
    });
  }

  getSpareCount() {
    this.apiService.getSpareCount({}).subscribe((data:any) => {
      this.spare = data['data'];
    });
  }

}
