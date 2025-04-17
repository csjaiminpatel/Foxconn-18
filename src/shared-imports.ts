import { CommonModule } from "@angular/common";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule } from "devextreme-angular";

export const SHARED_IMPORTS = [
    CommonModule,
    MatIconModule,
    TranslateModule,
    MatTooltipModule
]
export const MAT_IMPORTS = [
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule
]

export const DX_IMPORTS = [
    DxDataGridModule,
    DxDateBoxModule,
    DxDropDownBoxModule,
    DxCheckBoxModule 
]