import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  cardImageBase64 = './assets/images/default_male.png';
  signBase64 = './assets/images/sign.jpg';
  DesignationName:any;
  DepartmentName:any;
  AddressOne:any;
  AddressTwo:any;
  AddressPincode:any;
  AddressArea:any;
  AddressAreaName:any;
  AddressCity:any;
  AddressCityName:any;
  AddressState:any;
  AddressStateName:any;
  AddressCountry:any;
  AddressCountryName:any;
  Village:any;
  Taluko:any;
  District:any;
  executiveId:any;
  selectedRow:any;
  shift_total_hours = '';
  shift_total_minutes = '';
  userForm: FormGroup;
  userDetail: FormGroup;
  memberForm: FormGroup;
  staffs : any[] = [];
  designations : any[] = [];
  departments : any[] = [];
  areaDrp : any[] = [];
  cityDrp : any[] = [];
  stateDrp : any[] = [];
  countryDrp : any[] = [];
  familyMembers : any[] = [];
  productGroups : any[] = [];
  relations : any[] = [];
  invalidForm = false;
  invalidDetailForm = false;
  invalidContactForm = false;
  showDesignation = false;
  showDepartment = false;
  showAddressOne = false;
  showAddressTwo = false;
  moreDetails = false;
  showFamilyMember = false;
  showArea = false;
  showCity = false;
  showState = false;
  showCountry = false;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  showRelation = false;
  selectAll = false;
  showStartTime = false;
  showEndTime = false;
  waitingForSave = false;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.getStaff();
    this.getDesignation();
    this.getDepartment();
    this.getAllAddress();
    this.getProductGroup();
    this.getRelation();

    this.userForm = this.fb.group({
      id: new FormControl(null),
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      company_phone_code: new FormControl('+91', Validators.required),
      company_phone_number: new FormControl(null, Validators.required),
      person_type: new FormControl(null, Validators.required),
      designation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      department_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      area_id: new FormControl(null, Validators.required),
      address_one_id: new FormControl(null, Validators.required),
      address_line_one: new FormControl(null),
      address_line_two: new FormControl(null),
      pincode: new FormControl(null),
      village: new FormControl(null),
      taluko: new FormControl(null),
      district: new FormControl(null),
      father_name: new FormControl(null, Validators.required),
      executive_id: new FormControl({value: null, disabled: true}),
      personal_phone_code: new FormControl('+91'),
      personal_phone_number: new FormControl(null),
      whatsapp: new FormControl(null),
      email: new FormControl(null),
      skype: new FormControl(null),
      twitter: new FormControl(null),
      blood_group: new FormControl(null),
      birth_date: new FormControl(null),
      anniversary_date: new FormControl(null),
      joining_date: new FormControl(null),
      resignation_date: new FormControl(null),
      address_two_id: new FormControl(null),
      photo: new FormControl(null),
      signature: new FormControl(null),
      active: new FormControl(null),
      working_place: new FormControl(null),
      company_name: new FormControl(null),
      stay_away_from_office: new FormControl(null),
      office_location: new FormControl(null),
      login_alert: new FormControl(null),
      t_birth_date: new FormControl(null),
      t_anniversary_date: new FormControl(null),
      t_joining_date: new FormControl(null),
      t_resignation_date: new FormControl(null)
    });

    this.userDetail = this.fb.group({
      id: new FormControl(null),
      user_id: new FormControl(null, Validators.required),
      benefit: new FormControl(null),
      valid_within: new FormControl(null),
      id_proof: new FormControl(null),
      reference: new FormControl(null),
      yield_by_service: new FormControl(null),
      yield_by_service_rs: new FormControl({value: null, disabled: true}),
      yield_days: new FormControl({value: null, disabled: true}),
      yield_date: new FormControl({value: null, disabled: true}),
      installation_days: new FormControl({value: null, disabled: true}),
      installation_date: new FormControl({value: null, disabled: true}),
      liable_to_yield_if: new FormControl({value: null, disabled: true}),
      no_repeat_call: new FormControl({value: null, disabled: true}),
      call_charge_not_pending: new FormControl({value: null, disabled: true}),
      forced_deduction_rs: new FormControl(null),
      yield_by_installation: new FormControl(null),
      yield_approved: new FormControl({value: null, disabled: true}),
      shift_start: new FormControl(null),
      shift_end: new FormControl(null),
      shift_total_hours: new FormControl(null),
      shift_total_minutes: new FormControl(null),
      base_salary_month_rs: new FormControl(null),
      work_on_outstation_paid: new FormControl(null),
      work_on_outstation_paid_rd: new FormControl({value: null, disabled: true}),
      sunday_pay_off: new FormControl(null),
      sunday_pay_off_rd: new FormControl({value: null, disabled: true}),
      fuel_charge_km: new FormControl(null),
      fuel_charge_rs: new FormControl({value: null, disabled: true}),
      mobile_usage_limit: new FormControl(null),
      mobile_usage_limit_rs: new FormControl({value: null, disabled: true}),
      proffessional_tax: new FormControl(null),
      proffessional_tax_rs: new FormControl({value: null, disabled: true}),
      esic: new FormControl(null),
      employer_contribution: new FormControl({value: null, disabled: true}),
      self_contribution: new FormControl({value: null, disabled: true}),
      tds: new FormControl(null),
      tds_applicable: new FormControl({value: null, disabled: true}),
      pan_no: new FormControl(null),
      aadhar_no: new FormControl(null),
      voter_id: new FormControl(null),
      vehicle_name: new FormControl(null),
      vehicle_type_more: new FormControl(null),
      vehicle_state: new FormControl(null),
      vehicle_city: new FormControl(null),
      vehicle_series: new FormControl(null),
      vehicle_number: new FormControl(null),
      brand: new FormControl(null),
      chesis_no: new FormControl(null),
      licence_no: new FormControl(null),
      licence_valid_upto: new FormControl(null),
      renew_reminder_date: new FormControl(null),
      starting_reading_km: new FormControl(null),
      partnership: new FormControl(null),
      partnership_rate: new FormControl({value: null, disabled: true}),
      t_licence_valid_upto: new FormControl(null),
      t_renew_reminder_date: new FormControl(null)
    });

    this.memberForm = this.fb.group({
      id: new FormControl(null),
      user_id: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      relation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      relation_name: new FormControl(null),
      birth_date: new FormControl(null),
      t_birth_date: new FormControl(null),
      contact_code: new FormControl(null),
      contact_number: new FormControl(null),
    });

  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    $( "#BirthDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.userForm.controls.birth_date.setValue(date);
    });

    $( "#AnniversaryDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.userForm.controls.anniversary_date.setValue(date);
    });

    $( "#JoiningDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.userForm.controls.joining_date.setValue(date);
    });

    $( "#ResignationDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.userForm.controls.resignation_date.setValue(date);
    });

    $("#BirthDate").mask('00/00/0000');
    $("#AnniversaryDate").mask('00/00/0000');
    $("#JoiningDate").mask('00/00/0000');
    $("#ResignationDate").mask('00/00/0000');
  }

  loadDatePicker() {
    setTimeout(() => {
      $( "#familyBirthDate" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.memberForm.controls.birth_date.setValue(date);
      });
      $("#familyBirthDate").mask('00/00/0000');
    }, 500);
  }

  licencePicker() {
    setTimeout(() => {
      $( "#licence_valid_upto" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.userDetail.controls.licence_valid_upto.setValue(date);
      });

      $( "#renew_reminder_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.userDetail.controls.renew_reminder_date.setValue(date);
      });
      $("#licence_valid_upto").mask('00/00/0000');
      $("#renew_reminder_date").mask('00/00/0000');
    }, 1000);
  }

  changeDate(field: any, iField: any) {
    if (this.userForm.value[field]) {
      let d = this.makeDate(this.userForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.userForm.controls[iField].setValue(date);
    }
  }

  changeDetailDate(field: any, iField: any) {
    if (this.userDetail.value[field]) {
      let d = this.makeDate(this.userDetail.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.userDetail.controls[iField].setValue(date);
    }
  }

  changeFmDate(field: any, iField: any) {
    if (this.memberForm.value[field]) {
      let d = this.makeDate(this.memberForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.memberForm.controls[iField].setValue(date);
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

  getRelation() {
    this.apiService.getRelation({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.relations = data['data'];
      }
    });
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        // data['data'].push({
        //   'id': 0,
        //   'name': 'Other Product'
        // });
        var i,j, chunk = 4;
        for (i = 0,j = data['data'].length; i < j; i += chunk) {
          this.productGroups.push(data['data'].slice(i, i + chunk));
        }
      }
    });
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
        this.executiveId = data['exec_id'];
      }
    });
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.userForm.reset();
    this.cardImageBase64 = './assets/images/default_male.png';
    this.signBase64 = './assets/images/sign.jpg';
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.userForm.reset();
    this.userForm.controls['id'].clearValidators();
    this.userForm.controls['id'].updateValueAndValidity();
    this.userForm.controls['username'].setValidators([Validators.required]);
    this.userForm.controls['username'].updateValueAndValidity();
    this.userForm.controls['password'].setValidators([Validators.required]);
    this.userForm.controls['password'].updateValueAndValidity();
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.userForm.reset();
    this.userForm.controls['id'].setValidators([Validators.required]);
    this.userForm.controls['id'].updateValueAndValidity();
    this.userForm.controls['username'].clearValidators();
    this.userForm.controls['username'].updateValueAndValidity();
    this.userForm.controls['password'].clearValidators();
    this.userForm.controls['password'].updateValueAndValidity();
  }

  createExecId() {
    if (this.createMode && this.executiveId &&  this.userForm.value.first_name && this.userForm.value.father_name && this.userForm.value.last_name) {
      const date = this.datePipe.transform(new Date(), 'yyMMdd');
      let executiveId = this.userForm.value.first_name.charAt(0) + this.userForm.value.father_name.charAt(0) + this.userForm.value.last_name.charAt(0) + this.executiveId;
      executiveId = executiveId.toUpperCase() + date;
      this.userForm.controls.executive_id.setValue(executiveId);
    }
  }

  setEditFormData() {
    if (this.userForm.value.id) {
      for(let i in this.staffs) {
        if (this.staffs[i].id == this.userForm.value.id) {
          this.userForm.patchValue(this.staffs[i]);
          if (this.staffs[i].photo) {
            this.cardImageBase64 = this.staffs[i].photo;
          } else {
            this.cardImageBase64 = './assets/images/default_male.png';
          }
          if (this.staffs[i].signature) {
            this.signBase64 = this.staffs[i].signature;
          } else {
            this.signBase64 = './assets/images/sign.jpg';
          }


          let newAddress : any[] = [];
          if (this.staffs[i].address_line_one) {
            newAddress.push(this.staffs[i].address_line_one);
          }
          if (this.staffs[i].address_line_two) {
            newAddress.push(this.staffs[i].address_line_two);
          }
          if (this.staffs[i].city_name) {
            let ct = this.staffs[i].city_name;
            if (this.staffs[i].pincode) {
              ct += '-' + this.staffs[i].pincode;
            }
            newAddress.push(ct);
          }
          if (this.staffs[i].state_name) {
            newAddress.push(this.staffs[i].state_name);
          }
          if (this.staffs[i].country_name) {
            newAddress.push(this.staffs[i].country_name);
          }
          const stringAddress = newAddress;
          this.userForm.controls.address_one_id.setValue(stringAddress.join(', ')); 

          let sub_address : any[] = [];
          if (this.staffs[i].village) {
            sub_address.push(this.staffs[i].village);
          }
          if (this.staffs[i].taluko) {
            sub_address.push(this.staffs[i].taluko);
          }
          if (this.staffs[i].district) {
            sub_address.push(this.staffs[i].district);
          }
          this.userForm.controls.address_two_id.setValue(sub_address.join(', '));

          this.userForm.controls.photo.setValue(null);
          this.userForm.controls.signature.setValue(null);

          if(this.staffs[i].birth_date) {
            this.userForm.controls.t_birth_date.setValue(this.datePipe.transform(new Date(this.staffs[i].birth_date), 'dd/MM/yyyy'));
          }
          if(this.staffs[i].anniversary_date) {
            this.userForm.controls.t_anniversary_date.setValue(this.datePipe.transform(new Date(this.staffs[i].anniversary_date), 'dd/MM/yyyy'));
          }
          if(this.staffs[i].joining_date) {
            this.userForm.controls.t_joining_date.setValue(this.datePipe.transform(new Date(this.staffs[i].joining_date), 'dd/MM/yyyy'));
          }
          if(this.staffs[i].resignation_date) {
            this.userForm.controls.t_resignation_date.setValue(this.datePipe.transform(new Date(this.staffs[i].resignation_date), 'dd/MM/yyyy'));
          }
        }
      }
    }
  }

  deleteProduct() {
    if (this.userForm.value.id && this.userForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Profile.');
    }
  }

  deleteData() {
    if (!this.userForm.value.id) {
      this.toastr.error('ERROR', 'Please select staff.');
    } else {
      this.loader.start();
      this.apiService.deleteStaff({id: this.userForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Staff deleted successfully.'); 
        }
      });
    }
  }

  saveUser() {
    this.invalidForm = false;
    if (this.userForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.userForm.value.id && this.userForm.value.id > 0) {
      this.loader.start();
      this.apiService.updateStaff(this.userForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Staff details updated successfully.');
          this.closeForm();
          this.getStaff();
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveStaff(this.userForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Staff details saved successfully.');
          if (this.waitingForSave) {
            this.userForm.controls.id.setValue(data['data'].id);
            this.createMode = false;
            this.userDetail.controls.user_id.setValue(data['data'].id);
            this.saveDetails();
          } else {
            this.closeForm();
          }
          this.getStaff();
        }
      });
    }
  }

  saveDesignation() {
    if (this.DesignationName) {
      this.loader.start();
      this.apiService.saveDesignation({name:this.DesignationName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.designations.push(data['data']);
          this.userForm.controls.designation_id.setValue(data['data'].id);
        }
        this.showDesignation = false;
      });
    }
  }

  saveDepartment() {
    if (this.DepartmentName) {
      this.loader.start();
      this.apiService.saveDepartment({name:this.DepartmentName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.departments.push(data['data']);
          this.userForm.controls.department_id.setValue(data['data'].id);
        }
        this.showDepartment = false;
      });
    }
  }

  saveAddressOne() {
    let address = {
      address_one: this.AddressOne,
      address_two: this.AddressTwo,
      pincode: this.AddressPincode,
      area_name: this.AddressAreaName,
      city_name: this.AddressCityName,
      state_name: this.AddressStateName,
      country_name: this.AddressCountryName,
      area_id: this.AddressArea,
      city_id: this.AddressCity,
      state_id: this.AddressState,
      country_id: this.AddressCountry
    }
    this.userForm.controls.address_line_one.setValue(this.AddressOne);
    this.userForm.controls.address_line_two.setValue(this.AddressTwo);
    this.userForm.controls.pincode.setValue(this.AddressPincode);

    let newAddress : any[] = [];
    if (this.AddressOne) {
      newAddress.push(this.AddressOne);
    }
    if (this.AddressTwo) {
      newAddress.push(this.AddressTwo);
    }

    if (this.showArea && this.AddressAreaName) {
      address.area_id = null;
      if (this.showCity)  {
        address.city_id = null;
      } else {
        address.city_name = null;
      }
      if (this.showState)  {
        address.state_id = null;
      } else {
        address.state_name = null;
      }
      if (this.showCountry)  {
        address.country_id = null;
      } else {
        address.country_name = null;
      }
      this.loader.start();
      this.apiService.saveAddress(address).subscribe(data => {
        this.loader.start();
        if (data && data['status'] == 1) {
          newAddress.push(data['data'].name);
          let ct = data['data'].city.name;
          if (this.AddressPincode) {
            ct += '-' + this.AddressPincode;
          }
          newAddress.push(ct);
          newAddress.push('(' + data['data'].state.name + ')');
          newAddress.push(data['data'].country.name);
          const stringAddress = newAddress;
          this.userForm.controls.address_one_id.setValue(stringAddress.join(', '));    
          this.userForm.controls.area_id.setValue(data['data'].id);    
          this.showAddressOne = false;
        }
      });
    } else {
      for(let i in this.areaDrp) {
        if (this.areaDrp[i].id == this.AddressArea) {
          newAddress.push(this.areaDrp[i].name);
          let ct = this.areaDrp[i].city.name;
          if (this.AddressPincode) {
            ct += '-' + this.AddressPincode;
          }
          newAddress.push(ct);
          newAddress.push('(' + this.areaDrp[i].state.name + ')');
          newAddress.push(this.areaDrp[i].country.name);
        }
      }
      const stringAddress = newAddress;
      this.userForm.controls.address_one_id.setValue(stringAddress.join(', '));    
      this.userForm.controls.area_id.setValue(this.AddressArea);    
      this.showAddressOne = false;
    }
  }

  saveAddressTwo() {
    let newAddress : any[] = [];
    if (this.Village) {
      this.userForm.controls.village.setValue(this.Village);
      newAddress.push(this.Village);
    }
    if (this.Taluko) {
      this.userForm.controls.taluko.setValue(this.Taluko);
      newAddress.push(this.Taluko);
    }
    if (this.District) {
      this.userForm.controls.district.setValue(this.District);
      newAddress.push(this.District);
    }
    this.userForm.controls.address_two_id.setValue(newAddress.join(', '));
    this.showAddressTwo = false;
  }

  selectAllProduct() {
    for(let i in this.productGroups) {
      for(let j in this.productGroups[i]) {
        if (this.selectAll) {
          this.productGroups[i][j].checked = true;
        } else {
          this.productGroups[i][j].checked = false;
        }
      }
    }
  }

  isInValid(value: any) {
    return (!value || value == 'null' || value == 'undefined' || value == '');
  }

  saveDetails() {

    this.invalidDetailForm = false;
    if (this.userDetail.invalid) {
      this.invalidDetailForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.userDetail.value.user_id && this.userDetail.value.user_id > 0) {
      let params = JSON.parse(JSON.stringify(this.userDetail.value));
      let productIds : any[] = [];
      for(let i in this.productGroups) {
        for(let j in this.productGroups[i]) {
          if (this.productGroups[i][j].checked) {
            productIds.push(this.productGroups[i][j].id);
          }
        }
      }
      params.product_ids = productIds;
      if (this.userDetail.value.id && this.userDetail.value.id > 0) {
        this.loader.start();
        this.apiService.updateUserDetail(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Details saved successfully.');
          }
          if (data['status'] == 0) {
            for(var r in data['data']) {
              this.toastr.error('Error', data['data'][r]);    
            }
          }
        });
      } else {
        this.loader.start();
        this.apiService.saveUserDetail(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Details saved successfully.');
            if (this.waitingForSave) {
              this.moreDetails = false;
              this.closeForm();
            }
          }
          if (data['status'] == 0) {
            for(var r in data['data']) {
              this.toastr.error('Error', data['data'][r]);    
            }
          }
        });
      }
    } else {
      this.waitingForSave = true;
      this.saveUser();
    }
  }

  saveFamilyMember() {
    this.invalidContactForm = false;
    if (this.memberForm.invalid) {
      this.invalidContactForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.memberForm.value.id) {
      this.loader.start();
      this.apiService.updateFamilyMember(this.memberForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Family member details updated successfully.');
          this.memberForm.reset();
          this.memberForm.controls['user_id'].setValue(this.userForm.value.id);
          this.memberForm.controls['contact_code'].setValue('+91');
          this.showFamilyMember = false;  
          this.getFamilyMember();
          this.getRelation();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });  
    } else {
      this.loader.start();
      this.apiService.saveFamilyMember(this.memberForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Family member details saved successfully.');
          this.memberForm.reset();
          this.memberForm.controls['user_id'].setValue(this.userForm.value.id);
          this.memberForm.controls['contact_code'].setValue('+91');
          this.showFamilyMember = false;  
          this.getFamilyMember();
          this.getRelation();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  showDesignationModal() {
    this.showDesignation = true;
  }

  showDepartmentModal() {
    this.showDepartment = true;
  }

  showAddressOneModal() {
    this.showAddressOne = true;  
  }

  showAddressTwoModal() {
    this.showAddressTwo = true;  
  }

  viewMoreDetail() {
    this.moreDetails = true;  
    this.waitingForSave = false;
    this.userDetail.controls['user_id'].setValue(this.userForm.value.id);
    this.getFamilyMember();
    this.getUserDetail();
    this.licencePicker();
  }

  getUserDetail() {
    if (this.userForm.value.id) {
      this.loader.start();
      this.apiService.getUserDetail({user_id: this.userForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.userDetail.patchValue(data['data']);
          this.setEnableDisable();
          this.manageHour();
          let check = 0;
          let spds = data['products'].map(String);
          for(let i in this.productGroups) {
            for(let j in this.productGroups[i]) {
              check++;
              let id = this.productGroups[i][j].id.toString();
              if (spds.indexOf(id) != -1) {
                this.productGroups[i][j].checked = true;
              } else {
                this.productGroups[i][j].checked = false;
              }
            }
          }
          if (check == data['products'].length) {
            this.selectAll = true;
          } else {
            this.selectAll = false;
          }
          if(data['data'].licence_valid_upto) {
            this.userDetail.controls.t_licence_valid_upto.setValue(this.datePipe.transform(new Date(data['data'].licence_valid_upto), 'dd/MM/yyyy'));
          }
          if(data['data'].renew_reminder_date) {
            this.userDetail.controls.t_renew_reminder_date.setValue(this.datePipe.transform(new Date(data['data'].renew_reminder_date), 'dd/MM/yyyy'));
          }
        }
        this.loader.stop();
      });
    }
  }

  closeMoreDetail() {
    $('#licence_valid_upto').datepicker('destroy');
    $('#renew_reminder_date').datepicker('destroy');
    this.moreDetails = false;  
  }

  getFamilyMember() {
    if (this.userForm.value.id) {
      this.apiService.getFamilyMember({user_id: this.userForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.familyMembers = data['data'];
        }
      });
    }
  }

  showFamilyModal() {
    this.memberForm.reset();
    this.memberForm.controls['user_id'].setValue(this.userForm.value.id);
    this.memberForm.controls['contact_code'].setValue('+91');
    this.selectedRow = null;  
    this.showFamilyMember = true;  
    this.loadDatePicker();
  }

  editFamilyModal() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Family Member.');
      return;
    }
    this.memberForm.patchValue(this.selectedRow);
    if(this.selectedRow.birth_date) {
      this.memberForm.controls.t_birth_date.setValue(this.datePipe.transform(new Date(this.selectedRow.birth_date), 'dd/MM/yyyy'));
    }
    this.showFamilyMember = true;  
    this.loadDatePicker();
  }

  hideFamilyModal() {
    $('#familyBirthDate').datepicker('destroy');
    this.memberForm.reset();
    this.memberForm.controls['user_id'].setValue(this.userForm.value.id);
    this.memberForm.controls['contact_code'].setValue('+91');
    this.showFamilyMember = false;  
  }

  showRelationField() {
    this.memberForm.controls['relation_id'].clearValidators();
    this.memberForm.controls['relation_id'].updateValueAndValidity();
    this.memberForm.controls['relation_name'].setValidators([Validators.required]);
    this.memberForm.controls['relation_name'].updateValueAndValidity();
    this.memberForm.controls['relation_id'].setValue(null);
    this.showRelation = true;
  }
  closeRelationField() {
    this.memberForm.controls['relation_id'].setValidators([Validators.required]);
    this.memberForm.controls['relation_id'].updateValueAndValidity();
    this.memberForm.controls['relation_name'].clearValidators();
    this.memberForm.controls['relation_name'].updateValueAndValidity();
    this.memberForm.controls['relation_name'].setValue(null);
    this.showRelation = false;
  }

  removeFamilyModal() {
    if (!this.selectedRow) {
      this.toastr.error('ERROR', 'Please Select One Family Member.');
    } else {
      this.loader.start();
      this.apiService.deleteFamilyMember({id: this.selectedRow.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.getFamilyMember();
          this.toastr.success('SUCCESS', 'Family Member deleted Successfully.'); 
          this.memberForm.reset();
          this.memberForm.controls['user_id'].setValue(this.userForm.value.id);
          this.memberForm.controls['contact_code'].setValue('+91');
        }
        this.selectedRow = null;
      });
    }
  }

  changeYiDay() {
    if (this.userDetail.value.yield_days > -1) {
      var result = new Date();
      result.setDate(result.getDate() + this.userDetail.value.yield_days);
      const date = this.datePipe.transform(result, 'yyyy-MM-dd');
      this.userDetail.controls.yield_date.setValue(date);
    }
  }

  changeInsDay() {
   if (this.userDetail.value.installation_days > -1) {
      var result = new Date();
      result.setDate(result.getDate() + this.userDetail.value.installation_days);
      const date = this.datePipe.transform(result, 'yyyy-MM-dd');
      this.userDetail.controls.installation_date.setValue(date);
    } 
  }

  setEnableDisable() {

    if (this.userDetail.value.yield_by_service) {
      this.userDetail.controls.yield_days.enable();
      this.userDetail.controls.yield_date.enable();
      this.userDetail.controls.yield_days.setValidators([Validators.required]);
      this.userDetail.controls.yield_date.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.yield_days.disable();
      this.userDetail.controls.yield_date.disable();
      this.userDetail.controls.yield_days.clearValidators();
      this.userDetail.controls.yield_date.clearValidators();
    }
    this.userDetail.controls.yield_days.updateValueAndValidity();
    this.userDetail.controls.yield_date.updateValueAndValidity();

    if (this.userDetail.value.yield_by_installation) {
      this.userDetail.controls.installation_days.enable();
      this.userDetail.controls.installation_date.enable();
      this.userDetail.controls.installation_days.setValidators([Validators.required]);
      this.userDetail.controls.installation_date.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.installation_days.disable();
      this.userDetail.controls.installation_date.disable();
      this.userDetail.controls.installation_days.clearValidators();
      this.userDetail.controls.installation_date.clearValidators();
    }
    this.userDetail.controls.installation_days.updateValueAndValidity();
    this.userDetail.controls.installation_date.updateValueAndValidity();

    if (this.userDetail.value.work_on_outstation_paid) {
      this.userDetail.controls.work_on_outstation_paid_rd.enable();
      this.userDetail.controls.work_on_outstation_paid_rd.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.work_on_outstation_paid_rd.disable();
      this.userDetail.controls.work_on_outstation_paid_rd.clearValidators();
    }
    this.userDetail.controls.work_on_outstation_paid_rd.updateValueAndValidity();

    if (this.userDetail.value.sunday_pay_off) {
      this.userDetail.controls.sunday_pay_off_rd.enable();
      this.userDetail.controls.sunday_pay_off_rd.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.sunday_pay_off_rd.disable();
      this.userDetail.controls.sunday_pay_off_rd.clearValidators();
    }
    this.userDetail.controls.sunday_pay_off_rd.updateValueAndValidity();

    if (this.userDetail.value.fuel_charge_km) {
      this.userDetail.controls.fuel_charge_rs.enable();
      this.userDetail.controls.fuel_charge_rs.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.fuel_charge_rs.disable();
      this.userDetail.controls.fuel_charge_rs.clearValidators();
    }
    this.userDetail.controls.fuel_charge_rs.updateValueAndValidity();

    if (this.userDetail.value.mobile_usage_limit) {
      this.userDetail.controls.mobile_usage_limit_rs.enable();
      this.userDetail.controls.mobile_usage_limit_rs.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.mobile_usage_limit_rs.disable();
      this.userDetail.controls.mobile_usage_limit_rs.clearValidators();
    }
    this.userDetail.controls.mobile_usage_limit_rs.updateValueAndValidity();

    if (this.userDetail.value.proffessional_tax) {
      this.userDetail.controls.proffessional_tax_rs.enable();
      this.userDetail.controls.proffessional_tax_rs.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.proffessional_tax_rs.disable();
      this.userDetail.controls.proffessional_tax_rs.clearValidators();
    }
    this.userDetail.controls.proffessional_tax_rs.updateValueAndValidity();

    if (this.userDetail.value.esic) {
      this.userDetail.controls.employer_contribution.enable();
      this.userDetail.controls.self_contribution.enable();
      this.userDetail.controls.employer_contribution.setValidators([Validators.required]);
      this.userDetail.controls.self_contribution.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.employer_contribution.disable();
      this.userDetail.controls.self_contribution.disable();
      this.userDetail.controls.employer_contribution.clearValidators();
      this.userDetail.controls.self_contribution.clearValidators();
    }
    this.userDetail.controls.employer_contribution.updateValueAndValidity();
    this.userDetail.controls.self_contribution.updateValueAndValidity();

    if (this.userDetail.value.tds) {
      this.userDetail.controls.tds_applicable.enable();
      this.userDetail.controls.tds_applicable.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.tds_applicable.disable();
      this.userDetail.controls.tds_applicable.clearValidators();
    }
    this.userDetail.controls.tds_applicable.updateValueAndValidity();

    if (this.userDetail.value.partnership) {
      this.userDetail.controls.partnership_rate.enable();
      this.userDetail.controls.partnership_rate.setValidators([Validators.required]);
    } else {
      this.userDetail.controls.partnership_rate.disable();
      this.userDetail.controls.partnership_rate.clearValidators();
    }
    this.userDetail.controls.partnership_rate.updateValueAndValidity();
  }

  blurStart() {
    setTimeout(() => {
      this.showStartTime = false;
    },200)
  }

  blurEnd() {
    setTimeout(() => {
      this.showEndTime = false;
    },200)
  }

  // https://timepicker.co/
  // $('.timepicker').timepicker({
  //     timeFormat: 'h:mm p',
  //     interval: 30,
  //     minTime: '8',
  //     maxTime: '8:00pm',
  //     startTime: '8:00',
  //     dynamic: false,
  //     dropdown: true,
  //     scrollbar: true
  // });

  setStartTime(time:any) {
    this.userDetail.controls.shift_start.setValue(time);
    this.manageHour();
  }

  setEndTime(time:any) {
    this.userDetail.controls.shift_end.setValue(time);
    this.manageHour();
  }

  manageHour() {
    if(this.userDetail.value.shift_start && this.userDetail.value.shift_end) {
      let startDate:any = this.parseDaytime(this.userDetail.value.shift_start);
      let endDate:any = this.parseDaytime(this.userDetail.value.shift_end);
      if (startDate != 'Invalid Date' && endDate != 'Invalid Date') {
        var diffMs = (endDate - startDate);
        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        var totalMinute  = (diffHrs * 60) + diffMins;
        var totalHours  = (totalMinute / 60).toFixed(2);
        this.userDetail.controls.shift_total_hours.setValue(totalHours);
        this.userDetail.controls.shift_total_minutes.setValue(totalMinute);
        this.shift_total_hours = totalHours + ' Hours';
        this.shift_total_minutes = totalMinute + ' Minutes';
      } else {
        this.userDetail.controls.shift_total_hours.setValue(null);
        this.userDetail.controls.shift_total_minutes.setValue(null);
        this.shift_total_hours = '';
        this.shift_total_minutes = '';
      }
    } else {
      this.userDetail.controls.shift_total_hours.setValue(null);
      this.userDetail.controls.shift_total_minutes.setValue(null);
      this.shift_total_hours = '';
      this.shift_total_minutes = '';
    }
  }

  parseDaytime(time:any) {
    let [hours, minutes] = time.substr(0, time.length  -2).split(":").map(Number);
    if (time.includes("pm") && hours !== 12) hours += 12;
    let diff = 1000 * 60 * (hours * 60 + minutes);
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return new Date(0,0,0,hh,mm,ss);
  }

  showStaff(id: any) {
    // this.apiService.showStaff({id: id}).subscribe(data => {
    //   if (data && data['status'] == 1) {
    //     // this.staffs = data['data'];
    //   }
    // });
  }

  getDesignation() {
    this.apiService.getDesignation({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.designations = data['data'];
      }
    });
  }

  getDepartment() {
    this.apiService.getDepartment({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.departments = data['data'];
      }
    });
  }

  getAllAddress() {
    this.apiService.getAllAddress({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.areaDrp = data['data']['area'];
        this.cityDrp = data['data']['city'];
        this.stateDrp = data['data']['state'];
        this.countryDrp = data['data']['country'];
      }
    });
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.cardImageBase64 = e.target.result;
          this.userForm.controls.photo.setValue(e.target.result);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  signChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.signBase64 = e.target.result;
          this.userForm.controls.signature.setValue(e.target.result);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

}
