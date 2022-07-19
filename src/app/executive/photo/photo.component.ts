import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit {

  cardImageBase64 = './assets/images/user.png';
  userProfile:any;
  constructor(private toastr: ToastService, private apiService: ApiService, private loader: LoaderService) {
    this.getMe();
  }

  ngOnInit(): void {
  }

  getMe() {
    this.loader.start();
    this.apiService.me().subscribe(data => {
      if (data.photo) {
        this.cardImageBase64 = data.photo;
      }
      this.loader.stop();
    });
  }

  updatePhoto() {
    if (!this.userProfile) {
      this.toastr.error('ERROR', 'Please select profile picture.');
      return;
    }

    this.loader.start();
    this.apiService.updatePhoto({ photo: this.userProfile }).subscribe(data => {
      if (data && data['status'] == 1) {
        this.toastr.success('SUCCESS', 'Progile Photo Updated Successfully.'); 
      }
      if (data['status'] == 0) {
        for(var r in data['data']) {
          this.toastr.error('Error', data['data'][r]);    
        }
      }
      this.userProfile = null;
      this.loader.stop();
    });
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.cardImageBase64 = e.target.result;
          this.userProfile = e.target.result;
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

}
