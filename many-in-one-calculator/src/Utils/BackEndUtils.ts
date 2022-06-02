export function useWorker<T,R>(type:string, ...args:T[]): Promise<R>{
    const worker:Worker = new Worker("./build/worker.js");
    worker.postMessage({
        type:type,
        args:args
    });
    return new Promise((resolve,reject)=>{
        worker.onmessage = (e:MessageEvent) => {
            resolve(e.data);
            worker.terminate();
        }
    });
}

export interface DisplayBackend<T> {
    onUpdate: (updated:T)=>void
    onError: (message:string)=>void
}

export class DevelopmentError extends Error {
    constructor(message) {
        super(message);
        this.name = "DevelopmentError";
    }
}
export class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserError";
    }
}

export class BackendUtils {
    static assertNotNull(value:any,name:string){
        if (value === null || value === undefined){
            throw new DevelopmentError(`${name} is null or undefined! (${value})`);
        }
    }
    static parseAsInteger(numString:string,base:number=10){
        let result = parseInt(numString,base);
        BackendUtils.assertIsntNaN(result);
        return result;
    }
    static parseAsFloat(numString:string){
        let result = parseFloat(numString);
        BackendUtils.assertIsntNaN(result);
        return result;
    }
    static assertIsntNaN(...checkIfNaN:number[]){
        for (let might of checkIfNaN){
            if (isNaN(might)) throw new UserError("Input must be a valid number!");
        }
        return true;
    }
    static assertIsntNegative(...checkIfNeg:number[]){
        for (let might of checkIfNeg){
            if (might < 0){
                throw new UserError("Input must be a positive number!");
            }
        }
        return true;
    }
    static assertLessThanInfinity(checkme:number){
        if (checkme === Infinity) throw new UserError(`JavaScript numbers have a maximum limit of ${Number.MAX_VALUE}`);
    }
    static tryCatch<T>(action:()=>T, onError:(message)=>void):T{
        try {
            return action();
        } catch (e){
            BackendUtils.errorHandling(e,onError);
        }
    }
    static errorHandling(e,onError: (message:string)=>void){
        console.log(e);
        if (e instanceof UserError){
            onError(e.message);
        } else if (e instanceof DevelopmentError){
            console.error(e.message);
        } else {
            throw e;
        }
    }
}