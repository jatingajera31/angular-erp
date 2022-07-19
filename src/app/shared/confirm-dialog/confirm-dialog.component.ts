import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';  
  
@Component({  
    selector: 'app-confirm-dialog',  
    templateUrl: 'confirm-dialog.component.html',  
    styleUrls: ['confirm-dialog.component.css']  
})  
  
export class ConfirmDialogComponent implements OnInit {  
    @Input() MessageText:any;
    @Input() MessageTitle:any;
    @Input() SaveBtn:string = "Yes";
    @Input() CancelBtn:string = "No";
    @Input() ActionType:string = "";
    @Output() saveAction = new EventEmitter<any>();
    
    constructor() { }  
  
    ngOnInit(): any {
    }  

    saveModal() {
        this.saveAction.emit({status: true, type: this.ActionType});
    }

    closeModal() {
        this.saveAction.emit({status: false, type: this.ActionType});
    }
}  