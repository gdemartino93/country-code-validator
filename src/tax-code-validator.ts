import { Country } from "./CountryValidator/Country";
import { getCountryFromString } from "./CountryValidator/Utils/stringToCountry";
import { ValidationResult } from "./CountryValidator/ValidationResult";
import { getCorrectValidatorForCountry } from "./CountryValidator/Utils/validatorFromCountry";

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
    var country = getCountryFromString(countryCode);
    console.log('country is: ', country);
    const validator = getCorrectValidatorForCountry(country);
    if (!validator) {
        return returnResult(false, 'No validator available for this country!');
    }
    console.log('validator used is: ', validator.constructor.name);
    result = validator.validateIndividualTaxCode(taxCode);
    return returnResult(result.isValid, result.error);   
}

function validateCountryCodeInput(countryCode: string) {
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

function returnResult(isValid: boolean, error?: string): ValidationResult {
    return {
        isValid: isValid,
        error: error
    };
}

function validateInputTaxCode(taxCode: string): ValidationResult{
    if(taxCode == null || taxCode.trim() === ''){
        return returnResult(false, 'Tax code is required!');
    }
    if(taxCode.length < 7 || taxCode.length > 25){
        return returnResult(false, 'Invalid tax code length!');
    }
    return returnResult(true);
}

