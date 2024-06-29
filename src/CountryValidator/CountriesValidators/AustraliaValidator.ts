import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class AustraliaValidator implements CountryValidator {

    COUNTRY_CODE: string = 'AU';
    // abn is austrlian vat code example: 12004044937
    // tfn is australian fiscal code example: 583088886
    // austrlian postal code example: 4215

    public validateIndividualTaxCode(taxCode: string): ValidationResult {
        taxCode = removeSpecialCharacters(taxCode);
        if (!/^\d+$/.test(taxCode)) {
            return ValidationResult.InvalidFormat("583088886");
        }
        if (!(taxCode.length === 8 || taxCode.length === 9)) {
            return ValidationResult.InvalidLength();
        }
        if (this.checkSumTFN(taxCode) !== 0) {
            return ValidationResult.InvalidChecksum();
        }
        return ValidationResult.Success();
    }

    public validateVatCode(vatCode: string): ValidationResult {
        vatCode = removeSpecialCharacters(vatCode);
        if (!vatCode || vatCode.length !== 11) {
            return ValidationResult.InvalidLength();
        } else if (!/^\d+$/.test(vatCode)) {
            return ValidationResult.InvalidFormat("12004044937");
        }
    
        return this.isValidABNChecksum(vatCode) ? 
            ValidationResult.Success() : 
            ValidationResult.InvalidChecksum();
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        const postalCodePattern = /^\d{4}$/;
        
        if (!postalCodePattern.test(postalCode)) {
            return ValidationResult.InvalidFormat("4215");
        }
        return ValidationResult.Success();
    }
    
    private isValidABNChecksum(vatCode: string): boolean {
        let s = 0;
        const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    
        for (let i = 0; i < vatCode.length; i++) {
            if (i === 0) {
                s += weights[i] * (parseInt(vatCode[i], 10) - 1);
            } else {
                s += weights[i] * parseInt(vatCode[i], 10);
            }
        }  
        return s % 89 === 0;
    }

    private checkSumTFN(number: string): number {
        const weights: number[] = [1, 4, 3, 7, 5, 8, 6, 9, 10];
        let sum: number = 0;
        
        for (let i = 0; i < number.length; i++) {
            sum += parseInt(number[i], 10) * weights[i];
        }
        
        return sum % 11;
    }
}