import { CheckboxControlValueAccessor, CheckboxRequiredValidator } from "@angular/forms";

export interface personalDetails {
    name: string;
    email: string;
    adress: string;
    phone: string;
    id: string;
    country: string;
    tc: CheckboxRequiredValidator;
    passport: CheckboxRequiredValidator;
}
