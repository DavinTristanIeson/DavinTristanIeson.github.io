import { writable,readable, Writable } from "svelte/store";

export class CalculationComponent {
    private static _lastId = 0;
    id:number;
    title:string;
    source:string;
    description:string;
    details:string;
    constructor(title:string,description:string,details?:string){
        this.id = CalculationComponent._lastId;
        this.title = title;
        this.source = CalculationComponent.toCamelCase(this.title);
        this.description = description;
        this.details = details ?? "";
        CalculationComponent._lastId++;
    }
    // https://javascriptf1.com/snippet/convert-string-to-camel-case-in-javascript#:~:text=To%20convert%20a%20string%20to%20a%20camel%20case,and%20callback%20functions%20to%20generate%20the%20right%20output.
    static toCamelCase(str){
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
}

export const optionsSchema = {
    "Calculators":["Calculator","Fraction Calculator"],
    "Factors":["Factors", "Factor Tree", "GCD", "LCM","isPrime"],
};

export class CalculationComponentManager {
    selected:Writable<CalculationComponent[]>
    unselected:Writable<CalculationComponent[]>
    static ALL_COMPONENTS = [
        new CalculationComponent(
            "Calculator",
            "A basic calculator for fundamental mathematics calculation, including the arithmetic operators, logarithm, square root, exponent, modulo, and inverse.",
            `Shortcuts:\nType in the arithmetic operator '+','-','*','x','/','%','^','!' or '=' to directly perform the actions associated with those symbols.\nPress Enter to retrieve the results of the operation, Page Down to go back to the previous answer, Delete to clear current input, or Ctrl + Delete to clear all.\nBecause '-' is used as a shortcut for subtraction, use '_' for minus signs.\n\nDue to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent(
            "Fractional Calculator",
            "A calculator for operations on fractions. It is considerably limited compared to the basic calculator. Computed fractions are automatically simplified. Additional conversions are provided at the bottom for mixed fractions and its decimal value.",
            `Type in the arithmetic operator '+','-','*','x','/','%','^', or '=' to directly perform the actions associated with those symbols.\nPress Enter to retrieve the results of the operation, Page Down to go back to the previous answer, Delete to clear current input, or Ctrl + Delete to clear all.\nBecause '-' is used as a shortcut for subtraction, use '_' for minus signs.\nPress the up or down arrow to switch the focused input, or use the arrow buttons in the calculator itself.\n\nDue to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Factors",
            "Deals with factorization. Supported actions include: isPrime (checks if a number is a prime or not), factorize (outputs the factor table and the factor tree of the number), GCD (Greatest Common Divisor), and LCM (Lowest Common Multiple).",
            `Note that really large primes will take a while to compute.\nGCD and LCM members must be separated by a space. Anything that's not a valid number will be ignored.\n\nDue to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Trigonometry",
            "Deals with trigonometric operations, including sin, cos, tan and their respective inverse, in both degrees and radians.",
            `Note that the output values are rounded up to 1e7 due to floating point precision errors which causes tan(45deg) to be something like 0.999999... rather than just 1.`),
        new CalculationComponent("Permutation",
            "Deals with operations related to factorials, permutation, and combination. Also includes string permutation.",
            "Press Enter while focused on an input field to execute the operation associated with it.\nFor keyboard users, you can use arrow keys to move between input field in the same category."),
        new CalculationComponent("Base Converter",
            "Deals with conversions between various bases of numbers, including binary, octal, decimal, and hexadecimal.",
            "Two's Complement determines whether conversions of negative numbers should equal 2^8/2^16/2^32/2^64 - number or just add a minus sign in front of the converted number.\nNote that Two's Complement only works for up to numbers less or equal to 2^64.")
    ];
    static STORAGE_NAME = "components";
    constructor(){
        this.selected = writable<CalculationComponent[]>([]);
        this.unselected = writable<CalculationComponent[]>([]);
        this.fetchComponents();
    }
    filterComponents(ids:number[]){
        //  normally, a .filter call is enough, but I want to keep the order
        let returned:CalculationComponent[] = [];
        for (let id of ids){
            if (id < 0 || id >= CalculationComponentManager.ALL_COMPONENTS.length) continue;
            returned.push(CalculationComponentManager.ALL_COMPONENTS[id]);
        }
        return returned;
    }
    fetchComponents(){
        try {
            let loaded:number[] = JSON.parse(localStorage.getItem(CalculationComponentManager.STORAGE_NAME)) ?? [];
            this.selected.set(this.filterComponents(loaded));
            this.unselected.set(CalculationComponentManager.ALL_COMPONENTS.filter(x => !loaded.includes(x.id)));
        } catch (e){
            console.error(e);
            this.resetComponents();
            console.warn("Resetting components due to unexpected error!");
        }
    }
    saveComponents(){
        let data;
        const unsubscribe = this.selected.subscribe(info => {data = info});
        localStorage.setItem(CalculationComponentManager.STORAGE_NAME,
            JSON.stringify(data.map(x => x.id)));
        unsubscribe();
    }
    resetComponents(){
        this.selected.set([]);
        this.unselected.set(CalculationComponentManager.ALL_COMPONENTS);
        localStorage.setItem(CalculationComponentManager.STORAGE_NAME,"[]");
    }
}

export const componentManager = new CalculationComponentManager();

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
export function assertIsntNaN(onError:(string)=>void,...checkIfNaN:number[]){
    for (let might of checkIfNaN){
        if (isNaN(might)){
            onError("Input must be a valid number!");
            return false;
        }
    }
    return true;
}
export function assertIsntNegative(onError:(string)=>void,...checkIfNeg:number[]){
    for (let might of checkIfNeg){
        if (might < 0){
            onError("Input must be a positive number!");
            return false;
        }
    }
    return true;
}
export function onEnter(e:KeyboardEvent,callback:()=>void){
    if (e.key !== "Enter") return;
    e.preventDefault();
    callback();
}
export function onArrowChangeFocus(e:KeyboardEvent,inputElement:HTMLInputElement,isVerticalKeystroke:boolean){
    if ((isVerticalKeystroke && (e.key === "ArrowUp" || e.key === "ArrowDown")) || (e.key === "ArrowLeft" || e.key === "ArrowRight")){
        e.preventDefault();
        inputElement.focus();
    }
}
// https://medium.com/@ricciutipaolo/how-to-check-for-media-queries-in-svelte-with-usemediaquery-604f14190035
export function useMediaQuery(mediaQueryString:string){
    //we inizialize the readable as null and get the callback with the set function
      const matches = readable(null, (set) => {
              //we match the media query
          const m = window.matchMedia(mediaQueryString);
          //we set the value of the reader to the matches property
          set(m.matches);
          //we create the event listener that will set the new value on change
          const el=e => set(e.matches);
          //we add the new event listener
          m.addEventListener("change", el);
              //we return the stop function that will clean the event listener
          return () => {m.removeEventListener("change", el)};
      });
      //then we return the readable
      return matches;
}
export type Vec2 = {x:number,y:number};
export enum SwipeDirection {
    NONE = 0,
    LEFT = 1,
    RIGHT = 2,
    UP = 4,
    DOWN = 8,
}
export class SwipeManager {
    swipeStart:Vec2|null = null;
    minDist:Vec2;
    callback: (e:TouchEvent)=>void;
    direction:SwipeDirection;
    constructor(minDist:Vec2,callback:(e:TouchEvent)=>void,direction:SwipeDirection){
        this.minDist = minDist;
        this.callback = callback;
        this.direction = direction;
    }
    onSwipeStart(e:TouchEvent){
        if (!e.touches.length) return;
        this.swipeStart = {x:e.touches[0].clientX,y:e.touches[0].clientY};
    }
    onSwipeEnd(e:TouchEvent){
        if (!e.changedTouches.length || !this.swipeStart) return;
        const swipeEnd = {x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
        const distance = SwipeManager.coordinateDistance(this.swipeStart,swipeEnd);
        if (SwipeManager.checkBit(this.direction, SwipeDirection.LEFT) && distance.x < 0 && Math.abs(distance.x) >= this.minDist.x) this.callback(e);
        if (SwipeManager.checkBit(this.direction, SwipeDirection.RIGHT) && distance.x >= 0 && Math.abs(distance.x) >= this.minDist.x) this.callback(e);
        if (SwipeManager.checkBit(this.direction, SwipeDirection.UP) && distance.y < 0 && Math.abs(distance.y) >= this.minDist.y) this.callback(e);
        if (SwipeManager.checkBit(this.direction, SwipeDirection.DOWN) && distance.y >= 0 && Math.abs(distance.y) >= this.minDist.y) this.callback(e);
        this.swipeStart = null;
    }
    static checkBit(bit:SwipeDirection,expected:SwipeDirection){
        return ((bit & expected) !== 0);
    }
    static coordinateDistance(a:Vec2,b:Vec2): Vec2{
        return {x: b.x-a.x, y: b.y-a.y};
    }
    static euclideanDistance(a:Vec2,b:Vec2){
        return Math.sqrt((b.x-a.x)**2 + (b.y-a.y)**2);
    }
}