import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  static passwordMatchValidator(control: AbstractControl) {
    // get password from our password form control
    const password: string = control.get('password').value;

    // get password from our confirmPassword form control
    const confirmPassword: string = control.get('confirmPassword').value;

    // compare is the password match
    if (password !== confirmPassword) {

      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
}