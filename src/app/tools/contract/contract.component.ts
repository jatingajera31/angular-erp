import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

  installations : any[] = [];
  productGroups : any[] = [];
  accounts : any[] = [];
  locations : any[] = [];
  products : any[] = [];
  projects : any[] = [];
  productLife : any[] = [];
  distanceLife : any[] = [];
  group_id: any = null;
  sc_type: any = null;
  client_id: any = null;
  location_id: any = null;
  project_id: any = null;
  distanceKm: any = null;
  distanceVariable: any = null;
  lifeVariable: any = 1;
  invalidForm = false;
  showPreview = false;
  showResult = false;
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
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.getProductGroup();
    this.getAccounts();
    this.getLocation();
    this.getProject();
    this.getSupply();
    this.getDistance();
  }

  ngOnInit(): void {
  }

  getAccounts() {
    this.apiService.getAccount({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.accounts = data['data'];
      }
    });
  }

  getLocation() {
    this.apiService.getLocation({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.locations = data['data'];
      }
    });
  }

  getProject() {
    this.apiService.getProject({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.projects = data['data'];
      }
    });
  }

  getSupply() {
    this.apiService.getSupply({}).subscribe(data => {
      this.productLife = data['data'];
    });
  }

  getDistance() {
    this.apiService.getDistance({}).subscribe(data => {
      this.distanceLife = data['data'];
    });
  }

  getProductGroup() {
    this.apiService.getProductGroup({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.productGroups = data['data'];
      }
    });
  }

  getProducts() {
    if (this.group_id && this.sc_type) {
      this.loader.start();
      this.apiService.getProductContract({group_id: this.group_id, sc_type: this.sc_type}).subscribe(data => {
        if (data && data['status'] == 1) {
          this.products = data['data'];
          this.installations = [];
          this.products.forEach((item) => {
            let rate_addon = (this.sc_type == 'Comprehensive') ? item.sc_rate_comprehensive_rate: item.sc_rate_non_comprehensive_rate;
            let year_increment = (this.sc_type == 'Comprehensive') ? item.sc_rate_comprehensive_yearly_increment: item.sc_rate_non_comprehensive_yearly_increment;
            let first_colm = 0;
            let second_colm = 0;
            let third_colm = 0;
            let fourth_colm = 0;
            let fifth_colm = 0;
            let six_colm = 0;
            let distance_variable = 0;
            let life_variable = 0;
            this.installations.push({
              product_category: item.category.name,
              model_no: item.model_no,
              group_id: this.group_id,
              category_id: item.category_id,
              product_id: item.id,
              unit_rate: item.max_retail_price,
              sc_rate: item.sc_rate,
              rate_addon: rate_addon,
              year_increment: year_increment,
              distance_variable: distance_variable,
              life_variable: life_variable,
              sc_month: (item.sc_month) ? item.sc_month: 6,
              first_colm: first_colm,
              second_colm: second_colm,
              third_colm: third_colm,
              fourth_colm: fourth_colm,
              fifth_colm: fifth_colm,
              six_colm: six_colm
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
        if (item.year_increment) {
          item.second_colm = item.first_colm + ((item.first_colm * item.year_increment) / 100);
          item.third_colm = item.second_colm + ((item.second_colm * item.year_increment) / 100);
          item.fourth_colm = item.third_colm + ((item.third_colm * item.year_increment) / 100);
          item.fifth_colm = item.fourth_colm + ((item.fourth_colm * item.year_increment) / 100);
          item.six_colm = item.fifth_colm + ((item.fifth_colm * item.year_increment) / 100);

          item.second_colm = Math.floor(item.second_colm * 100) / 100;
          item.third_colm = Math.floor(item.third_colm * 100) / 100;
          item.fourth_colm = Math.floor(item.fourth_colm * 100) / 100;
          item.fifth_colm = Math.floor(item.fifth_colm * 100) / 100;
          item.six_colm = Math.floor(item.six_colm * 100) / 100;
        }
      } else {
        item.first_colm = 0;
        item.second_colm = 0;
        item.third_colm = 0;
        item.fourth_colm = 0;
        item.fifth_colm = 0;
        item.six_colm = 0;
      }
    });
  }

  makeRate(selectedRow: any, colm: any) {
    let vs: number = Number((selectedRow['unit_rate'] * colm) / 100) * Number(selectedRow['distance_variable']) * Number(selectedRow['life_variable']);
    console.log(vs)
    return vs;
  }

  showData() {
    if (this.isValid(this.client_id) && this.isValid(this.distanceKm) && this.isValid(this.location_id) && this.isValid(this.distanceVariable) && this.isValid(this.project_id)) {
      // this.lifeVariable = 1;
      this.showResult = true;
    } else {
      this.toastr.error('ERROR', 'Please enter client information data.');
    }
  }

  closeShow() {
    this.client_id = null;
    this.distanceKm = null;
    this.location_id = null;
    this.distanceVariable = null;
    this.project_id = null;
    this.showPreview = false;
  }

  clearBack() {
    this.client_id = null;
    this.distanceKm = null;
    this.location_id = null;
    this.distanceVariable = null;
    this.project_id = null;
    this.showResult = false;
  }

  changeDistance() {
    if (this.distanceKm > -1) {
      let ss = this.distanceLife.filter((item) => {
        return (this.distanceKm >= item.range_from && this.distanceKm <= item.range_to);
      });
      if (ss.length) {
        this.distanceVariable = ss[0].range_variable;
        this.installations.forEach((item) => {
          item.distance_variable = ss[0].range_variable;
          item.life_variable = this.lifeVariable;
        });
      }
    }
  }

  undo() {
    this.installations = [];
    this.group_id = null;
    this.sc_type = null;
  }

  saveRate() {
    this.invalidForm = false;
    if (this.installations.length && this.group_id && this.sc_type) {
      this.loader.start();
      this.apiService.saveContract({ items: this.installations, group_id: this.group_id, sc_type: this.sc_type }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Service Contract Data Submit Successfully.');
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
    if (!item.sc_rate) {
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
    this.showResult = false;
    this.showPreview = true;
    this.first_colm = (item.unit_rate * item.first_colm) / 100;
    this.second_colm = (item.unit_rate * item.second_colm) / 100;
    this.third_colm = (item.unit_rate * item.third_colm) / 100;
    this.fourth_colm = (item.unit_rate * item.fourth_colm) / 100;
    this.fifth_colm = (item.unit_rate * item.fifth_colm) / 100;
    this.six_colm = (item.unit_rate * item.six_colm) / 100;
  }

  viewResult() {
    if (this.scYear > 0 && this.scYear < 6) {
      if (this.scYear == 1) {
        this.firstColumn = '1ST';
        this.secondColumn = (this.scYear + 1);
        this.thirdColumn = this.selectedRow.first_colm;
        this.fourthColumn = 0;
        this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_colm;
      } else if (this.scYear == 2) {
        this.firstColumn = '2ND';
        this.secondColumn = (this.scYear + 1);
        this.thirdColumn = this.selectedRow.second_colm;
        this.fourthColumn = 0;
        this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_colm + this.second_colm;
      } else if (this.scYear == 3) {
        this.firstColumn = '3RD';
        this.secondColumn = (this.scYear + 1);
        this.thirdColumn = this.selectedRow.third_colm;
        this.fourthColumn = 0;
        this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_colm + this.second_colm + this.third_colm;
      } else if (this.scYear == 4) {
        this.firstColumn = '4TH';
        this.secondColumn = (this.scYear + 1);
        this.thirdColumn = this.selectedRow.fourth_colm;
        this.fourthColumn = 0;
        this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_colm + this.second_colm + this.third_colm + this.fourth_colm;
      } else if (this.scYear == 5) {
        this.firstColumn = '5TH';
        this.secondColumn = (this.scYear + 1);
        this.thirdColumn = this.selectedRow.fifth_colm;
        this.fourthColumn = 0;
        this.fifthColumn = parseFloat(this.selectedRow.unit_rate) + this.first_colm + this.second_colm + this.third_colm + this.fourth_colm + this.fifth_colm;
      }
    }
  }

  toFixed(value: any) {
    if (value) {
      value = parseFloat(value);
      return value.toFixed(2);
    }
  }

  isValid(value: any) {
    return (value && value != 'null');
  }

}
