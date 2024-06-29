export function mod(a: number, b: number): number {
    return ((a % b) + b) % b; // Ensure non-negative result
}