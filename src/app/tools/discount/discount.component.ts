import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit {

  invalidForm = false;
  rateForm: FormGroup;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.rateForm = this.fb.group({
      standard_discount: new FormControl(0),
      executive_discount: new FormControl(0, Validators.required),
      manager_discount: new FormControl(0, Validators.required),
      project_discount: new FormControl(0, Validators.required),
      special_dicount: new FormControl(false),
    });

    this.getDiscount();
  }

  ngOnInit(): void {
  }

  getDiscount() {
    this.loader.start();
    this.apiService.getDiscount({}).subscribe(data => {
      if (data && data['status'] == 1 && data['data']) {
        this.rateForm.patchValue(data['data']);
      }
      this.loader.stop();
    });
  }

  resetForm() {
    this.rateForm.reset();
    this.rateForm.controls.standard_discount.setValue(0);
    this.rateForm.controls.executive_discount.setValue(0);
    this.rateForm.controls.manager_discount.setValue(0);
    this.rateForm.controls.project_discount.setValue(0);
    this.rateForm.controls.special_dicount.setValue(false);
  }

  saveRate() {
    this.invalidForm = false;
    if (this.rateForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid discount.');
      return;
    }

    this.loader.start();
    this.apiService.saveDiscount(this.rateForm.value).subscribe(data => {
      this.loader.stop();
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'Discount Type Master Data Submit Successfully.');
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
    });
  }

}
