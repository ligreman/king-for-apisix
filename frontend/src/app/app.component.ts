import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {DomSanitizer} from '@angular/platform-browser';
import {GlobalsService} from './services/globals.service';
import {HomeComponent} from './home/home.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatIconModule, MatToolbarModule, MatButtonModule, MatDividerModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
    title = 'King for Apisix';

    constructor(private globals: GlobalsService) {
        const iconRegistry = inject(MatIconRegistry);
        const sanitizer = inject(DomSanitizer);
        iconRegistry.addSvgIconLiteral('i-github', sanitizer.bypassSecurityTrustHtml(this.globals.ICON_GITHUB));
    }

    ngAfterViewInit(): void {
    }

    fitScreen() {
        this.globals.setMSG('fit-screen');
    }

    reloadData() {
        this.globals.setMSG('reload-data');
    }

    help() {

    }

    settings() {

    }
}
