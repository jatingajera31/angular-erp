import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-purchase-return',
  templateUrl: './purchase-return.component.html',
  styleUrls: ['./purchase-return.component.css']
})
export class PurchaseReturnComponent implements OnInit {

  purchaseForm: FormGroup;
  prodForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showAddItemModal = false;
  showEditModal = false;
  showRemoveModal = false;
  invalidSerialNumber = false;
  invalidMacAddress = false;
  showProductDetailModal = false;
  productEditMode = false;
  isFocus = false;
  skipSr = false;
  skipMac = false;
  isZero = false;
  nonDeleted = false;
  productGroups : any[] = [];
  suppliers : any[] = [];
  purchases : any[] = [];
  products : any[] = [];
  purchaseDetails : any[] = [];
  supplierId: any = null;
  purchaseId: any = null;
  purchaseNo: any = null;
  selectedModal:any;
  selectedProductIndex:any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_return_no: new FormControl(null),
      return_date: new FormControl(null),
      return_time: new FormControl(null),
      remarks: new FormControl(null),
      basic_amount: new FormControl(null),
      gst_amount: new FormControl(null),
      final_amount: new FormControl(null),
    });

    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      description: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      purchase_rate: new FormControl(null),
      gst_rate: new FormControl(null),
      gst_amount: new FormControl(null),
      serial_no: new FormControl(null),
      match_serial_no: new FormControl({value: null, disabled: true}),
      mac_address: new FormControl(null),
      match_mac_address: new FormControl({value: null, disabled: true}),
      invoice_no: new FormControl(null),
      return_date: new FormControl(null),
      inv_return_date: new FormControl(null),
      reason: new FormControl(null, Validators.required)
    });

    this.getProductGroup();
  }

  @HostListener('click', ['$event'])
  mouseClick(evt: any) {
    const flyoutElement = document.getElementsByClassName('adminActions');
      let targetElement = evt.target;
      do {
          if (targetElement.classList && targetElement.classList.contains('adminActions')) {
            this.isFocus = true;
            return;
          }
          targetElement = targetElement['parentNode'];
      } while (targetElement);

      this.isFocus = false;
      this.setFalseData(-1);
  }

  setFalseData(k: number) {
    this.purchaseDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
  }

  changeDate(field: any, iField: any) {
    if (this.prodForm.value[field]) {
      let d = this.makeDate(this.prodForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.prodForm.controls[iField].setValue(date);
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

  getPurchaseReturnNo() {
    if (!this.editMode) {
      this.apiService.getPurchaseReturnNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseNo = data['data']
          this.purchaseForm.controls.purchase_return_no.setValue(this.purchaseNo);
        } else {
          this.purchaseNo = null;
          this.purchaseForm.controls.purchase_return_no.setValue(this.purchaseNo);
        }
      });
    }
  }

  changeMatchSr() {
    if (this.prodForm.value.serial_no != this.prodForm.value.match_serial_no) {
      this.toastr.warning('Serial No. matching Alert !', 'Model No.: '+this.prodForm.value.product_name+' <br>This Serial No. did not matched with '+this.prodForm.value.serial_no+' !');
    }
  }

  changeMatchMac() {
    if (this.prodForm.value.mac_address != this.prodForm.value.match_mac_address) {
      this.toastr.warning('MAC Address matching Alert !', 'Model No.: '+this.prodForm.value.product_name+' <br>This MAC Address did not matched with ' + this.prodForm.value.mac_address + ' !');
    }
  }

  checkPurchaseQty() {
    this.apiService.checkPurchaseQty({qty: this.prodForm.value.qty, product_id: this.prodForm.value.product_id, supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
      if (data['status'] == 1) {
        if (this.prodForm.value.qty > data['data']) {
          let spName = this.suppliers.filter((row) => { return (row.id == this.purchaseForm.value.supplier_id) });
          if (spName.length) {
            this.prodForm.controls.qty.setValue(0);
            this.toastr.error('Gentleman !', 'Purchase Return qnty is more than the qnty you Purchased from '+spName[0].name+', please check qnty.')    
          }
        }
      }
    });
  }

  getInvDate() {
    this.apiService.getInvoiceDetail({invoice_no: this.prodForm.value.invoice_no, supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
      if (data['data']) {
        setTimeout(() => {
          if (data['data'].invoice_date) {
            this.prodForm.controls.return_date.setValue(data['data'].invoice_date);
            $("#inv_return_date").datepicker('setDate', new Date(data['data'].invoice_date))
          }
        }, 200)
      }
    });
  }

  getQrCode() {

    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.isZero = false;
      this.prodForm.controls.match_mac_address.enable();
      this.prodForm.controls.match_serial_no.enable();
      this.loader.start();
      this.apiService.getQrCode({qr_code: this.prodForm.value.qr_code}).subscribe(data => {
        if (data['status'] == 1 && data['data'] && data['data']['item']) {

          let gst_amount = null;
          if (data['data']['item']['prmodel']['gst_rate']) {
            gst_amount = (parseFloat(data['data']['item']['prmodel']['purchase_rate']) * parseFloat(data['data']['item']['prmodel']['gst_rate'])) / 100;
            // gst_amount = gst_amount.toFixed(2);
          }

          let iObj = {
            qr_code: data['data']['qr_code'],
            group_id: data['data']['item']['group_id'],
            group_name: data['data']['item']['group']['name'],
            product_id: data['data']['item']['product_id'],
            product_name: data['data']['item']['prmodel']['model_no'],
            description: data['data']['item']['prmodel']['category_name'],
            qty: 1,
            purchase_rate: parseFloat(data['data']['item']['prmodel']['purchase_rate']).toFixed(2),
            gst_rate: data['data']['item']['prmodel']['gst_rate'],
            gst_amount: gst_amount,
            serial_no: data['data']['serial_no'],
            match_serial_no: null,
            mac_address: data['data']['mac_address'],
            match_mac_address: null,
            invoice_no: (data['data']['purchase']) ? data['data']['purchase']['invoice_no']: null,
            return_date: (data['data']['purchase']) ? data['data']['purchase']['invoice_date']: null,
            // inv_return_date: (data['data']['purchase']) ? data['data']['purchase']['invoice_date']: null,
            reason: null
          }
          this.prodForm.patchValue(iObj);
          setTimeout(() => {
            if (iObj.return_date) {
              $("#inv_return_date").datepicker('setDate', new Date(iObj.return_date))
            }
          }, 800)
          if (data['data']['serial_no']) {
            this.prodForm.controls.match_serial_no.enable();
          } else {
            this.prodForm.controls.match_serial_no.disable();
          }
          if (data['data']['mac_address']) {
            this.prodForm.controls.match_mac_address.enable();
          } else {
            this.prodForm.controls.match_mac_address.disable();
          }
        } else {
          this.prodForm.reset();
          if (data['data']) {
            this.toastr.error('Sorry Gentleman !', data['data']);
          } else {
            this.toastr.error('Sorry Gentleman !', 'QR Code does not match please check or enter correct info.');
          }
          this.prodForm.controls.match_mac_address.disable();
          this.prodForm.controls.match_serial_no.disable();
        }
        this.loader.stop();
      });
    }
    if (this.prodForm.value.qr_code == '0') {
      this.isZero = true;
      this.prodForm.reset();
      this.prodForm.controls.match_mac_address.disable();
      this.prodForm.controls.match_serial_no.disable();
      this.prodForm.controls.qr_code.setValue(0);
    }
  }

  getProductGroup() {
    this.apiService.getProductGroup({coded_item: 'Non-Coded'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getModels() {
    if (this.prodForm.value.group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: this.prodForm.value.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  changeModel() {
    if (this.prodForm.value.product_id) {
      for(var r in this.products) {
        if (this.products[r].id == this.prodForm.value.product_id) {
          let gst_amount = null;
          if (this.products[r]['gst_rate']) {
            gst_amount = (parseFloat(this.products[r]['purchase_rate']) * parseFloat(this.products[r]['gst_rate'])) / 100;
          }
          this.prodForm.controls.gst_amount.setValue(gst_amount);
          this.prodForm.controls.gst_rate.setValue(this.products[r].gst_rate);
          this.prodForm.controls.purchase_rate.setValue(this.products[r].purchase_rate);
          this.prodForm.controls.product_name.setValue(this.products[r].model_no);
          this.prodForm.controls.description.setValue(this.products[r].category_name);
          if (this.products[r].qr_code) {
            this.prodForm.controls.serial_no.setValue(this.products[r].serial_no);
            this.prodForm.controls.mac_address.setValue(this.products[r].mac_address);
          }
        }
      }
    }
  }

  changeRate() {
    let gst_amount = null;
    if (this.prodForm.value.gst_rate) {
      gst_amount = (parseFloat(this.prodForm.value.purchase_rate) * parseFloat(this.prodForm.value.gst_rate)) / 100;
    }
    this.prodForm.controls.gst_amount.setValue(gst_amount);
  }

  getSupplier() {
    this.apiService.getSupplier({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'pretn'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getPurchaseReturn() {
    if (this.supplierId) {
      this.loader.start();
      this.apiService.getPurchaseReturn({supplier_id: this.supplierId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchases = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  resetForm() {
    this.purchaseDetails = [];
    if (this.editMode) {
      this.purchaseId = this.purchaseForm.value.id;
      this.showData();
    } else {
      this.purchaseForm.reset();
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.skipSr = false;
    this.skipMac = false;
    this.isZero = false;
    this.purchaseForm.reset();
    this.purchaseDetails = [];
  }

  viewCreateMode() {
    if (this.createMode) {
      return
    }
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    this.purchaseForm.controls.purchase_return_no.setValue(this.purchaseNo);
    this.getSupplier();
  }

  setInitDate() {
    let d = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.purchaseForm.controls.return_date.setValue(d);
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.return_time.setValue(tims);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }
  
  viewEditMode() {
    if (this.showEditModal) {
      return;
    }
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.getEditSuppliers();
  }

  saveReturn() {

    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.purchaseDetails.length == 0) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter purchase return items.');
      return;
    }


    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.purchase_details = JSON.parse(JSON.stringify(this.purchaseDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updatePurchaseReturn(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase return update successfully.');
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
      this.apiService.savePurchaseReturn(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase return saved successfully.');
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
      this.toastr.error('ERROR', 'Please Select Purchase Order.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Order.');
    } else {
      this.loader.start();
      this.apiService.deletePurchaseReturn({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase return deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    if (this.purchaseId) {
      this.loader.start();
      this.apiService.showPurchaseReturn({id: this.purchaseId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.nonDeleted = false;
          if (data['data']['dispatch']) {
            this.nonDeleted = true;
          }
          this.purchaseForm.patchValue(data['data']);
          this.purchaseId = null;
          this.supplierId = null;
          this.purchaseDetails = data['data']['details'];
          this.purchaseDetails.forEach((item) => {
              item.description = item.prmodel.category_name;
              item.group_name = item.group.name;
              item.product_name = item.prmodel.model_no;
              item.gst_rate = item.prmodel.gst_rate;
              item.qr_code = item.qr_code || 0;
          });
          setTimeout(() => {
            $('.purchase-return-cn td[data-toggle="tooltip"]').tooltip({html: true})
          }, 1000);
          this.showEditModal = false;
        }
        this.loader.stop();
      })
    }
  }

  loadDate() {
    setTimeout(() => {
      $( "#inv_return_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.prodForm.controls.return_date.setValue(date);
        this.prodForm.controls.inv_return_date.setValue(e.format());
      });

      $('#inv_return_date').mask('00/00/0000');
    },500)
  }

  editProductModal(prod: any, i: any) {
    let iObj = {
      qr_code: prod.qr_code,
      group_id: prod.group_id,
      group_name: prod.group_name,
      product_id: prod.product_id,
      product_name: prod.product_name,
      description: prod.description,
      qty: prod.qty,
      purchase_rate: prod.purchase_rate,
      gst_rate: prod.gst_rate,
      gst_amount: prod.gst_amount,
      serial_no: prod.serial_no,
      match_serial_no: prod.match_serial_no,
      mac_address: prod.mac_address,
      match_mac_address: prod.match_mac_address,
      invoice_no: prod.invoice_no,
      return_date: prod.return_date,
      reason: prod.reason
    }
    this.productEditMode = true;
    this.prodForm.patchValue(iObj);
    this.getModels();
    this.showAddItemModal = true;
    this.loadDate();
    if (prod.qr_code && prod.qr_code > 0) {
      this.prodForm.controls.match_mac_address.enable();
      this.prodForm.controls.match_serial_no.enable();
    }
    setTimeout(() => {
      if (prod.return_date) {
        $("#inv_return_date").datepicker('setDate', new Date(prod.return_date))
      }
    }, 800)
  }

  viewProductDetailModal(prod: any, i: any) {
    this.loader.start();
    this.apiService.viewProduct({id: prod.product_id}).subscribe(data => {
      this.selectedModal = data['data'];
      if (this.selectedModal.photo) {
        this.productImage = this.selectedModal.photo;
      }
      this.selectedProductIndex = i;
      this.showProductDetailModal = true;
      this.loader.stop();
    });
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.purchaseDetails.splice(this.selectedProductIndex, 1);
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  viewAddItemModal() {
    this.invalidForm = false;
    this.showAddItemModal = true;
    this.loadDate();
  }

  closeItemModal() {
    this.prodForm.reset();
    this.showAddItemModal = false;
    this.productEditMode = false;
    $('#inv_return_date').datepicker('destroy');
  }

  addToProduct() {
    let isFound = -1;
    this.purchaseDetails.forEach((item, key) => {
      if (item.qr_code == this.prodForm.value.qr_code && item.group_id == this.prodForm.value.group_id && item.product_id == this.prodForm.value.product_id) {
        isFound = key;
      }
    });
    if (isFound == -1) {
      this.purchaseDetails.push(this.prodForm.value);
    } else {
      this.showAddItemModal = false;
      this.purchaseDetails[isFound] = this.prodForm.value;
    }
    this.productEditMode = false;
    this.skipSr = false;
    this.skipMac = false;
    this.isZero = false;
    this.products = [];
    this.calc();
    this.prodForm.reset();
    setTimeout(() => {
      $('.purchase-return-cn td[data-toggle="tooltip"]').tooltip({html: true})
    }, 1000);
  }

  addItem() {
    this.invalidForm = false;
    if (this.prodForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.prodForm.value.reason.length < 25) {
      this.toastr.warning('Message Alert !', 'Reason for Purchase Return must be minumum 25 characters longer.')
      return;
    }

    // if (!this.isNotValid(this.prodForm.value.match_mac_address)) {
    //   if (this.prodForm.value.match_mac_address.length != 12) {
    //     this.toastr.error('ERROR', 'Please enter valid Match MAC Address.');
    //     return;
    //   }
    // };

    if (!this.isZero && !this.skipSr && !this.isNotValid(this.prodForm.value.serial_no)) {
      if (this.isNotValid(this.prodForm.value.match_serial_no) || (this.prodForm.value.serial_no != this.prodForm.value.match_serial_no)) {
        this.invalidSerialNumber = true;
        return;
      }
    }

    if (!this.isZero && !this.skipMac && !this.isNotValid(this.prodForm.value.mac_address)) {
      if (this.isNotValid(this.prodForm.value.match_mac_address) || (this.prodForm.value.mac_address != this.prodForm.value.match_mac_address)) {
        this.invalidMacAddress = true;
        return;
      }
    }

    this.addToProduct();

  }

  calc() {
    let basic_amount = 0;
    let gst_amount = 0;
    let final_amount = 0;
    this.purchaseDetails.forEach((item) => {
      if (this.isNotValid(item.purchase_rate)) {
        item.purchase_rate = 0;
      }
      if (this.isNotValid(item.gst_amount)) {
        item.gst_amount = 0;
      }
      if (this.isNotValid(item.gst_rate)) {
        item.gst_rate = 0;
      }
      let rate = item.purchase_rate * item.qty;
      let gst_rate = Number(rate * parseFloat(item.gst_rate)) / 100;
      gst_amount += gst_rate;
      basic_amount += rate;
      final_amount += rate;
      final_amount += gst_rate;
    });
    this.purchaseForm.controls.basic_amount.setValue(basic_amount);
    this.purchaseForm.controls.gst_amount.setValue(gst_amount);
    this.purchaseForm.controls.final_amount.setValue(final_amount);
  }

  clearItem() {
    this.prodForm.reset();
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

}
