import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BosniaValidator implements CountryValidator{

    COUNTRY_CODE: string = 'BA';

    public validateIndividualTaxCode(jmbg: string): ValidationResult {
        if (jmbg.length !== 13 || !/^\d+$/.test(jmbg)) {
            return ValidationResult.InvalidFormat("0101080123451");
        }

        const day = parseInt(jmbg.substring(0, 2), 10);
        const month = parseInt(jmbg.substring(2, 4), 10);
        const year = parseInt(jmbg.substring(4, 7), 10);
        const sequence = parseInt(jmbg.substring(7, 12), 10);
        const controlDigit = parseInt(jmbg.substring(12), 10);

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return ValidationResult.InvalidDate();
        }
        const currentYear = new Date().getFullYear() % 100;
        const fullYear = year + (year >= 0 && year <= currentYear ? 1900 : 2000);
        const date = new Date(fullYear, month - 1, day);
        if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return ValidationResult.InvalidDate();
        }

        const weights = [7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        let sum = 0;

        for (let i = 0; i < 12; i++) {
            sum += parseInt(jmbg[i], 10) * weights[i];
        }

        const remainder = sum % 11;
        const calculatedControlDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;

        if (calculatedControlDigit === controlDigit) {
            return ValidationResult.Success();
        } else {
            return ValidationResult.InvalidChecksum();
        }
    }

    validateVatCode(vatCode: string): ValidationResult {
        vatCode = removeSpecialCharacters(vatCode);

        if (!/^\d{13}$/.test(vatCode)) {
            return ValidationResult.InvalidFormat("0101080123451");
        }
        return ValidationResult.Success();
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{5}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("NNNNN");
        }
        return ValidationResult.Success();
    }
}