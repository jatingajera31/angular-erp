import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  AddressAreaName:any;
  AddressCity:any;
  AddressCityName:any;
  AddressState:any;
  AddressStateName:any;
  AddressCountry:any;
  AddressCountryName:any;
  areaDrp : any[] = [];
  cityDrp : any[] = [];
  stateDrp : any[] = [];
  countryDrp : any[] = [];
  showAddressOne = false;
  showArea = false;
  showCity = false;
  showState = false;
  showCountry = false;
  @Input() FullAddress:any;
  @Input() AddressOne:any;
  @Input() AddressTwo:any;
  @Input() AddressPincode:any;
  @Input() AddressArea:any = null;
  @Input() placeholder = 'Address';
  @Input() defaultObj = null;
  @Input() IsDisabled = false;
  @Input() dropdowns : any;
  @Output() setAddress = new EventEmitter<any>();
  
  constructor(private apiService: ApiService, private loader: LoaderService) {
  }

  ngOnInit(): void {
    this.areaDrp = this.dropdowns['area'];
    this.cityDrp = this.dropdowns['city'];
    this.stateDrp = this.dropdowns['state'];
    this.countryDrp = this.dropdowns['country'];
  }

  showAddressOneModal() {
    this.showAddressOne = true;  
  }

  saveAddressOne() {
    let address = {
      full_address: '',
      address_one: this.AddressOne,
      address_two: this.AddressTwo,
      pincode: this.AddressPincode,
      area_name: this.AddressAreaName,
      city_name: this.AddressCityName,
      state_name: this.AddressStateName,
      country_name: this.AddressCountryName,
      area_id: this.AddressArea,
      city_id: this.AddressCity,
      state_id: this.AddressState,
      country_id: this.AddressCountry
    }

    let newAddress : any[] = [];
    if (this.AddressOne) {
      newAddress.push(this.AddressOne);
    }
    if (this.AddressTwo) {
      newAddress.push(this.AddressTwo);
    }

    if (this.showArea && this.AddressAreaName) {
      address.area_id = null;
      if (this.showCity)  {
        address.city_id = null;
      } else {
        address.city_name = null;
      }
      if (this.showState)  {
        address.state_id = null;
      } else {
        address.state_name = null;
      }
      if (this.showCountry)  {
        address.country_id = null;
      } else {
        address.country_name = null;
      }
      this.loader.start();
      this.apiService.saveAddress(address).subscribe(data => {
        this.loader.stop();
        if (data && data['status'] == 1) {
          newAddress.push(data['data'].name);
          let ct = data['data'].city.name;
          if (this.AddressPincode) {
            ct += '-' + this.AddressPincode;
          }
          newAddress.push(ct);
          newAddress.push('(' + data['data'].state.name + ')');
          newAddress.push(data['data'].country.name);
          const stringAddress = newAddress;
          address.full_address = stringAddress.join(', ');    
          address.area_id = data['data'].id;    
          this.FullAddress = stringAddress.join(', ');    
          this.showAddressOne = false;
          this.setAddress.emit(address);
        }
      });
    } else {
      for(let i in this.areaDrp) {
        if (this.areaDrp[i].id == this.AddressArea) {
          newAddress.push(this.areaDrp[i].name);
          let ct = this.areaDrp[i].city.name;
          if (this.AddressPincode) {
            ct += '-' + this.AddressPincode;
          }
          newAddress.push(ct);
          newAddress.push('(' + this.areaDrp[i].state.name + ')');
          newAddress.push(this.areaDrp[i].country.name);
        }
      }
      const stringAddress = newAddress;
      address.full_address = stringAddress.join(', ');    
      address.area_id = this.AddressArea;   
      this.FullAddress = stringAddress.join(', ');    
      this.setAddress.emit(address);
      this.showAddressOne = false;
    }
  }

}
