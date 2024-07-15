import { CountryValidator } from "../CodeValidation";
import { removeSpecialCharacters } from "../Utils/removeSpecialCharacters";
import { ValidationResult } from "../ValidationResult";

export class BelgiumValidator  implements CountryValidator{
    // National Number (NN)
    // For Individuals, Example: 63.11.28-001.74
    // The Belgian Numero National (NN) is 11 digits in the format NN.NN.NN-NNN.NN. It is issued to individuals and it encodes the date of birth.

    // Ondernemingsnummer (VAT)
    // For Entities, VAT, Example: 0403019261
    // The Belgian enterprise number (Ondernemingsnummer) is 10 digits in the format NNNNNNNNNN with an optional prefix of BE. Older 9-digit numbers should start with a leading zero. It is a unique identifier of companies within the Belgian administrative services. It was previously known as the VAT ID number.

    // postal code example: 1000

    COUNTRY_CODE: string = 'BE';
    regexVatCode = /^0?\d{9}$/;

    validateIndividualTaxCode(ssn: string): ValidationResult {
        ssn = removeSpecialCharacters(ssn);
        if (!/^\d{11}$/.test(ssn)) {
            return ValidationResult.InvalidFormat("63.11.28-001.74");
        }
        
        const birthDatePart = ssn.substring(0, 6);
        const sequenceNumber = ssn.substring(6, 9);
        const checkDigits = parseInt(ssn.substring(9, 11), 10);
        const fullNumber = parseInt(ssn.substring(0, 9), 10);
    
        let checksum = 97 - (fullNumber % 97);
        
        // For persons born before 2000, the check digits are calculated as above.
        // For persons born in 2000 or later, 2,000,000,000 is added to the number before calculating the check digits.
        if (checksum !== checkDigits) {
            const fullNumberPost2000 = parseInt('2' + ssn.substring(0, 9), 10);
            checksum = 97 - (fullNumberPost2000 % 97);
            return checksum === checkDigits ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
        }
        
        return ValidationResult.Success();
    }

    validateVatCode(vatCode: string): ValidationResult {
        vatCode = removeSpecialCharacters(vatCode);
        if (!/^\d{10}$/.test(vatCode)) {
            return ValidationResult.InvalidFormat("0403019261");
        }
        
        const number = vatCode.substring(0, 8);
        const checkDigits = parseInt(vatCode.substring(8, 10), 10);
        const calculatedCheckDigits = 97 - (parseInt(number, 10) % 97);
        
        return checkDigits === calculatedCheckDigits ? ValidationResult.Success() : ValidationResult.InvalidChecksum();
    }

    validatePostalCode(postalCode: string): ValidationResult {
        postalCode = removeSpecialCharacters(postalCode);
        if (!/^\d{4}$/.test(postalCode)) {
            return ValidationResult.InvalidFormat("NNNN");
        }
        return ValidationResult.Success();
    }


}