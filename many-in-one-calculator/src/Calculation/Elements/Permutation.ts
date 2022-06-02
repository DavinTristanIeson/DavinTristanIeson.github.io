export function factorial(from:number,to:number=1): number {
    let returned = 1;
    while (from > to){
        returned *= from;
        from--;
    }
    return returned;
}
export function combination(n:number, r:number): number {
    if (n-r < r) return factorial(n,r)/factorial(n-r);
    else return factorial(n,n-r)/factorial(r);
}
export function permutation(n:number, r:number): number {
    return factorial(n,n-r)
}
export function repeatCombination(n:number, r:number): number {
    return combination((n+r-1),r);
}
export function repeatPermutation(n:number, r:number): number {
    return n**r;
}
export function stringPermutation(n:number,repeated:number[]): number{
    let returned = factorial(n);
    if (returned === Infinity) return returned;
    let cache : {[key:number]:number} = {};
    for (let repeat of repeated){
        if (repeat in cache){
            returned /= cache[repeat];
            continue;
        }
        const fact = factorial(repeat);
        returned /= fact;
        cache[repeat] = fact;
    }
    return returned;
}
export const FORMULAS = [
    "n! / (r! * (n - r)!)",
    "n! / (n - r)!",
    "(r + n - 1)! / (r! * (n - 1)!)",
    "n^r"
];
export const OPERATIONS = [combination,permutation,repeatCombination,repeatPermutation];