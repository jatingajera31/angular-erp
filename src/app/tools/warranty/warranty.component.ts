import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.css']
})
export class WarrantyComponent implements OnInit {

  installations : any[] = [];
  productGroups : any[] = [];
  products : any[] = [];
  group_id: any = null;
  invalidForm = false;
  showPreview = false;
  selectedRow: any;
  scYear: any;
  firstColumn: any;
  secondColumn: any;
  thirdColumn: any;
  fourthColumn: any;
  fifthColumn: any;
  first_colm: any;
  second_colm: any;
  third_colm: any;
  fourth_colm: any;
  fifth_colm: any;
  six_colm: any;
  seven_colm: any;
  eight_colm: any;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.getProductGroup();
  }

  ngOnInit(): void {
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getProducts() {
    if (this.group_id) {
      this.loader.start();
      this.apiService.getProductWarranty({group_id: this.group_id}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
          this.installations = [];
          this.products.forEach((item) => {
            let rate_addon = item.extended_warranty_rate;
            let year_increment = item.extended_warranty_yearly_increment;
            let first_colm = 0;
            let second_colm = 0;
            let third_colm = 0;
            let fourth_colm = 0;
            let fifth_colm = 0;
            let six_colm = 0;
            let seven_colm = 0;
            let eight_colm = 0;
            this.installations.push({
              product_category: item.category.name,
              model_no: item.model_no,
              group_id: this.group_id,
              category_id: item.category_id,
              product_id: item.id,
              unit_rate: item.max_retail_price,
              client_warranty: item.client_warranty,
              extended_warranty: item.extended_warranty,
              rate_addon: rate_addon,
              year_increment: year_increment,
              extended_month: (item.extended_month) ? item.extended_month: 6,
              first_colm: first_colm,
              second_colm: second_colm,
              third_colm: third_colm,
              fourth_colm: fourth_colm,
              fifth_colm: fifth_colm,
              six_colm: six_colm,
              seven_colm: seven_colm,
              eight_colm: eight_colm,
            });
          });
          this.calculateRate();
        }
        this.loader.stop();
      });
    }
  }

  calculateRate() {
    this.installations.forEach((item) => {
      if (item.rate_addon) {
        item.first_colm = parseFloat(item.rate_addon);
        item.second_colm = parseFloat(item.rate_addon);
        item.third_colm = parseFloat(item.rate_addon);
        item.fourth_colm = parseFloat(item.rate_addon);
        item.fifth_colm = parseFloat(item.rate_addon);
        item.six_colm = parseFloat(item.rate_addon);
        item.seven_colm = parseFloat(item.rate_addon);
        item.eight_colm = parseFloat(item.rate_addon);
        if (item.year_increment) {
          item.second_colm = item.first_colm + ((item.first_colm * item.year_increment) / 100);
          item.third_colm = item.second_colm + ((item.second_colm * item.year_increment) / 100);
          item.fourth_colm = item.third_colm + ((item.third_colm * item.year_increment) / 100);
          item.fifth_colm = item.fourth_colm + ((item.fourth_colm * item.year_increment) / 100);
          item.six_colm = item.fifth_colm + ((item.fifth_colm * item.year_increment) / 100);
          item.seven_colm = item.six_colm + ((item.six_colm * item.year_increment) / 100);
          item.eight_colm = item.seven_colm + ((item.seven_colm * item.year_increment) / 100);

          item.second_colm = Math.floor(item.second_colm * 100) / 100;
          item.third_colm = Math.floor(item.third_colm * 100) / 100;
          item.fourth_colm = Math.floor(item.fourth_colm * 100) / 100;
          item.fifth_colm = Math.floor(item.fifth_colm * 100) / 100;
          item.six_colm = Math.floor(item.six_colm * 100) / 100;
          item.seven_colm = Math.floor(item.seven_colm * 100) / 100;
          item.eight_colm = Math.floor(item.eight_colm * 100) / 100;
        }
      } else {
        item.first_colm = 0;
        item.second_colm = 0;
        item.third_colm = 0;
        item.fourth_colm = 0;
        item.fifth_colm = 0;
        item.six_colm = 0;
        item.seven_colm = 0;
        item.eight_colm = 0;
      }
    });
  }

  undo() {
    this.installations = [];
    this.group_id = null;
  }

  saveRate() {
    this.invalidForm = false;
    if (this.installations.length && this.group_id) {
      this.loader.start();
      this.apiService.saveWarranty({ items: this.installations, group_id: this.group_id }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Warranty Data Submit Successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
        this.toastr.error('ERROR', 'Please enter valid data.');
        return;
    }
  }

  viewDetail(item: any) {
    if (!item.extended_warranty) {
      this.toastr.error('ERROR', 'Please enter Rate ADD-ON and Increment Factor in product.');
      return;
    }
    this.firstColumn = null;
    this.secondColumn = null;
    this.thirdColumn = null;
    this.fourthColumn = null;
    this.fifthColumn = null;
    this.scYear = null;
    this.selectedRow = item;
    this.showPreview = true;
    this.first_colm = (item.unit_rate * item.first_colm) / 100;
    this.second_colm = (item.unit_rate * item.second_colm) / 100;
    this.third_colm = (item.unit_rate * item.third_colm) / 100;
    this.fourth_colm = (item.unit_rate * item.fourth_colm) / 100;
    this.fifth_colm = (item.unit_rate * item.fifth_colm) / 100;
    this.six_colm = (item.unit_rate * item.six_colm) / 100;
    this.seven_colm = (item.unit_rate * item.seven_colm) / 100;
    this.eight_colm = (item.unit_rate * item.eight_colm) / 100;
  }

  makeRate(selectedRow: any, colm: any) {
    let vs: number = Number((selectedRow['unit_rate'] * colm) / 100) + Number(selectedRow['unit_rate']);
    return vs;
  }

  toFixed(value: any) {
    if (value) {
      value = parseFloat(value);
      return value.toFixed(2);
    }
  }

  // viewResult() {
  //   if (this.scYear > 0 && this.scYear < 6) {
  //     if (this.scYear == 1) {
  //       this.firstColumn = '1ST';
  //       this.secondColumn = (this.scYear + 1);
  //       this.thirdColumn = this.selectedRow.first_year;
  //       this.fourthColumn = 0;
  //       this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_year;
  //     } else if (this.scYear == 2) {
  //       this.firstColumn = '2ND';
  //       this.secondColumn = (this.scYear + 1);
  //       this.thirdColumn = this.selectedRow.second_year;
  //       this.fourthColumn = 0;
  //       this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_year + this.second_year;
  //     } else if (this.scYear == 3) {
  //       this.firstColumn = '3RD';
  //       this.secondColumn = (this.scYear + 1);
  //       this.thirdColumn = this.selectedRow.third_year;
  //       this.fourthColumn = 0;
  //       this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_year + this.second_year + this.third_year;
  //     } else if (this.scYear == 4) {
  //       this.firstColumn = '4TH';
  //       this.secondColumn = (this.scYear + 1);
  //       this.thirdColumn = this.selectedRow.fourth_year;
  //       this.fourthColumn = 0;
  //       this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_year + this.second_year + this.third_year + this.fourth_year;
  //     } else if (this.scYear == 5) {
  //       this.firstColumn = '5TH';
  //       this.secondColumn = (this.scYear + 1);
  //       this.thirdColumn = this.selectedRow.fifth_year;
  //       this.fourthColumn = 0;
  //       this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_year + this.second_year + this.third_year + this.fourth_year + this.fifth_year;
  //     }
  //   }
  // }

}
