import { Country } from "./CountryValidator/Country";
import { getCountryFromString } from "./CountryValidator/Utils/mappings";
import { ValidationResult } from "./CountryValidator/ValidationResult";

export function taxCodeValidator(countryCode: string, taxCode: string) : ValidationResult{
    let result: ValidationResult;
    result = validateCountryCodeInput(countryCode);
    if(!result.isValid){
        return returnResult(false, result.error);
    }
    result = validateInputTaxCode(taxCode);
    if(!result.isValid){
        return returnResult(false, result.error);
    }

    return returnResult(result.isValid, result.error);
    
}

export function validateCountryCodeInput(countryCode: string) {
    if (!countryCode || countryCode.trim() === '') {
        return returnResult(false, 'Country code is required!');
    }
    if (countryCode.length !== 2) {
        return returnResult(false, 'Country code must be exactly 2 characters long!');
    }
    const knownCountry = getCountryFromString(countryCode);
    if (knownCountry == Country.XX){
        return returnResult(false, 'Country code does not match any known country!');
    }
    return returnResult(true);
}

export function returnResult(isValid: boolean, error?: string): ValidationResult {
    return {
        isValid: isValid,
        error: error
    };
}

export function validateInputTaxCode(taxCode: string): ValidationResult{
    if(taxCode == null || taxCode.trim() === ''){
        return returnResult(false, 'Tax code is required!');
    }
    if(taxCode.length < 7 || taxCode.length > 25){
        return returnResult(false, 'Invalid tax code length!');
    }
    return returnResult(true);
}

