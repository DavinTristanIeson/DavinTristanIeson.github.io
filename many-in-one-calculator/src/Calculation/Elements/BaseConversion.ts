import { BackendUtils, DisplayError, UserError } from "../../Utils/BackEndUtils";
export class BaseConverter implements DisplayError {
    from:string;
    to:string;
    fromType:string = "decimal";
    toType:string = "decimal";
    isTwoComplement:boolean = false;
    static readonly TYPES = ["binary","octal","decimal","hexadecimal"]
    static readonly BASES = [2,8,10,16];
    static readonly BITSTEPS = [2**8,2**16,2**32,2**64];
    private static readonly ERROR_MESSAGES = ["Binary strings must only use 1s or 0s!","Octal numbers should only have digits between 0-7!","Decimal numbers should only digits between 0-9!","Hexadecimal numbers should only contain digits from 0-9 or characters between a-f!"];
    onError: (message: string) => void;
    constructor(onError:(message:string)=>void){
        this.onError = onError;
    }
    swap(){
        const temp = this.from;
        this.from = this.to;
        this.to = temp;
    }
    indexOfType(type:string){
        return BaseConverter.TYPES.indexOf(type);
    }
    convert(){
        let temp;
        try {
            temp = parseInt(this.from,BaseConverter.BASES[this.indexOfType(this.fromType)]);
            if (isNaN(temp)) throw new UserError(BaseConverter.ERROR_MESSAGES[this.indexOfType(this.fromType)]);
        } catch (e){
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        if (this.isTwoComplement && temp < 0){
            let subtracter:number;
            temp = Math.abs(temp);
            for (let bitcount of BaseConverter.BITSTEPS){
                if (bitcount > temp){
                    subtracter = bitcount;
                    break;
                }
            }
            if (!subtracter){
                this.onError("Two's Complement is only supported up to 64-bit numbers!");
                return;
            }
            temp = subtracter - temp;
        }
        this.to = temp.toString(BaseConverter.BASES[this.indexOfType(this.toType)]);
    }
}