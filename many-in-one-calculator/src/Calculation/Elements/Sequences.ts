import { useWorker } from "../../Utils";

export function fibonacci(length:number){
    return useWorker<number,number[]>("fibonacci",length);
}

export function arithmeticSum(from:number,step:number,length:number){
    return (length/2) * (from*2 + ((length-1) * step));
}

export function arithmeticSumWithLastTerm(from:number,to:number,length:number){
    return (length/2) * (from + to);
}

export function arithmeticNthTerm(from:number,step:number,length:number){
    return from + ((length - 1) * step);
}

export function geometricSum(from:number,ratio:number,length:number){
    if (Math.abs(ratio) < 1) return (from * (1 - (ratio**length)))/(1 - ratio);
    else return (from * ((ratio**length)-1))/(ratio - 1);
}

export function infiniteGeometricSum(from:number,ratio:number){
    return from/(1-ratio);
}

export function geometricNthTerm(from:number,ratio:number,length:number){
    return from * (ratio ** (length-1));
}

export function pascalTriangle(from:number,to:number){
    return useWorker<number,number[][]>("pascalTriangle",from,to);
}