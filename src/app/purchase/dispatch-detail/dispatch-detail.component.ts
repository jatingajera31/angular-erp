import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-dispatch-detail',
  templateUrl: './dispatch-detail.component.html',
  styleUrls: ['./dispatch-detail.component.css']
})
export class DispatchDetailComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showDeliveredModal = false;
  showEditModal = false;
  showRemoveModal = false;
  suppliers : any[] = [];
  purchaseOrders : any[] = [];
  purchaseDispatch : any[] = [];
  productGroups : any[] = [];
  serviceGroups : any[] = [];
  productDetails : any[] = [];
  transportList : any[] = [];
  qty_rate_total: any = 0;
  discount_total: any = 0;
  sub_total: any = 0;
  gst_total: any = 0;
  total_amount: any = 0;
  TransportName: any;
  purchaseId: any;
  supplierId: any;
  selectedProductIndex: any;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      dispatch_no: new FormControl(null, Validators.required),
      pi_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_order_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      dispatched_on_date: new FormControl(null, Validators.required),
      total_amount: new FormControl(null),
      purchase_country: new FormControl(null),
      invoice_no: new FormControl(null),
      invoice_date: new FormControl(null),
      expected_date: new FormControl(null),
      // goods_dispatched: new FormControl('All', Validators.required),
      partial_amount: new FormControl(null),
      e_way_bill_no: new FormControl(null),
      e_way_date: new FormControl(null),
      e_way_time: new FormControl(null),
      valid_from: new FormControl(null),
      valid_until: new FormControl(null),
      place_of_dispatch: new FormControl(null),
      transporter_id: new FormControl(null,[Validators.pattern("^[0-9]*$")]),
      pick_up_date: new FormControl(null),
      vehicle_no: new FormControl(null),
      docket_date: new FormControl(null),
      no_of_cartons: new FormControl(null),
      track_consignment: new FormControl(null),
      t_invoice_date: new FormControl(null),
      t_dispatched_on_date: new FormControl(null),
      t_expected_date: new FormControl(null),
      t_e_way_date: new FormControl(null),
      t_valid_from: new FormControl(null),
      t_valid_until: new FormControl(null),
      t_pick_up_date: new FormControl(null),
      t_docket_date: new FormControl(null),
    }); 
    this.getProductGroup();
    this.getServiceGroup();
    this.getTransport();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#invoice_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.invoice_date.setValue(date);
      });

      $( "#dispatched_on_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.dispatched_on_date.setValue(date);
      });

      $( "#expected_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.expected_date.setValue(date);
      });

      $( "#e_way_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.e_way_date.setValue(date);
      });

      $( "#valid_from" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.valid_from.setValue(date);
      });

      $( "#valid_until" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.valid_until.setValue(date);
      });

      $( "#pick_up_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.pick_up_date.setValue(date);
      });

      $( "#docket_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.docket_date.setValue(date);
      });

      $('#e_way_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.e_way_time.setValue(time.toLocaleTimeString());
        }
      });

      $("#invoice_date").mask('00/00/0000');
      $("#dispatched_on_date").mask('00/00/0000');
      $("#expected_date").mask('00/00/0000');
      $("#e_way_date").mask('00/00/0000');
      $("#valid_from").mask('00/00/0000');
      $("#valid_until").mask('00/00/0000');
      $("#pick_up_date").mask('00/00/0000');
      $("#docket_date").mask('00/00/0000');

    }, 1000);
  }

  changeDate(field: any, iField: any) {
    if (this.purchaseForm.value[field]) {
      let d = this.makeDate(this.purchaseForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.purchaseForm.controls[iField].setValue(date);
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

  getTransport() {
    this.apiService.getTransport({}).subscribe(data => {
        this.transportList = data['data'];
    });
  }

  getSupplier() {
    this.apiService.getSupplier({dispatch: 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getPurchaseDispatchNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.supplier_id)) {
      this.apiService.getPurchaseDispatchNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.dispatch_no.setValue(data['data']);
          this.purchaseForm.controls.place_of_dispatch.setValue(data['place']);
        }
      });
    } else {
      this.purchaseForm.controls.dispatch_no.setValue(null);
      this.purchaseForm.controls.place_of_dispatch.setValue(null);
    }
  }

  getPurchaseDispatch() {
    if (this.supplierId) {
      this.loader.start();
      this.apiService.getPurchaseDispatch({supplier_id: this.supplierId, mode: true}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseDispatch = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'pdis'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.purchaseForm.reset();
    this.productDetails = [];
    this.purchaseOrders = [];
    // this.purchaseForm.controls.goods_dispatched.setValue('All');
  }

  resetForm() {
    this.productDetails = [];
    if (this.createMode) {
      this.purchaseForm.reset();
      this.purchaseOrders = [];
      // this.purchaseForm.controls.goods_dispatched.setValue('All');
    } else {
      this.showPDData();
    }
  }

  viewCreateMode() {
    if (this.createMode) {
      return
    }
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    // this.purchaseForm.controls.goods_dispatched.setValue('All');
    this.getSupplier();
  }
  
  viewEditMode() {
    if (this.editMode) {
      return
    }
    this.createMode = false;
    // this.editMode = true;
    this.showEditModal = true;
    this.purchaseForm.reset();
    // this.purchaseForm.controls.goods_dispatched.setValue('All');
    this.purchaseId = null;
    this.supplierId = null;
    this.getEditSuppliers();
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getModels(group_id: any, index: any, product_id: any) {
    if (group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.productDetails[index].products = data['data'];
          this.changeModel(product_id, index)
        }
        this.loader.stop();
      });
    }
  }

  getServiceGroup() {
    this.apiService.getServiceGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.serviceGroups = data['data'];
      }
    });
  }

  changeModel(product_id: any, index: any) {
    if (product_id) {
      for(var r in this.productDetails[index].products) {
        if (this.productDetails[index].products[r].id == product_id) {
          this.productDetails[index].description = this.productDetails[index].products[r].description;
        }
      }
    }
  }

  getPurchaseOrder() {
    if (this.purchaseForm.value.supplier_id) {
      this.loader.start();
      this.apiService.getPurchaseInfo({supplier_id: this.purchaseForm.value.supplier_id, mode: false, dispatch : 1}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseOrders = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getName() {
    let row = this.suppliers.filter((item) => { return (item.id == this.purchaseForm.value.supplier_id); });
    if (row.length) {
      return row[0].name;
    } else {
      return "";
    }
  }

  showPOData() {
    if (this.purchaseForm.value.pi_id) {
      this.loader.start();
      this.apiService.showPurchaseInfo({id: this.purchaseForm.value.pi_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.qty_rate_total = data['data']['qty_rate_total'];
          this.discount_total = data['data']['discount_total'];
          this.sub_total = data['data']['sub_total'];
          this.gst_total = data['data']['gst_total'];
          this.total_amount = data['data']['total_amount'];
          this.productDetails = data['data']['details'];
          // this.purchaseForm.controls.purchase_country.setValue(data['data']['purchase_country']);
          this.purchaseForm.controls.total_amount.setValue(data['data']['total_amount']);
          this.purchaseForm.controls.purchase_order_id.setValue(data['data']['purchase_order_id']);
          this.productDetails.forEach((item, key) => {
            if (item.type == 'Product') {
              let sw = 'Not Applicable';
              let hsn = '';
              let product_code = '';
              if (!this.isNotValid(item.prmodel.supplier_warranty)) {
                sw = item.prmodel.supplier_warranty + ' Months';
              }
              if (item.prmodel.hsn_code) {
                hsn = item.prmodel.hsn_code;
              }
              if (item.prmodel.product_code) {
                product_code = item.prmodel.product_code;
              }
              let desc = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
              let tdesc = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
              item.description = desc;
              item.tdescription = tdesc;
            } else {
              item.group_name = item.group.name;
              item.product_name = item.prmodel.service_code;
              item.description = item.prmodel.description;
              item.tdescription = item.prmodel.description;
            }
          });
          setTimeout(() => {
            $('.dispatch-detail td[data-toggle="tooltip"]').tooltip({html: true})
          }, 1500);
        }
        this.loader.stop();
      });

      // if (this.editMode) {
      //   this.showPDData();
      // }
    }
  }

  showPDData() {
    if (this.purchaseForm.value.id) {
      this.loader.start();
      this.apiService.showPurchaseDispatch({id: this.purchaseForm.value.id}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (data['data']) {
            this.purchaseForm.patchValue(data['data']);
            this.purchaseOrders = [{
              id: data['data']['pi_id'],
              purchase_info_no: data['data']['pos']['purchase_info_no'],
              pi_date: data['data']['pos']['pi_date'],
              final_amount: data['data']['pos']['final_amount'],
            }];
            this.purchaseForm.controls.purchase_country.setValue(data['purchase_order']['purchase_country']);
            if (data['data']['invoice_date']) {
              $("#invoice_date").datepicker("setDate", new Date(data['data']['invoice_date']));
            }
            if (data['data']['dispatched_on_date']) {
              $("#dispatched_on_date").datepicker("setDate", new Date(data['data']['dispatched_on_date']));
            }
            if (data['data']['expected_date']) {
              $("#expected_date").datepicker("setDate", new Date(data['data']['expected_date']));
            }
            if (data['data']['e_way_date']) {
              $("#e_way_date").datepicker("setDate", new Date(data['data']['e_way_date']));
            }
            if (data['data']['valid_from']) {
              $("#valid_from").datepicker("setDate", new Date(data['data']['valid_from']));
            }
            if (data['data']['valid_until']) {
              $("#valid_until").datepicker("setDate", new Date(data['data']['valid_until']));
            }
            if (data['data']['pick_up_date']) {
              $("#pick_up_date").datepicker("setDate", new Date(data['data']['pick_up_date']));
            }
            if (data['data']['docket_date']) {
              $("#docket_date").datepicker("setDate", new Date(data['data']['docket_date']));
            }
            this.productDetails = data['data']['details'];
            this.productDetails.forEach((item, key) => {
              if (item.type == 'Product') {
                let sw = 'Not Applicable';
                let hsn = '';
                let product_code = '';
                if (!this.isNotValid(item.prmodel.supplier_warranty)) {
                  sw = item.prmodel.supplier_warranty + ' Months';
                }
                if (item.prmodel.hsn_code) {
                  hsn = item.prmodel.hsn_code;
                }
                if (item.prmodel.product_code) {
                  product_code = item.prmodel.product_code;
                }
                let desc = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
                let tdesc = item.prmodel.description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;
                item.group_name = item.group.name;
                item.product_name = item.prmodel.model_no;
                item.description = desc;
                item.tdescription = tdesc;
              } else {
                item.group_name = item.group.name;
                item.product_name = item.prmodel.service_code;
                item.description = item.prmodel.description;
                item.tdescription = item.prmodel.description;
              }
            });
            setTimeout(() => {
              $('.dispatch-detail td[data-toggle="tooltip"]').tooltip({html: true})
            }, 1500);
            this.calculate();
          } else {
            this.purchaseForm.controls.dispatched_on_date.setValue(null);
            this.purchaseForm.controls.invoice_no.setValue(null);
            this.purchaseForm.controls.invoice_date.setValue(null);
            this.purchaseForm.controls.expected_date.setValue(null);
            // this.purchaseForm.controls.goods_dispatched.setValue('All');
            this.purchaseForm.controls.e_way_bill_no.setValue(null);
            this.purchaseForm.controls.e_way_date.setValue(null);
            this.purchaseForm.controls.e_way_time.setValue(null);
            this.purchaseForm.controls.valid_from.setValue(null);
            this.purchaseForm.controls.valid_until.setValue(null);
            this.purchaseForm.controls.place_of_dispatch.setValue(null);
            this.purchaseForm.controls.transporter_id.setValue(null);
            this.purchaseForm.controls.pick_up_date.setValue(null);
            this.purchaseForm.controls.vehicle_no.setValue(null);
            this.purchaseForm.controls.docket_date.setValue(null);
            this.purchaseForm.controls.track_consignment.setValue(null);
            this.purchaseForm.controls.no_of_cartons.setValue(null);
          }
        }
        this.showEditModal = false;
        this.editMode = true;
        this.loader.stop();
      });
    }
  }

  showData() {
    if (this.supplierId && this.purchaseId) {
      this.purchaseForm.controls.id.setValue(this.purchaseId);
      this.showPDData();
    }
  }

  saveDelivered() {
    if (this.TransportName) {
      this.loader.start();
      this.apiService.saveTransport({name:this.TransportName}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.transportList.push(data['data']);
          this.purchaseForm.controls.transporter_id.setValue(data['data'].id);
        }
        this.showDeliveredModal = false;
      });
    }
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
    this.calculate();
  }

  calculate() {
    let qty_rate_total = 0;
    let discount_total = 0;
    let sub_total = 0;
    let gst_total = 0;
    let total_amount = 0;
    let item_amount = 0;
    this.productDetails.forEach((item, key) => {
      if (this.purchaseForm.value.purchase_country == 'Overseas') {
        item.gst_percentage = 0;
      }
      if (!item.is_paired) {
        item.discount_amount = 0;
        item.gst_amount = 0;
        item.sub_total = 0;
        if (item.qty && item.rate) {
          let itemRate = item.rate;
          let itemQty = Number(item.qty);
          item.sub_total = (itemQty * itemRate);
          qty_rate_total += (itemQty * itemRate);
        }
        if (item.discount_percentage) {
          item.discount_amount = (item.sub_total * item.discount_percentage) / 100;
          discount_total += item.discount_amount;
        }
        item.sub_total = (item.sub_total - item.discount_amount);
        sub_total += item.sub_total;
        if (item.gst_percentage && this.purchaseForm.value.purchase_country == 'India') {
          item.gst_amount = (item.sub_total * item.gst_percentage) / 100;
          gst_total += item.gst_amount;
        }
        item.total_amount = (item.sub_total + item.gst_amount);
        total_amount += item.total_amount;
      }
    });

    this.qty_rate_total = qty_rate_total;
    this.discount_total = discount_total;
    this.sub_total = sub_total;
    this.gst_total = gst_total;
    this.total_amount = total_amount;
    this.purchaseForm.controls.total_amount.setValue(total_amount);
  }

  saveInfo() {
    this.invalidForm = false;
    let msg = "Please enter valid details.";
    if (this.purchaseForm.invalid) {
      let msgs: any = {
        supplier_id: 'Supplier',
        purchase_order_id: 'P.O.No',
        dispatch_no: 'Distach No',
        dispatched_on_date: 'Dispatched On',
        goods_dispatched: 'Goods Dispatched',
      };
      for(var r in this.purchaseForm.controls) {
        if (this.purchaseForm.controls[r].invalid) {
          msg = 'Please enter valid ' + msgs[r] + ' data';
          break;
        }
      }
      this.invalidForm = true;
      this.toastr.error('ERROR', msg);
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.product_details = this.productDetails;
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updatePurchaseDispatch(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase distach update successfully.');
          this.closeForm();
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.savePurchaseDispatch(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase distach saved successfully.');
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

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Purchase Distach.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Distach.');
    } else {
      this.loader.start();
      this.apiService.deletePurchaseDispatch({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase Distach deleted successfully.'); 
        }
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
