import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-call-registration',
  templateUrl: './call-registration.component.html',
  styleUrls: ['./call-registration.component.css']
})
export class CallRegistrationComponent implements OnInit {

  purchaseForm: FormGroup;
  editMode = false;
  createMode = false;
  timeMode = '';
  currentTime: any;
  currentDate = new Date();
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null)
    });
  }

  ngOnInit(): void {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
      this.timeMode = 'good morning';
    } else if (curHr < 18) {
      this.timeMode = 'good afternoon';
    } else {
      this.timeMode = 'good evening';
    }

    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    },);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
  }

  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
  }

  resetForm() {}
  closeForm() {}
  saveInfo() {}

}
