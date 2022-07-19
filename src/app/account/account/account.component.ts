import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
declare var $: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  accountForm: FormGroup;
  contactForm: FormGroup;
  staffs : any[] = [];
  dropdowns : any[] = [];
  otherFields : any[] = [];
  areaDrp : any[] = [];
  cityDrp : any[] = [];
  stateDrp : any[] = [];
  countryDrp : any[] = [];
  departments : any[] = [];
  designations : any[] = [];
  contactPersons : any[] = [];
  accountLists : any[] = [];
  editOtherDetails : any[] = [];
  productListGroup : any[] = [];
  showArea = false;
  showCity = false;
  showState = false;
  showCountry = false;
  invalidForm = false;
  invalidContactForm = false;
  showDepartment = false;
  showContactForm = false;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  showConflictModal = false;
  showServiceGroupModal = false;
  isLoadedAddress = false;
  selectedRow:any;
  accountNo:any;
  serviceGroupName:any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.getStaff();
    this.getAccounts();
    this.getAllAddress();
    this.getDepartment();
    this.getDesignation();
    this.getAccountGroup();
    this.accountForm = this.fb.group({
      id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      is_client: new FormControl(null),
      is_supplier: new FormControl(null),
      is_service_agency: new FormControl(null),
      is_re_seller: new FormControl(null),
      account_name: new FormControl(null, Validators.required),
      account_no: new FormControl(null, Validators.required),
      short_code: new FormControl(null, Validators.required),
      phone_code: new FormControl('91'),
      phone_number: new FormControl(null),
      account_group_id: new FormControl(null),
      website: new FormControl(null),
      email: new FormControl(null),
      address: new FormControl(null, Validators.required),
      area_id: new FormControl(null, Validators.required),
      address_line_one: new FormControl(null),
      address_line_two: new FormControl(null),
      pincode: new FormControl(null),
      credit_day: new FormControl(null),
      credit_limit: new FormControl(null),
      gst_no: new FormControl(null),
      pan_no: new FormControl(null),
      communication_gujarati: new FormControl(null),
      communication_english: new FormControl(null),
      price_discount_silver: new FormControl(null),
      price_discount_silver_rate: new FormControl(null),
      price_discount_gold: new FormControl(null),
      price_discount_gold_rate: new FormControl(null),
      price_discount_platinum: new FormControl(null),
      price_discount_platinum_rate: new FormControl(null),
      executive_id: new FormControl(null, [Validators.pattern("^[0-9]*$")]),
      additional_silver_rate: new FormControl(null),
      additional_gold_rate: new FormControl(null),
      additional_platinum_rate: new FormControl(null),
      target_lower_silver_rate: new FormControl(null),
      target_upper_silver_rate: new FormControl(null),
      target_lower_gold_rate: new FormControl(null),
      target_upper_gold_rate: new FormControl(null),
      target_lower_platinum_rate: new FormControl(null),
      reminder_target_reached: new FormControl(null),
      department_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
    });

    this.contactForm = this.fb.group({
      id: new FormControl(null),
      account_id: new FormControl(null, Validators.required),
      account_name: new FormControl(null),
      department_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      designation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      first_name: new FormControl(null, Validators.required),
      mobile_code: new FormControl('91', Validators.required),
      mobile_number: new FormControl(null, Validators.required),
      last_name: new FormControl(null),
      phone_code: new FormControl('91'),
      phone_number: new FormControl(null),
      email: new FormControl(null),
      birth_date: new FormControl(null),
      b_date: new FormControl(null),
      anniversary_date: new FormControl(null),
      a_date: new FormControl(null),
      department_name: new FormControl(null)
    });
  }

  ngOnInit(): void {
      this.accountForm.controls.is_client.valueChanges.subscribe(val => {
        if (val || this.accountForm.value.is_re_seller) {
          this.accountForm.controls['executive_id'].setValidators([Validators.required]);
        } else {
          this.accountForm.controls['executive_id'].clearValidators();
        }
        this.accountForm.controls['executive_id'].updateValueAndValidity();
      });

      this.accountForm.controls.is_re_seller.valueChanges.subscribe(val => {
        if (val || this.accountForm.value.is_client) {
          this.accountForm.controls['executive_id'].setValidators([Validators.required]);
        } else {
          this.accountForm.controls['executive_id'].clearValidators();
        }
        this.accountForm.controls['executive_id'].updateValueAndValidity();
      });

      // this.accountForm.controls.is_service_agency.valueChanges.subscribe(val => {
      //   if (val) {
      //     this.accountForm.controls['credit_day'].setValidators([Validators.required]);
      //   } else {
      //     this.accountForm.controls['credit_day'].clearValidators();
      //   }
      //   this.accountForm.controls['credit_day'].updateValueAndValidity();
      // });
  }

  generateAccountNo() {
    if (this.createMode && this.accountNo &&  this.accountForm.value.short_code) {
      const date = this.datePipe.transform(new Date(), 'yyMMdd');
      let accountNo = this.accountForm.value.short_code + this.accountNo + date;
      accountNo = accountNo.toUpperCase();
      this.accountForm.controls.account_no.setValue(accountNo);
    }
  }

  getPan() {
    if (this.accountForm.value.gst_no) {
      var panno = this.accountForm.value.gst_no.substr(2, 10);
      this.accountForm.controls.pan_no.setValue(panno);
    }
  }

  // Scode0000120210212

  resetForm() {
    this.accountForm.reset();
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.editOtherDetails = [];
    this.otherFields = [];
    this.resetForm();
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.editOtherDetails = [];
    this.resetForm();
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.editOtherDetails = [];
    this.resetForm();
  }

  deleteAcount() {
    if (this.accountForm.value.id && this.accountForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Account.');
    }
  }

  deleteData() {
    if (!this.accountForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Account Info.');
    } else {
      this.loader.start();
      this.apiService.deleteAccount({id: this.accountForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.getAccounts();
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Account deleted successfully.'); 
        }
      });
    }
  }

  getAllAddress() {
    this.apiService.getAllAddress({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.dropdowns = data['data'];
        this.isLoadedAddress = true;
      }
    });
  }

  getAddress(address: any) {
    console.log(address)
    this.accountForm.controls.address_line_one.setValue(address.address_one);
    this.accountForm.controls.address_line_two.setValue(address.address_two);
    this.accountForm.controls.pincode.setValue(address.pincode);
    this.accountForm.controls.area_id.setValue(address.area_id);
    this.accountForm.controls.address.setValue(address.full_address);
  }

  getAccountDetail() {
    this.editOtherDetails = [];
    this.loader.start();
    this.apiService.showAccount({id: this.accountForm.value.id}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.accountForm.patchValue(data['data']);
        this.editOtherDetails = data['data']['details'];
        this.getAccountPerson();
        this.getAccountInfoByInfo();

        let newAddress : any[] = [];
        if (data['data'].address_line_one) {
          newAddress.push(data['data'].address_line_one);
        }
        if (data['data'].address_line_two) {
          newAddress.push(data['data'].address_line_two);
        }
        if (data['data'].city_name) {
          let ct = data['data'].city_name;
          if (data['data'].pincode) {
            ct += '-' + data['data'].pincode;
          }
          newAddress.push(ct);
        }
        if (data['data'].state_name) {
          newAddress.push(data['data'].state_name);
        }
        if (data['data'].country_name) {
          newAddress.push(data['data'].country_name);
        }
        const stringAddress = newAddress;
        this.accountForm.controls.address.setValue(stringAddress.join(', '));
      }
    });
  }

  // getAllAddress() {
  //   this.apiService.getAllAddress({}).subscribe(data => {
  //     if (data && data['status'] == 1) {
  //       this.areaDrp = data['data']['area'];
  //       this.cityDrp = data['data']['city'];
  //       this.stateDrp = data['data']['state'];
  //       this.countryDrp = data['data']['country'];
  //     }
  //   });
  // }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getAccounts() {
    this.apiService.getAccount({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.accountLists = data['data'];
      }
    });
  }

  getAccountNo() {
    if (this.accountForm.value.short_code && this.createMode) {
      this.apiService.getAccountNo({code: this.accountForm.value.short_code}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.accountNo = data['data'];
          this.generateAccountNo();
        }
      });
    }
  }

  getAccountInfoByInfo() {
    if (this.accountForm.value.is_re_seller && this.accountForm.value.is_client) {
      this.showConflictModal = true;
    } else {
      this.yesConflict();
    }
  }

  noConflict() {
    this.showConflictModal = false;
    this.accountForm.controls.is_re_seller.setValue(false);
  }

  yesConflict() {
    let params = {
      is_client: this.accountForm.value.is_client,
      is_supplier: this.accountForm.value.is_supplier,
      is_service_agency: this.accountForm.value.is_service_agency,
      is_re_seller: this.accountForm.value.is_re_seller
    }
    if (!params.is_client && !params.is_supplier && !params.is_service_agency && !params.is_re_seller) {
      this.otherFields = [];
      return;
    }
    if (this.accountForm.value.is_re_seller && this.accountForm.value.is_client) {
      this.accountForm.controls.is_client.setValue(false);
      params.is_client = false;
      this.showConflictModal = false;
    }
    this.apiService.getAccountInfoByInfo(params).subscribe(data => {
      if (data && data['status'] == 1) {
        this.otherFields = data['data'];
        if (this.accountForm.value.id && this.accountForm.value.id > 0 && this.editOtherDetails.length) {
          for(let i in this.otherFields) {
            for(let j in this.editOtherDetails) {
              if (this.otherFields[i].id == this.editOtherDetails[j].account_info_id) {
                this.otherFields[i].text_value = this.editOtherDetails[j].account_info_value;
              }
            }
          }
        }
      }
      this.showConflictModal = false;
    });
  }

  getAccountGroup() {
    this.apiService.getAccountGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productListGroup = data['data'];
      }
    });
  }

  viewServiceGroupModal() {
    if (this.accountForm.value.account_group_id && this.accountForm.value.account_group_id != 'null') {
      for(let i in this.productListGroup) {
        if (this.productListGroup[i].id == this.accountForm.value.account_group_id) {
          this.serviceGroupName = this.productListGroup[i].name;
          this.showServiceGroupModal = true;
        }
      }
    } else {
      this.serviceGroupName = '';
      this.showServiceGroupModal = true;
    }
  }

  saveServiceGroup() {
    if (!this.serviceGroupName) {
      this.toastr.error('ERROR', 'Please enter product group.');
      return;
    }
    if (this.accountForm.value.account_group_id && this.accountForm.value.account_group_id != 'null') {
      this.loader.start();
      this.apiService.updateAccountGroup({id:this.accountForm.value.account_group_id, name: this.serviceGroupName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.productListGroup) {
            if (this.productListGroup[i].id == this.accountForm.value.account_group_id) {
              this.productListGroup[i].name = data['data'].name;
            }
          }
          this.showServiceGroupModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      })
    } else {
      this.loader.start();
      this.apiService.saveAccountGroup({name: this.serviceGroupName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.productListGroup.push(data['data']);
          this.accountForm.controls.account_group_id.setValue(data['data'].id);
          this.showServiceGroupModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveAccount() {
    this.invalidForm = false;
    if (this.accountForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.accountForm.value.is_client || this.accountForm.value.is_re_seller) {
      if (this.isValid(this.accountForm.value.executive_id)) {
        this.invalidForm = true;
        this.toastr.error('ERROR', 'Please enter valid details.');
        return;
      }
    }

    if (!this.accountForm.value.is_client && !this.accountForm.value.is_supplier && !this.accountForm.value.is_service_agency && !this.accountForm.value.is_re_seller) {
      this.toastr.error('ERROR', 'Please Select Atleast One Type.');
      return;
    }

    if (!this.accountForm.value.communication_gujarati && !this.accountForm.value.communication_english) {
      this.toastr.error('ERROR', 'Please Select Atleast One Communication Language.');
      return;
    }

    if (this.accountForm.value.is_re_seller) {
      if (!this.accountForm.value.price_discount_silver && !this.accountForm.value.price_discount_gold && !this.accountForm.value.price_discount_platinum) {
        this.toastr.error('ERROR', 'Please Select Atleast One Price Discount Structure.');
        return;
      }

      if (!this.accountForm.value.price_discount_silver_rate && !this.accountForm.value.price_discount_gold_rate && !this.accountForm.value.price_discount_platinum_rate) {
        this.toastr.error('ERROR', 'Please Enter Amount of Price Discount Structure.');
        return;
      }
    }

    let params = JSON.parse(JSON.stringify(this.accountForm.value));
    params.fields = JSON.parse(JSON.stringify(this.otherFields));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateAccount(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account details update successfully.');
          this.closeForm();
          this.otherFields = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveAccount(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account details saved successfully.');
          this.getAccounts();
          this.closeForm();
          this.otherFields = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveContact(isCont: any) {
    console.log(this.contactForm.controls)
    this.invalidContactForm = false;
    if (this.contactForm.invalid) {
      this.invalidContactForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.contactForm.value.id && this.contactForm.value.id > 0) {
      this.loader.start();
      this.apiService.updateAccountPerson(this.contactForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account person details updated successfully.');
          this.contactForm.reset();
          this.contactForm.controls.account_id.setValue(this.accountForm.value.id);
          this.contactForm.controls.account_name.setValue(this.accountForm.value.account_name);
          if (!isCont) {
            this.showContactForm = false;  
          }
          this.getAccountPerson();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveAccountPerson(this.contactForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Account person details saved successfully.');
          this.contactForm.reset();
          this.contactForm.controls.account_id.setValue(this.accountForm.value.id);
          this.contactForm.controls.account_name.setValue(this.accountForm.value.account_name);
          if (!isCont) {
            this.showContactForm = false;  
          }
          this.getAccountPerson();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  showContactFormModal() {
    this.contactForm.reset();
    this.contactForm.controls.account_id.setValue(this.accountForm.value.id);
    this.contactForm.controls.account_name.setValue(this.accountForm.value.account_name);
    this.selectedRow = null;  
    this.showContactForm = true;  
    this.loadDatePicker();
  }

  loadDatePicker() {
    setTimeout(() => {
      $( "#contactBirthDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.contactForm.controls.birth_date.setValue(date);
      });

      $( "#contactAnniversaryDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.contactForm.controls.anniversary_date.setValue(date);
      });

      $('#contactBirthDate').mask('00/00/0000');
      $('#contactAnniversaryDate').mask('00/00/0000');
    }, 1000);
  }

  changeDate(field: any, iField: any) {
    if (this.contactForm.value[field]) {
      let d = this.makeDate(this.contactForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.contactForm.controls[iField].setValue(date);
    }
  }

  makeDate(tarik: string) {
    if (tarik) {
      let t = tarik.split('/');
      return t[1] + '/' + t[0] + '/' + t[2];
    } else {
      return null;
    }
  }

  closeContactFormModal() {
    $('#contactBirthDate').datepicker('destroy');
    $('#contactAnniversaryDate').datepicker('destroy');
    this.contactForm.reset();
    this.contactForm.controls.account_id.setValue(this.accountForm.value.id);
    this.contactForm.controls.account_name.setValue(this.accountForm.value.account_name);
    this.showContactForm = false;  
  }

  editContactFormModal() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Contact Person.');
    } else {
      this.showContactForm = true;
      this.contactForm.patchValue(this.selectedRow);
      if(this.selectedRow.birth_date) {
        this.contactForm.controls.b_date.setValue(this.datePipe.transform(new Date(this.selectedRow.birth_date), 'dd/MM/yyyy'));
      }
      if(this.selectedRow.anniversary_date) {
        this.contactForm.controls.a_date.setValue(this.datePipe.transform(new Date(this.selectedRow.anniversary_date), 'dd/MM/yyyy'));
      }
      this.contactForm.controls.account_name.setValue(this.accountForm.value.account_name);
      this.loadDatePicker();
    }
  }

  removeContactFormModal() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Contact Person.');
    } else {
      this.loader.start();
      this.apiService.deleteAccountPerson({id: this.selectedRow.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.getAccountPerson();
          this.toastr.success('SUCCESS', 'Contact Person deleted Successfully.'); 
          this.contactForm.reset();
          this.contactForm.controls.account_id.setValue(this.accountForm.value.id);
          this.contactForm.controls.account_name.setValue(this.accountForm.value.account_name);
        }
        this.selectedRow = null;
      });
    }
  }

  getDepartment() {
    this.apiService.getDepartment({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.departments = data['data'];
      }
    });
  }

  getDesignation() {
    this.apiService.getDesignation({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.designations = data['data'];
      }
    });
  }

  getAccountPerson() {
    if (this.accountForm.value.id) {
      this.apiService.getAccountPerson({account_id: this.accountForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.contactPersons = data['data'];
          this.contactPersons.forEach((item) => {
            this.designations.forEach((row) => {
              if (row.id == item.designation_id) {
                item.designation_name = row.title;
              }
            });            
          });
        }
      });
    }
  }

  showDepartmentModal() {
    this.contactForm.controls['department_id'].clearValidators();
    this.contactForm.controls['department_id'].updateValueAndValidity();
    this.contactForm.controls['department_name'].setValidators([Validators.required]);
    this.contactForm.controls['department_name'].updateValueAndValidity();
    this.contactForm.controls['department_id'].setValue(null);
    this.showDepartment = true;
  }
  closeDepartmentModal() {
    this.contactForm.controls['department_id'].setValidators([Validators.required]);
    this.contactForm.controls['department_id'].updateValueAndValidity();
    this.contactForm.controls['department_name'].clearValidators();
    this.contactForm.controls['department_name'].updateValueAndValidity();
    this.contactForm.controls['department_name'].setValue(null);
    this.showDepartment = false;
  }

  isValid(value: any) {
    return (!value || value == 'null' || value == 'undefined' || value == '');
  }

}
