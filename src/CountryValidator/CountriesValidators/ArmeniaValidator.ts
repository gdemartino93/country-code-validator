import { CountryValidator } from '../CodeValidation';
import { ValidationResult } from '../ValidationResult';
import { removeSpecialCharacters } from './../Utils/removeSpecialCharacters';

export class ArmeniaValidator implements CountryValidator{

    // Individual tax code example: 12345678
    // VAT number example: 12345678
    // Postal code example: 0010
    COUNTRY_CODE: string = 'AM';

    validateIndividualTaxCode(ssn: string): ValidationResult {
        ssn = removeSpecialCharacters(ssn);
        ssn = ssn.replace(this.COUNTRY_CODE, '');
        if (!/^\d{8}$/.test(ssn)) {
            return ValidationResult.InvalidFormat('12345678');
        }
        return ValidationResult.Success();
    }
    validateVatCode(vatCode: string): ValidationResult {
        return this.validateIndividualTaxCode(vatCode);
    }
    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        postalCode = postalCode.replace(this.COUNTRY_CODE, '');

        if (!/^\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat('NNNN');
        }
        return ValidationResult.Success();
    }
}