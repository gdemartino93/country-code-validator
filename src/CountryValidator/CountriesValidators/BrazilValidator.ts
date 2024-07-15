import { CountryValidator } from "../CodeValidation";
import { ValidationResult } from "../ValidationResult";

export class BrazilValidator implements CountryValidator{
    COUNTRY_CODE: string = 'BR';
    validateIndividualTaxCode(cpf: string): ValidationResult {
        cpf = cpf.replace(/[^\d]/g, '');
        if (!/^\d{11}$/.test(cpf)) {
            return ValidationResult.InvalidFormat("123.456.789-09");
        }
        let sum = 0;
        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        let rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(cpf.substring(9, 10))) {
            return ValidationResult.InvalidChecksum();
        }
        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(cpf.substring(10, 11))) {
            return ValidationResult.InvalidChecksum();
        }
        return ValidationResult.Success();
    }

    validateVatCode(vatCode: string): ValidationResult {
        vatCode = vatCode.replace(/[^\d]/g, '');
        if (!/^\d{14}$/.test(vatCode)) {
            return ValidationResult.InvalidFormat("11.222.333/0001-81");
        }
        let registration = vatCode.substring(0, 12);
        registration += this.digitChecksum(registration);
        registration += this.digitChecksum(registration);
        const isValid = registration.substring(registration.length - 2) === vatCode.substring(vatCode.length - 2);
        return isValid ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = postalCode.replace(/[^\d]/g, '');
        if (!/^\d{8}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("013102-00");
        }
        return ValidationResult.Success();
    }

    private digitChecksum(numbers: string): number {
        let index = 2;
        const charArray = numbers.split('').reverse();
        numbers = charArray.join('');
        let sum = 0;
        for (let i = 0; i < numbers.length; i++) {
            sum += parseInt(numbers[i]) * index;
            index = index === 9 ? 2 : index + 1;
        }
        const mod = sum % 11;
        return mod < 2 ? 0 : 11 - mod;
    }

}