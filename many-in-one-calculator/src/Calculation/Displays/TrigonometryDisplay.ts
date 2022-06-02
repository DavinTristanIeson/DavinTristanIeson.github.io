import { BackendUtils } from "../../Utils/BackEndUtils";

export class TrigonometryDisplay {
    onError: (message: string) => void;
    onUpdate: (updated: { [key: string]: string; }) => void;
    usingDegrees:boolean = true;
    inversed:boolean = false;
    trigValues = {
        sin:"0",
        cos:"0",
        tan:"0",
        cosec:"0",
        sec:"0",
        cot:"0"
    };
    constructor(onUpdate:(updated:{[key:string]:string})=>void,onError:(message:string)=>void){
        this.onUpdate = onUpdate;
        this.onError = onError;
    }
    inverseOperation(){this.inversed = !this.inversed;this.render();}
    changeInputMethod(number:number){
        this.usingDegrees = !this.usingDegrees;
        if (this.inversed){
            this.calculateTrigonometry(number.toString());
        } else {
            number = (this.usingDegrees ? TrigonometryDisplay.radiansToDegrees(number) : TrigonometryDisplay.degreesToRadians(number));
        }
        this.render();
        return number;
    }
    get360deg(){
        return (this.usingDegrees ? 360 : (2*Math.PI))
    }
    divideBy360deg(degrees:number){
        return degrees % this.get360deg();
    }
    complementOf360deg(degrees:number){
        return this.get360deg() - (degrees % this.get360deg());
    }
    render(){
        this.onUpdate({
            sin:this.trigValues.sin,
            cos:this.trigValues.cos,
            tan:this.trigValues.tan,
            cosec:this.trigValues.cosec,
            sec:this.trigValues.sec,
            cot:this.trigValues.cot,
            inverse:(this.inversed ? "inv" : ""),
            inputMethod:(this.usingDegrees ? "deg" : "rad"),
        });
    }
    roundPrecision(number:number){
        const PRECISION = 1e7;
        return Math.round(number*PRECISION)/PRECISION;
    }
    calculateTrigonometry(trigInput:string){
        let value = BackendUtils.tryCatch<number>(()=>BackendUtils.parseAsFloat(trigInput),this.onError);
        const params = ["sin","cos","tan","cosec","sec","cot"];
        let sincostan:number[];
        if (!this.inversed){
            value = (this.usingDegrees ? TrigonometryDisplay.degreesToRadians(value) : value);
            sincostan = [Math.sin(value),Math.cos(value),Math.tan(value)];
            for (let i = 0; i < 3; i++){this.trigValues[params[i]] = this.roundPrecision(sincostan[i]).toString();}
            for (let i = 0; i < 3; i++){this.trigValues[params[i+3]] = this.roundPrecision(1/sincostan[i]).toString();}
        } else {
            sincostan = [Math.asin(value),Math.acos(value),Math.atan(value),Math.asin(1/value),Math.acos(1/value),Math.atan(1/value)];
            for (let i = 0; i < 6; i++){
                let arcNaN = sincostan[i];
                arcNaN = this.roundPrecision(this.usingDegrees ? TrigonometryDisplay.radiansToDegrees(arcNaN) : arcNaN);
                this.trigValues[params[i]] = (isNaN(arcNaN) ? "-" : arcNaN.toString());
            }
        }
        this.render();
    }
    static degreesToRadians(degrees:number){return degrees * (Math.PI / 180);}
    static radiansToDegrees(radians:number){return radians * (180 / Math.PI);}
}