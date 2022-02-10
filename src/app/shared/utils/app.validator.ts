import { FormControl, FormGroup } from "@angular/forms";

export function emailValidator(control: FormControl) {
  var emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
  if (control.value && !emailRegex.test(control.value)) {
    return { invalidEmail: true };
  }
}

export function matchingPasswords(
  passwordKey: string,
  passwordConfirmationKey: string
) {
  return (group: FormGroup) => {
    let password = group.controls[passwordKey];
    let passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({ mismatchedPasswords: true });
    }
  };
}

export function documentValidator(control: FormControl) {
  if (control.value) {
    const document: string = control.value.replace(/(\.|\/|\-)/g, "");
    if (document.length == 11) {
      return cpfValidator(control);
    } else if (document.length == 14) {
      return cnpjValidator(control);
    } else {
      return { invalidDocument: true };
    }
  }
}

export function cpfValidator(control: FormControl) {
  if (control.value) {
    const cpf: string = control.value.replace(/(\.|\/|\-)/g, "");
    if (cpf.length != 11) {
      return { invalidCPF: true };
    }
    if (
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    ) {
      return { invalidCPF: true };
    }
    let number: number = 0;
    let char: string = "";
    let numbers: string = "0123456789";
    let j: number = 10;
    let sum: number = 0;
    let rest: number = 0;
    let firstDigit: number = 0;
    let secondDigit: number = 0;
    let cpfAux: string = "";

    cpfAux = cpf.substring(0, 9);

    for (let i: number = 0; i < 9; i++) {
      char = cpfAux.charAt(i);

      if (numbers.search(char) == -1) {
        return { invalidCPF: true };
      }

      number = Number(char);
      sum = sum + number * j;
      j--;
    }

    rest = sum % 11;
    firstDigit = 11 - rest;
    if (firstDigit > 9) {
      firstDigit = 0;
    }

    j = 11;
    sum = 0;
    cpfAux = cpfAux + firstDigit;

    for (let i: number = 0; i < 10; i++) {
      char = cpfAux.charAt(i);
      number = Number(char);
      sum = sum + number * j;
      j--;
    }

    rest = sum % 11;
    secondDigit = 11 - rest;
    if (secondDigit > 9) {
      secondDigit = 0;
    }

    cpfAux = cpfAux + secondDigit;

    if (cpf != cpfAux) {
      return { invalidCPF: true };
    }
  }

  return null;
}

export function cnpjValidator(control: FormControl) {
  if (control.value) {
    const cnpj: string = control.value.toString().replace(/(\.|\/|\-)/g, "");
    if (cnpj.length != 14) {
      return { invalidCNPJ: true };
    }

    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    ) {
      return { invalidCNPJ: true };
    }

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += +numbers.charAt(size - i) * position--;
      if (position < 2) position = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != +digits.charAt(0)) {
      return { invalidCNPJ: true };
    }

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    position = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += +numbers.charAt(size - i) * position--;
      if (position < 2) position = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != +digits.charAt(1)) {
      return { invalidCNPJ: true };
    }
  }
}
