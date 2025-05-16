import { NgModule } from "@angular/core";

import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {ColorPickerModule} from "primeng/colorpicker";
import {InputNumberModule} from "primeng/inputnumber";
import { ToastModule } from 'primeng/toast';
import {TableModule} from "primeng/table";
import {SharedModule} from "primeng/api";
import {ToolbarModule} from "primeng/toolbar";
import {DockModule} from "primeng/dock";
import {ProgressBarModule} from "primeng/progressbar";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
    exports: [
        CardModule,
        ButtonModule,
        DividerModule,
        InputTextModule,
        RippleModule,
        DialogModule,
        DropdownModule,
        ColorPickerModule,
        InputNumberModule,
        ToastModule,
        TableModule,
        SharedModule,
        ToolbarModule,
        DockModule,
        ProgressBarModule,
        ConfirmDialogModule
    ]
})
export class PrimeNgModule { }