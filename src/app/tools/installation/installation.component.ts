import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-installation',
  templateUrl: './installation.component.html',
  styleUrls: ['./installation.component.css']
})
export class InstallationComponent implements OnInit {

  invalidForm = false;
  showAddItemModal = false;
  editMode = false;
  editIndex:any;
  installations : any[] = [];
  designations : any[] = [];
  sourceType: any = null;
  yieldRate: any;
  benificiaryTitle: any;
  benificiaryType: any = null;
  totalContribution: any;
  constructor(private toastr: ToastService, private fb: FormBuilder, private loader: LoaderService, private apiService: ApiService) {
    this.getDesignation();
  }

  ngOnInit(): void {
    
  }

  getDesignation() {
    this.loader.start();
    this.apiService.getDesignation({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.designations = data['data'];
        this.getInstallation();
      }
    });
  }

  getInstallation() {
    this.apiService.getInstallation({}).subscribe(data => {
      let olditems:any = data['data'];
      olditems.forEach((item: any) => {
        let desc:any = [];
        this.designations.forEach((des: any) => {
          let checked = false;
          item.designations.forEach((row: any) => {
            if (row.role_id == des.id) {
              checked = true;
            }
          });
          desc.push({
            id: des.id,
            title: des.title,
            checked: checked
          });
        });
        item.designations = desc;
      });
      this.installations = olditems;
      if (this.installations.length) {
        this.sourceType = this.installations[0].yield_applicable;
        this.yieldRate = this.installations[0].yield_rate;
      }
      this.loader.stop();
    });
  }

  checkUncheckItem(i: any, j: any) {
    if (this.installations[i].designations[j].checked) {
      let checkedids: any = [];
      let exist = false;
      this.installations.forEach((row: any) => {
        row.designations.forEach((item: any) => {
          if (item.checked) {
            if (checkedids.indexOf(item.id) != -1) {
              exist = true;
            } else {
              checkedids.push(item.id);
            }
          }
        });
      });

      if (exist) {
        this.toastr.error('ERROR', 'Hey, you can not add Benificiery in more than one benificiery group.');
        setTimeout(() => {
          this.installations[i].designations[j].checked = false;
        },300)
      }
    }
    
  }

  addDis() {
    this.editMode = false;
    this.editIndex = null;
    this.benificiaryTitle = null;
    this.benificiaryType = null;
    this.totalContribution = null;
    this.showAddItemModal = true;
  }

  editItem(ins: any, i: any) {
    this.benificiaryTitle = ins.benificiary_title;
    this.benificiaryType = ins.benificiary_type;
    this.totalContribution = ins.contribution;
    this.editMode = true;
    this.editIndex = i;
    this.showAddItemModal = true;
  }

  deleteItem(ins: any, i: any) {
    this.installations.splice(i, 1);
  }

  addItem() {
    if (this.benificiaryTitle && this.totalContribution) {
      let isMajor = 0;
      let percent = this.totalContribution;
      let inValidName = false;
      this.installations.forEach((item, key) => {
        if (key != this.editIndex) {
          percent += parseFloat(item.contribution);
          if (item.benificiary_title == this.benificiaryTitle) {
            inValidName = true;
          }
          if (item.benificiary_type == 'Major') {
            isMajor++;
          }
        }
      });

      if (inValidName) {
        this.toastr.error('ERROR', 'Benificiary Group is already exist.');
        return;
      }

      if (percent > 100) {
        this.toastr.error('ERROR', 'Hey, total contribution % can not be more than 100% among all benificary groups. Revise benificary groups contribution planning.');
        return;
      }

      if (isMajor > 0 && this.benificiaryType == 'Major') {
        this.toastr.error('ERROR', 'Hey, Major Benificary type already selected.');
        return;
      }

      if (this.editMode) {
        this.installations[this.editIndex].benificiary_title = this.benificiaryTitle;
        this.installations[this.editIndex].benificiary_type = this.benificiaryType;
        this.installations[this.editIndex].contribution = this.totalContribution;
      } else {
        let desc:any = [];
        this.designations.forEach((item) => {
          desc.push({
            id: item.id,
            title: item.title,
            checked: false
          });
        });
        this.installations.push({
          benificiary_title: this.benificiaryTitle,
          contribution: this.totalContribution,
          benificiary_type: this.benificiaryType,
          designations: desc
        });
      }

      this.showAddItemModal = false;
    }
  }

  removeInstallations(i: any) {
    this.installations.splice(i, 1);
  }

  isValid(value: any) {
    return (value === '');
  }

  saveRate() {

    this.invalidForm = false;
    if (this.installations.length && this.sourceType && this.yieldRate) {
      this.installations.forEach((item) => {
        if (this.isValid(item.lower_rate) || this.isValid(item.upper_rate))  {
          this.invalidForm = true;
        }
      });

      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid range.');
        return;
      }

      this.loader.start();
      this.apiService.saveInstallation({ items: this.installations, yield_applicable: this.sourceType, yield_rate: this.yieldRate }).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          this.toastr.success('SUCCESS', 'Installation Data Submit Successfully.');
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }
      });
    } else {
      if (this.invalidForm) {
        this.toastr.error('ERROR', 'Please enter valid range.');
        return;
      }
    }

  }

  calculateRate() {
    if (this.yieldRate) {
      this.installations.forEach((item) => {
        if (item.lower_rate && item.upper_rate) {
          let amount = ((item.lower_rate + item.upper_rate) * this.yieldRate) / 100;
          item.amount = amount / 2;
        } else {
          item.amount = 0;
        }
      });
    }
  }

}
