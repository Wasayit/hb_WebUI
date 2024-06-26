import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { JwtService, ResponseModel } from "src/auth/jwtService";
import { environment } from "src/environments/environment";
import { CORESERVICE } from "./constants";

@Injectable()
export class AjaxService {
  IsTokenByPass: boolean = true;

  constructor(
    private tokenHelper: JwtService,
    private http: HttpClient
  ) {
  }

  private GetHeader(){
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    });
  }

  LoadStaticJson(StaticUrl: string): Observable<any> {
    let JsonData = this.http.get(StaticUrl);
    return JsonData;
  }

  private GetBaseUrl() {
    return environment.baseUrl;
  }

  login(Url: string, Param: any, service: string = CORESERVICE): Promise<ResponseModel> {
    let url = `${this.GetBaseUrl()}${service}/${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        }).subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (this.tokenHelper.IsValidResponse(res.body)) {
                let loginData: ResponseModel = res.body;
                if (this.tokenHelper.setLoginDetail(loginData.ResponseBody)) {
                  resolve(res.body);
                } else {
                  resolve(null);
                }
              } else {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  get(Url: string, service: string = CORESERVICE): Promise<ResponseModel> {
    return new Promise((resolve, reject) => {
      let url = `${this.GetBaseUrl()}${service}/${Url}`;
      return this.http
        .get(url, {
          observe: "response"
        })
        .subscribe({
          next: (res: any) => {
            if (this.tokenHelper.IsValidResponse(res.body)) {
              resolve(res.body);
            } else {
              resolve(null);
            }
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  post(Url: string, Param: any, service: string = CORESERVICE): Promise<any> {
    let url = `${this.GetBaseUrl()}${service}/${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        }).subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(null);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  put(Url: string, Param: any, service: string = CORESERVICE): Promise<any> {
    let url = `${this.GetBaseUrl()}${service}/${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .put(url, Param, {
          observe: "response"
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  delete(Url: string, Param?: any, service: string = CORESERVICE): Promise<any> {
    let url = `${this.GetBaseUrl()}${service}/${Url}`;
    return new Promise((resolve, reject) => {
      this.http.delete(url, {
        headers: {
          observe: "response",
        },
        body: Param
      }).subscribe({
        next: (res: any) => {
          try {
            if (!this.tokenHelper.IsValidResponse(res)) {
              reject(null);
            }
          } catch (e) {
            reject(e);
          }
          resolve(res);
        },
        error: (e: HttpErrorResponse) => {
          this.tokenHelper.HandleResponseStatus(e);
          reject(e.error);
        }
      });
    });
  }

  upload(Url: string, Param: any, service: string = CORESERVICE): Promise<any> {
    let url = `${this.GetBaseUrl()}${service}/${Url}`;
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        })
        .subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }

  forgotPassword(Url: string, Param: any, service: string = CORESERVICE): Promise<ResponseModel> {
    let url = `${this.GetBaseUrl()}${service}/${Url}`;
    this.tokenHelper.setCompanyCode(Param.CompanyCode);
    return new Promise((resolve, reject) => {
      this.http
        .post(url, Param, {
          observe: "response"
        }).subscribe({
          next: (res: HttpResponse<any>) => {
            try {
              if (!this.tokenHelper.IsValidResponse(res.body)) {
                reject(null);
              }
            } catch (e) {
              reject(e);
            }
            resolve(res.body);
          },
          error: (e: HttpErrorResponse) => {
            this.tokenHelper.HandleResponseStatus(e);
            reject(e.error);
          }
        });
    });
  }
}

export class Filter {
  employeeId?: number = 0;
  clientId?: number = 0;
  searchString: string = "1=1";
  pageIndex: number = 1;
  startIndex?: number = 0;
  endIndex?: number = 0;
  pageSize: number = 10;
  sortBy?: string = "";
  companyId: number = 0;
  totalRecords?: number = 0;
  showPageNo?: number = 5;
  activePageNumber?: number = 1;
  isReUseSame?: boolean = false;
  isActive?: boolean = true;

  update(total: any) {
    if(!isNaN(Number(total))) {
      this.totalRecords = total;
      this.startIndex = 1;
      this.pageIndex = 1;
    }
  }

  reset() {
    this.totalRecords = 0;
    this.startIndex = 1;
    this.pageIndex = 1;
    this.activePageNumber = 1;
  }
}
