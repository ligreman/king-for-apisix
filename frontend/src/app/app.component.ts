import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {DomSanitizer} from '@angular/platform-browser';
import {GlobalsService} from './services/globals.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

/**
 * Prefs Dialog Component
 */
@Component({
    selector: 'preferences-dialog',
    templateUrl: 'preferences-dialog.html',
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesDialog {
    savePrefs() {
        console.log('save');
    }
}

/**
 * App Component
 */
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatIconModule, MatToolbarModule, MatButtonModule, MatDividerModule, MatTooltipModule, MatDialogModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    title = 'King for Apisix';

    constructor(private globals: GlobalsService) {
        const iconRegistry = inject(MatIconRegistry);
        const sanitizer = inject(DomSanitizer);
        iconRegistry.addSvgIconLiteral('i-github', sanitizer.bypassSecurityTrustHtml(this.globals.ICON_GITHUB));
    }

    ngOnInit(): void {
        const pref1 = localStorage.getItem('graphHideClass');
        if (pref1) {
            this.globals.prefGraphHideClass = pref1 == 'hidden' ? 'hidden' : 'transparent';
        }
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
        const dialogRef = this.dialog.open(PreferencesDialog);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
}
