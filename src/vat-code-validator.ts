import { Country } from "./CountryValidator/Country";
import { getCountryFromString } from "./CountryValidator/Utils/stringToCountry";
import { returnResult, validateCountryCodeInput } from "./CountryValidator/Utils/validateCountryCode";
import { getCorrectValidatorForCountry } from "./CountryValidator/Utils/validatorFromCountry";
import { ValidationResult } from "./CountryValidator/ValidationResult";

export function vatCodeValidator(countryCode: string, vatCode: string) : ValidationResult{
    let result: ValidationResult;
    validateInputs(countryCode, vatCode);
    var country = getCountryFromString(countryCode);
    const validator = getCorrectValidatorForCountry(country);
    if (!validator) {
        return returnResult(false, 'No validator available for this country!');
    }
    result = validator.validateVatCode(vatCode);
    return result;
}

function validateInputs(countryCode: string, taxCode: string){
    let result: ValidationResult;
    result = validateCountryCodeInput(countryCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
    result = validateVatCodeInput(taxCode);
    if(!result.isValid){
        return returnResult(false, result.errorMessage);
    }
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
