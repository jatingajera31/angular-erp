import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  accountForm: FormGroup;
  accountInfos : any[] = [];
  selectedRow : any;
  showModal = false;
  showDeleteModal = false;
  constructor(private fb: FormBuilder, private toastr: ToastService, private apiService: ApiService, private loader: LoaderService) {
     this.accountForm = this.fb.group({
      id: new FormControl(null),
      is_client: new FormControl(null),
      is_supplier: new FormControl(null),
      is_service_agency: new FormControl(null),
      is_re_seller: new FormControl(null),
      name: new FormControl(null, Validators.required)
    });
    this.getData();
  }

  ngOnInit(): void {
    
  }

  editRow() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Account Info.');
    } else {
      this.accountForm.patchValue(this.selectedRow);
      this.showModal = true;
    }
  }

  removeRow() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Account Info.');
    } else {
      this.showDeleteModal = true;
    }
  }

  deleteData() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Account Info.');
    } else {
      this.loader.start();
      this.apiService.deleteAccountInfo({id: this.selectedRow.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.getData();
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Account Information deleted Successfully.'); 
          this.accountForm.reset();
        }
        this.selectedRow = null;
      });
    }
  }

  getData() {
    this.loader.start();
    this.apiService.getAccountInfo({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.accountInfos = [];
        for(let i in data['data']) {
          let types : any[] = [];
          if (data['data'][i].is_client == 1) {
            types.push('Client');
          }
          if (data['data'][i].is_supplier == 1) {
            types.push('Supplier');
          }
          if (data['data'][i].is_service_agency == 1) {
            types.push('Service Agency');
          }
          if (data['data'][i].is_re_seller == 1) {
            types.push('Re Seller');
          }
          let rows = {
            id: data['data'][i].id,
            name: data['data'][i].name,
            is_client: data['data'][i].is_client,
            is_supplier: data['data'][i].is_supplier,
            is_service_agency: data['data'][i].is_service_agency,
            is_re_seller: data['data'][i].is_re_seller,
            text: types.join(', ')
          }
          this.accountInfos.push(rows);
        }
      }
      this.loader.stop();
    });
  }

  saveData() {
    if (this.accountForm.invalid) {
      return;
    }
    if (!this.accountForm.value.is_client && !this.accountForm.value.is_supplier && !this.accountForm.value.is_service_agency && !this.accountForm.value.is_re_seller) {
      this.toastr.error('ERROR', 'Please Select One Account Type.');
      return;
    }
    this.loader.start();
    this.apiService.saveAccountInfo(this.accountForm.value).subscribe(data => {
      if (data && data['status'] == 1) {
        let types : any[] = [];
        if (data['data'].is_client == 1) {
          types.push('Client');
        }
        if (data['data'].is_supplier == 1) {
          types.push('Supplier');
        }
        if (data['data'].is_service_agency == 1) {
          types.push('Service Agency');
        }
        if (data['data'].is_re_seller == 1) {
          types.push('Re Seller');
        }
        let rows = {
          id: data['data'].id,
          name: data['data'].name,
          is_client: data['data'].is_client,
          is_supplier: data['data'].is_supplier,
          is_service_agency: data['data'].is_service_agency,
          is_re_seller: data['data'].is_re_seller,
          text: types.join(', ')
        }
        this.accountInfos.push(rows);
        this.showModal = false;
        this.toastr.success('SUCCESS', 'Account Information Saved Successfully.'); 
        this.accountForm.reset();
        this.selectedRow = null;
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
      this.loader.stop();
    });
  }

  updateData() {
    if (this.accountForm.invalid) {
      return;
    }
    if (!this.accountForm.value.is_client && !this.accountForm.value.is_supplier && !this.accountForm.value.is_service_agency && !this.accountForm.value.is_re_seller) {
      this.toastr.error('ERROR', 'Please Select One Account Type.');
      return;
    }
    if (this.accountForm.value.id > 0) {
      this.loader.start();
      this.apiService.updateAccountInfo(this.accountForm.value).subscribe(data => {
        if (data && data['status'] == 1) {
          let types : any[] = [];
          if (data['data'].is_client == 1) {
            types.push('Client');
          }
          if (data['data'].is_supplier == 1) {
            types.push('Supplier');
          }
          if (data['data'].is_service_agency == 1) {
            types.push('Service Agency');
          }
          if (data['data'].is_re_seller == 1) {
            types.push('Re Seller');
          }
          let rows = {
            id: data['data'].id,
            name: data['data'].name,
            is_client: data['data'].is_client,
            is_supplier: data['data'].is_supplier,
            is_service_agency: data['data'].is_service_agency,
            is_re_seller: data['data'].is_re_seller,
            text: types.join(', ')
          }
          for(let i in this.accountInfos) {
            if (this.accountInfos[i].id == data['data'].id) {
              this.accountInfos[i] = rows;
            }
          }
          this.showModal = false;
          this.toastr.success('SUCCESS', 'Account Information Update Successfully.'); 
          this.accountForm.reset();
          this.selectedRow = null;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
        this.loader.stop();
      });
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.accountForm.reset();
  }

}
