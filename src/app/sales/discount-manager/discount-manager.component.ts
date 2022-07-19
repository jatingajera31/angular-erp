import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-discount-manager',
  templateUrl: './discount-manager.component.html',
  styleUrls: ['./discount-manager.component.css']
})
export class DiscountManagerComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  isHappyOffer = false;
  showDisApprove = false;
  firstTime = false;
  verifyLoginModal = false;
  suppliers : any[] = [];
  clients : any[] = [];
  quotations : any[] = [];
  productDetails : any[] = [];
  productItc : any[] = [];
  attentions : any[] = [];
  staffs : any[] = [];
  approverName: any;
  myPassword: any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      client_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      quotation_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      quotation_date: new FormControl(null),
      discount_approval_no: new FormControl(null, [Validators.required]),
      discount_approval_date: new FormControl(null, [Validators.required]),
      attention_to_id: new FormControl({value: null, disabled: true}),
      email: new FormControl({value: null, disabled: true}),
      contact_code: new FormControl({value: null, disabled: true}),
      contact_number: new FormControl({value: null, disabled: true}),
      sales_executive_id: new FormControl({value: null, disabled: true}),
      executive_contact_code: new FormControl({value: null, disabled: true}),
      executive_contact_number: new FormControl({value: null, disabled: true}),
      executive_email: new FormControl({value: null, disabled: true}),
      qty_rate_total: new FormControl(null),
      discount_total: new FormControl(null),
      itc_qty_rate_total: new FormControl(null),
      itc_sub_total: new FormControl(null),
      itc_gst_total: new FormControl(null),
      itc_total_amount: new FormControl(null),
      sub_total: new FormControl(null),
      gst_total: new FormControl(null),
      total_amount: new FormControl(null),
      native_amount: new FormControl(null),
      re_worked_amount: new FormControl(null),
      closure_amount: new FormControl(null),
      discount_request_amount: new FormControl(null),
      reworked_quotation_amount: new FormControl(null, Validators.required),
      discount_approved: new FormControl(null, Validators.required),
      discount_approved_by: new FormControl(null),
      discount_offered: new FormControl(null, Validators.required),
      discount_amount: new FormControl(null),
      approver_remarks: new FormControl(null, Validators.required),
      reason_for_discount: new FormControl(null)
    });
    this.getStaff();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
  }

  getClients() {
    this.apiService.getClients({'manager': 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getEditClients() {
    this.apiService.editClients({page: 'dm'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.clients = data['data'];
      }
    });
  }

  getDiscountManagerQuotion() {
    if (!this.isNotValid(this.purchaseForm.value.client_id)) {
      this.getAttentions();
      this.apiService.getDiscountManagerQuotion({client_id: this.purchaseForm.value.client_id, edit_mode: this.editMode}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.quotations = data['data'];
        }
      });
    }
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getAttentions() {
    this.apiService.getLookup({lookup_type: 'Attention', parent_id: this.purchaseForm.value.client_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.attentions = data['data'];
      }
    });
  }

  getDMNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.client_id)) {
      this.apiService.getDMNo({client_id: this.purchaseForm.value.client_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.discount_approval_no.setValue(data['data']);
        }
      });
    } else {
      this.purchaseForm.controls.discount_approval_no.setValue(null);
    }
  }

  changeQuotation() {
    if (!this.isNotValid(this.purchaseForm.value.quotation_id)) {
      this.loader.start();
      this.apiService.showQuotation({id: this.purchaseForm.value.quotation_id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.productItc = data['data']['itc'];
          this.productDetails.forEach((item, key) => {
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
            item.description = desc;
          })
          this.productItc.forEach((item, key) => {
            item.itc_rate = item.rate;
            item.itc_hsncode = item.itc_hsncode;
            item.itc_gst_rate = item.gst_percentage;
            let desc = item.prmodel.description +'&#13;&#10;Prod. Code: '+ item.prmodel.product_code +'&#13;&#10;Warranty: '+ item.prmodel.supplier_warranty +' Months&#13;&#10;HSN Code: '+ item.prmodel.hsn_code;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
            item.description = desc;
          });
          this.getDMNo();

          this.staffs.forEach((item) => {
            if (item.id == data['data']['sales_executive_id']) {
              console.log(item.company_phone_code)
              this.purchaseForm.controls.executive_contact_code.setValue(item.company_phone_code);
              this.purchaseForm.controls.executive_contact_number.setValue(item.company_phone_number);
              this.purchaseForm.controls.executive_email.setValue(item.email);
            }
          });
          if (this.isNotValid(data['data']['discount_manager_id'])) {
            this.purchaseForm.controls.id.setValue(null);
          } else {
            this.purchaseForm.controls.id.setValue(data['data']['discount_manager_id']);
            this.showDM()
          }
        }
      });
    }
  }

  showDM() {
    this.loader.start();
    this.apiService.showDM({id: this.purchaseForm.value.id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.purchaseForm.controls.approver_remarks.setValue(data['data']['approver_remarks']);
        this.purchaseForm.controls.discount_amount.setValue(data['data']['discount_amount']);
        this.purchaseForm.controls.discount_approval_date.setValue(data['data']['discount_approval_date']);
        this.purchaseForm.controls.discount_approval_no.setValue(data['data']['discount_approval_no']);
        this.purchaseForm.controls.discount_approved.setValue(true);
        this.purchaseForm.controls.discount_approved_by.setValue(data['data']['discount_approved_by']);
        this.purchaseForm.controls.discount_offered.setValue(data['data']['discount_offered']);
        this.purchaseForm.controls.reworked_quotation_amount.setValue(data['data']['reworked_quotation_amount']);
        this.approverName = data['data']['approver']['first_name'] +' '+ data['data']['approver']['last_name'];
        this.firstTime = true;
      }
      this.loader.stop();
    });
  }

  disApprove() {
    if (!this.purchaseForm.value.discount_approved && this.firstTime) {
      this.showDisApprove = true;
    }
    this.verifyPassword();
  }

  verifyPassword() {
    if (this.purchaseForm.value.discount_approved) {
      this.verifyLoginModal = true;
    }
  }

  savePassword(status: boolean) {
    if (!status) {
      this.verifyLoginModal = false;
      this.purchaseForm.controls.discount_approved.setValue(false);
      return
    } else {
      this.loader.start();
      this.apiService.verifyPassword({password: this.myPassword}).subscribe(data => {
        this.loader.stop();
        if (data.status == 1) {
          this.verifyLoginModal = false;    
        } else {
          this.toastr.error('ERROR', 'Invalid Password.');
        }
        this.myPassword = null;
      });
    }
  }

  saveDisApprove(status: boolean) {
    if (!status) {
      this.purchaseForm.controls.discount_approved.setValue(true);
    } else {
      this.firstTime = false;
    }
    this.showDisApprove = false;
  }

  resetForm() {
    this.approverName = null;
    if (this.purchaseForm.value.quotation_id) {
      this.changeQuotation();
    }
    this.purchaseForm.reset();
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.approverName = null;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.productItc = [];
    this.quotations = [];
    this.attentions = [];
    this.clients = [];
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.getClients();
  }

  setInitDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.discount_approval_date.setValue(date);
  }
  
  viewEditMode() {
    this.createMode = false;
    this.editMode = true;
    this.purchaseForm.reset();
    this.getEditClients();
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    if (params.id && params.id > 0) {

      if (this.isNotValid(this.purchaseForm.value.discount_approved)) {
        this.deleteData();
      } else {
        this.loader.start();
        this.apiService.updateDM(params).subscribe(data => {
          this.loader.stop();
          if (data && data['status'] == 1) {
            this.toastr.success('SUCCESS', 'Quotation Discount Approval Successfully.');
            this.closeForm();
          }
          if (data['status'] == 0) {
            for(var r in data['data']) {
              this.toastr.error('Error', data['data'][r]);    
            }
          }
        });
      }

    } else {
      this.loader.start();
      this.apiService.saveDM(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Quotation Discount Approval Successfully.');
          this.closeForm();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select Quotation.');
    } else {
      this.loader.start();
      this.apiService.deleteDM({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.toastr.success('SUCCESS', 'Quotation Discount Disapprove Successfully.'); 
        }
      });
    }
  }

  managerDiscount() {
    let happyDiscount = 20;
    if (!this.isNotValid(this.purchaseForm.value.discount_offered)) {
      if (this.purchaseForm.value.discount_offered > happyDiscount) {
        this.toastr.error('ERROR', 'You Can not enter more than Manager Discount ('+happyDiscount+'%)');
        return;
      }
      let salesDiscount = this.purchaseForm.value.discount_offered;
      if (this.purchaseForm.value.re_worked_amount) {
        let re_worked_amount = parseFloat(this.purchaseForm.value.re_worked_amount);
        let reworked_quotation_amount = (re_worked_amount * salesDiscount) / 100;
        reworked_quotation_amount = re_worked_amount - reworked_quotation_amount;
        this.purchaseForm.controls.reworked_quotation_amount.setValue(reworked_quotation_amount);
        this.purchaseForm.controls.discount_amount.setValue(salesDiscount);
        if (this.purchaseForm.value.closure_amount < reworked_quotation_amount) {
          let quotation_amount = (re_worked_amount * happyDiscount) / 100;
          quotation_amount = re_worked_amount - quotation_amount;
          if (this.purchaseForm.value.closure_amount < quotation_amount) {
            this.isHappyOffer = true;
            this.toastr.warning('Warning', 'You Need to Apply Full Discount. Click "Happy to Offer" button.');
          } else {
            let perc = (this.purchaseForm.value.closure_amount * 100) / re_worked_amount;
            let rmperc = 100 - perc;
            let fixp = rmperc.toFixed(2);
            this.toastr.warning('Warning', 'You Should Apply '+fixp+'% Discount.');
          }
        }
      }
    }
  }

  happyOffer() {
    let salesDiscount = 20;
    this.purchaseForm.controls.discount_offered.setValue(salesDiscount);
    if (this.purchaseForm.value.re_worked_amount) {
      let re_worked_amount = parseFloat(this.purchaseForm.value.re_worked_amount);
      let reworked_quotation_amount = (re_worked_amount * salesDiscount) / 100;
      reworked_quotation_amount = re_worked_amount - reworked_quotation_amount;
      this.purchaseForm.controls.reworked_quotation_amount.setValue(reworked_quotation_amount);
      this.purchaseForm.controls.discount_amount.setValue(salesDiscount);
    }
    this.purchaseForm.controls.approver_remarks.setValue('Offered Highest Discount, I CAN !');
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

  toFixed(value: any) {
    if (value) {
      value = parseFloat(value);
      return value.toFixed(2);
    } else {
      return value;
    }
  }

}
