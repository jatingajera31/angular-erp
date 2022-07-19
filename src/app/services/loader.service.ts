import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Injectable({
  providedIn: 'root'
})

export class LoaderService {

  constructor(private ngxService: NgxUiLoaderService) {}

  start() {
    this.ngxService.start();
  }

  stop() {
    this.ngxService.stop();
  }
}