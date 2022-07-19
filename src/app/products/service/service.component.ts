import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  cardImageBase64 = './assets/images/product.jpg';
  serviceForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  showServiceGroupModal = false;
  showServiceCodeModal = false;
  showUnitModal = false;
  invalidForm = false;
  servicesLists : any[] = [];
  unitLists : any[] = [];
  serviceGroupLists : any[] = [];
  serviceCodeLists : any[] = [];
  serviceGroupName: any;
  serviceCodeName: any;
  untiName: any;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.serviceForm = this.fb.group({
      id: new FormControl(null),
      group_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      service_code: new FormControl(null, Validators.required),
      description: new FormControl(null),
      hsn_code: new FormControl(null),
      unit_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      gst_rate: new FormControl(null),
      remarks: new FormControl(null),
      photo: new FormControl(null),
    });
    this.getService();
    this.getUnit();
    this.getServiceGroup();
  }

  ngOnInit(): void {
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.serviceForm.reset();
    this.cardImageBase64 = './assets/images/product.jpg';
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.serviceForm.reset();
    this.serviceForm.controls['service_code'].setValidators([Validators.required]);
    this.serviceForm.controls['service_code'].updateValueAndValidity();
    this.serviceForm.controls['id'].clearValidators();
    this.serviceForm.controls['service_code'].updateValueAndValidity();
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.serviceForm.reset();
    this.serviceForm.controls['id'].setValidators([Validators.required, Validators.pattern("^[0-9]*$")]);
    this.serviceForm.controls['id'].updateValueAndValidity();
    this.serviceForm.controls['service_code'].clearValidators();
    this.serviceForm.controls['service_code'].updateValueAndValidity();
  }

  deleteService() {
    if (this.serviceForm.value.id && this.serviceForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Service.');
    }
  }

  deleteData() {
    if (!this.serviceForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Service Info.');
    } else {
      this.loader.start();
      this.apiService.deleteService({id: this.serviceForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Service deleted successfully.'); 
        }
      });
    }
  }

  getService() {
    this.apiService.getService({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.servicesLists = data['data'];
      }
    });
  }

  getUnit() {
    this.apiService.getUnit({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.unitLists = data['data'];
      }
    });
  }

  getServiceGroup() {
    this.apiService.getServiceGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.serviceGroupLists = data['data'];
      }
    });
  }

  getServiceGroupCode() {
    this.serviceForm.controls.id.setValue(null);
    if (this.serviceForm.value.group_id && this.editMode) {
      this.apiService.getServiceGroupCode({group_id: this.serviceForm.value.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.serviceCodeLists = data['data'];
        }
      });
    }
  }

  viewServiceGroupModal() {
    if (this.serviceForm.value.group_id && this.serviceForm.value.group_id != 'null') {
      for(let i in this.serviceGroupLists) {
        if (this.serviceGroupLists[i].id == this.serviceForm.value.group_id) {
          this.serviceGroupName = this.serviceGroupLists[i].name;
          this.showServiceGroupModal = true;
        }
      }
    } else {
      this.serviceGroupName = '';
      this.showServiceGroupModal = true;
    }
  }

  viewServiceCodeModal() {
    if (this.serviceForm.value.id) {
      for(let i in this.serviceCodeLists) {
        if (this.serviceCodeLists[i].id == this.serviceForm.value.id) {
          this.serviceCodeName = this.serviceCodeLists[i].service_code;
          this.showServiceCodeModal = true;
        }
      }
    }
  }

  viewUnitModal() {
    if (this.serviceForm.value.unit_id && this.serviceForm.value.unit_id != null) {
      for(let i in this.unitLists) {
        if (this.unitLists[i].id == this.serviceForm.value.unit_id) {
          this.untiName = this.unitLists[i].name;
          this.showUnitModal = true;
        }
      }
    } else {
      this.untiName = '';
      this.showUnitModal = true;
    }
  }

  setEditFormData() {
    if (this.serviceForm.value.id) {
      for(let i in this.serviceCodeLists) {
        if (this.serviceCodeLists[i].id == this.serviceForm.value.id) {
          this.serviceForm.controls.service_code.setValue(this.serviceCodeLists[i].service_code);
          this.serviceForm.controls.description.setValue(this.serviceCodeLists[i].description);
          this.serviceForm.controls.hsn_code.setValue(this.serviceCodeLists[i].hsn_code);
          this.serviceForm.controls.unit_id.setValue(this.serviceCodeLists[i].unit_id);
          this.serviceForm.controls.gst_rate.setValue(this.serviceCodeLists[i].gst_rate);
          this.serviceForm.controls.remarks.setValue(this.serviceCodeLists[i].remarks);
          if (this.serviceCodeLists[i].photo) {
            this.cardImageBase64 = this.serviceCodeLists[i].photo;
          }
        }
      }
    }
  }

  saveService() {
    this.invalidForm = false;
    if (this.serviceForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.serviceForm.value.id) {
      this.loader.start();
      this.apiService.updateService(this.serviceForm.value).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm();
          this.toastr.success('SUCCESS', 'Service details updated successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      if (this.createMode) {
        this.loader.start();
        this.apiService.saveService(this.serviceForm.value).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.closeForm();
            this.toastr.success('SUCCESS', 'Service details saved successfully.');
          }
          if (data['status'] == 0) {
            for(var r in data['data']) {
              this.toastr.error('Error', data['data'][r]);    
            }
          }
        });
      } else {
        this.toastr.error('ERROR', 'Please Select Service.');  
      }
    }
  }

  saveServiceGroup() {
    if (!this.serviceGroupName) {
      this.toastr.error('ERROR', 'Please enter service group.');
      return;
    }
    if (this.serviceForm.value.group_id) {
      this.loader.start();
      this.apiService.updateServiceGroup({id:this.serviceForm.value.group_id, name: this.serviceGroupName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.serviceGroupLists) {
            if (this.serviceGroupLists[i].id == this.serviceForm.value.group_id) {
              this.serviceGroupLists[i].name = data['data'].name;
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
      this.apiService.saveServiceGroup({name: this.serviceGroupName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.serviceGroupLists.push(data['data']);
          this.serviceForm.controls.group_id.setValue(data['data'].id);
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

  saveUnit() {
    if (!this.untiName) {
      this.toastr.error('ERROR', 'Please enter unit.');
      return;
    }
    if (this.serviceForm.value.unit_id) {
      this.loader.start();
      this.apiService.updateUnit({id: this.serviceForm.value.unit_id, name: this.untiName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          for(let i in this.unitLists) {
            if (this.unitLists[i].id == this.serviceForm.value.unit_id) {
              this.unitLists[i].name = data['data'].name;
            }
          }
          this.showUnitModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveUnit({name: this.untiName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.unitLists.push(data['data']);
          this.serviceForm.controls.unit_id.setValue(data['data'].id);
          this.showUnitModal = false;
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  saveServiceGroupCode() {
    if (!this.serviceCodeName || !this.serviceForm.value.id) {
      this.toastr.error('ERROR', 'Please enter service code.');
      return;
    }
    this.loader.start();
    this.apiService.saveServiceGroupCode({id: this.serviceForm.value.id,  service_code: this.serviceCodeName}).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.serviceForm.controls.service_code.setValue(data['data'].service_code);
        for(let i in this.serviceCodeLists) {
          if (this.serviceCodeLists[i].id == this.serviceForm.value.id) {
            this.serviceCodeLists[i].service_code = data['data'].service_code;
          }
        }
        this.showServiceCodeModal = false;
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
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
          this.serviceForm.controls.photo.setValue(e.target.result);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  undoForm() {
    this.invalidForm = false;
    this.serviceForm.reset();
  }

  isValid(value: any) {
    return (!value || value == 'null' || value == 'undefined' || value == '');
  }

  setTwoDigit(event:any, value:any) {
    event.target.value = value.toFixed(2);
  }

}
