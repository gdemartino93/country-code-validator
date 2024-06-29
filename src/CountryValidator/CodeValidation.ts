import { ValidationResult } from './ValidationResult';

export interface CountryValidator {
    validateIndividualTaxCode(taxCode: string): ValidationResult;
    validateVatCode(vatCode: string): ValidationResult;
}
