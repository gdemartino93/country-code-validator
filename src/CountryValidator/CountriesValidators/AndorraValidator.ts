import { CountryValidator } from '../CodeValidation';
import { ValidationResult } from '../ValidationResult';
import { removeSpecialCharacters } from './../Utils/removeSpecialCharacters';

export class AndorraValidator implements CountryValidator {
    
    COUNTRY_CODE: string = 'AD';

    private static readonly INVALID_FORMAT_REGEX = /^[ACDEFGLOPU]/;
    private static readonly POSTAL_CODE_REGEX = /^[Aa][Dd]\d{3}$/;

    public validateIndividualTaxCode(id: string): ValidationResult {
        id = removeSpecialCharacters(id).replace(this.COUNTRY_CODE, '');

        if (id.length !== 8) {
            return ValidationResult.InvalidLength();
        }
        if (!/[A-Z]/.test(id[0]) || !/[A-Z]/.test(id[id.length - 1])) {
            return ValidationResult.Invalid('Invalid format. First and last character must be letters');
        } else if (!/^\d{6}$/.test(id.substring(1, 7))) {
            return ValidationResult.InvalidFormat('F-123456-Z');
        } else if (!AndorraValidator.INVALID_FORMAT_REGEX.test(id[0])) {
            return ValidationResult.Invalid('Invalid format. First letter must be ACDEFGLOPU');
        } else if (id[0] === 'F' && parseInt(id.substring(1, 7)) > 699999) {
            return ValidationResult.Invalid('Invalid format. The number code cannot be higher than 699999');
        }
        if ((id[0] === 'A' || id[0] === 'L') && !(699999 < parseInt(id.substring(1, 7)) && parseInt(id.substring(1, 7)) < 800000)) {
            return ValidationResult.Invalid('Invalid format. The number code must be between 699999 and 800000');
        }

        return ValidationResult.Success();
    }

    public validateVatCode(vatCode: string): ValidationResult {
        return this.validateIndividualTaxCode(vatCode);
    }

    public validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        postalCode = postalCode.replace(this.COUNTRY_CODE, '').toUpperCase();
        if (!AndorraValidator.POSTAL_CODE_REGEX.test(postalCode)) {
            return ValidationResult.InvalidFormat('CCNNN');
        }
        return ValidationResult.Success();
    }
}
