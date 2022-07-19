import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginObj = {
		username: '',
		password: ''
	}
  constructor(private apiService: ApiService, private toastr: ToastService, private loader: LoaderService, private router: Router) { }

  ngOnInit(): void {
  }

  doLogin() {

    if (this.loginObj.username && this.loginObj.password) {
      console.log(this.loader);
      this.loader.start();
      this.apiService.login(this.loginObj).subscribe(data => {
        this.loader.stop();
        if (data['access_token']) {
        	localStorage.setItem('access_token', data['access_token']);
          localStorage.setItem('token_id', data['token_id']);
        	this.apiService.setToken(data['access_token']);
          this.apiService.publishData(true);
          this.router.navigate(['/actions']);
        }
        if (data['status'] == 0) {
          for(var r in data['data']) {
            this.toastr.error('Error', data['data'][r]);    
          }
        }

      }, error => {
        this.toastr.error('Error', error?.message);
      });
    }
  }

}
