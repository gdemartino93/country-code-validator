import { CountryValidator } from "../CodeValidation";
import { mod } from "../Utils/arithmeticFunctions";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class AustriaValidator implements CountryValidator{

    // Fiscal code example: 223456781
    // VAT number example: ATU73071025
    // Postal code example: 1020  
    COUNTRY_CODE: string = 'AT';

    // Validate Austrian tax identification number (Abgabenkontonummer)
    public validateIndividualTaxCode(taxCode: string): ValidationResult {
        taxCode = removeSpecialCharacters(taxCode);
        if (taxCode.length !== 9) {
            return ValidationResult.InvalidLength();
        } else if (!/^\d+$/.test(taxCode)) {
            return ValidationResult.InvalidFormat('223456781');
        } else if (this.calculateChecksumTaxCode(taxCode) !== parseInt(taxCode[taxCode.length - 1], 10)) {
            return ValidationResult.InvalidChecksum();
        }
        return ValidationResult.Success();
    }

    // Calculate checksum for tax code
    private calculateChecksumTaxCode(number: string): number {
        let sum = 0;
        for (let i = 0; i < 8; i++) {
            const n = parseInt(number[i], 10);
            if (i % 2 !== 0) {
                sum += parseInt("0246813579"[n], 10);
            } else {
                sum += n;
            }
        }
        return mod(10 - sum, 10);
    }

    public validateVatCode(vatCode: string): ValidationResult {
        vatCode = removeSpecialCharacters(vatCode).replace(/AT|at/g, '');

        if (!/^U\d{8}$/.test(vatCode)) {
            return ValidationResult.InvalidFormat('ATU73071025');
        }

        const multipliers = [1, 2, 1, 2, 1, 2, 1];
        let sum = 0;
        let index = 1;

        for (const digit of multipliers) {
            const temp = parseInt(vatCode[index++], 10) * digit;
            sum += temp > 9 ? Math.floor(temp / 10) + (temp % 10) : temp;
        }

        let checkDigit = 10 - (sum + 4) % 10;
        if (checkDigit === 10) {
            checkDigit = 0;
        }

        if (checkDigit === parseInt(vatCode[8], 10)) {
            return ValidationResult.Success();
        } else {
            return ValidationResult.InvalidChecksum();
        }
    }

    // Validate postal code
    public validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat('1020');
        }
        return ValidationResult.Success();
    }

}
