import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  Name:any;
  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.me().subscribe((data:any) => {
      this.Name = data['first_name'] + ' ' + data['father_name'];
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/']);
  }

}
