import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.css']
})
export class SupplyComponent implements OnInit {

  invalidForm = false;
  installations : any[] = [];
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.getSupply();
  }

  ngOnInit(): void {
    
  }

  getSupply() {
    this.loader.start();
    this.apiService.getSupply({}).subscribe(data => {
      this.loader.stop();
      this.installations = data['data'];
      if (this.installations.length == 0) {
        this.addDis();
      }
    });
  }

  addDis() {
    this.installations.push({
      sc_year: 1,
      from_day: '',
      to_day: '',
      variable: ''
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
        if (this.isValid(item.sc_year) || this.isValid(item.from_day) || this.isValid(item.to_day) || this.isValid(item.variable))  {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid range.');
        return;
      }

      this.loader.start();
      this.apiService.saveSupply({ items: this.installations }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Supply Data Submit Successfully.');
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
