import { FormControl } from "@angular/forms";

export interface UserDialogFormGroup {
    fullName: FormControl<string>
    email: FormControl<string>
    password: FormControl<string|null>
    role: FormControl<string|null>
    isActive: FormControl<boolean>
}