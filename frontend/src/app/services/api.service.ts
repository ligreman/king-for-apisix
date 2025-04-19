import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {GlobalsService} from './globals.service';
import {catchError, throwError} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient, private globals: GlobalsService) {
    }


    /*
      Manage the errors
     */
    handleError(error: HttpErrorResponse) {
        let errorMessage;
        if (error['error']['message']) {
            errorMessage = error.error.message;
        } else {
            errorMessage = `Code: ${error.status}. Error: ${error.message}`;
        }
        return throwError(() => error);
    }

    public getServices() {
        return this.http.get(this.globals.API_URL + '/apisix/services').pipe(catchError(this.handleError));
    }

    public getRoutes() {
        return this.http.get(this.globals.API_URL + '/apisix/routes').pipe(catchError(this.handleError));
    }

    public getUpstreams() {
        return this.http.get(this.globals.API_URL + '/apisix/upstreams ').pipe(catchError(this.handleError));
    }

    public getHealth() {
        return this.http.get(this.globals.API_URL + '/apisix/healthcheck ').pipe(catchError(this.handleError));
    }
}
