import { ValidationResult } from './ValidationResult';

export interface CountryValidator {
    validateIndividualTaxCode(taxCode: string): ValidationResult;
    validateVatCode(vatCode: string): ValidationResult;
    validatePostalCode(postalCode: string): ValidationResult;
    COUNTRY_CODE: string;
}
