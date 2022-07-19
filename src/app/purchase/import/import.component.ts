import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  imports : any[] = [];
  suppliers : any[] = [];
  packingDetails : any[] = [];
  sr_no: any = 0;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      sr_no: new FormControl(null, Validators.required),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      item_name: new FormControl(null),
      invoice_no: new FormControl(null),
      invoice_date: new FormControl(null),
      purchase_currency: new FormControl(null),
      total_amount_currency: new FormControl(null),
      delivery_days: new FormControl(null),
      expected_delivery_date: new FormControl(null),
      contact_name: new FormControl(null),
      email_id: new FormControl(null),
      contact_no: new FormControl(null),
      remarks: new FormControl(null),
      no_of_boxes: new FormControl(null),
      total_wt: new FormControl(null),
      packing_remarks: new FormControl(null),
      payment_amount: new FormControl(null),
      payment_exchage_rate: new FormControl(null),
      payment_amount_inr: new FormControl(null),
      payment_instrument_no: new FormControl(null),
      payment_instrument_date: new FormControl(null),
      payment_remarks: new FormControl(null),
      freight_name: new FormControl(null),
      freight_charge: new FormControl(null),
      freight_rate_confirmed_date: new FormControl(null),
      pickup_order_no: new FormControl(null),
      carrier_type: new FormControl(null),
      pickup_date: new FormControl(null),
      tracking_no: new FormControl(null),
      freight_amount_inr: new FormControl(null),
      freight_instrument_no: new FormControl(null),
      freight_instrument_date: new FormControl(null),
      mawn_no: new FormControl(null),
      hawb_no: new FormControl(null),
      freight_m_date: new FormControl(null),
      freight_h_date: new FormControl(null),
      freight_remarks: new FormControl(null),
      place_of_clearance: new FormControl(null),
      custom_house: new FormControl(null),
      custom_duty_amount_inr: new FormControl(null),
      custom_duty_exchange_rate: new FormControl(null),
      penalty_type: new FormControl(null),
      custom_duty_amount: new FormControl(null),
      boe_no: new FormControl(null),
      boe_date: new FormControl(null),
      custom_gst_amount: new FormControl(null),
      custom_instrument_no: new FormControl(null),
      custom_instrument_date: new FormControl(null),
      custom_remarks: new FormControl(null),
      import_invoice_no: new FormControl(null),
      material_date: new FormControl(null),
      material_received_date: new FormControl(null),
      material_freight_amount: new FormControl(null),
      material_instrument_no: new FormControl(null),
      material_instrument_date: new FormControl(null),
      material_remarks: new FormControl(null),
      t_invoice_date: new FormControl(null),
      t_expected_delivery_date: new FormControl(null),
      t_payment_instrument_date: new FormControl(null),
      t_freight_rate_confirmed_date: new FormControl(null),
      t_pickup_date: new FormControl(null),
      t_freight_instrument_date: new FormControl(null),
      t_freight_m_date: new FormControl(null),
      t_freight_h_date: new FormControl(null),
      t_boe_date: new FormControl(null),
      t_custom_instrument_date: new FormControl(null),
      t_material_date: new FormControl(null),
      t_material_received_date: new FormControl(null),
      t_material_instrument_date: new FormControl(null)
    });
    this.getSupplier();
    this.getImport();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $("#invoice_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.invoice_date.setValue(date);
      });
      $("#expected_delivery_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.expected_delivery_date.setValue(date);
      });
      $("#payment_instrument_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.payment_instrument_date.setValue(date);
      });
      $("#freight_rate_confirmed_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.freight_rate_confirmed_date.setValue(date);
      });
      $("#pickup_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.pickup_date.setValue(date);
      });
      $("#freight_instrument_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.freight_instrument_date.setValue(date);
      });
      $("#freight_m_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.freight_m_date.setValue(date);
      });
      $("#freight_h_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.freight_h_date.setValue(date);
      });
      $("#boe_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.boe_date.setValue(date);
      });
      $("#custom_instrument_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.custom_instrument_date.setValue(date);
      });
      $("#material_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.material_date.setValue(date);
      });
      $("#material_received_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.material_received_date.setValue(date);
      });
      $("#material_instrument_date").datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.purchaseForm.controls.material_instrument_date.setValue(date);
      });
      $("#invoice_date").mask('00/00/0000');
      $("#expected_delivery_date").mask('00/00/0000');
      $("#payment_instrument_date").mask('00/00/0000');
      $("#freight_rate_confirmed_date").mask('00/00/0000');
      $("#pickup_date").mask('00/00/0000');
      $("#freight_instrument_date").mask('00/00/0000');
      $("#freight_m_date").mask('00/00/0000');
      $("#freight_h_date").mask('00/00/0000');
      $("#boe_date").mask('00/00/0000');
      $("#custom_instrument_date").mask('00/00/0000');
      $("#material_date").mask('00/00/0000');
      $("#material_received_date").mask('00/00/0000');
      $("#material_instrument_date").mask('00/00/0000');
    }, 1000);
  }

  makeTable() {
    if (this.purchaseForm.value.no_of_boxes) {
      this.packingDetails = [];
      for (var i = 0; i < this.purchaseForm.value.no_of_boxes; i++) {
        this.packingDetails.push({
          box_id: 'Box ' + (i + 1),
          dimensions: null,
          net_wt: null,
          gross_wt: null,
          remarks: null,
        });
      }
    }
  }

  changeDate(field: any, iField: any) {
    if (this.purchaseForm.value[field]) {
      let d = this.makeDate(this.purchaseForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.purchaseForm.controls[iField].setValue(date);
    } else {
      this.purchaseForm.controls[iField].setValue(null);
    }
  }

  makeDate(tarik: string) {
    if (tarik) {
      let t = tarik.split('/');
      if (t.length == 3) {
        return t[1] + '/' + t[0] + '/' + t[2];
      } else {
        return new Date();  
      }
    } else {
      return null;
    }
  }

  getSupplier() {
    this.apiService.getSupplier({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getImport() {
    this.apiService.getImport({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.imports = data['data'];
        if (this.imports.length) {
          this.sr_no = Number(this.imports[this.imports.length - 1].sr_no) + 1;
          this.purchaseForm.controls.sr_no.setValue(this.sr_no);
        } else {
          this.purchaseForm.controls.sr_no.setValue(1);
        }
      }
    });
  }

  showImport() {
    if (this.isNotValid(this.purchaseForm.value.id)) {
      this.purchaseForm.reset();
    } else {
      this.loader.start();
      this.apiService.showImport({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['data']) {
          this.purchaseForm.patchValue(data['data']);
          this.packingDetails = data['data']['details'];
          if (data['data']['invoice_date']) {
            this.purchaseForm.controls.t_invoice_date.setValue(new Date(data['data']['invoice_date']));
            $("#invoice_date").datepicker('setDate', new Date(data['data']['invoice_date']));
          }
          if (data['data']['expected_delivery_date']) {
            this.purchaseForm.controls.t_expected_delivery_date.setValue(new Date(data['data']['expected_delivery_date']));
            $("#expected_delivery_date").datepicker('setDate', new Date(data['data']['expected_delivery_date']));
          }
          if (data['data']['payment_instrument_date']) {
            this.purchaseForm.controls.t_payment_instrument_date.setValue(new Date(data['data']['payment_instrument_date']));
            $("#payment_instrument_date").datepicker('setDate', new Date(data['data']['payment_instrument_date']));
          }
          if (data['data']['freight_rate_confirmed_date']) {
            this.purchaseForm.controls.t_freight_rate_confirmed_date.setValue(new Date(data['data']['freight_rate_confirmed_date']));
            $("#freight_rate_confirmed_date").datepicker('setDate', new Date(data['data']['freight_rate_confirmed_date']));
          }
          if (data['data']['pickup_date']) {
            this.purchaseForm.controls.t_pickup_date.setValue(new Date(data['data']['pickup_date']));
            $("#pickup_date").datepicker('setDate', new Date(data['data']['pickup_date']));
          }
          if (data['data']['freight_instrument_date']) {
            this.purchaseForm.controls.t_freight_instrument_date.setValue(new Date(data['data']['freight_instrument_date']));
            $("#freight_instrument_date").datepicker('setDate', new Date(data['data']['freight_instrument_date']));
          }
          if (data['data']['freight_m_date']) {
            this.purchaseForm.controls.t_freight_m_date.setValue(new Date(data['data']['freight_m_date']));
            $("#freight_m_date").datepicker('setDate', new Date(data['data']['freight_m_date']));
          }
          if (data['data']['freight_h_date']) {
            this.purchaseForm.controls.t_freight_h_date.setValue(new Date(data['data']['freight_h_date']));
            $("#freight_h_date").datepicker('setDate', new Date(data['data']['freight_h_date']));
          }
          if (data['data']['boe_date']) {
            this.purchaseForm.controls.t_boe_date.setValue(new Date(data['data']['boe_date']));
            $("#boe_date").datepicker('setDate', new Date(data['data']['boe_date']));
          }
          if (data['data']['custom_instrument_date']) {
            this.purchaseForm.controls.t_custom_instrument_date.setValue(new Date(data['data']['custom_instrument_date']));
            $("#custom_instrument_date").datepicker('setDate', new Date(data['data']['custom_instrument_date']));
          }
          if (data['data']['material_date']) {
            this.purchaseForm.controls.t_material_date.setValue(new Date(data['data']['material_date']));
            $("#material_date").datepicker('setDate', new Date(data['data']['material_date']));
          }
          if (data['data']['material_received_date']) {
            this.purchaseForm.controls.t_material_received_date.setValue(new Date(data['data']['material_received_date']));
            $("#material_received_date").datepicker('setDate', new Date(data['data']['material_received_date']));
          }
          if (data['data']['material_instrument_date']) {
            this.purchaseForm.controls.t_material_instrument_date.setValue(new Date(data['data']['material_instrument_date']));
            $("#material_instrument_date").datepicker('setDate', new Date(data['data']['material_instrument_date']));
          }

        }
        this.loader.stop();
      });
    }
  }

  resetForm() {
    if (this.createMode) {
      this.purchaseForm.reset();
      this.packingDetails = [];
      this.purchaseForm.controls.sr_no.setValue(this.sr_no);
    } else {
      let pid = this.purchaseForm.value.id;
      this.purchaseForm.reset();
      this.packingDetails = [];
      this.purchaseForm.controls.id.setValue(pid);
      this.showImport();
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.packingDetails = [];
    this.purchaseForm.controls.sr_no.setValue(this.sr_no);
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.packingDetails = [];
    this.purchaseForm.controls.sr_no.setValue(this.sr_no);
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.editMode = true;
    this.createMode = false;
    this.packingDetails = [];
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.packing_details = JSON.parse(JSON.stringify(this.packingDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateImport(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Import data update successfully.');
          this.closeForm();
          this.getImport();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveImport(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Import data saved successfully.');
          this.closeForm();
          this.getImport();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    }
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Import Detail.');
    }
  }

  deleteData() {
    if (this.isNotValid(this.purchaseForm.value.id)) {
      this.toastr.error('ERROR', 'Please Select One Import Detail.');
    } else {
      this.loader.start();
      this.apiService.deleteImport({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Import Detail deleted successfully.'); 
        }
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
