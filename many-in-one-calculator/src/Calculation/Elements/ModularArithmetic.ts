import { useWorker } from "../../Utils";

export function modularExponentiation(x:number, y:number, p:number):Promise<number[]> {
    return useWorker<number,number[]>("modularExponentiation",x,y,p);
}
export function moduloGenerator(base:number,mod:number):Promise<number[]> {
    return useWorker<number,number[]>("moduloGenerator",base,mod);
}
export function isPrimitiveRoot(generatedModulo:number[]):Promise<boolean>{
    return useWorker<number[],boolean>("isPrimitiveRoot",generatedModulo);
}
export function primitiveRootOf(mod:number): Promise<number[]> {
    return useWorker<number,number[]>("primitiveRootOf",mod);
}
export function discreteLogarithm(root:number,mod:number,value:number): Promise<number|null> {
    return useWorker<number,number|null>("discreteLogarithm",root,mod,value);
}