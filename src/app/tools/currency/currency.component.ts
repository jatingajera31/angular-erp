import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {

  invalidForm = false;
  installations : any[] = [];
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.getCurrency();
  }

  ngOnInit(): void {
    
  }

  getCurrency() {
    this.loader.start();
    this.apiService.getCurrency({}).subscribe(data => {
      this.loader.stop();
      this.installations = data['data'];
      if (this.installations.length == 0) {
        this.addDis();
      }
    });
  }

  addDis() {
    this.installations.push({
      id: null,
      country: null,
      currency_code: null
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
        if (this.isValid(item.country) || this.isValid(item.currency_code))  {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid details.');
        return;
      }

      this.loader.start();
      this.apiService.saveCurrency({ items: this.installations }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Currency Data Submit Successfully.');
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