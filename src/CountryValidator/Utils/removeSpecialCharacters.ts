export function removeSpecialCharacters(str: string): string {
    return str.replace(/[^A-Z0-9]/gi, '');
}
