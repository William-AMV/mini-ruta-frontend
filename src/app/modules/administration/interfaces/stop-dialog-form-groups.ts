import { FormControl } from "@angular/forms";

export interface StopDialogFormGroup {
    name: FormControl<string>
    linkPlace: FormControl<string|null>
    isActive: FormControl<boolean>
}