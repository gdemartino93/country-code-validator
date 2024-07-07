import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class AzerbaijanValidator implements CountryValidator{

    // The Azerbaijani TIN is a ten-digit code, where the first two digits characterize code of territorial administrative unit and the following six digits characterize a serial number. The software determines the ninth digit via special algorithm, and the legal status of a taxpayer by assigning number 1 for legal persons and number 2 for natural persons as the tenth digit. The State Tax Service under the Ministry of Economy of the Republic of Azerbaijan issues tax identification number (TIN), that is a unique number on the territory of the Republic of Azerbaijan, to each taxpayer for all taxes, including payments related to the transfer of goods across the customs border of the Republic of Azerbaijan.

    // For Individuals, Companies, Example: 1525855852
    // Postal Code example: 1001
    
    COUNTRY_CODE: string = 'AZ';

    validateIndividualTaxCode(taxCode: string): ValidationResult {
        return this.validateEntity(taxCode);
    }
    
    validateVatCode(vatCode: string): ValidationResult {
        return this.validateEntity(vatCode);
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat('NNNN');
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