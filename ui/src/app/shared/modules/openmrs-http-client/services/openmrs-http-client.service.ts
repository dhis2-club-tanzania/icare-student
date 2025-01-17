import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  DEFAULT_ROOT_URL,
  HTTP_CONFIG,
  HTTP_HEADER_OPTIONS,
} from '../constants/http.constant';
import { ErrorMessage } from '../models/error-message.model';
import { HttpConfig } from '../models/http-config.model';

@Injectable({
  providedIn: 'root',
})
export class OpenmrsHttpClientService {
  constructor(private httpClient: HttpClient) {}

  login(credentialsToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + credentialsToken,
    });

    const rootUrl = this._getRootUrl();
    return this.httpClient.get(
      rootUrl +
        'session?v=custom:(authenticated,user:(privileges:(uuid,name,roles),roles:(uuid,name)))',
      {
        headers: headers,
      }
    );
  }

  get(url: string, httpConfig?: HttpConfig): Observable<any> {
    const newHttpConfig = this._getHttpConfig(httpConfig);

    const httpOptions = this._getHttpOptions(newHttpConfig.httpHeaders);

    return this._getFromServer(url, newHttpConfig, httpOptions);
  }

  post(url: string, data: any, httpConfig?: HttpConfig) {
    const newHttpConfig = this._getHttpConfig(httpConfig);

    const httpOptions = this._getHttpOptions(newHttpConfig.httpHeaders);
    const rootUrl = this._getRootUrl();

    return httpOptions
      ? this.httpClient.post(rootUrl + url, data, httpOptions)
      : this.httpClient.post(rootUrl + url, data);
  }

  put(url: string, data: any, httpConfig?: HttpConfig) {
    const newHttpConfig = this._getHttpConfig(httpConfig);

    const httpOptions = this._getHttpOptions(newHttpConfig.httpHeaders);
    const rootUrl = this._getRootUrl();
    return httpOptions
      ? this.httpClient.put(rootUrl + url, data, httpOptions)
      : this.httpClient.put(rootUrl + url, data);
  }

  delete(url: string, httpConfig?: HttpConfig) {
    const newHttpConfig = this._getHttpConfig(httpConfig);

    const httpOptions = this._getHttpOptions(newHttpConfig.httpHeaders);
    const rootUrl = this._getRootUrl();
    return httpOptions
      ? this.httpClient.delete(rootUrl + url, httpOptions)
      : this.httpClient.delete(rootUrl + url);
  }

  private _getFromServer(url, httpConfig: HttpConfig, httpOptions: any) {
    const rootUrl = this._getRootUrl();
    return httpOptions
      ? this.httpClient.get(rootUrl + url, httpOptions)
      : this.httpClient.get(rootUrl + url);
  }

  private _getHttpConfig(httpConfig: HttpConfig) {
    return { ...HTTP_CONFIG, ...(httpConfig || {}) };
  }

  private _getRootUrl() {
    const rootUrl = DEFAULT_ROOT_URL;
    return this._getApiRootUrl(rootUrl);
  }
  private _handleError(err: HttpErrorResponse) {
    let error: ErrorMessage = null;
    if (err.error instanceof ErrorEvent) {
      error = {
        message: err.error.toString(),
        status: err.status,
        statusText: err.statusText,
      };
    } else {
      error = {
        message:
          err.error instanceof Object
            ? err.error.message
            : err.error || err.message,
        status: err.status,
        statusText: err.statusText,
      };
    }
    return throwError(error);
  }

  private _getApiRootUrl(rootUrl: string) {
    const version = 'ws/rest/v1/';
    return rootUrl + version;
  }

  private _getHttpOptions(httpHeaderOptions: any) {
    return httpHeaderOptions
      ? {
          headers: new HttpHeaders({
            ...HTTP_HEADER_OPTIONS,
            ...(httpHeaderOptions || {}),
          }),
        }
      : null;
  }
}
