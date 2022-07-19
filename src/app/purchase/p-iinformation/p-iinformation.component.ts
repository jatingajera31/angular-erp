import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-p-iinformation',
  templateUrl: './p-iinformation.component.html',
  styleUrls: ['./p-iinformation.component.css']
})
export class PIInformationComponent implements OnInit {

  purchaseForm: FormGroup;
  createMode = false;
  editMode = false;
  showDeleteModal = false;
  invalidForm = false;
  showEditModal = false;
  showRemoveModal = false;
  showAddItemModal = false;
  showProductDetailModal = false;
  showRemarkModal = false;
  isFocus = false;
  exist = false;
  isUsed = false;
  rowAdded = false;
  suppliers : any[] = [];
  serviceGroups : any[] = [];
  productGroups : any[] = [];
  staffs : any[] = [];
  purchaseOrders : any[] = [];
  purchaseInfos : any[] = [];
  productDetails : any[] = [];
  productDetailsCopy : any[] = [];
  productDetailsMainCopy : any[] = [];
  editSuppliers : any[] = [];
  qty_rate_total: any = 0;
  discount_total: any = 0;
  sub_total: any = 0;
  gst_total: any = 0;
  total_amount: any = 0;
  approvedUser:any = {
    id: null,
    first_name: null,
    father_name: null
  };
  purchaseId: any;
  supplierId: any;
  purchase_country: any;
  payment_currency: any;
  exchange_rate: any;
  productRemark:any;
  selectedModal:any;
  selectedProductIndex:any;
  productImage = './assets/images/product.jpg';
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.purchaseForm = this.fb.group({
      id: new FormControl(null),
      supplier_id: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      purchase_order_id: new FormControl(null, Validators.required),
      purchase_info_no: new FormControl(null, Validators.required),
      online_po_no: new FormControl(null, Validators.required),
      pi_date: new FormControl(null, Validators.required),
      pi_time: new FormControl(null, Validators.required),
      goods_dispatched: new FormControl(null, Validators.required),
      po_date: new FormControl(null),
      t_po_date: new FormControl(null),
      discount_remarks: new FormControl(null),
      po_comments: new FormControl(null),
      pi_no: new FormControl(null),
      t_pi_date: new FormControl(null),
      pi_approved_by: new FormControl(null),
      pio_date: new FormControl(null),
      t_pio_date: new FormControl(null),
      pi_remarks: new FormControl(null),
      qty_rate_total: new FormControl(null),
      discount_total: new FormControl(null),
      sub_total: new FormControl(null),
      gst_total: new FormControl(null),
      total_amount: new FormControl(null),
      item_amount: new FormControl(null),
      discount_amount: new FormControl(null),
      discount_percentage: new FormControl(null),
      final_amount: new FormControl(null)
    });
    this.getStaff();
    this.getProductGroup();
    this.getServiceGroup();
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
    // this.apiService.me().subscribe((data:any) => {
    //   this.approvedUser = data;
    //   this.purchaseForm.controls.pi_approved_by.setValue(this.approvedUser.id);
    // });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $( "#po_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.po_date.setValue(date);
      });

      $( "#pio_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.pio_date.setValue(date);
      });

      $( "#pi_date" ).datepicker({ autoclose: true, todayHighlight: true, format: 'dd/mm/yyyy' }).on('changeDate', (e:any) => {
          const date = this.datePipe.transform(e.date, 'yyyy-MM-dd');
          this.purchaseForm.controls.pi_date.setValue(date);
      });

      $('#pio_date').mask('00/00/0000');
      $('#pi_date').mask('00/00/0000');
      $('#po_date').mask('00/00/0000');

      $('#pi_time').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '8',
        maxTime: '8:00pm',
        startTime: '8:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        change: (time: any) => {
          this.purchaseForm.controls.pi_time.setValue(this.getTimes(time));
        }
      });

    }, 1000);
  }

  getTimes(date: any) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute:'2-digit'
    });
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

  getStaff() {
    this.apiService.allStaff({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.staffs = data['data'];
      }
    });
  }

  getSupplier() {
    this.apiService.getSupplier({p_info: 1}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getEditSuppliers() {
    this.apiService.editSuppliers({page: 'pinfo'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  setCurrectDate() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.purchaseForm.controls.pi_date.setValue(date);
    $("#pi_date").datepicker("setDate", new Date());
    const cTime = new Date();
    this.purchaseForm.controls.pi_time.setValue(cTime.toLocaleTimeString());
  }

  closeForm() {
    this.createMode = false;
    this.editMode = false;
    this.isUsed = false;
    this.rowAdded = false;
    this.productDetails = [];
    this.purchaseOrders = [];
    this.purchaseForm.reset();
    this.qty_rate_total = 0;
    this.discount_total = 0;
    this.sub_total = 0;
    this.gst_total = 0;
    this.total_amount = 0;
  }

  resetForm() {
    this.rowAdded = false;
    this.isUsed = false;
    this.productDetails = [];
    this.qty_rate_total = 0;
    this.discount_total = 0;
    this.sub_total = 0;
    this.gst_total = 0;
    this.total_amount = 0;
    if (this.createMode) {
      this.purchaseOrders = [];
      this.purchaseForm.reset();
    } else {
      this.showPiData();
    }
  }

  viewCreateMode() {
    if (this.createMode) {
      return
    }
    this.createMode = true;
    this.editMode = false;
    this.purchaseForm.reset();
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
    this.purchaseId = null;
    this.supplierId = null;
    this.getEditSuppliers();
  }

  getPurchaseOrder() {
    if (this.purchaseForm.value.supplier_id) {
      this.loader.start();
      this.apiService.getPurchaseOrder({supplier_id: this.purchaseForm.value.supplier_id, pi: true }).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseOrders = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  getPurchaseInfo() {
    if (this.supplierId) {
      this.loader.start();
      this.apiService.getPurchaseInfo({supplier_id: this.supplierId }).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseInfos = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  showPOData() {
    if (this.purchaseForm.value.purchase_order_id) {
      this.loader.start();
      this.exist = false;
      this.apiService.showPurchaseOrder({id: this.purchaseForm.value.purchase_order_id, pi: true}).subscribe(data => {
        if (data && data['status'] == 1) {
          if (!this.editMode) {
            this.purchaseForm.controls.qty_rate_total.setValue(data['data']['qty_rate_total']);
            this.purchaseForm.controls.discount_total.setValue(data['data']['discount_total']);
            this.purchaseForm.controls.sub_total.setValue(data['data']['sub_total']);
            this.purchaseForm.controls.gst_total.setValue(data['data']['gst_total']);
            this.purchaseForm.controls.total_amount.setValue(data['data']['total_amount']);
            this.purchaseForm.controls.item_amount.setValue(data['data']['item_amount']);
            this.purchaseForm.controls.discount_percentage.setValue(data['data']['discount_percentage']);
            this.purchaseForm.controls.discount_amount.setValue(data['data']['discount_amount']);
            this.purchaseForm.controls.final_amount.setValue(data['data']['final_amount']);
            this.productDetails = data['data']['details'];
            let items:any = [];
            if (data['pinfo'] && data['pinfo'].length) {
                data['pinfo'].forEach((row: any) => {
                  row['details'].forEach((dit: any) => {
                    items.push(dit);
                  });
                });
            }
            if (items.length) {
              this.exist = true;
              this.productDetails.forEach((item, key) => {
                items.forEach((row:any, k:any) => {
                  if (item.is_paired) {
                     if (row.is_paired && item.product_id == row.product_id && Number(item.qty) >= Number(row.qty)) {
                      item.qty = Number(item.qty) - Number(row.qty);
                     }
                  } else {
                    if (!row.is_paired && item.product_id == row.product_id && Number(item.qty) >= Number(row.qty)) {
                      item.qty = Number(item.qty) - Number(row.qty);
                    }
                  }
                });
                if (!item.is_paired) {
                  if (item.type == 'Product') {
                    this.getModels(item, key, item.product_id);
                  } else {
                    this.getServices(item, key, item.product_id);
                  }
                }
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
                }
                if (Number(item.qty) < 1) {
                  item.hideRow = true;
                }
              });
              this.productDetailsCopy = JSON.parse(JSON.stringify(this.productDetails));
              this.productDetailsMainCopy = JSON.parse(JSON.stringify(this.productDetails));
              this.calculate();
            } else {
              this.productDetails.forEach((item, key) => {
                if (!item.is_paired) {
                  if (item.type == 'Product') {
                    this.getModels(item, key, item.product_id);
                  } else {
                    this.getServices(item, key, item.product_id);
                  }
                }
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
                }
              });
              this.productDetailsCopy = JSON.parse(JSON.stringify(data['data']['details']));
              this.productDetailsMainCopy = JSON.parse(JSON.stringify(data['data']['details']));
            }
            setTimeout(() => {
              $('td[data-toggle="tooltip"]').tooltip({html: true})
            }, 1500);
          }
          this.purchase_country = data['data']['purchase_country'];
          this.payment_currency = data['data']['payment_currency'];
          this.exchange_rate = data['data']['exchange_rate'];
          if (data['data']['pio_date']) {
            this.purchaseForm.controls.pio_date.setValue(data['data']['pio_date']);
            this.purchaseForm.controls.t_pio_date.setValue(data['data']['pio_date']);
            $("#pio_date").datepicker("setDate", new Date(data['data']['pio_date']));
          }
          console.log(this.productDetails)
        }
        this.loader.stop();
      });
    }

    if (this.createMode) {
      this.setCurrectDate();
    }
  }

  getPurchaseInfoNo() {
    if (!this.editMode && !this.isNotValid(this.purchaseForm.value.supplier_id)) {
      this.apiService.getPurchaseInfoNo({supplier_id: this.purchaseForm.value.supplier_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseForm.controls.purchase_info_no.setValue(data['data']);
        }
      });
    } else {
      this.purchaseForm.controls.purchase_info_no.setValue(null);
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

  showPiData() {
    if (this.purchaseId) {
      this.loader.start();
      this.apiService.showPurchaseInfo({id: this.purchaseId}).subscribe(data => {
        if (data && data['data']) {
          this.purchaseForm.patchValue(data['data']);
          if(data['data']['po_date']) {
            $("#po_date").datepicker("setDate", new Date(data['data']['po_date']));
          }
          if(data['data']['pi_date']) {
            $("#pi_date").datepicker("setDate", new Date(data['data']['pi_date']));
          }
          if(data['data']['pio_date']) {
            $("#pio_date").datepicker("setDate", new Date(data['data']['pio_date']));
          }
          this.editMode = true;
          this.showEditModal = false;
          // this.getPurchaseOrder();
          this.purchaseOrders = data['data']['pos'];
          this.showPOData();
          this.productDetails = data['data']['details'];
          this.productDetails.forEach((item, key) => {
            if (!item.is_paired) {
              if (item.type == 'Product') {
                this.getModels(item, key, item.product_id);
              } else {
                this.getServices(item, key, item.product_id);
              }
            }
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
            }
          });
          this.isUsed = data['used'];
          setTimeout(() => {
            $('td[data-toggle="tooltip"]').tooltip({html: true})
          }, 1500);
        } else {
          // this.setCurrectDate();
        }
        this.loader.stop();
      });
    }
  }


  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getModels(prod: any, index: any, product_id: any) {
    if (prod.group_id) {
      this.loader.start();
      this.apiService.getProductGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          prod.products = data['data'];
          if (product_id) {
            this.changeModel(product_id, prod, true)
          }
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

  getServices(prod: any, index: any, product_id: any) {
    if (prod.group_id) {
      this.loader.start();
      this.apiService.getServiceGroupCode({group_id: prod.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          prod.products = data['data'];
          if (product_id) {
            this.changeModel(product_id, prod, true)
          }
        }
        this.loader.stop();
      });
    }
  }

  changeModel(product_id: any, prod: any, isEdited: any) {
    if (product_id) {
      for(var r in prod.products) {
        if (prod.products[r].id == product_id) {
          if (prod.type == 'Product') {
            let sw = 'Not Applicable';
            let hsn = '';
            let product_code = '';
            if (!this.isNotValid(prod.products[r].supplier_warranty)) {
              sw = prod.products[r].supplier_warranty + ' Months';
            }
            if (prod.products[r].hsn_code) {
              hsn = prod.products[r].hsn_code;
            }
            if (prod.products[r].product_code) {
              product_code = prod.products[r].product_code;
            }
            prod.description = prod.products[r].description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
            prod.tdescription = prod.products[r].description +'&#13;&#10;<br>Warranty: '+ sw +'&#13;&#10;<br>Product Code: '+ product_code +'&#13;&#10;<br>HSN Code: '+ hsn;            
            if (!this.editMode) {
              prod.gst_percentage = (this.purchase_country == 'India') ? prod.products[r].gst_rate : 0;
              prod.rate = (this.purchase_country == 'India') ? prod.products[r].purchase_rate : 0;
            }
          } else {
            prod.description = prod.products[r].description;
            if (!this.editMode) {
              prod.gst_percentage = (this.purchase_country == 'India') ? prod.products[r].gst_rate : 0;
              prod.rate = (this.purchase_country == 'India') ? prod.products[r].purchase_rate : 0;
            }
          }
        }
      }

      if (!prod.is_paired && prod.type == 'Product' && !isEdited) {
        let keys: any = [];
        this.productDetails.map((item: any, key: any) => {
          if (item.paired_id == product_id && item.is_paired) {
            keys.push(key);
          }
        });

        if (keys.length) {
          keys.sort((a:any, b:any) => {
            return b - a;
          });
          for(var d in keys) {
            this.productDetails.splice(keys[d], 1);
          }
        }
        setTimeout(() => {
          this.getProductPaired(product_id, isEdited); 
        }, 200);
        setTimeout(() => {
          $('td[data-toggle="tooltip"]').tooltip({html: true})
        }, 1500);
      }
    }
  }

  getProductPaired(product_id: any, isEdited: any) {
    this.loader.start();
    this.apiService.showProduct({id: product_id}).subscribe(data => {
      if (data && data['status'] == 1) {
        if (data['paired'] && data['paired'].length) {
          data['paired'].forEach((item: any) => {
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
            let found = false;
            this.productDetails.filter((prditem) => {
               if (prditem.product_id == item.model_id && prditem.paired_id == product_id) {
                prditem.group_name = item.group.name;
                prditem.product_name = item.prmodel.model_no;
                prditem.description = desc;
                prditem.tdescription = tdesc;
                prditem.gst_percentage = item.prmodel.gst_rate;
                found = true;
               }
            });
            if (!found && !isEdited) {
              this.productDetails.push({
                id: null,
                type: 'Product',
                group_id: item.group_id,
                product_id: item.model_id,
                group_name: item.group.name,
                product_name: item.prmodel.model_no,
                is_paired: true,
                paired_id: product_id,
                paired_qty: item.qty,
                description: desc,
                tdescription: tdesc,
                qty: 0,
                rate: 0,
                discount_percentage: 0,
                discount_amount: 0,
                sub_total: 0,
                gst_percentage: 0,
                gst_amount: 0,
                total_amount: 0,
                remark: null,
                show: false,
                products: []
              });
            }
          });
        }
      }
      this.loader.stop();
    });
  }

  checkQty(prod:any, i: any) {
    if (this.productDetailsCopy[i] && (Number(prod.qty) > Number(this.productDetailsCopy[i].qty)) && this.purchaseForm.value.goods_dispatched != 'All') {
      this.toastr.error('ERROR', 'Hey, '+this.productDetailsCopy[i].qty+' is the Max. quantity you can add. Model No.: ' + prod.product_name);
    }
  }
  checkQtyErr(prod:any, i: any) {
    if (this.productDetailsCopy[i] && this.productDetailsCopy[i]) {
      if ((Number(prod.qty) > Number(this.productDetailsCopy[i].qty)) && this.purchaseForm.value.goods_dispatched != 'All') {
        return true;
      } 
    }
    return false;
  }

  checkValidQty(prod: any) {
    if (prod.is_paired && !this.exist && !this.isUsed && this.purchaseForm.value.goods_dispatched == 'All') {
      let q = 0;
      this.productDetails.forEach((item) => {
        if (item.product_id == prod.paired_id) {
          q = item.qty;
        }
      });
      let maxq = q * prod.paired_qty;
      if (prod.qty > maxq) {
        return true;
      }
    }
    return false;
  }

  checkValidQtyErr(prod: any) {
    if (prod.is_paired && !this.exist && !this.isUsed && this.purchaseForm.value.goods_dispatched == 'All') {
      let q = 0;
      this.productDetails.forEach((item) => {
        if (item.product_id == prod.paired_id) {
          q = item.qty;
        }
      });
      let maxq = q * prod.paired_qty;
      if (prod.qty > maxq) {
        this.toastr.error('ERROR', 'Hey, '+maxq+' is the Max. quantity you can add. Model No.: ' + prod.product_name);
      }
      if (prod.qty < maxq) {
        this.toastr.warning('Warning', 'Hey, '+maxq+' is the max quantity.  you added ' + prod.qty +' quantity for Model No.: ' + prod.product_name);
      }
    }
  }

  checkIsValidQty(product_id: any, qty: any, is_paired:any) {
    let pLen = this.productDetails.filter((item) => { return(item.product_id == product_id && item.qty == qty && item.is_paired == is_paired) })
    return (pLen.length == 0);
  }

  saveInfo() {
    this.invalidForm = false;
    let msg = "Please enter valid details.";
    if (this.purchaseForm.invalid) {
      let msgs: any = {
        supplier_id: 'Supplier',
        purchase_order_id: 'P.O.No',
        goods_dispatched: 'Goods Dispatched',
        online_po_no: 'Online PO No'
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

    let changedQty = false;

    this.productDetails.forEach((item, k) => {
      if (this.isNotValid(item.qty) && !item.hideRow) {
        this.toastr.error('ERROR', 'Please enter quantity');
        this.invalidForm = true;
        return
      }

      if (item.is_paired && this.checkValidQty(item)) {
        this.toastr.error('ERROR', 'Hey, Please Enter Valid Quantity.');
        this.invalidForm = true;
      }

      if (this.productDetailsCopy[k] && (Number(item.qty) > Number(this.productDetailsCopy[k].qty)) && this.purchaseForm.value.goods_dispatched == 'Partial') {
        this.toastr.error('ERROR', 'Hey, Please Enter Valid Quantity.'); 
        this.invalidForm = true;
      }

      // if (Number(this.productDetailsCopy[k].qty) != Number(item.qty)) {
      //   changedQty = true;
      // }
    });

    if (this.invalidForm) {
      return;
    }

    this.productDetailsMainCopy.forEach((row) => {
      if (!row.hideRow && this.checkIsValidQty(row.product_id, row.qty, row.is_paired)) {
        changedQty = true;
      }
    });

    if (!changedQty && this.purchaseForm.value.goods_dispatched == 'Partial') {
      this.purchaseForm.controls.goods_dispatched.setValue('All');
    }

    let params = JSON.parse(JSON.stringify(this.purchaseForm.value));
    params.product_details = JSON.parse(JSON.stringify(this.productDetails));
    if (params.id && params.id > 0) {
      this.loader.start();
      this.apiService.updatePurchaseInfo(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase information update successfully.');
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
      this.apiService.savePurchaseInfo(params).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Purchase information saved successfully.');
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

  isNotValid(value: any) {
    return (!value || value == '' || value == 'null' || value == '0');
  }

  calculate() {
    let qty_rate_total = 0;
    let discount_total = 0;
    let sub_total = 0;
    let gst_total = 0;
    let total_amount = 0;
    let item_amount = 0;
    this.productDetails.forEach((item, key) => {
      if (this.purchase_country == 'Overseas') {
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
        if (item.gst_percentage && this.purchase_country == 'India') {
          item.gst_amount = (item.sub_total * item.gst_percentage) / 100;
          gst_total += item.gst_amount;
        }
        item.total_amount = (item.sub_total + item.gst_amount);
        total_amount += item.total_amount;
      }
    });

    this.purchaseForm.controls.qty_rate_total.setValue(qty_rate_total);
    this.purchaseForm.controls.discount_total.setValue(discount_total);
    this.purchaseForm.controls.sub_total.setValue(sub_total);
    this.purchaseForm.controls.gst_total.setValue(gst_total);
    this.purchaseForm.controls.total_amount.setValue(total_amount);
    this.purchaseForm.controls.item_amount.setValue(total_amount);
    this.calculateTotal();
  }

  calculateTotal() {
    let item_amount = this.purchaseForm.value.item_amount;
    let discount_amount = 0;
    if (this.purchaseForm.value.discount_percentage) {
      discount_amount = (item_amount * this.purchaseForm.value.discount_percentage) / 100;
    }
    let final_amount = item_amount - discount_amount;
    this.purchaseForm.controls.discount_amount.setValue(discount_amount);
    final_amount = Math.round(final_amount * 100) / 100;
    this.purchaseForm.controls.final_amount.setValue(final_amount);
  }

  getDiscountAmount(prod: any) {
    if (prod.rate) {
      let prodRate = prod.rate;
      if (prod.discount_percentage) {
        let dic = (prod.rate * prod.discount_percentage) / 100;
        return  Math.round(dic * 100) / 100;
      }
    }
    return 0;
  }

  changeFinalAmount() {
    if (this.purchaseForm.value.final_amount) {
      let item_amount = this.purchaseForm.value.item_amount;
      let final_amount = this.purchaseForm.value.final_amount;
      let discount_amount = item_amount - final_amount;
      discount_amount = Math.round(discount_amount * 100) / 100;
      let discount_percentage = (100 * discount_amount) / item_amount;
      discount_percentage = Math.round(discount_percentage * 100) / 100;
      this.purchaseForm.controls.discount_amount.setValue(discount_amount);
      this.purchaseForm.controls.discount_percentage.setValue(discount_percentage);
    }
  }

  changeDiscountAmount() {
    // if (this.purchaseForm.value.discount_amount) {
      let discount_amount = this.purchaseForm.value.discount_amount;
      let item_amount = this.purchaseForm.value.item_amount;
      let final_amount = item_amount - discount_amount;
      this.purchaseForm.controls.final_amount.setValue(final_amount);
      let discount_percentage = (100 * discount_amount) / item_amount;
      discount_percentage = Math.round(discount_percentage * 100) / 100;
      this.purchaseForm.controls.discount_percentage.setValue(discount_percentage);
    // }
  }

  viewAddItemModal() {
    let errors = false;
    this.productDetails.forEach((item) => {
        item.error = false;
        if (this.isNotValid(item.group_id)) {
          this.toastr.error('ERROR', 'Please select product group');
          item.error = true;
          errors = true;
          return
        }
        if (this.isNotValid(item.product_id)) {
          this.toastr.error('ERROR', 'Please select model no');
          item.error = true;
          errors = true;
          return
        }
        if (this.isNotValid(item.qty) && !item.hideRow) {
          this.toastr.error('ERROR', 'Please enter quantity');
          item.error = true;
          errors = true;
          return
        }
        if (this.isNotValid(item.rate) && !item.is_paired) {
          this.toastr.error('ERROR', 'Please enter rate');
          item.error = true;
          errors = true;
          return
        }

        if (item.is_paired && this.checkValidQty(item)) {
          // this.toastr.error('ERROR', 'Please enter valid quantity');
          item.error = true;
          errors = true;
        }
      });

      if (errors) {
        return;
      }
      this.showAddItemModal = true;
  }

  addRow(type: string) {
    this.loader.start();
    this.rowAdded = true;
    setTimeout(() => {
      this.addProdDetail(type);
      this.showAddItemModal = false;
      this.loader.stop();
    },300);
  }

  addProdDetail(type: string) {
    this.productDetails.push({
      id: null,
      type: type,
      group_id: null,
      product_id: null,
      group_name: null,
      product_name: null,
      is_paired: null,
      paired_id: null,
      paired_qty: null,
      description: null,
      qty: null,
      rate: null,
      discount_percentage: null,
      discount_amount: null,
      sub_total: 0,
      gst_percentage: 0,
      gst_amount: 0,
      total_amount: 0,
      remark: null,
      show: false,
      products: []
    });
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

  viewRemarkModal(prod: any, i: any) {
    this.productRemark = prod.remark;
    this.selectedProductIndex = i;
    this.showRemarkModal = true;
  }

  saveRemark() {
    this.productDetails[this.selectedProductIndex].remark = this.productRemark;
    this.showRemarkModal = false;
  }

  viewRemoveModal(prod: any, i: any) {
    this.selectedProductIndex = i;
    this.showRemoveModal = true;
  }

  removeProduct() {
    this.selectedModal = null;
    this.showRemoveModal = false;
    this.productDetails.splice(this.selectedProductIndex, 1);
    if (this.productDetailsCopy[this.selectedProductIndex]) {
      this.productDetailsCopy.splice(this.selectedProductIndex, 1);
    }
    this.calculate()
  }

  deleteInfo() {
    if (this.purchaseForm.value.id && this.purchaseForm.value.id > 0) {
      this.showDeleteModal = true;
    } else {
      this.toastr.error('ERROR', 'Please Select Purchase Perfoma.');
    }
  }

  deleteData() {
    if (!this.purchaseForm.value.id) {
      this.toastr.error('ERROR', 'Please Select One Purchase Perfoma.');
    } else {
      this.loader.start();
      this.apiService.deletePurchaseInfo({id: this.purchaseForm.value.id}).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.closeForm()
          this.showDeleteModal = false
          this.toastr.success('SUCCESS', 'Purchase Perfoma deleted successfully.'); 
        } else {
          this.toastr.error('ERROR', data['data']);    
        }
      });
    }
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
