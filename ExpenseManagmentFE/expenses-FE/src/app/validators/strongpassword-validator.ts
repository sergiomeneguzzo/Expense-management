import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&\-]{8,}$/;
    const isValid = passwordPattern.test(password);
    return password && !isValid ? { weakPassword: true } : null;
  };
}
