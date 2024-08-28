import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function length(length: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value.length !== length) {
            return { length: { requiredLength: length, actualLength: control.value.length } };
        }
        return null;
    };
}