import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BahrainValidator implements CountryValidator{
    COUNTRY_CODE: string = 'BH';

    validateIndividualTaxCode(id: string): ValidationResult {
        id = removeSpecialCharacters(id);
        if (!/^\d{9}$/.test(id)) {
            return ValidationResult.Invalid("123456789");
        }
        return ValidationResult.Success();
    }
    
    validateVatCode(vatCode: string): ValidationResult {
        throw new Error("Method not implemented.");
    }
    validatePostalCode(postalCode: string): ValidationResult {
        throw new Error("Method not implemented.");
    }


}