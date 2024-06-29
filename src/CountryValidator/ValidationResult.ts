class ValidationResult {
    isValid: boolean;
    errorMessage?: string;

    private constructor(isValid: boolean, errorMessage?: string) {
        this.isValid = isValid;
        this.errorMessage = errorMessage;
    }

    static Success(): ValidationResult {
        return new ValidationResult(true);
    }

    static Invalid(errorMessage: string): ValidationResult {
        return new ValidationResult(false, errorMessage);
    }

    static InvalidChecksum(): ValidationResult {
        return new ValidationResult(false, 'Invalid checksum.');
    }

    static InvalidFormat(format: string): ValidationResult {
        return new ValidationResult(false, `Invalid format. The code must have this format: ${format}`);
    }

    static InvalidDate(): ValidationResult {
        return new ValidationResult(false, 'Invalid date');
    }

    static InvalidLength(): ValidationResult {
        return new ValidationResult(false, 'Invalid length');
    }
}

export { ValidationResult };
