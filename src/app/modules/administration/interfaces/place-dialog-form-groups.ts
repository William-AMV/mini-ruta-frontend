import { FormControl } from "@angular/forms";

export interface PlaceDialogFormGroup {
    name: FormControl<string>
    linkPlace: FormControl<string|null>
    isActive: FormControl<boolean>
}