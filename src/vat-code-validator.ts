import { Country } from "./CountryValidator/Country";
import { getCountryFromString } from "./CountryValidator/Utils/stringToCountry";
import { getCorrectValidatorForCountry } from "./CountryValidator/Utils/validatorFromCountry";
import { ValidationResult } from "./CountryValidator/ValidationResult";

export function vatCodeValidator(vatCode: string) : ValidationResult{
    let result: ValidationResult;
    result = validateInput(vatCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
    var country = getCountryFromString(vatCode.substring(0, 2));
    console.log('country name is: ' + Country[country as unknown as keyof typeof Country] + ' Country value: ' + country);

    const validator = getCorrectValidatorForCountry(country);
    if (!validator) {
        return returnResult(false, 'No validator available for this country!');
    }
    console.log('validator used is: ', validator.constructor.name);
    result = validator.validateVatCode(vatCode.substring(2));
    console.log('final result is: ', result);
    return result;
}

function validateInput(vatCode: string): ValidationResult{
    let result: ValidationResult;
    result = validateVatCodeInput(vatCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
    return returnResult(true);
}

function returnResult(isValid: boolean, error?: string): ValidationResult {
    return {
        isValid: isValid,
        errorMessage: error
    };
}
function validateVatCodeInput(vatCode: string): ValidationResult{
    if(vatCode == null || vatCode.trim() === ''){
        return returnResult(false, 'Vat code is required!');
    }
    if(vatCode.length < 7 || vatCode.length > 25){
        return returnResult(false, 'Invalid vat code length!');
    }
    const countryCode = vatCode.substring(0, 2);
    const countryCodeRegex = /^[A-Za-z]{2}$/;
    if (!countryCodeRegex.test(countryCode)) {
        return returnResult(false, 'The first 2 characters of the VAT code do not correspond to a valid country code.');
    }
    var country = getCountryFromString(countryCode);
    if (country == Country.XX) {
        return returnResult(false, 'The first 2 characters of the VAT code do not correspond to a valid country code.');
    }
    return returnResult(true);
}
