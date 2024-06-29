import { CountryValidator } from "../CodeValidation";
import { ItalyValidator } from "../CountriesValidators/ItalyValidator";
import { Country } from "../Country";


// mappings validators with key of country
const validators: { [key in keyof typeof Country]?: CountryValidator } = {
    [Country.IT]: new ItalyValidator(),
    // ong add other validators
};

export function getCorrectValidatorForCountry(countryCode: Country): CountryValidator | null {
    return validators[countryCode] || null;
}