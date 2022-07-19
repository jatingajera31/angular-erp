import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.css']
})
export class DistanceComponent implements OnInit {

  invalidForm = false;
  installations : any[] = [];
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.getDistance();
  }

  ngOnInit(): void {
    
  }

  getDistance() {
    this.loader.start();
    this.apiService.getDistance({}).subscribe(data => {
      this.loader.stop();
      this.installations = data['data'];
      if (this.installations.length == 0) {
        this.addDis();
      }
    });
  }

  addDis() {
    this.installations.push({
      range_from: '',
      range_to: '',
      range_variable: ''
    });
  }

  removeInstallations(i: any) {
    this.installations.splice(i, 1);
  }

  isValid(value: any) {
    return (value === '');
  }

  saveRate() {

    this.invalidForm = false;
    if (this.installations.length) {
      this.installations.forEach((item) => {
        if (this.isValid(item.range_from) || this.isValid(item.range_to) || this.isValid(item.range_variable))  {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid range.');
        return;
      }

      this.loader.start();
      this.apiService.saveDistance({ items: this.installations }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Distance Data Submit Successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }

  }

}
