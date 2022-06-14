import { writable,readable, Writable } from "svelte/store";

export class CalculationComponent {
    private static _lastId = 0;
    id:number;
    title:string;
    source:string;
    description:string;
    constructor(title:string,description:string){
        this.id = CalculationComponent._lastId;
        this.title = title;
        this.source = CalculationComponent.toCamelCase(this.title);
        this.description = description;
        CalculationComponent._lastId++;
    }
    // https://javascriptf1.com/snippet/convert-string-to-camel-case-in-javascript#:~:text=To%20convert%20a%20string%20to%20a%20camel%20case,and%20callback%20functions%20to%20generate%20the%20right%20output.
    static toCamelCase(str){
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    }
}

export class CalculationComponentManager {
    selected:Writable<CalculationComponent[]>
    unselected:Writable<CalculationComponent[]>
    static ALL_COMPONENTS = [
        new CalculationComponent(
            "Calculator",
`A basic calculator for fundamental mathematics calculation, including the arithmetic operators, logarithm, square root, exponent, modulo, and inverse.
Shortcuts:Type in the arithmetic operator '+','-','*','x','/','%','^','!' or '=' to directly perform the actions associated with those symbols.
Press Enter to retrieve the results of the operation, Page Down to go back to the previous answer, Delete to clear current input, or Ctrl + Delete to clear all.
Because '-' is used as a shortcut for subtraction, press '_' in the input field for minus signs.
Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent(
            "Fractional Calculator",
`A calculator for operations on fractions. It is considerably limited compared to the basic calculator. Computed fractions are automatically simplified. Additional conversions are provided at the bottom for mixed fractions and its decimal value.
Type in the arithmetic operator '+','-','*','x','/','%','^', or '=' to directly perform the actions associated with those symbols.
Press Enter to retrieve the results of the operation, Page Down to go back to the previous answer, Delete to clear current input, or Ctrl + Delete to clear all.
Because '-' is used as a shortcut for subtraction, press '_' in the input field for minus signs.Press the up or down arrow to switch the focused input, or use the arrow buttons in the calculator itself.
Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Factors",
`Deals with factorization. Supported actions include: isPrime (checks if a number is a prime or not), factorize (outputs the factor table and the factor tree of the number), GCD (Greatest Common Divisor), and LCM (Lowest Common Multiple).
Note that really large primes will take a while to compute for isPrime and factorize.
GCD and LCM members must be separated by a space. Anything that's not a valid number will be ignored.
Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Trigonometry",
`Deals with trigonometric operations, including sin, cos, tan and their respective inverse, in both degrees and radians.
You can press Enter on the input field to execute it instantly.
The deg/rad button changes the unit used. If the button shows 'deg', that means the input and output uses degrees, while 'rad' is associated with radians.
"% 360" is the equivalent of constraining the degrees/radians to the maximum angle of a square/circle (works for both degrees and radians), while "360 -" finds the complement of the angle.
"inv" changes the mode to find the arc- values; sin -> arcsin, cos -> arccos, etc. In this scenario, the degrees/radians refer to the output, and the input is just a number. Note that some values simply don't exist in the arc- spectrum, in which case they'll have '-' as their answer.
Note that the output values are rounded up to 1e-7 due to floating point precision errors which causes tan(45deg) to be something like 0.999999... rather than just 1.
This doesn't solve the precision problem of course.`),
        new CalculationComponent("Permutation",
`Deals with operations related to factorial divisions, permutation, and combination. Also includes string permutation.
The formula associated with the various types of permutation/combination is also included because I usually forget them.
Press Enter while focused on an input field to execute the operation associated with it.
For keyboard users, you can use arrow keys to move between input field in the same category.
Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Base Converter",
`Deals with conversions between various bases of numbers, including binary, octal, decimal, and hexadecimal.
Two's Complement determines whether conversions of negative numbers should equal 2^8/2^16/2^32/2^64 - number or just add a minus sign in front of the converted number.
Note that Two's Complement only works for up to numbers less or equal to 2^64.
Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Truth Table",
`Compiles logic operations such as conjunction, disjunction, exclusive disjunction, negation, implication, and biconditional implication in the form of a truth table that displays all possible logical outputs.
You can also filter the table based on which columns should only have true values and which columns should only have false values.
Variable should be separated by spaces.
You can use the three dropdowns to set the new columns to add. The dropdown at the center sets the operation while the rest sets the operands.
Note that the table only supports up to 8 variables to prevent lag.`),
        new CalculationComponent("Matrix Calculator",
`A calculator for operations on matrices.
Matrix sizes are capped at 6 for now until I figure out how to handle larger input sizes.
Determinant is automatically calculated unless the matrix cannot have a determinant. If it remains '-', press the '=' button.
Shortcuts:
Type in the arithmetic operator '+','-','*','x','/','%','^','!' or '=' to directly perform the actions associated with those symbols.
Press Enter to retrieve the results of the operation, Page Down to go back to the previous answer, Delete to clear current input, or Ctrl + Delete to clear all.
Because '-' is used as a shortcut for subtraction, press '_' in the input field for minus signs.

Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Modular Arithmetic",
`Deals with modular arithmetic operations like modular exponentiation, modulo generator, discrete logarithm, and primitive roots.
Note that large inputs can put a strain on your browser and cause lag.
Due to the nature of JavaScript numbers, accuracy can be guaranted up until ${Number.MAX_SAFE_INTEGER}`),
        new CalculationComponent("Sequences",
`Deals with the summation/nth-term of arithmetic/geometric sequences, and the generation of sequences such as fibonacci and Pascal's Triangle.
Note that large quantities of sequence generation will put a burden on your browser and may cause some lag.`),
        new CalculationComponent("Expression Parser",
`This parser uses the functionality of https://mathjs.org/.
It can evaluate a function with the given variables, or even simplify, derive, and rationalize expressions.
For derivatives, you need to provide the variable to be derived (d/d{})`),
        new CalculationComponent("Graph Representation",
`Converts between various representations of graph, such as adjacency lists, adjacency matrices, and edge lists.
This component also handles the analysis of the graph and produces a report including whether the graph has cycles in them, is bipartite, is connected, and also generates its in-degrees, out-degrees, and eulerian path if it exists.
Note that the graphs are treated as directed by default.`),
        new CalculationComponent("Djikstra",
`Executes Djikstra's algorithm on the provided weighted, directed adjacency list and produces a table containing all the paths and their respective length.
Note that Djikstra's algorithm doesn't perform as expected for graphs with negative values.`)
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
        this.saveComponents();
    }
    selectAllComponents(){
        this.selected.set([...CalculationComponentManager.ALL_COMPONENTS]);
        this.unselected.set([]);
        this.saveComponents();
    }
}

export const componentManager = new CalculationComponentManager();

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