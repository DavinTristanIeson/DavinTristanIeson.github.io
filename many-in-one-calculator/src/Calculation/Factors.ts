import { useWorker } from "../Utils";

export function isPrime(number:number): Promise<boolean> {
    return useWorker("isPrime",number);
}
export function getFactorsOf(number:number): Promise<[number,number][]> {
    return useWorker("getFactorsOf",number);
}
export function getFactorTree(number:number): Promise<number[]> {
    return useWorker("getFactorTree",number);
}
function __gcd(x:number,y:number){
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}
function __lcm(x:number,y:number){
    return Math.abs(x*y)/__gcd(x,y);
}
export function gcd(...numbers: number[]): number {
    if (numbers.length === 0) throw "Empty argument for GCD!";
    let GCD:number = numbers[0];
    for (let i = 1; i < numbers.length; i++){
        GCD = __gcd(GCD,numbers[i]);
    }
    return GCD;
}
export function lcm(...numbers: number[]): number{
    if (numbers.length === 0) throw "Empty argument for LCM!";
    let LCM:number = numbers[0];
    for (let i = 1; i < numbers.length; i++){
        LCM = __lcm(LCM,numbers[i]);
    }
    return LCM;
}