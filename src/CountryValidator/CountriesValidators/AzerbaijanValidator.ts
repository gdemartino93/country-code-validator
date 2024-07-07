import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class AzerbaijanValidator implements CountryValidator{
    COUNTRY_CODE: string = 'AZ';

    validateIndividualTaxCode(taxCode: string): ValidationResult {
        return this.validateEntity(taxCode);
    }
    
    validateVatCode(vatCode: string): ValidationResult {
        return this.validateEntity(vatCode);
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^[Aa][Zz]\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat('CCNNNN');
        }
        return ValidationResult.Success();
    }

    validateEntity(id: string): ValidationResult {
        id = removeSpecialCharacters(id);
        if (!/^\d{10}$/.test(id)) {
            return ValidationResult.InvalidFormat('1234567890');
        }
        return ValidationResult.Success();
    }

}