import { Country } from "../Country";
import { ValidationResult } from "../ValidationResult";
import { getCountryFromString } from "./stringToCountry";

export function validateCountryCodeInput(countryCode: string) {
    if(!countryCode || countryCode.trim() === '') {
        return returnResult(false, 'Country code is required!');
    }
    if(countryCode.length !== 2) {
        return returnResult(false, 'Country code must be exactly 2 characters long!');
    }
    const knownCountry = getCountryFromString(countryCode);
    if(knownCountry == Country.XX){
        return returnResult(false, 'Country code does not match any known country!');
    }
    return returnResult(true);
}
export function returnResult(isValid: boolean, error?: string): ValidationResult {
    return {
        isValid: isValid,
        errorMessage: error
    };
}