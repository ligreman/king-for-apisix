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
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {ToastService} from './services/toast.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

/**
 * Prefs Dialog Component
 */
@Component({
    selector: 'preferences-dialog',
    templateUrl: 'preferences-dialog.html',
    imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSlideToggleModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './app.component.scss'
})
export class PreferencesDialog implements OnInit {
    prefsForm = new FormGroup({
        transparent: new FormControl('transparent'),
        showPlugins: new FormControl(true),
        filtersSize: new FormControl('normal'),
    });

    ngOnInit(): void {
        // Load prefs from storage
        const pref1 = localStorage.getItem('graphHideClass');
        const pref2 = localStorage.getItem('showPlugins');
        const pref3 = localStorage.getItem('filtersSize');

        this.prefsForm.setValue({
            transparent: pref1 === 'hidden' ? 'hidden' : 'transparent',
            showPlugins: pref2 === 'false' ? false : true,
            filtersSize: (pref3 === 'thin' || pref3 === 'min') ? pref3 : 'normal'
        });
    }

    getPrefs() {
        return {
            transparent: this.prefsForm.get('transparent')?.value,
            showPlugins: this.prefsForm.get('showPlugins')?.value,
            filtersSize: this.prefsForm.get('filtersSize')?.value
        }
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

    constructor(private globals: GlobalsService, private toast: ToastService) {
        const iconRegistry = inject(MatIconRegistry);
        const sanitizer = inject(DomSanitizer);
        iconRegistry.addSvgIconLiteral('i-github', sanitizer.bypassSecurityTrustHtml(this.globals.ICON_GITHUB));
    }

    ngOnInit(): void {
        this.loadStorage();
    }

    loadStorage() {
        const pref1 = localStorage.getItem('graphHideClass');
        if (pref1) {
            this.globals.prefGraphHideClass = pref1 == 'hidden' ? 'hidden' : 'transparent';
        }
        const pref2 = localStorage.getItem('showPlugins');
        if (pref2) {
            this.globals.prefShowPlugins = pref2 !== 'false';
        }
        const pref3 = localStorage.getItem('filtersSize');
        if (pref3) {
            this.globals.prefFiltersSize = (pref3 === 'thin' || pref3 === 'min') ? pref3 : 'normal';
        }
    }

    fitScreen() {
        this.globals.setMSG('fit-screen');
    }

    reloadData() {
        this.globals.setMSG('reload-data');
    }

    help() {
        const dialogRef = this.dialog.open(HelpDialog);

        dialogRef.afterClosed().subscribe(() => {
        });
    }

    settings() {
        const dialogRef = this.dialog.open(PreferencesDialog);

        dialogRef.afterClosed().subscribe((res: any) => {
            console.log(res);
            if (res) {
                const val = res.transparent;
                localStorage.setItem('graphHideClass', val);

                const val2 = res.showPlugins;
                localStorage.setItem('showPlugins', val2);

                const val3 = res.filtersSize;
                localStorage.setItem('filtersSize', val3);

                this.toast.success('Some settings will not apply until reloading or filtering the graph.', 'Settings saved');
            }

            this.loadStorage();
        });
    }

}


/**
 * Help Dialog Component
 */
@Component({
    selector: 'help-dialog',
    templateUrl: 'help-dialog.html',
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './app.component.scss'
})
export class HelpDialog implements OnInit {
    ngOnInit(): void {
    }
}
