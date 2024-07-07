import { CountryValidator } from "../CodeValidation";
import { translit } from "../Utils/cyrillicToLatin";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BelarusValidator implements CountryValidator{

    COUNTRY_CODE: string = 'BY';
    
    validateIndividualTaxCode(id: string): ValidationResult {
        id = id?.replace("УНП", '').replace("UNP", '');
        id = translit(id);
        id = removeSpecialCharacters(id);
        if (!/^\d{2}/.test(id)) {
            return ValidationResult.Invalid("Invalid format");
        }
        return this.validateUNP(id);
    }
    
    validateVatCode(vatId: string): ValidationResult {
        vatId = vatId?.replace("УНП", '').replace("UNP", '');
        vatId = translit(vatId);
        vatId = removeSpecialCharacters(vatId);
        if (!/^[AaBbCcEeHhKkMmOoPpTt]{2}/.test(vatId)) {
            return ValidationResult.Invalid("Invalid format");
        }
        return this.validateUNP(vatId);
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{6}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("NNNNNN");
        }
        return ValidationResult.Success();
    }

    private validateUNP(number: string): ValidationResult {
        if (number.length !== 9) {
            return ValidationResult.InvalidLength();
        } else if (!/^\d{7}$/.test(number.substring(2))) {
            return ValidationResult.InvalidFormat("AA1234567");
        } else if (!/^[1234567AaBbCcEeHhKkMm]/.test(number)) {
            return ValidationResult.Invalid("Invalid format");
        } else if (this.calculateChecksum(number) !== number[number.length - 1]) {
            return ValidationResult.InvalidChecksum();
        }
        return ValidationResult.Success();
    }

    private calculateChecksum(number: string): string {
        number = number.toUpperCase();
        const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const weights = [29, 23, 19, 17, 13, 7, 5, 3];
        if (!/^\d/.test(number[1])) {
            number = `${number[0]}${"ABCEHKMOPT".indexOf(number[1])}${number.substring(2)}`;
        }
        let sum = 0;
        for (let i = 0; i < weights.length; i++) {
            sum += weights[i] * alphabet.indexOf(number[i]);
        }
        sum %= 11;
        if (sum > 9) {
            return '';
        }
        return sum.toString();
    }


}