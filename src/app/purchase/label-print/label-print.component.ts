import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';
import { DatePipe } from '@angular/common';
declare var $: any;


@Component({
  selector: 'app-label-print',
  templateUrl: './label-print.component.html',
  styleUrls: ['./label-print.component.css']
})
export class LabelPrintComponent implements OnInit {

  // purchaseForm: FormGroup;
  createMode = false;
  showPrintModal = false;
  confirmLabelModal = false;
  showBarCodes = false;
  showQrCodeModal = false;
  isChecked = false;
  suppliers : any[] = [];
  productDetails : any[] = [];
  productQrCodes : any[] = [];
  BarCodes : any[] = [];
  purchases : any[] = [];
  purchaseData: any;
  supplier_id: any = null;
  sr_no: any = null;
  constructor(private datePipe: DatePipe, private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.getSupplier();
  }

  ngOnInit(): void {
    
  }

  getSupplier() {
    this.apiService.editSuppliers({page: 'purc'}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.suppliers = data['data'];
      }
    });
  }

  getPurchase() {
    if (this.supplier_id) {
      this.loader.start();
      this.apiService.getPurchase({supplier_id: this.supplier_id, status: 'Purchased'}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchases = data['data'];
        }
        this.loader.stop();
      });
    }
  }

  showPurchase() {
    this.loader.start();
    if (this.sr_no) {
      this.apiService.showPurchase({id: this.sr_no}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.purchaseData = data['data'];
          this.productDetails = data['data']['details'];
          this.productDetails.forEach((item, key) => {
            let sw = 'Not Applicable';
            let hsn = '';
            let product_code = '';
            if (item.prmodel.supplier_warranty && item.prmodel.supplier_warranty != 0) {
              sw = item.prmodel.supplier_warranty + ' Months';
            }
            if (item.prmodel.hsn_code) {
              hsn = item.prmodel.hsn_code;
            }
            if (item.prmodel.product_code) {
              product_code = item.prmodel.product_code;
            }
            item.description = item.prmodel.description +'&#13;&#10;Warranty: '+ sw +'&#13;&#10;Product Code: '+ product_code +'&#13;&#10;HSN Code: '+ hsn;
            item.group_name = item.group.name;
            item.product_name = item.prmodel.model_no;
          });
        }
        this.loader.stop();
      });
    }
  }

  closeLabel() {
    let checked = this.productDetails.filter((item) => { return (item.checked) });
    let isCoded = this.productDetails.filter((item) => { return (item.qrcodes.length > 0) });
    if (checked.length != isCoded.length) {
      this.confirmLabelModal = true;
    } else {
      this.showPrintModal = false;
      this.yesKnow();
    }
  }

  yesKnow() {
    this.createMode = false;
    this.purchaseData = null;
    this.supplier_id = null;
    this.sr_no = null;
    this.showPrintModal = false;
    this.confirmLabelModal = false;
    this.productDetails = [];
  }

  printLabel(prod: any) {
    if (prod.checked && prod.qrcodes.length) {
      this.BarCodes = prod.qrcodes;
      this.isChecked = false;
      this.showBarCodes = true;
    }
  }

  viewCodes() {
    let checked = this.BarCodes.filter((row) => { return (row.checked) })
    if (checked.length) {
      this.showQrCodeModal = true;
    } 
  }

  selectAll() {
    this.BarCodes.forEach((item) => {
      item.checked = this.isChecked;
    });
  }

  doPrint() {
    // var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
    // if (winPrint && document.getElementById("qrCodeContent")) {
    //   let htmls = $("#qrCodeContent").html();
    //   winPrint.document.write(htmls);
    //   winPrint.document.close();
    //   winPrint.focus();
    //   winPrint.print();
    //   winPrint.close(); 
    // }
    window.print();
  }

}
