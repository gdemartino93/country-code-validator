import { Country } from "./CountryValidator/Country";
import { getCountryFromString } from "./CountryValidator/Utils/stringToCountry";
import { ValidationResult } from "./CountryValidator/ValidationResult";
import { getCorrectValidatorForCountry } from "./CountryValidator/Utils/validatorFromCountry";

export function postalCodeValidator(postalCode: string) : ValidationResult{
    let result: ValidationResult;
    result = validateInput(postalCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
    var country = getCountryFromString(postalCode.substring(0, 2));
    console.log('country name is: ' + Country[country as unknown as keyof typeof Country] + ' Country value: ' + country);
    const validator = getCorrectValidatorForCountry(country);
    if (!validator) {
        return returnResult(false, 'No validator available for this country!');
    }
    result = validator.validatePostalCode(postalCode);
    console.log('final result is: ', result);
    return result;
}
function validateInput(postalCode: string): ValidationResult{
    let result: ValidationResult;
    result = validatePostalCodeInput(postalCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
    return returnResult(true);
}
function validatePostalCodeInput(postalCode: string): ValidationResult{
    if(postalCode == null || postalCode.trim() === ''){
        return returnResult(false, 'Postal code is required!');
    }
    if(postalCode.length < 2 || postalCode.length > 10){
        return returnResult(false, 'Invalid postal code length!');
    }
    const countryCode = postalCode.substring(0, 2);
    const countryCodeRegex = /^[A-Za-z]{2}$/;
    if (!countryCodeRegex.test(countryCode)) {
        return returnResult(false, 'The first 2 characters of the postal code do not correspond to a valid country code.');
    }
    var country = getCountryFromString(countryCode);
    if (country == Country.XX) {
        return returnResult(false, 'The first 2 characters of the postal code do not correspond to a valid country code.');
    }
    return returnResult(true);
}
function returnResult(isValid: boolean, error?: string): ValidationResult {
    return {
        isValid: isValid,
        errorMessage: error
    };
}