import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {

  actions : any[] = [];
  constructor(private toastr: ToastService, private loader: LoaderService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {
    this.getAction();
  }

  ngOnInit(): void {
  }

  getAction() {
    this.loader.start();
    this.apiService.getAction({}).subscribe(data => {
      if (data && data['status'] == 1) {
        this.actions = data['data'];
      }
      this.loader.stop();
    });
  }

}
