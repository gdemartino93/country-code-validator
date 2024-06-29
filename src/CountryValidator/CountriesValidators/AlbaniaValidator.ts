import { CountryValidator } from '../CodeValidation';
import { ValidationResult } from '../ValidationResult';
import { removeSpecialCharacters } from './../Utils/removeSpecialCharacters';

export class AlbaniaValidator implements CountryValidator {
    
    // NIPT is the Albanian VAT number example: J12345678N
    // NID is the Albanian National Identity Number (ssn) example: A12345678A
    // postal code example: 1001

    COUNTRY_CODE: string = 'AL';
    private static readonly NID_REGEX = /^[A-O]\d(0[1-9]|1[0-2]|5[1-9]|6[0-2])(0?[1-9]|[1-3][0-9]|4[0-2])\d{3}\w$/;
    private static readonly VAT_REGEX = /^[JKL][0-9]{8}[A-Z]$/;
    private static readonly POSTAL_CODE_REGEX = /^\d{4}$/;

    public validateNationalIdentity(ssn: string): ValidationResult {
        ssn = removeSpecialCharacters(ssn);

        if (ssn.length !== 10) {
            return ValidationResult.InvalidLength();
        } else if (!AlbaniaValidator.NID_REGEX.test(ssn)) {
            return ValidationResult.InvalidFormat('YYMMDDSSSC');
        }

        return ValidationResult.Success();
    }

    public validateIndividualTaxCode(nipt: string): ValidationResult {
        return this.validateNationalIdentity(nipt);
    }
    
    public validateVatCode(nipt: string): ValidationResult {
        nipt = removeSpecialCharacters(nipt);
        nipt = nipt.replace(this.COUNTRY_CODE, '').toUpperCase();

        if (nipt.length !== 10) {
            return ValidationResult.InvalidLength();
        }
        if (!AlbaniaValidator.VAT_REGEX.test(nipt)) {
            return ValidationResult.InvalidFormat('[JKL]12345678A');
        }
        return ValidationResult.Success();
    }

    public validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        postalCode = postalCode.replace(this.COUNTRY_CODE, '').toUpperCase();
        if (!AlbaniaValidator.POSTAL_CODE_REGEX.test(postalCode)) {
            return ValidationResult.InvalidFormat('NNNN');
        }
        return ValidationResult.Success();
    }
}
