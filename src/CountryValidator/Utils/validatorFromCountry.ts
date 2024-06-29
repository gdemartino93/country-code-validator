import { CountryValidator } from "../CodeValidation";
import { AlbaniaValidator } from "../CountriesValidators/AlbaniaValidator";
import { AndorraValidator } from "../CountriesValidators/AndorraValidator";
import { ArgentinaValidator } from "../CountriesValidators/ArgentinaValidator";
import { ItalyValidator } from "../CountriesValidators/ItalyValidator";
import { Country } from "../Country";


// mappings validators with key of country
const validators: { [key in keyof typeof Country]?: CountryValidator } = {
    [Country.AL]: new AlbaniaValidator(),
    [Country.AD]: new AndorraValidator(),
    [Country.AR]: new ArgentinaValidator(),
    [Country.IT]: new ItalyValidator(),
    
    // ong add other validators
};

export function getCorrectValidatorForCountry(countryCode: Country): CountryValidator | null {
    return validators[countryCode] || null;
}