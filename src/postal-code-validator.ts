import { Country } from "./CountryValidator/Country";
import { getCountryFromString } from "./CountryValidator/Utils/stringToCountry";
import { ValidationResult } from "./CountryValidator/ValidationResult";
import { getCorrectValidatorForCountry } from "./CountryValidator/Utils/validatorFromCountry";
import { returnResult, validateCountryCodeInput } from "./CountryValidator/Utils/validateCountryCode";

export function postalCodeValidator(countryCode: string, postalCode: string) : ValidationResult{
    let result: ValidationResult;
    validateInputs(countryCode, postalCode);
    var country = getCountryFromString(postalCode.substring(0, 2));
    const validator = getCorrectValidatorForCountry(country);
    if (!validator) {
        return returnResult(false, 'No validator available for this country!');
    }
    result = validator.validatePostalCode(postalCode);
    return result;
}
function validateInputs(countryCode: string, taxCode: string){
    let result: ValidationResult;
    result = validateCountryCodeInput(countryCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
    result = validatePostalCodeInput(taxCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
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