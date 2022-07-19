import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  accountForm: FormGroup;
  invalidForm = false;
  constructor(private fb: FormBuilder, private toastr: ToastService, private apiService: ApiService, private loader: LoaderService) {
    this.accountForm = this.fb.group({
      old_password: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      password_confirmation: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
  }

  savePassword() {
    this.invalidForm = false;
    if (this.accountForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.accountForm.value.password !== this.accountForm.value.password_confirmation) {
      this.toastr.error('ERROR', 'New Password does not match.');
      this.accountForm.reset();
      return;
    }

    this.loader.start();
    this.apiService.updatePassword(this.accountForm.value).subscribe(data => {
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'Password Updated Successfully.'); 
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
      this.accountForm.reset();
      this.loader.stop();
    });
  }

}
