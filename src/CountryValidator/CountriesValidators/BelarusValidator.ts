import { CountryValidator } from "../CodeValidation";
import { translit } from "../Utils/cyrillicToLatin";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BelarusValidator implements CountryValidator{

    // Passport Number (PN)
    // For Individuals
    // The Belarusian Passport Number is 9 characters and is often used in lieu of a tax ID number on international tax forms.

    // UNP Number (UNP)
    // For Individuals, Entities, VAT, Example: 623456785
    // The UNP Number is 9 digits in the format NNNNNNNNN where the last digit is a check digit. It also contains a regional identifier. It is issued to organizations and individuals for tax purposes. Belarus is not an EU member state and therefore their VAT numbers are not available for lookup in the VIES database.

    // postal code example: 222820
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
        
        // if (!/^[AaBbCcEeHhKkMmOoPpTt]{2}/.test(vatId)) {
        //     return ValidationResult.Invalid("Invalid format");
        // }
        if (!/^\d{2}/.test(vatId)) {
            return ValidationResult.Invalid("Invalid format");
        }
        return this.validateUNP(vatId);
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{6}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("222820");
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