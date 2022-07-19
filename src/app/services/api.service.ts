import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loginCheck = new Subject<any>();
  public changeCount = new Subject<string>();
	// baseUrl:string = "http://127.0.0.1:8000/api/";
  baseUrl:string = "https://api.earthcontrolsys.com/api/";
  access_token:string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kZXYuZGVzdGlueWNlcmFtaWMuY29tXC9hcGlcL2xvZ2luIiwiaWF0IjoxNjAyMzMyNjI4LCJleHAiOjE2MDIzMzYyMjgsIm5iZiI6MTYwMjMzMjYyOCwianRpIjoiVnpweHJMMUt3QWYzRk5TaCIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.1hfPI1WPkc_JKiHS5O2TQBh7NG_kjWim7w0kuAfjUyY';
	httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) {
    let access_token = localStorage.getItem('access_token');
    if (access_token) {
      this.httpOptions.headers.set("Authorization", "Bearer " + this.access_token);
      this.access_token = access_token;
    }
  }

  applyNotificationCount(text: string) {
    this.changeCount.next(text);
  }

  publishData(data: any) {
    this.loginCheck.next(data);
  }

  getObservableData(): Subject<any> {
    return this.loginCheck;
  }

  setToken(access_token:any) {
    this.access_token = access_token;
    this.httpOptions.headers.set("Authorization", "Bearer " + this.access_token);
  }

  me(): Observable<any> {
    const url = this.baseUrl + 'me';
    return this.http.post<any>(url, {});
  }

  updatePassword(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/password';
    return this.http.post<any>(url, param);
  }

  verifyPassword(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/password/verify';
    return this.http.post<any>(url, param);
  }

  updatePhoto(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/photo';
    return this.http.post<any>(url, param);
  }

  getAllAddress(param: any): Observable<any> {
    const url = this.baseUrl + 'address';
    return this.http.post<any>(url, param);
  }

  saveAddress(param: any): Observable<any> {
    const url = this.baseUrl + 'address/save';
    return this.http.post<any>(url, param);
  }

  getAction(param: any): Observable<any> {
    const url = this.baseUrl + 'actions';
    return this.http.post<any>(url, param);
  }

  getStaffs(param: any): Observable<any> {
    const url = this.baseUrl + 'staff';
    return this.http.post<any>(url, param);
  }

  getStaffStatus(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/status';
    return this.http.post<any>(url, param);
  }

  saveStaffStatus(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/save-status';
    return this.http.post<any>(url, param);
  }

  saveStaff(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/store';
    return this.http.post<any>(url, param);
  }

  updateStaff(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/update';
    return this.http.post<any>(url, param);
  }

  showStaff(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/show';
    return this.http.post<any>(url, param);
  }

  deleteStaff(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/delete';
    return this.http.post<any>(url, param);
  }

  allStaff(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/executives';
    return this.http.post<any>(url, param);
  }

  myStaff(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/all';
    return this.http.post<any>(url, param);
  }

  allRoles(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/roles';
    return this.http.post<any>(url, param);
  }

  getDesignation(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/roles';
    return this.http.post<any>(url, param);
  }

  saveDesignation(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/save-roles';
    return this.http.post<any>(url, param);
  }

  getDeliveredBy(param: any): Observable<any> {
    const url = this.baseUrl + 'delivered-by';
    return this.http.post<any>(url, param);
  }

  saveDeliveredBy(param: any): Observable<any> {
    const url = this.baseUrl + 'delivered-by/store';
    return this.http.post<any>(url, param);
  }

  getDepartment(param: any): Observable<any> {
    const url = this.baseUrl + 'department';
    return this.http.post<any>(url, param);
  }

  saveDepartment(param: any): Observable<any> {
    const url = this.baseUrl + 'department/store';
    return this.http.post<any>(url, param);
  }

  getLookup(param: any): Observable<any> {
    const url = this.baseUrl + 'lookup';
    return this.http.post<any>(url, param);
  }

  saveLookup(param: any): Observable<any> {
    const url = this.baseUrl + 'lookup/store';
    return this.http.post<any>(url, param);
  }

  updateLookup(param: any): Observable<any> {
    const url = this.baseUrl + 'lookup/update';
    return this.http.post<any>(url, param);
  }

  getLocation(param: any): Observable<any> {
    const url = this.baseUrl + 'location';
    return this.http.post<any>(url, param);
  }

  saveLocation(param: any): Observable<any> {
    const url = this.baseUrl + 'location/store';
    return this.http.post<any>(url, param);
  }

  updateLocation(param: any): Observable<any> {
    const url = this.baseUrl + 'location/update';
    return this.http.post<any>(url, param);
  }

  getProject(param: any): Observable<any> {
    const url = this.baseUrl + 'project';
    return this.http.post<any>(url, param);
  }

  saveProject(param: any): Observable<any> {
    const url = this.baseUrl + 'project/store';
    return this.http.post<any>(url, param);
  }

  updateProject(param: any): Observable<any> {
    const url = this.baseUrl + 'project/update';
    return this.http.post<any>(url, param);
  }

  getTransport(param: any): Observable<any> {
    const url = this.baseUrl + 'transport';
    return this.http.post<any>(url, param);
  }

  saveTransport(param: any): Observable<any> {
    const url = this.baseUrl + 'transport/store';
    return this.http.post<any>(url, param);
  }

  updateDepartment(param: any): Observable<any> {
    const url = this.baseUrl + 'department/update';
    return this.http.post<any>(url, param);
  }

  getRelation(param: any): Observable<any> {
    const url = this.baseUrl + 'relation';
    return this.http.post<any>(url, param);
  }

  saveRelation(param: any): Observable<any> {
    const url = this.baseUrl + 'relation/store';
    return this.http.post<any>(url, param);
  }

  updateRelation(param: any): Observable<any> {
    const url = this.baseUrl + 'relation/update';
    return this.http.post<any>(url, param);
  }

  getAccountInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'account-info';
    return this.http.post<any>(url, param);
  }

  getAccountInfoByInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'account-info/list-by-type';
    return this.http.post<any>(url, param);
  }

  saveAccountInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'account-info/store';
    return this.http.post<any>(url, param);
  }

  updateAccountInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'account-info/update';
    return this.http.post<any>(url, param);
  }

  deleteAccountInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'account-info/delete';
    return this.http.post<any>(url, param);
  }

  getCurrency(param: any): Observable<any> {
    const url = this.baseUrl + 'currency';
    return this.http.post<any>(url, param);
  }

  showCurrency(param: any): Observable<any> {
    const url = this.baseUrl + 'currency/show';
    return this.http.post<any>(url, param);
  }

  saveCurrency(param: any): Observable<any> {
    const url = this.baseUrl + 'currency/store';
    return this.http.post<any>(url, param);
  }

  updateCurrency(param: any): Observable<any> {
    const url = this.baseUrl + 'currency/update';
    return this.http.post<any>(url, param);
  }

  deleteCurrency(param: any): Observable<any> {
    const url = this.baseUrl + 'currency/delete';
    return this.http.post<any>(url, param);
  }

  getAccount(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts';
    return this.http.post<any>(url, param);
  }

  getClients(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/client';
    return this.http.post<any>(url, param);
  }

  editClients(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/edit-client';
    return this.http.post<any>(url, param);
  }

  editSuppliers(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/edit-supplier';
    return this.http.post<any>(url, param);
  }

  getAccountNo(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/account-no';
    return this.http.post<any>(url, param);
  }

  saveAccount(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/store';
    return this.http.post<any>(url, param);
  }

  updateAccount(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/update';
    return this.http.post<any>(url, param);
  }

  showAccount(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/show';
    return this.http.post<any>(url, param);
  }

  deleteAccount(param: any): Observable<any> {
    const url = this.baseUrl + 'accounts/delete';
    return this.http.post<any>(url, param);
  }

  getInstaPlanning(param: any): Observable<any> {
    const url = this.baseUrl + 'installation-planning';
    return this.http.post<any>(url, param);
  }

  getInstaPlanningNo(param: any): Observable<any> {
    const url = this.baseUrl + 'installation-planning/no';
    return this.http.post<any>(url, param);
  }

  saveInstaPlanning(param: any): Observable<any> {
    const url = this.baseUrl + 'installation-planning/store';
    return this.http.post<any>(url, param);
  }

  updateInstaPlanning(param: any): Observable<any> {
    const url = this.baseUrl + 'installation-planning/update';
    return this.http.post<any>(url, param);
  }

  showInstaPlanning(param: any): Observable<any> {
    const url = this.baseUrl + 'installation-planning/show';
    return this.http.post<any>(url, param);
  }

  deleteInstaPlanning(param: any): Observable<any> {
    const url = this.baseUrl + 'installation-planning/delete';
    return this.http.post<any>(url, param);
  }

  getPreCommissioning(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-commissioning';
    return this.http.post<any>(url, param);
  }

  getPreCommissioningNo(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-commissioning/no';
    return this.http.post<any>(url, param);
  }

  savePreCommissioning(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-commissioning/store';
    return this.http.post<any>(url, param);
  }

  updatePreCommissioning(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-commissioning/update';
    return this.http.post<any>(url, param);
  }

  showPreCommissioning(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-commissioning/show';
    return this.http.post<any>(url, param);
  }

  deletePreCommissioning(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-commissioning/delete';
    return this.http.post<any>(url, param);
  }

  getItemInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'item-installation';
    return this.http.post<any>(url, param);
  }

  getItemInstallationNo(param: any): Observable<any> {
    const url = this.baseUrl + 'item-installation/no';
    return this.http.post<any>(url, param);
  }

  saveItemInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'item-installation/store';
    return this.http.post<any>(url, param);
  }

  updateItemInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'item-installation/update';
    return this.http.post<any>(url, param);
  }

  showItemInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'item-installation/show';
    return this.http.post<any>(url, param);
  }

  deleteItemInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'item-installation/delete';
    return this.http.post<any>(url, param);
  }

  getItemLost(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost';
    return this.http.post<any>(url, param);
  }

  getItemLostNo(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost/no';
    return this.http.post<any>(url, param);
  }

  saveItemLost(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost/store';
    return this.http.post<any>(url, param);
  }

  updateItemLost(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost/update';
    return this.http.post<any>(url, param);
  }

  showItemLost(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost/show';
    return this.http.post<any>(url, param);
  }

  deleteItemLost(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost/delete';
    return this.http.post<any>(url, param);
  }

  ItemLostApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'item-lost/approved';
    return this.http.post<any>(url, param);
  }

  getItemScrapChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan';
    return this.http.post<any>(url, param);
  }

  getItemScrapChallanNo(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan/no';
    return this.http.post<any>(url, param);
  }

  saveItemScrapChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan/store';
    return this.http.post<any>(url, param);
  }

  updateItemScrapChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan/update';
    return this.http.post<any>(url, param);
  }

  showItemScrapChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan/show';
    return this.http.post<any>(url, param);
  }

  deleteItemScrapChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan/delete';
    return this.http.post<any>(url, param);
  }

  ItemScrapChallanApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap-challan/approved';
    return this.http.post<any>(url, param);
  }

  getItemScrap(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap';
    return this.http.post<any>(url, param);
  }

  getItemScrapNo(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap/no';
    return this.http.post<any>(url, param);
  }

  saveItemScrap(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap/store';
    return this.http.post<any>(url, param);
  }

  updateItemScrap(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap/update';
    return this.http.post<any>(url, param);
  }

  showItemScrap(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap/show';
    return this.http.post<any>(url, param);
  }

  deleteItemScrap(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap/delete';
    return this.http.post<any>(url, param);
  }

  ItemScrapApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'item-scrap/approved';
    return this.http.post<any>(url, param);
  }

  getDemoCount(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/count';
    return this.http.post<any>(url, param);
  }

  getDemoDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand';
    return this.http.post<any>(url, param);
  }

  getDemoDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/no';
    return this.http.post<any>(url, param);
  }

  saveDemoDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/store';
    return this.http.post<any>(url, param);
  }

  updateDemoDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/update';
    return this.http.post<any>(url, param);
  }

  showDemoDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/show';
    return this.http.post<any>(url, param);
  }

  deleteDemoDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/delete';
    return this.http.post<any>(url, param);
  }

  demoDemandApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/approved';
    return this.http.post<any>(url, param);
  }

  demoDemandCancel(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/demand/cancel';
    return this.http.post<any>(url, param);
  }

  getDemoDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/dispatch';
    return this.http.post<any>(url, param);
  }

  getDemoDispatchNo(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/dispatch/no';
    return this.http.post<any>(url, param);
  }

  saveDemoDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/dispatch/store';
    return this.http.post<any>(url, param);
  }

  updateDemoDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/dispatch/update';
    return this.http.post<any>(url, param);
  }

  showDemoDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/dispatch/show';
    return this.http.post<any>(url, param);
  }

  deleteDemoDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/dispatch/delete';
    return this.http.post<any>(url, param);
  }

  getDemoReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/receipt';
    return this.http.post<any>(url, param);
  }

  getDemoReceiptNo(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/receipt/no';
    return this.http.post<any>(url, param);
  }

  saveDemoReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/receipt/store';
    return this.http.post<any>(url, param);
  }

  updateDemoReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/receipt/update';
    return this.http.post<any>(url, param);
  }

  showDemoReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/receipt/show';
    return this.http.post<any>(url, param);
  }

  deleteDemoReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'demo/receipt/delete';
    return this.http.post<any>(url, param);
  }

  getSampleCount(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/count';
    return this.http.post<any>(url, param);
  }

  getSampleDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand';
    return this.http.post<any>(url, param);
  }

  getSampleDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/no';
    return this.http.post<any>(url, param);
  }

  saveSampleDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/store';
    return this.http.post<any>(url, param);
  }

  updateSampleDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/update';
    return this.http.post<any>(url, param);
  }

  showSampleDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/show';
    return this.http.post<any>(url, param);
  }

  deleteSampleDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/delete';
    return this.http.post<any>(url, param);
  }

  SampleDemandApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/approved';
    return this.http.post<any>(url, param);
  }

  sampleDemandCancel(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/demand/cancel';
    return this.http.post<any>(url, param);
  }

  getSampleDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/dispatch';
    return this.http.post<any>(url, param);
  }

  getSampleDispatchNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/dispatch/no';
    return this.http.post<any>(url, param);
  }

  saveSampleDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/dispatch/store';
    return this.http.post<any>(url, param);
  }

  updateSampleDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/dispatch/update';
    return this.http.post<any>(url, param);
  }

  showSampleDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/dispatch/show';
    return this.http.post<any>(url, param);
  }

  deleteSampleDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/dispatch/delete';
    return this.http.post<any>(url, param);
  }

  getSampleReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/receipt';
    return this.http.post<any>(url, param);
  }

  getSampleReceiptNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/receipt/no';
    return this.http.post<any>(url, param);
  }

  saveSampleReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/receipt/store';
    return this.http.post<any>(url, param);
  }

  updateSampleReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/receipt/update';
    return this.http.post<any>(url, param);
  }

  showSampleReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/receipt/show';
    return this.http.post<any>(url, param);
  }

  deleteSampleReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'sample/receipt/delete';
    return this.http.post<any>(url, param);
  }

  getSpareCount(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/count';
    return this.http.post<any>(url, param);
  }

  getSpareDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand';
    return this.http.post<any>(url, param);
  }

  getSpareDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/no';
    return this.http.post<any>(url, param);
  }

  saveSpareDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/store';
    return this.http.post<any>(url, param);
  }

  updateSpareDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/update';
    return this.http.post<any>(url, param);
  }

  showSpareDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/show';
    return this.http.post<any>(url, param);
  }

  deleteSpareDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/delete';
    return this.http.post<any>(url, param);
  }

  SpareDemandApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/approved';
    return this.http.post<any>(url, param);
  }

  spareDemandCancel(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/demand/cancel';
    return this.http.post<any>(url, param);
  }

  getSpareDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/dispatch';
    return this.http.post<any>(url, param);
  }

  getSpareDispatchNo(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/dispatch/no';
    return this.http.post<any>(url, param);
  }

  saveSpareDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/dispatch/store';
    return this.http.post<any>(url, param);
  }

  updateSpareDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/dispatch/update';
    return this.http.post<any>(url, param);
  }

  showSpareDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/dispatch/show';
    return this.http.post<any>(url, param);
  }

  deleteSpareDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/dispatch/delete';
    return this.http.post<any>(url, param);
  }

  getSpareReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/receipt';
    return this.http.post<any>(url, param);
  }

  getSpareReceiptNo(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/receipt/no';
    return this.http.post<any>(url, param);
  }

  saveSpareReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/receipt/store';
    return this.http.post<any>(url, param);
  }

  updateSpareReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/receipt/update';
    return this.http.post<any>(url, param);
  }

  showSpareReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/receipt/show';
    return this.http.post<any>(url, param);
  }

  deleteSpareReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'spare/receipt/delete';
    return this.http.post<any>(url, param);
  }

  getReplaceDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand';
    return this.http.post<any>(url, param);
  }

  getReplaceQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/qr-code';
    return this.http.post<any>(url, param);
  }

  getReplaceDemandProducts(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/products';
    return this.http.post<any>(url, param);
  }

  getReplaceDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/no';
    return this.http.post<any>(url, param);
  }

  saveReplaceDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/store';
    return this.http.post<any>(url, param);
  }

  updateReplaceDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/update';
    return this.http.post<any>(url, param);
  }

  showReplaceDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/show';
    return this.http.post<any>(url, param);
  }

  deleteReplaceDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/delete';
    return this.http.post<any>(url, param);
  }

  ReplaceDemandApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/approved';
    return this.http.post<any>(url, param);
  }

  replaceDemandSaveNotification(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/demand/notification-save';
    return this.http.post<any>(url, param);
  }

  getReplaceReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return';
    return this.http.post<any>(url, param);
  }

  getReplaceReturnQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return/qr-code';
    return this.http.post<any>(url, param);
  }

  getReplaceReturnNo(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return/no';
    return this.http.post<any>(url, param);
  }

  saveReplaceReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return/store';
    return this.http.post<any>(url, param);
  }

  updateReplaceReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return/update';
    return this.http.post<any>(url, param);
  }

  showReplaceReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return/show';
    return this.http.post<any>(url, param);
  }

  deleteReplaceReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/return/delete';
    return this.http.post<any>(url, param);
  }

  getReplaceReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt';
    return this.http.post<any>(url, param);
  }

  getReplaceReceiptQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt/qr-code';
    return this.http.post<any>(url, param);
  }

  getReplaceReceiptNo(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt/no';
    return this.http.post<any>(url, param);
  }

  saveReplaceReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt/store';
    return this.http.post<any>(url, param);
  }

  updateReplaceReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt/update';
    return this.http.post<any>(url, param);
  }

  showReplaceReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt/show';
    return this.http.post<any>(url, param);
  }

  deleteReplaceReceipt(param: any): Observable<any> {
    const url = this.baseUrl + 'replace/receipt/delete';
    return this.http.post<any>(url, param);
  }

  getExchangeDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand';
    return this.http.post<any>(url, param);
  }

  getExchangeQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/qr-code';
    return this.http.post<any>(url, param);
  }

  getExchangeDemandProducts(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/products';
    return this.http.post<any>(url, param);
  }

  getExchangeDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/no';
    return this.http.post<any>(url, param);
  }

  saveExchangeDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/store';
    return this.http.post<any>(url, param);
  }

  updateExchangeDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/update';
    return this.http.post<any>(url, param);
  }

  showExchangeDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/show';
    return this.http.post<any>(url, param);
  }

  deleteExchangeDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/delete';
    return this.http.post<any>(url, param);
  }

  ExchangeDemandApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/demand/approved';
    return this.http.post<any>(url, param);
  }

  getExchangeDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/dispatch';
    return this.http.post<any>(url, param);
  }

  getExchangeDispatchNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/dispatch/no';
    return this.http.post<any>(url, param);
  }

  saveExchangeDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/dispatch/store';
    return this.http.post<any>(url, param);
  }

  updateExchangeDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/dispatch/update';
    return this.http.post<any>(url, param);
  }

  showExchangeDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/dispatch/show';
    return this.http.post<any>(url, param);
  }

  deleteExchangeDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/dispatch/delete';
    return this.http.post<any>(url, param);
  }

  getExchangeReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/return';
    return this.http.post<any>(url, param);
  }

  getExchangeReturnNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/return/no';
    return this.http.post<any>(url, param);
  }

  saveExchangeReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/return/store';
    return this.http.post<any>(url, param);
  }

  updateExchangeReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/return/update';
    return this.http.post<any>(url, param);
  }

  showExchangeReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/return/show';
    return this.http.post<any>(url, param);
  }

  deleteExchangeReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-exchange/return/delete';
    return this.http.post<any>(url, param);
  }

  getSupplier(param: any): Observable<any> {
    const url = this.baseUrl + 'suppliers';
    return this.http.post<any>(url, param);
  }

  saveSupplier(param: any): Observable<any> {
    const url = this.baseUrl + 'suppliers/store';
    return this.http.post<any>(url, param);
  }

  updateSupplier(param: any): Observable<any> {
    const url = this.baseUrl + 'suppliers/update';
    return this.http.post<any>(url, param);
  }

  showSupplier(param: any): Observable<any> {
    const url = this.baseUrl + 'suppliers/show';
    return this.http.post<any>(url, param);
  }

  deleteSupplier(param: any): Observable<any> {
    const url = this.baseUrl + 'suppliers/delete';
    return this.http.post<any>(url, param);
  }

  getImport(param: any): Observable<any> {
    const url = this.baseUrl + 'import';
    return this.http.post<any>(url, param);
  }

  saveImport(param: any): Observable<any> {
    const url = this.baseUrl + 'import/store';
    return this.http.post<any>(url, param);
  }

  updateImport(param: any): Observable<any> {
    const url = this.baseUrl + 'import/update';
    return this.http.post<any>(url, param);
  }

  showImport(param: any): Observable<any> {
    const url = this.baseUrl + 'import/show';
    return this.http.post<any>(url, param);
  }

  deleteImport(param: any): Observable<any> {
    const url = this.baseUrl + 'import/delete';
    return this.http.post<any>(url, param);
  }

  getPurchaseNo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/no';
    return this.http.post<any>(url, param);
  }

  getPurchase(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase';
    return this.http.post<any>(url, param);
  }

  savePurchase(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/store';
    return this.http.post<any>(url, param);
  }

  updatePurchase(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/update';
    return this.http.post<any>(url, param);
  }

  approvedPurchase(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/approved';
    return this.http.post<any>(url, param);
  }
  approvalCount(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/approved/count';
    return this.http.post<any>(url, param);
  }

  showPurchase(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/show';
    return this.http.post<any>(url, param);
  }

  deletePurchase(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/delete';
    return this.http.post<any>(url, param);
  }

  checkPurchaseQty(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/check-qty';
    return this.http.post<any>(url, param);
  }

  getInvoiceDetail(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase/invoice-no';
    return this.http.post<any>(url, param);
  }

  getQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return/qr-code';
    return this.http.post<any>(url, param);
  }

  getPurchaseReturnNo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return/no';
    return this.http.post<any>(url, param);
  }

  getPurchaseReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return';
    return this.http.post<any>(url, param);
  }

  savePurchaseReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return/store';
    return this.http.post<any>(url, param);
  }

  updatePurchaseReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return/update';
    return this.http.post<any>(url, param);
  }

  showPurchaseReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return/show';
    return this.http.post<any>(url, param);
  }

  deletePurchaseReturn(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return/delete';
    return this.http.post<any>(url, param);
  }

  getPurchaseReturnDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return-dispatch';
    return this.http.post<any>(url, param);
  }

  getPurchaseReturnDispatchNo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return-dispatch/no';
    return this.http.post<any>(url, param);
  }

  savePurchaseReturnDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return-dispatch/store';
    return this.http.post<any>(url, param);
  }

  updatePurchaseReturnDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return-dispatch/update';
    return this.http.post<any>(url, param);
  }

  showPurchaseReturnDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return-dispatch/show';
    return this.http.post<any>(url, param);
  }

  deletePurchaseReturnDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-return-dispatch/delete';
    return this.http.post<any>(url, param);
  }
  
  getPurchaseOrderNo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/po-no';
    return this.http.post<any>(url, param);
  }

  getPurchaseOrder(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order';
    return this.http.post<any>(url, param);
  }

  getAllPurchaseOrder(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/all';
    return this.http.post<any>(url, param);
  }

  savePurchaseOrder(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/store';
    return this.http.post<any>(url, param);
  }

  updatePurchaseOrder(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/update';
    return this.http.post<any>(url, param);
  }

  showPurchaseOrder(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/show';
    return this.http.post<any>(url, param);
  }

  getPurchaseOrderDetail(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/details';
    return this.http.post<any>(url, param);
  }

  deletePurchaseOrder(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-order/delete';
    return this.http.post<any>(url, param);
  }

  getPurchaseInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-info';
    return this.http.post<any>(url, param);
  }

  getPurchaseInfoNo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-info/pi-no';
    return this.http.post<any>(url, param);
  }

  savePurchaseInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-info/store';
    return this.http.post<any>(url, param);
  }

  updatePurchaseInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-info/update';
    return this.http.post<any>(url, param);
  }

  showPurchaseInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-info/show';
    return this.http.post<any>(url, param);
  }

  deletePurchaseInfo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-info/delete';
    return this.http.post<any>(url, param);
  }

  getDispatchByInvoice(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/invoice-no';
    return this.http.post<any>(url, param);
  }

  getPurchaseDispatchNo(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/dispatch-no';
    return this.http.post<any>(url, param);
  }

  getDispatchEWay(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/e-way-no';
    return this.http.post<any>(url, param);
  }

  getPurchaseDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch';
    return this.http.post<any>(url, param);
  }

  savePurchaseDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/store';
    return this.http.post<any>(url, param);
  }

  updatePurchaseDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/update';
    return this.http.post<any>(url, param);
  }

  showPurchaseDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/show';
    return this.http.post<any>(url, param);
  }

  deletePurchaseDispatch(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-dispatch/delete';
    return this.http.post<any>(url, param);
  }

  getPurchaseRate(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-rate';
    return this.http.post<any>(url, param);
  }

  savePurchaseRate(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-rate/store';
    return this.http.post<any>(url, param);
  }

  updatePurchaseRate(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-rate/update';
    return this.http.post<any>(url, param);
  }

  showPurchaseRate(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-rate/show';
    return this.http.post<any>(url, param);
  }

  deletePurchaseRate(param: any): Observable<any> {
    const url = this.baseUrl + 'purchase-rate/delete';
    return this.http.post<any>(url, param);
  }


  getUnit(param: any): Observable<any> {
    const url = this.baseUrl + 'units';
    return this.http.post<any>(url, param);
  }

  saveUnit(param: any): Observable<any> {
    const url = this.baseUrl + 'units/store';
    return this.http.post<any>(url, param);
  }

  updateUnit(param: any): Observable<any> {
    const url = this.baseUrl + 'units/update';
    return this.http.post<any>(url, param);
  }

  showUnit(param: any): Observable<any> {
    const url = this.baseUrl + 'units/show';
    return this.http.post<any>(url, param);
  }

  deleteUnit(param: any): Observable<any> {
    const url = this.baseUrl + 'units/delete';
    return this.http.post<any>(url, param);
  }

  getService(param: any): Observable<any> {
    const url = this.baseUrl + 'services';
    return this.http.post<any>(url, param);
  }

  saveService(param: any): Observable<any> {
    const url = this.baseUrl + 'services/store';
    return this.http.post<any>(url, param);
  }

  updateService(param: any): Observable<any> {
    const url = this.baseUrl + 'services/update';
    return this.http.post<any>(url, param);
  }

  showService(param: any): Observable<any> {
    const url = this.baseUrl + 'services/show';
    return this.http.post<any>(url, param);
  }

  deleteService(param: any): Observable<any> {
    const url = this.baseUrl + 'services/delete';
    return this.http.post<any>(url, param);
  }

  getServiceGroupCode(param: any): Observable<any> {
    const url = this.baseUrl + 'services/service-code';
    return this.http.post<any>(url, param);
  }

  saveServiceGroupCode(param: any): Observable<any> {
    const url = this.baseUrl + 'services/save-service-code';
    return this.http.post<any>(url, param);
  }

  getServiceGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'service-group';
    return this.http.post<any>(url, param);
  }

  saveServiceGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'service-group/store';
    return this.http.post<any>(url, param);
  }

  updateServiceGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'service-group/update';
    return this.http.post<any>(url, param);
  }

  showServiceGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'service-group/show';
    return this.http.post<any>(url, param);
  }

  deleteServiceGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'service-group/delete';
    return this.http.post<any>(url, param);
  }

  getProductAssembly(param: any): Observable<any> {
    const url = this.baseUrl + 'product-assembly';
    return this.http.post<any>(url, param);
  }

  saveProductAssembly(param: any): Observable<any> {
    const url = this.baseUrl + 'product-assembly/store';
    return this.http.post<any>(url, param);
  }

  updateProductAssembly(param: any): Observable<any> {
    const url = this.baseUrl + 'product-assembly/update';
    return this.http.post<any>(url, param);
  }

  showProductAssembly(param: any): Observable<any> {
    const url = this.baseUrl + 'product-assembly/show';
    return this.http.post<any>(url, param);
  }

  deleteProductAssembly(param: any): Observable<any> {
    const url = this.baseUrl + 'product-assembly/delete';
    return this.http.post<any>(url, param);
  }

  getProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products';
    return this.http.post<any>(url, param);
  }

  getYieldProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products/only-yield';
    return this.http.post<any>(url, param);
  }

  getCodedNonCoded(param: any): Observable<any> {
    const url = this.baseUrl + 'products/coded-non-coded';
    return this.http.post<any>(url, param);
  }

  saveProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products/store';
    return this.http.post<any>(url, param);
  }

  updateProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products/update';
    return this.http.post<any>(url, param);
  }

  showProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products/show';
    return this.http.post<any>(url, param);
  }

  viewProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products/view';
    return this.http.post<any>(url, param);
  }

  deleteProduct(param: any): Observable<any> {
    const url = this.baseUrl + 'products/delete';
    return this.http.post<any>(url, param);
  }

  getProductGroupCode(param: any): Observable<any> {
    const url = this.baseUrl + 'products/model-no';
    return this.http.post<any>(url, param);
  }

  saveProductGroupCode(param: any): Observable<any> {
    const url = this.baseUrl + 'products/save-model-no';
    return this.http.post<any>(url, param);
  }

  getProductGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'product-group';
    return this.http.post<any>(url, param);
  }

  saveProductGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'product-group/store';
    return this.http.post<any>(url, param);
  }

  updateProductGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'product-group/update';
    return this.http.post<any>(url, param);
  }

  showProductGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'product-group/show';
    return this.http.post<any>(url, param);
  }

  deleteProductGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'product-group/delete';
    return this.http.post<any>(url, param);
  }

  getAccountGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'account-group';
    return this.http.post<any>(url, param);
  }

  saveAccountGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'account-group/store';
    return this.http.post<any>(url, param);
  }

  updateAccountGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'account-group/update';
    return this.http.post<any>(url, param);
  }

  showAccountGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'account-group/show';
    return this.http.post<any>(url, param);
  }

  deleteAccountGroup(param: any): Observable<any> {
    const url = this.baseUrl + 'account-group/delete';
    return this.http.post<any>(url, param);
  }

  getCategory(param: any): Observable<any> {
    const url = this.baseUrl + 'category';
    return this.http.post<any>(url, param);
  }

  saveCategory(param: any): Observable<any> {
    const url = this.baseUrl + 'category/store';
    return this.http.post<any>(url, param);
  }

  updateCategory(param: any): Observable<any> {
    const url = this.baseUrl + 'category/update';
    return this.http.post<any>(url, param);
  }

  showCategory(param: any): Observable<any> {
    const url = this.baseUrl + 'category/show';
    return this.http.post<any>(url, param);
  }

  deleteCategory(param: any): Observable<any> {
    const url = this.baseUrl + 'category/delete';
    return this.http.post<any>(url, param);
  }

  getBrand(param: any): Observable<any> {
    const url = this.baseUrl + 'brands';
    return this.http.post<any>(url, param);
  }

  saveBrand(param: any): Observable<any> {
    const url = this.baseUrl + 'brands/store';
    return this.http.post<any>(url, param);
  }

  updateBrand(param: any): Observable<any> {
    const url = this.baseUrl + 'brands/update';
    return this.http.post<any>(url, param);
  }

  showBrand(param: any): Observable<any> {
    const url = this.baseUrl + 'brands/show';
    return this.http.post<any>(url, param);
  }

  deleteBrand(param: any): Observable<any> {
    const url = this.baseUrl + 'brands/delete';
    return this.http.post<any>(url, param);
  }

  getAccountPerson(param: any): Observable<any> {
    const url = this.baseUrl + 'account-person';
    return this.http.post<any>(url, param);
  }

  saveAccountPerson(param: any): Observable<any> {
    const url = this.baseUrl + 'account-person/store';
    return this.http.post<any>(url, param);
  }

  updateAccountPerson(param: any): Observable<any> {
    const url = this.baseUrl + 'account-person/update';
    return this.http.post<any>(url, param);
  }

  deleteAccountPerson(param: any): Observable<any> {
    const url = this.baseUrl + 'account-person/delete';
    return this.http.post<any>(url, param);
  }

  getFamilyMember(param: any): Observable<any> {
    const url = this.baseUrl + 'family-member';
    return this.http.post<any>(url, param);
  }

  saveFamilyMember(param: any): Observable<any> {
    const url = this.baseUrl + 'family-member/store';
    return this.http.post<any>(url, param);
  }

  updateFamilyMember(param: any): Observable<any> {
    const url = this.baseUrl + 'family-member/update';
    return this.http.post<any>(url, param);
  }

  deleteFamilyMember(param: any): Observable<any> {
    const url = this.baseUrl + 'family-member/delete';
    return this.http.post<any>(url, param);
  }

  getUserDetail(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/details';
    return this.http.post<any>(url, param);
  }

  saveUserDetail(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/details/store';
    return this.http.post<any>(url, param);
  }

  updateUserDetail(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/details/update';
    return this.http.post<any>(url, param);
  }

  deleteUserDetail(param: any): Observable<any> {
    const url = this.baseUrl + 'staff/details/delete';
    return this.http.post<any>(url, param);
  }

  getPurchaseSources(param: any): Observable<any> {
    const url = this.baseUrl + 'lookup/purchase-source';
    return this.http.post<any>(url, param);
  }

  getLatestQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'lookup/qr-code';
    return this.http.post<any>(url, param);
  }

  getProductQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'lookup/product/qr-code';
    return this.http.post<any>(url, param);
  }

  getDiscount(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-type';
    return this.http.post<any>(url, param);
  }
  saveDiscount(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-type/store';
    return this.http.post<any>(url, param);
  }

  getDiscountMatrix(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-matrix';
    return this.http.post<any>(url, param);
  }
  saveDiscountMatrix(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-matrix/store';
    return this.http.post<any>(url, param);
  }

  getDistance(param: any): Observable<any> {
    const url = this.baseUrl + 'distance';
    return this.http.post<any>(url, param);
  }
  saveDistance(param: any): Observable<any> {
    const url = this.baseUrl + 'distance/store';
    return this.http.post<any>(url, param);
  }

  getSupply(param: any): Observable<any> {
    const url = this.baseUrl + 'supply-life';
    return this.http.post<any>(url, param);
  }
  saveSupply(param: any): Observable<any> {
    const url = this.baseUrl + 'supply-life/store';
    return this.http.post<any>(url, param);
  }

  getInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'installation';
    return this.http.post<any>(url, param);
  }
  saveInstallation(param: any): Observable<any> {
    const url = this.baseUrl + 'installation/store';
    return this.http.post<any>(url, param);
  }

  getWarranty(param: any): Observable<any> {
    const url = this.baseUrl + 'warranty';
    return this.http.post<any>(url, param);
  }
  saveWarranty(param: any): Observable<any> {
    const url = this.baseUrl + 'warranty/store';
    return this.http.post<any>(url, param);
  }

  getProductWarranty(param: any): Observable<any> {
    const url = this.baseUrl + 'warranty/products';
    return this.http.post<any>(url, param);
  }

  getContract(param: any): Observable<any> {
    const url = this.baseUrl + 'contract';
    return this.http.post<any>(url, param);
  }
  saveContract(param: any): Observable<any> {
    const url = this.baseUrl + 'contract/store';
    return this.http.post<any>(url, param);
  }

  getProductContract(param: any): Observable<any> {
    const url = this.baseUrl + 'contract/products';
    return this.http.post<any>(url, param);
  }

  getSalesRate(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-rate';
    return this.http.post<any>(url, param);
  }
  saveSalesRate(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-rate/store';
    return this.http.post<any>(url, param);
  }

  getProductSalesRate(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-rate/products';
    return this.http.post<any>(url, param);
  }

  // SALES

  getQuotationNo(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/no';
    return this.http.post<any>(url, param);
  }

  getQuotation(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation';
    return this.http.post<any>(url, param);
  }

  countQuotation(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/count';
    return this.http.post<any>(url, param);
  }
  
  getDiscountManagerQuotion(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/discount/manager';
    return this.http.post<any>(url, param);
  }

  getDiscountProjectQuotion(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/discount/project';
    return this.http.post<any>(url, param);
  }

  saveQuotation(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/store';
    return this.http.post<any>(url, param);
  }

  updateQuotation(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/update';
    return this.http.post<any>(url, param);
  }

  showQuotation(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/show';
    return this.http.post<any>(url, param);
  }

  deleteQuotation(param: any): Observable<any> {
    const url = this.baseUrl + 'quotation/delete';
    return this.http.post<any>(url, param);
  }

  getPreSalesDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand/no';
    return this.http.post<any>(url, param);
  }

  getPreSalesDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand';
    return this.http.post<any>(url, param);
  }

  savePreSalesDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand/store';
    return this.http.post<any>(url, param);
  }

  updatePreSalesDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand/update';
    return this.http.post<any>(url, param);
  }

  showPreSalesDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand/show';
    return this.http.post<any>(url, param);
  }

  deletePreSalesDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand/delete';
    return this.http.post<any>(url, param);
  }
  approvedPreSalesDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'pre-sales-demand/approved';
    return this.http.post<any>(url, param);
  }

  getDMNo(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-manager/no';
    return this.http.post<any>(url, param);
  }

  getDM(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-manager';
    return this.http.post<any>(url, param);
  }

  saveDM(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-manager/store';
    return this.http.post<any>(url, param);
  }

  updateDM(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-manager/update';
    return this.http.post<any>(url, param);
  }

  showDM(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-manager/show';
    return this.http.post<any>(url, param);
  }

  deleteDM(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-manager/delete';
    return this.http.post<any>(url, param);
  }

  getDPNo(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-project/no';
    return this.http.post<any>(url, param);
  }

  getDP(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-project';
    return this.http.post<any>(url, param);
  }

  saveDP(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-project/store';
    return this.http.post<any>(url, param);
  }

  updateDP(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-project/update';
    return this.http.post<any>(url, param);
  }

  showDP(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-project/show';
    return this.http.post<any>(url, param);
  }

  deleteDP(param: any): Observable<any> {
    const url = this.baseUrl + 'discount-project/delete';
    return this.http.post<any>(url, param);
  }

  getDeliveryQrCode(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/qr-code';
    return this.http.post<any>(url, param);
  }

  getDeliveryChallanNo(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/no';
    return this.http.post<any>(url, param);
  }

  getDeliveryChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan';
    return this.http.post<any>(url, param);
  }

  saveDeliveryChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/store';
    return this.http.post<any>(url, param);
  }

  updateDeliveryChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/update';
    return this.http.post<any>(url, param);
  }

  showDeliveryChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/show';
    return this.http.post<any>(url, param);
  }

  deleteDeliveryChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/delete';
    return this.http.post<any>(url, param);
  }

  undeliveredDeliveryChallan(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan/undelivered';
    return this.http.post<any>(url, param);
  }

  getDeliveryChallanRecovery(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan-recovery';
    return this.http.post<any>(url, param);
  }

  saveDeliveryChallanRecovery(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan-recovery/store';
    return this.http.post<any>(url, param);
  }

  updateDeliveryChallanRecovery(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan-recovery/update';
    return this.http.post<any>(url, param);
  }

  showDeliveryChallanRecovery(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan-recovery/show';
    return this.http.post<any>(url, param);
  }

  deleteDeliveryChallanRecovery(param: any): Observable<any> {
    const url = this.baseUrl + 'delivery-challan-recovery/delete';
    return this.http.post<any>(url, param);
  }

  getSalesReturnDemandNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/no';
    return this.http.post<any>(url, param);
  }

  getSalesReturnDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand';
    return this.http.post<any>(url, param);
  }

  saveSalesReturnDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/store';
    return this.http.post<any>(url, param);
  }

  updateSalesReturnDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/update';
    return this.http.post<any>(url, param);
  }

  showSalesReturnDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/show';
    return this.http.post<any>(url, param);
  }

  deleteSalesReturnDemand(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/delete';
    return this.http.post<any>(url, param);
  }

  salesReturnApproved(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/approved';
    return this.http.post<any>(url, param);
  }

  salesReturnCheck(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/demand/check';
    return this.http.post<any>(url, param);
  }

  getSalesReturnReceivedNo(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received/no';
    return this.http.post<any>(url, param);
  }

  getSalesReturnReceived(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received';
    return this.http.post<any>(url, param);
  }

  saveSalesReturnReceived(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received/store';
    return this.http.post<any>(url, param);
  }

  updateSalesReturnReceived(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received/update';
    return this.http.post<any>(url, param);
  }

  showSalesReturnReceived(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received/show';
    return this.http.post<any>(url, param);
  }

  deleteSalesReturnReceived(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received/delete';
    return this.http.post<any>(url, param);
  }

  approvedSalesReturnReceived(param: any): Observable<any> {
    const url = this.baseUrl + 'sales-return/received/approved';
    return this.http.post<any>(url, param);
  }

  login(param: any): Observable<any> {
    const url = this.baseUrl + 'login';
    return this.http.post<any>(url, param);
  }
  logout(): Observable<any> {
    const url = this.baseUrl + 'logout';
    return this.http.post<any>(url, {});
  }
}
