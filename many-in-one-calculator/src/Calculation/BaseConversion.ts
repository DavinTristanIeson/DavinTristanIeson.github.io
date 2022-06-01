export class Converter {
    from:string = "";
    to:string = "";
    fromType:number = 2;
    toType:number = 2;
    isTwoComplement:boolean = false;
    static readonly TYPES = ["Binary","Octal","Decimal","Hexadecimal"]
    static readonly BASES = [2,8,10,16];
    static readonly BITSTEPS = [2**8,2**16,2**32,2**64];
    private static readonly ERROR_MESSAGES = ["Binary strings must only use 1s or 0s!","Octal numbers should only have digits between 0-7!","Decimal numbers should only digits between 0-9!","Hexadecimal numbers should only contain digits from 0-9 or characters between a-f!"];
    onError: (message:string)=>void;
    onUpdate: (updated:{[key:string]:string})=>void;
    constructor(onUpdate:(updated:{[key:string]:string})=>void,onError:(message:string)=>void){
        this.onUpdate = onUpdate;
        this.onError = onError;
    }
    render(){
        this.onUpdate({
            from: this.from,
            to: this.to,
            fromIndex: this.fromType.toString(),
            toIndex: this.toType.toString(),
        });
    }
    swap(){
        let temp = this.to, tempType = this.toType;
        this.to = this.from; this.from = temp;
        this.toType = this.fromType; this.fromType = tempType;
        this.render();
    }
    update(updated:{
        toType:number,
        fromType:number,
        to:string,
        from:string,
        isTwoComplement:boolean
    }){
        this.toType = updated.toType;
        this.fromType = updated.fromType;
        this.from = updated.from;
        this.to = updated.to;
        this.isTwoComplement = updated.isTwoComplement;
    }
    convert(){
        let temp = parseInt(this.from,Converter.BASES[this.fromType]);
        if (isNaN(temp)){
            this.onError(Converter.ERROR_MESSAGES[this.fromType]);
            return;
        }
        if (this.isTwoComplement && temp < 0){
            let subtracter:number;
            temp = Math.abs(temp);
            for (let bitcount of Converter.BITSTEPS){
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
        this.to = temp.toString(Converter.BASES[this.toType]);
        this.render();
    }
}