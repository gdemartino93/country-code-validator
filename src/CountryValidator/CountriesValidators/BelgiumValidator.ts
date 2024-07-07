import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BelgiumValidator  implements CountryValidator{

    COUNTRY_CODE: string = 'BE';

    validateIndividualTaxCode(id: string): ValidationResult {
        id = removeSpecialCharacters(id);
        if (!/^\d{11}$/.test(id)) {
            return ValidationResult.InvalidFormat("12345678901");
        }

        const checkDigit = parseInt(id.substring(id.length - 2));
        let nrToCheck = parseInt(id.substring(0, 9));

        if (this.modFunctionForChecksum(nrToCheck) === checkDigit) {
            return ValidationResult.Success();
        }

        nrToCheck = parseInt('2' + id.substring(0, 9));
        const isValid = this.modFunctionForChecksum(nrToCheck) === checkDigit;
        return isValid ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }
    
    validateVatCode(id: string): ValidationResult {
        id = removeSpecialCharacters(id);
        id = id.replace(/be/gi, '');

        if (id.length === 9) {
            id = id.padStart(10, '0');
        }

        if (!/^[0-1]?\d{9}$/.test(id)) {
            return ValidationResult.InvalidFormat("1234567890");
        }

        const isValid = 97 - parseInt(id.substring(0, 8)) % 97 === parseInt(id.substring(8, 2));
        return isValid ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("NNNN");
        }
        return ValidationResult.Success();
    }

    private modFunctionForChecksum(nr: number): number {
        return 97 - (nr % 97);
    }

}