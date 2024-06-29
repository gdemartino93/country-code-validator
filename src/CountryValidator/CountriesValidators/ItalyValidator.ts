import { CountryValidator } from "../CodeValidation";
import { Country } from "../Country";
import { ValidationResult } from "../ValidationResult";

export class ItalyValidator implements CountryValidator {
    private static readonly OmocodeChars = "LMNPQRSTUV";
    private static readonly ControlCodeArray = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23];
    private static readonly CheckRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;

    countryCode: string;

    constructor() {
        this.countryCode = Country[Country.IT];
    }

    public validateIndividualTaxCode(ssn: string): ValidationResult {
        ssn = this.removeSpecialCharacters(ssn);

        if (!ssn || ssn.length < 16) {
            return { isValid: false, error: 'Invalid length. The code must have 16 characters' };
        }

        ssn = this.normalize(ssn, false);
        if (!ItalyValidator.CheckRegex.test(ssn)) {
            const nonOmocodeFC = this.replaceOmocodeChars(ssn);
            if (!ItalyValidator.CheckRegex.test(nonOmocodeFC)) {
                return { isValid: false, error: 'Invalid format' };
            }
        }

        const isValid = ssn[15] === this.getControlChar(ssn.substring(0, 15));
        return isValid ? { isValid: true } : { isValid: false, error: 'Invalid checksum' };
    }

    private replaceOmocodeChars(fc: string): string {
        const fcChars = fc.split('');
        const positions = [6, 7, 9, 10, 12, 13, 14];

        positions.forEach(pos => {
            if (isNaN(Number(fcChars[pos]))) {
                fcChars[pos] = ItalyValidator.OmocodeChars.indexOf(fcChars[pos]).toString()[0];
            }
        });

        return fcChars.join('');
    }

    private getControlChar(f15: string): string {
        let total = 0;
        const arrCode = f15.toUpperCase().split('');

        for (let i = 0; i < f15.length; i++) {
            if ((i + 1) % 2 === 0) {
                total += isNaN(Number(arrCode[i]))
                    ? arrCode[i].charCodeAt(0) - 'A'.charCodeAt(0)
                    : arrCode[i].charCodeAt(0) - '0'.charCodeAt(0);
            } else {
                total += isNaN(Number(arrCode[i]))
                    ? ItalyValidator.ControlCodeArray[arrCode[i].charCodeAt(0) - 'A'.charCodeAt(0)]
                    : ItalyValidator.ControlCodeArray[arrCode[i].charCodeAt(0) - '0'.charCodeAt(0)];
            }
        }

        total %= 26;
        return String.fromCharCode(total + 'A'.charCodeAt(0));
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

    private removeSpecialCharacters(s: string): string {
        return s.replace(/[^a-zA-Z0-9]/g, '');
    }
}