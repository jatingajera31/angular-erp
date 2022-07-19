import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-item-installed-approval',
  templateUrl: './item-installed-approval.component.html',
  styleUrls: ['./item-installed-approval.component.css']
})
export class ItemInstalledApprovalComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  suppliers : any[] = [];
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      claim_type: new FormControl(null),
      claim_day: new FormControl(null),
      remarks: new FormControl(null),
      return_date: new FormControl(null),
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#return_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.return_date.setValue(date);
      });
    }, 1000);
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
  }

  saveInfo() {

  }

  showData() {
    this.editMode = true;
    this.createMode = false;
    this.purchaseForm.controls.purchase_id.setValue(1);
    this.showEditModal = false;
  }

  deleteOrder() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Purchase Order.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Order.');
    } else {
      this.loader.start();
      this.apiService.deleteService({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase Order deleted successfully.'); 
        }
      });
    }
  }

}