import { CountryValidator } from '../CodeValidation';
import { ValidationResult } from '../ValidationResult';
import { removeSpecialCharacters } from './../Utils/removeSpecialCharacters';

export class ArgentinaValidator implements CountryValidator{
    
    // CUIT is the Argentine vat code example: 20345678906
    // DNI is the Argentine National Identity Number (ssn) example: 12345678
    // Postal code example: 1001 or A1001AAA

    COUNTRY_CODE: string = 'AR';
    private readonly CUIT_REGEX = /^\d{11}$/;
    private readonly DNI_REGEX = /^\d{8}$/;
    private readonly CBU_REGEX = /^[0-9]{22}$/;
    private readonly POSTAL_CODE_REGEX = /^\d{4}|[A-Za-z]\d{4}[a-zA-Z]{3}$/;

    public validateIndividualTaxCode(dni: string): ValidationResult {
        return this.validateNationalIdentity(dni);
    }

    public validateVatCode(cuit: string): ValidationResult {
        return this.validateCuit(cuit);
    }

    public validateEntity(id: string): ValidationResult {
        return this.validateCuit(id);
    }

    public validateNationalIdentity(dni: string): ValidationResult {
        dni = removeSpecialCharacters(dni);

        if (!this.DNI_REGEX.test(dni)) {
            return ValidationResult.InvalidFormat('12345678');
        }

        const dniNumber = parseInt(dni, 10);
        if (dniNumber >= 10000000 && dniNumber <= 99999999) {
            return ValidationResult.Success();
        }

        return ValidationResult.Invalid('Invalid');
    }

    private validateCuit(cuit: string): ValidationResult {
        cuit = removeSpecialCharacters(cuit);
        if (!this.CUIT_REGEX.test(cuit)) {
            return ValidationResult.InvalidFormat('27355362685');
        }

        const calculatedDigit = this.calculateCuitDigit(cuit);
        const checkDigit = parseInt(cuit.substring(10), 10);
        const isValid = calculatedDigit === checkDigit;

        return isValid ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }

    private calculateCuitDigit(cuit: string): number {
        const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
        const digits = cuit.split('').map(char => parseInt(char, 10));
        const total = multipliers.reduce((sum, multiplier, i) => sum + digits[i] * multiplier, 0);
        const remainder = total % 11;

        if (remainder === 0) return 0;
        if (remainder === 1) return 9;
        return 11 - remainder;
    }

    public validateCBU(cbu: string): ValidationResult {
        cbu = removeSpecialCharacters(cbu);

        if (!this.CBU_REGEX.test(cbu)) {
            return ValidationResult.InvalidFormat('1234567890123456789012');
        }

        const getChecksumDigit = (value: string): string => {
            const weights = [3, 1, 7, 9];
            const sum = value.split('').reverse().reduce((acc, char, i) => {
                return acc + parseInt(char, 10) * weights[i % 4];
            }, 0);
            return ((10 - (sum % 10)) % 10).toString();
        };

        if (cbu[7] !== getChecksumDigit(cbu.substring(0, 7))) {
            return ValidationResult.InvalidChecksum();
        }
        if (cbu[21] !== getChecksumDigit(cbu.substring(8, 13))) {
            return ValidationResult.InvalidChecksum();
        }

        return ValidationResult.Success();
    }

    public validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        postalCode = postalCode.replace(this.COUNTRY_CODE, '').toUpperCase();
        if (!this.POSTAL_CODE_REGEX.test(postalCode)) {
            return ValidationResult.InvalidFormat('NNNN OR ANNNNAAA');
        }

        return ValidationResult.Success();
    }
}
