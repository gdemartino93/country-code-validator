import { CountryValidator } from '../CodeValidation';
import { ValidationResult } from '../ValidationResult';
import { removeSpecialCharacters } from './../Utils/removeSpecialCharacters';

export class AlbaniaValidator implements CountryValidator {

    private static readonly NID_REGEX = /^[A-O]\d(0[1-9]|1[0-2]|5[1-9]|6[0-2])(0?[1-9]|[1-3][0-9]|4[0-2])\d{3}\w$/;
    private static readonly VAT_REGEX = /^[JKL][0-9]{8}[A-Z]$/;
    private static readonly POSTAL_CODE_REGEX = /^\d{4}$/;

    private static readonly COUNTRY_CODE = 'AL';

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
        return this.validateVatCode(nipt);
    }

    // Unique com­pany identifier
    // Com­pa­nies in Albania are issued with a unique tax number (Numri i Identifikimit për Personin e Tatueshëm - NIPT).
    // VATify.eu checks com­pa­nies using the tax number in the offi­ci­al register. Here is a list of valid number formats:
    // Type	Number format	Description
    // NIPT	J12345678A	10 character code, starting with "J", followed by 8 digits and ending in a letter
    // NIPT	K12345678B	10 character code, starting with "K", followed by 8 digits and ending in a letter
    // NIPT	L12345678C	10 character code, starting with "L", followed by 8 digits and ending in a letter
    
    public validateVatCode(nipt: string): ValidationResult {
        nipt = removeSpecialCharacters(nipt);
        nipt = nipt.replace(AlbaniaValidator.COUNTRY_CODE, '').toUpperCase();

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
        if (!AlbaniaValidator.POSTAL_CODE_REGEX.test(postalCode)) {
            return ValidationResult.InvalidFormat('NNNN');
        }
        return ValidationResult.Success();
    }
}
