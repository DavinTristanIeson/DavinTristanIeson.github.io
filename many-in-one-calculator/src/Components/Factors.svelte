<script type="ts">
    import { getFactorTree,getFactorsOf,isPrime, gcd,lcm } from "../Calculation/Factors";
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    let factors:[number,number][] = [[1,1]];
    let factorTree:string = "1 x 1";
    let factorOf:string = "Factors of 1";
    let numberInput:string = "";
    let primeInput:HTMLInputElement;
    let gcdLcmInputProto:string = "";
    let gcdOutput:number = 1;
    let lcmOutput:number = 1;
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }
    function assertIsntNaN(number:number){
        if (isNaN(number)){
            onError("Input must be a proper integer!");
            return true;
        }
        return false;
    }
    function findFactors(){
        let input = parseInt(numberInput);
        if (assertIsntNaN(input)) return;
        factorOf = "Calculating...";
        factorTree = "Calculating...";
        factors = [];
        getFactorsOf(input).then(facts => {
            factors = facts
            factorOf = `Factors of ${numberInput}`;
        });
        getFactorTree(input).then(facts => {factorTree = facts.join(" x ")});
    }
    function checkPrime(){
        let input = parseInt(primeInput.value);
        if (assertIsntNaN(input)) return;
        primeInput.style.backgroundColor = "var(--theme-disabled)";
        isPrime(input).then(boolean => {
            if (boolean){
                primeInput.style.backgroundColor = "var(--theme-main)";
            } else {
                primeInput.style.backgroundColor = "var(--theme-error)";
            }
            primeInput.value = input.toString();
        })
    }
    function findGCDnLCM(){
        let numbers = gcdLcmInputProto.split(/\s+/).map(x => parseInt(x)).filter(x => !isNaN(x));
        try {
            gcdOutput = gcd(...numbers);
            lcmOutput = lcm(...numbers);
        } catch (e){
            onError(e);
        }
        console.log(numbers,gcdOutput,lcmOutput);
    }
    function onEnter(e:KeyboardEvent,callback:()=>void){
        if (e.key !== "Enter") return;
        callback();
    }
</script>

<article class="center-h">
    <h3>Factorization</h3>
    <div class="input-w-btn">
        <input type="number" placeholder="Number"
        bind:this={primeInput}
        on:keydown={(e)=>{onEnter(e,checkPrime)}}
        on:focus={()=>{primeInput.style.backgroundColor = "var(--theme-light)"}}>
        <button on:click={checkPrime}>Is Prime</button> 
        <input type="number" placeholder="Number"
        bind:value={numberInput}
        on:keydown={(e)=>{onEnter(e,findFactors)}}>
        <button on:click={findFactors}>Factorize</button>
    </div>
    <div class="full-width max-500-y">
        <table class="full-width">
            <tr>
                <th colspan="2">{factorOf}</th>
            </tr>
            {#each factors as factor}
                <tr>
                    <td>{factor[0]}</td>
                    <td>{factor[1]}</td>
                </tr>
            {/each}
        </table>
    </div>
    <div id="factor-tree">{factorTree}</div>
    <hr>
    <h3>GCD and LCM</h3>
    <div class="input-w-btn">
        <input type="text"
        bind:value={gcdLcmInputProto}
        on:keydown={(e)=>{onEnter(e,findGCDnLCM)}}>
        <button on:click={findGCDnLCM}>GCD&LCM</button>
    </div>
    <table class="full-width">
        <tr>
            <th>GCD</th>
            <th>LCM</th>
        </tr>
        <tr>
            <td>{gcdOutput}</td>
            <td>{lcmOutput}</td>
        </tr>
    </table>
</article>

<style>
    table {margin:20px 0px;}
    /* table td,th {min-width: 140px} */
    #factor-tree {
        width: 80%;
        background-color: var(--theme-light);
        padding: 10px 20px;
        border: 2px solid black;
    }
    hr {margin: 30px 0px;}
</style>