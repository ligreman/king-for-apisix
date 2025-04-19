import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastr: ToastrService) {
    }

    public success(msg: string, title: string = '', options: any = {}) {
        const {timeOut = 5000, extendedTimeOut = 1000, disableTimeOut = false} = options;

        this.toastr.success(msg, title, {
            timeOut: timeOut,
            extendedTimeOut: extendedTimeOut,
            disableTimeOut: disableTimeOut
        });
    }

    public error(msg: string, title: string = '', options: any = {}) {
        const {timeOut = 15000, extendedTimeOut = 3000, disableTimeOut = false} = options;

        this.toastr.error(msg, title, {
            timeOut: timeOut,
            extendedTimeOut: extendedTimeOut,
            disableTimeOut: disableTimeOut
        });
    };

    public error_general(err: any, options: any = {}) {
        const {
            timeOut = 15000,
            extendedTimeOut = 3000,
            disableTimeOut = false,
            msgExtra = err.message ? ' - ' + err.message : '',
            titleExtra = err.code ? ' - ' + err.code : ''
        } = options;
        this.error('An error has ocurred: ' + msgExtra, titleExtra, {
            timeOut: timeOut,
            extendedTimeOut: extendedTimeOut,
            disableTimeOut: disableTimeOut
        });
    }

    public warning(msg: string, title: string = '', options: any = {}) {
        const {timeOut = 5000, extendedTimeOut = 1000, disableTimeOut = false} = options;

        this.toastr.warning(msg, title, {
            timeOut: timeOut,
            extendedTimeOut: extendedTimeOut,
            disableTimeOut: disableTimeOut
        });
    }

    public info(msg: string, title: string = '', options: any = {}) {
        const {timeOut = 5000, extendedTimeOut = 1000, disableTimeOut = false} = options;

        this.toastr.info(msg, title, {
            timeOut: timeOut,
            extendedTimeOut: extendedTimeOut,
            disableTimeOut: disableTimeOut
        });
    }
}
