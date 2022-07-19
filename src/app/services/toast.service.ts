import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ToastService {

  constructor(private toastr: ToastrService) {}

  public success(title:string, message:string) {
    this.toastr.success(message, title, { timeOut: 3000, enableHtml: true, closeButton: true, positionClass: 'toast-center-center', });
  }

  public error(title:string, message:string) {
    this.toastr.error(message, title, { timeOut: 3000, enableHtml: true, closeButton: true, positionClass: 'toast-center-center', });
  }

  public warning(title:string, message:string) {
    this.toastr.warning(message, title, { timeOut: 3000, enableHtml: true, closeButton: true, positionClass: 'toast-center-center', });
  }

  public info(title:string, message:string) {
    this.toastr.info(message, title, { timeOut: 3000, enableHtml: true, closeButton: true, positionClass: 'toast-center-center', });
  }
}