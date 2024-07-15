import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BoliviaValidator implements CountryValidator {
    // VAT Code (Número de Identificación Tributaria - NIT):

    // A NIT in Bolivia is typically an 11-digit number.
    // SSN (Cédula de Identidad - CI):
    
    // The CI in Bolivia varies in length and format, but generally, it includes numbers and sometimes letters. It can be up to 9 digits long, sometimes followed by an optional character indicating the region.
    // Postal Code:
    
    // Bolivian postal codes are 4 digits long.

    COUNTRY_CODE: string = 'BO';

    validateIndividualTaxCode(ssn: string): ValidationResult {
        ssn = removeSpecialCharacters(ssn);
        if (!/^\d{5,8}\w?$/.test(ssn)) {
            return ValidationResult.InvalidFormat("1234567A");
        }
        return ValidationResult.Success();
    }

    validateVatCode(vatCode: string): ValidationResult {
        vatCode = removeSpecialCharacters(vatCode);
        if (!/^\d{7,11}$/.test(vatCode)) {
            return ValidationResult.InvalidFormat("1111111");
        }
        return ValidationResult.Success();
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("1000");
        }
        return ValidationResult.Success();
    }
}