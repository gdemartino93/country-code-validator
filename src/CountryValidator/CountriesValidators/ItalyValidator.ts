import { CountryValidator } from '../CodeValidation';
import { ValidationResult } from '../ValidationResult';
import { removeSpecialCharacters } from './../Utils/removeSpecialCharacters';
export class ItalyValidator implements CountryValidator {

    // Fiscal code example: RSSMRA80A01H501S
    // VAT number example: 11861041009
    // Postal code example: 00042

    COUNTRY_CODE: string = 'IT';

    private static readonly OmocodeChars = "LMNPQRSTUV";
    private static readonly ControlCodeArray = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];
    private static readonly CheckRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;

    public validateIndividualTaxCode(ssn: string): ValidationResult {
        ssn = removeSpecialCharacters(ssn);

        if (!ssn || ssn.length < 16) {
            return ValidationResult.Invalid("Invalid length. The code must have 16 characters");
        }

        ssn = this.normalize(ssn, false);
        if (!ItalyValidator.CheckRegex.test(ssn)) {
            const nonOmocodeFC = this.replaceOmocodeChars(ssn);
            if (!ItalyValidator.CheckRegex.test(nonOmocodeFC)) {
                return ValidationResult.InvalidFormat("12345678901");
            }
        }
        const isValid = ssn[15] === this.getControlChar(ssn.substring(0, 15));
        return isValid ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }

    private replaceOmocodeChars(fc: string): string {
        let fcChars = fc.split('');
        const positions = [6, 7, 9, 10, 12, 13, 14];
        for (const i of positions) {
            if (!/\d/.test(fcChars[i])) {
                fcChars[i] = ItalyValidator.OmocodeChars[ItalyValidator.OmocodeChars.indexOf(fcChars[i])];
            }
        }
        return fcChars.join('');
    }

    private getControlChar(f15: string): string {
        let tot = 0;
        const arrCode = new TextEncoder().encode(f15.toUpperCase());
        for (let i = 0; i < f15.length; i++) {
            if ((i + 1) % 2 === 0) {
                tot += /\D/.test(f15[i])
                    ? arrCode[i] - 'A'.charCodeAt(0)
                    : arrCode[i] - '0'.charCodeAt(0);
            } else {
                tot += /\D/.test(f15[i])
                    ? ItalyValidator.ControlCodeArray[arrCode[i] - 'A'.charCodeAt(0)]
                    : ItalyValidator.ControlCodeArray[arrCode[i] - '0'.charCodeAt(0)];
            }
        }
        tot %= 26;
        return String.fromCharCode(tot + 'A'.charCodeAt(0));
    }

    private normalize(s: string, normalizeDiacritics: boolean): string {
        if (!s) return s;
        s = s.trim().toUpperCase();
        if (normalizeDiacritics) {
            const src = "ÀÈÉÌÒÙàèéìòù";
            const rep = "AEEIOUAEEIOU";
            for (let i = 0; i < src.length; i++) {
                s = s.replace(new RegExp(src[i], 'g'), rep[i]);
            }
        }
        return s;
    }

    public validateVatCode(vat: string): ValidationResult {
        vat = removeSpecialCharacters(vat);
        vat = vat.replace(this.COUNTRY_CODE, '');

        if (!/^\d{11}$/.test(vat)) {
            return ValidationResult.InvalidFormat("12345678901");
        }

        const multipliers = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
        const firstSeven = parseInt(vat.substring(0, 7), 10);
        if (isNaN(firstSeven) || firstSeven === 0) {
            return ValidationResult.Invalid("Invalid format");
        }

        const temp = parseInt(vat.substring(7, 10), 10);
        if ((temp < 1 || temp > 201) && temp !== 999 && temp !== 888) {
            return ValidationResult.Invalid("Invalid");
        }

        let sum = 0;
        for (let i = 0; i < multipliers.length; i++) {
            let tempVal = parseInt(vat[i], 10) * multipliers[i];
            sum += tempVal > 9 ? Math.floor(tempVal / 10) + tempVal % 10 : tempVal;
        }

        const checkDigit = (10 - (sum % 10)) % 10;
        const isValid = checkDigit === parseInt(vat[10], 10);
        return isValid ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }

    public validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        postalCode = postalCode.replace(this.COUNTRY_CODE, '').toUpperCase();
        if (!/^\d{5}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("11111");
        }
        return ValidationResult.Success();
    }
}
