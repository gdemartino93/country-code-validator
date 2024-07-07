import { CountryValidator } from "../CodeValidation";
import { AlbaniaValidator } from "../CountriesValidators/AlbaniaValidator";
import { AndorraValidator } from "../CountriesValidators/AndorraValidator";
import { ArgentinaValidator } from "../CountriesValidators/ArgentinaValidator";
import { ArmeniaValidator } from "../CountriesValidators/ArmeniaValidator";
import { AustraliaValidator } from "../CountriesValidators/AustraliaValidator";
import { AustriaValidator } from "../CountriesValidators/AustriaValidator";
import { AzerbaijanValidator } from "../CountriesValidators/AzerbaijanValidator";
import { BahrainValidator } from "../CountriesValidators/BahrainValidator";
import { BelarusValidator } from "../CountriesValidators/BelarusValidator";
import { ItalyValidator } from "../CountriesValidators/ItalyValidator";
import { Country } from "../Country";


// mappings validators with key of country
const validators: { [key in keyof typeof Country]?: CountryValidator } = {
    [Country.AL]: new AlbaniaValidator(),
    [Country.AD]: new AndorraValidator(),
    [Country.AR]: new ArgentinaValidator(),
    [Country.AM]: new ArmeniaValidator(),
    [Country.AU]: new AustraliaValidator(),
    [Country.AT]: new AustriaValidator(),
    [Country.AZ]: new AzerbaijanValidator(),
    [Country.BH]: new BahrainValidator(),
    [Country.BY]: new BelarusValidator(),
    [Country.IT]: new ItalyValidator(),
    
    // ong add other validators
};

export function getCorrectValidatorForCountry(countryCode: Country): CountryValidator | null {
    return validators[countryCode] || null;
}