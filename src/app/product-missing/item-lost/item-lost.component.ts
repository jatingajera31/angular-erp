import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-item-lost',
  templateUrl: './item-lost.component.html',
  styleUrls: ['./item-lost.component.css']
})
export class ItemLostComponent implements OnInit {

  purchaseForm: FormGroup;
  prodForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showAddItemModal = false;
  productEditMode = false;
  isZero = false;
  showRemoveModal = false;
  isFocus = false;
  approved = false;
  selectedProductIndex:any;
  selectedProductId:any;
  selectedModal:any;
  suppliers : any[] = [];
  itemLosts : any[] = [];
  productDetails : any[] = [];
  productGroups : any[] = [];
  staffs : any[] = [];
  clients : any[] = [];
  products : any[] = [];
  demandNo: any = null;
  clientId: any = null;
  demandId: any = null;
  totalAmount = 0;
  taxTotalAmount = 0;
  prdObj = {
    qr_code: null,
    group_id: null,
    product_id: null,
    product_name: null,
    category_name: null,
    serial_no: null,
    mac_address: null,
    invoice_no: null,
    invoice_date: null,
    purchase_rate: 0,
    gst_amount: 0,
    gst_rate: 0,
    qty: 0,
    remarks: null
  }
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      prepared_by: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      connected_with: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      challan_no: new FormControl(null, [Validators.required]),
      challan_date: new FormControl(null, [Validators.required]),
      t_challan_date: new FormControl(null),
      challan_time: new FormControl(null, [Validators.required]),
      remarks: new FormControl(null)
    });
    this.prodForm = this.fb.group({
      qr_code: new FormControl(null, Validators.required),
      group_id: new FormControl(null, Validators.required),
      group_name: new FormControl(null),
      product_id: new FormControl(null, Validators.required),
      product_name: new FormControl(null),
      product_code: new FormControl(null),
      description: new FormControl(null),
      qty: new FormControl(null, Validators.required),
      warranty: new FormControl(null),
      warranty_date: new FormControl(null),
      serial_no: new FormControl(null),
      mac_address: new FormControl(null),
      invoice_no: new FormControl(null),
      invoice_date: new FormControl(null),
      inv_invoice_date: new FormControl(null),
      purchase_rate: new FormControl(null),
      gst_rate: new FormControl(null),
      gst_amount: new FormControl(null),
      remarks: new FormControl(null, Validators.required)
      // problem: new FormControl(null, [Validators.required, Validators.minLength(25)])
    });
    this.getStaff();
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
    this.productDetails.forEach((item, c) => {
      if (k == -1 || k != c) {
        item.show = false;
      }
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
  }

  getProductGroup() {
    this.apiService.getProductGroup({coded_item: 'Non-Coded'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getProducts() {
    if (this.isNotValid(this.prdObj.group_id)) {
      this.products = [];
      return;
    }
    this.loader.start();
    this.apiService.getProductGroupCode({group_id: this.prdObj.group_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.products = data['data'];
      }
      this.loader.stop();
    });
  }

  changeQty() {
    let gst_amount = Number(this.prodForm.value.qty * Number(this.prodForm.value.purchase_rate)) / Number(this.prodForm.value.gst_rate);
    gst_amount = Math.round(gst_amount * 100) / 100;
    this.prodForm.controls.gst_amount.setValue(gst_amount);
  }

  getItemLost() {
    this.apiService.getItemLost({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.itemLosts = data['data'];
      }
    });
  }

  changeDate(field: any, iField: any) {
    if (this.purchaseForm.value[field]) {
      let d = this.makeDate(this.purchaseForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.purchaseForm.controls[iField].setValue(date);
    }
  }

  changeSubDate(field: any, iField: any) {
    if (this.prodForm.value[field]) {
      let d = this.makeDate(this.prodForm.value[field]);
      const date = this.datePipe.transform(d, 'yyyy-MM-dd');
      this.prodForm.controls[iField].setValue(date);
    }
  }

  checkWar(wDate: any) {
    if (new Date(wDate) < new Date()) {
      return "Expired";
    } else {
      return "Yes";
    }
  }

  getInvDate() {
    // this.apiService.getInvoiceDetail({invoice_no: this.prodForm.value.invoice_no, supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
    //   if (data['data']) {
    //     setTimeout(() => {
    //       if (data['data'].invoice_date) {
    //         this.prodForm.controls.invoice_date.setValue(data['data'].invoice_date);
    //         $("#inv_invoice_date").datepicker('setDate', new Date(data['data'].invoice_date))
    //       }
    //     }, 200)
    //   }
    // });
  }

  makeDate(tarik: string) {
    if (tarik) {
      let t = tarik.split('/');
      return t[1] + '/' + t[0] + '/' + t[2];
    } else {
      return null;
    }
  }

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getItemLostNo() {
    if (this.createMode) {
      this.loader.start();
      this.apiService.getItemLostNo({}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.challan_no.setValue(data['data']);
        }
        this.loader.stop();
      });
    }
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.approved = false;
    this.totalAmount = 0;
    this.taxTotalAmount = 0;
    this.productDetails = [];
    this.purchaseForm.reset();
  }

  viewCreateMode() {
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.challan_date.setValue(date);
    this.purchaseForm.controls.t_challan_date.setValue(new Date());
    $("#challan_date").datepicker('setDate', new Date())
    let tims = this.getTimes(new Date());
    this.purchaseForm.controls.challan_time.setValue(tims);
    this.getItemLostNo();
  }
  
  viewEditMode() {
    this.purchaseForm.reset();
    this.showEditModal = true;
    this.createMode = false;
    this.getItemLost();
    // this.getEditClients();
  }

  saveInfo() {
    this.invalidForm = false;
    if (this.purchaseForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }

    if (this.productDetails.length) {
      this.productDetails.forEach((item) => {
        if (this.isNotValid(item.group_id)) {
          this.invalidForm = true;
        }
        if (this.isNotValid(item.product_id)) {
          this.invalidForm = true;
        }
        if (this.isNotValid(item.qty)) {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid product details.');
        return;
      }
    } else {
      this.toastr.error('ERROR', 'Please enter product details.');
      return;
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.products = JSON.parse(JSON.stringify(this.productDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updateItemLost(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item details update successfully.');
          this.closeForm();
          this.productDetails = [];
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      this.loader.start();
      this.apiService.saveItemLost(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Item details saved successfully.');
          this.closeForm();
          this.productDetails = [];
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
      this.toastr.error('ERROR', 'Please Select One Item Loss.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Item Loss.');
    } else {
      this.loader.start();
      this.apiService.deleteItemLost({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Item Loss deleted successfully.'); 
        }
      });
    }
  }

  showData() {
    if (this.demandId) {
      this.loader.start();
      this.apiService.showItemLost({id: this.demandId}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.createMode = false;
          this.editMode = true;
          this.purchaseForm.patchValue(data['data']);
          this.productDetails = data['data']['details'];
          this.showEditModal = false;
          this.productDetails.forEach((item, key) => {
            item.description = item.product.category_name;
            item.product_name = item.product.model_no;
            item.category_name = item.product.category.name;
            item.gst_rate = item.product.gst_rate;
            item.group_name = item.group.name;
            item.product_code = item.product.product_code;
          })
          this.approved = (data['data']['status'] == 'Approved');
          this.calc();
          if (data['data']['challan_date']) {
            $("#challan_date").datepicker("setDate", new Date(data['data']['challan_date']));
          }
        }
        this.loader.stop();
        this.demandId = null;
        this.clientId = null;
      });
    }
  }

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

  getQrCode() {
    if (this.prodForm.value.qr_code && this.prodForm.value.qr_code != '0') {
      this.isZero = false;
      this.loader.start();
      this.apiService.getProductQrCode({qr_code: this.prodForm.value.qr_code}).subscribe((data:any) => {
        if (data && data['status'] == 1 && data['data']) {
          let warranty_date = null;
          let warranty = 0;
          let desc = data['prmodel'].description +'&#13;&#10;Prod. Code: '+ data['prmodel'].product_code +'&#13;&#10;Warranty: '+ data['prmodel'].supplier_warranty +' Months&#13;&#10;HSN Code: '+ data['prmodel'].hsn_code;
          if (!this.isNotValid(data['prmodel']['supplier_warranty'])) {
            // let extended_month = data['prmodel'].extended_month;
            let extended_month = data['prmodel'].supplier_warranty;
            let challan_date = new Date();
            if (data['data']['purchase']['purchase_date']) {
              challan_date = new Date(data['data']['purchase']['purchase_date']);
            }
            let date = new Date(challan_date.setMonth(Number(extended_month)));
            warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
            if (date > new Date()) {
              warranty = 1;
            }
          }
          let iObj = {
            qr_code: data['data']['qr_code'],
            group_id: data['data']['item']['group_id'],
            group_name: data['prmodel']['group']['name'],
            product_id: data['data']['item']['product_id'],
            product_name: data['prmodel']['model_no'],
            product_code: data['prmodel']['product_code'],
            description: data['prmodel']['category_name'],
            qty: 1,
            serial_no: data['data']['serial_no'],
            mac_address: data['data']['mac_address'],
            invoice_no: (data['data']['purchase']) ? data['data']['purchase']['invoice_no']: null,
            invoice_date: (data['data']['purchase']) ? data['data']['purchase']['invoice_date']: null,
            warranty: warranty,
            warranty_date: warranty_date,
            purchase_rate: data['prmodel']['purchase_rate'],
            gst_rate: data['prmodel']['gst_rate'],
            gst_amount: 0,
            reason: null,
            remarks: null,
          }
          let gst = (1 * Number(data['prmodel']['purchase_rate'])) / Number(data['prmodel']['gst_rate']);
          gst = Math.round(gst * 100) / 100;
          iObj.gst_amount = gst;

          this.prodForm.patchValue(iObj);
          setTimeout(() => {
            if (iObj.invoice_date) {
              $("#inv_invoice_date").datepicker('setDate', new Date(iObj.invoice_date))
            }
          }, 800)
        } else {
          this.prodForm.reset();
          if (data['data']) {
            this.toastr.error('Sorry Gentleman !', data['data']);
          } else {
            this.toastr.error('Sorry Gentleman !', 'QR Code does not match please check or enter correct info.');
          }
        }
        this.loader.stop();
      });
    }
    if (this.prodForm.value.qr_code == '0') {
      this.isZero = true;
      this.prodForm.reset();
      this.prodForm.controls.qr_code.setValue(0);
    }
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
          this.prodForm.controls.product_name.setValue(this.products[r].model_no);
          this.prodForm.controls.description.setValue(this.products[r].category_name);
          this.prodForm.controls.warranty.setValue(this.products[r].extended_warranty);
          this.prodForm.controls.product_code.setValue(this.products[r].product_code);
          if (this.products[r].extended_warranty == '1') {
            let extended_month = this.products[r].extended_month;
            let challan_date = new Date();
            let date = new Date(challan_date.setMonth(challan_date.getMonth() + Number(extended_month)));
            let warranty_date = this.datePipe.transform(date, 'yyyy-MM-dd');
            this.prodForm.controls.warranty_date.setValue(warranty_date);
          }

          this.prodForm.controls.purchase_rate.setValue(this.products[r].purchase_rate);
          this.prodForm.controls.gst_rate.setValue(this.products[r].gst_rate);
          this.prodForm.controls.qty.setValue(1)
          let gst = (this.prodForm.value.qty * Number(this.products[r].purchase_rate)) / Number(this.products[r].gst_rate);
          gst = Math.round(gst * 100) / 100;
          this.prodForm.controls.gst_amount.setValue(gst)

        }
      }
    }
  }

  viewProductDetailModal(prod: any, i: any) {
    this.selectedProductId = prod.product_id;
  }

  editProductModal(prod: any, i: any) {
    let iObj = {
      qr_code: prod.qr_code,
      group_id: prod.group_id,
      group_name: prod.group_name,
      product_id: prod.product_id,
      product_name: prod.product_name,
      product_code: prod.product_code,
      description: prod.description,
      qty: prod.qty,
      serial_no: prod.serial_no,
      mac_address: prod.mac_address,
      invoice_no: prod.invoice_no,
      invoice_date: prod.invoice_date,
      warranty: prod.warranty,
      warranty_date: prod.warranty_date,
      purchase_rate: prod.purchase_rate,
      gst_rate: prod.gst_rate,
      gst_amount: prod.gst_amount,
      reason: prod.reason,
      remarks: prod.remarks
    }
    this.productEditMode = true;
    this.prodForm.patchValue(iObj);
    this.getModels();
    this.loadDate();
    setTimeout(() => {
      if (iObj.invoice_date) {
        $("#inv_invoice_date").datepicker('setDate', new Date(iObj.invoice_date))
      }
    }, 800)
    this.showAddItemModal = true;
  }

  loadDate() {
    setTimeout(() => {
      $( "#inv_invoice_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
        const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
        this.prodForm.controls.invoice_date.setValue(date);
        this.prodForm.controls.inv_invoice_date.setValue(e.format());
      });

      $('#inv_invoice_date').mask('00/00/0000');
    },500)
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
  }

  clearItem() {
    this.prodForm.reset();
  }

  checkPurchaseQty() {
    if (this.isNotValid(this.prodForm.value.product_id)) {
      this.prodForm.controls.qty.setValue(0);
      return;
    }
    this.apiService.checkPurchaseQty({qty: this.prodForm.value.qty, product_id: this.prodForm.value.product_id, supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
      if (data['status'] == 1) {
        if (Number(this.prodForm.value.qty) > Number(data['data'])) {
          let spName = this.suppliers.filter((row) => { return (row.id == this.purchaseForm.value.supplier_id) });
          if (spName.length) {
            this.prodForm.controls.qty.setValue(0);
            this.toastr.error('Gentleman !', 'Item Loss qnty is more than the qnty you purchased from <strong>'+spName[0].name+'</strong>, please check qnty.')    
          }
        }
      }
    });
  }

  addItem() {
    this.invalidForm = false;
    if (this.prodForm.invalid) {
      this.invalidForm = true;
      this.toastr.error('ERROR', 'Please enter valid details.');
      return;
    }
    if (this.prodForm.value.remarks.length < 25) {
      this.toastr.warning('Message Alert !', 'Reason of Loss must be minumum 25 characters longer.')
      return;
    }

    this.addToList();
    
  }

  addToList() {
    let isFound = -1;
    this.productDetails.forEach((item, key) => {
      if (item.qr_code == this.prodForm.value.qr_code && item.group_id == this.prodForm.value.group_id && item.product_id == this.prodForm.value.product_id) {
        isFound = key;
      }
    });
    if (isFound == -1) {
      this.productDetails.push(this.prodForm.value);
    } else {
      this.showAddItemModal = false;
      this.productDetails[isFound] = this.prodForm.value;
    }
    this.productEditMode = false;
    this.isZero = false;
    this.prodForm.reset();
    this.products = [];
    this.calc();
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

  calc() {
    this.totalAmount = 0;
    this.taxTotalAmount = 0;
    this.productDetails.forEach((item, key) => {
      this.totalAmount += parseFloat(item.purchase_rate);
      this.taxTotalAmount += parseFloat(item.gst_amount);
    })
  }

  addRow(type: string) {
    this.showAddItemModal = false;
  }

}