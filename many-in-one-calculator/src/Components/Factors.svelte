<script type="ts">
    import { getFactorTree,getFactorsOf,isPrime, gcd,lcm } from "../Calculation/Elements/Factors";
    import { createEventDispatcher } from 'svelte';
    import { BackendUtils,FrontendUtils } from "../Utils";
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
    function findFactors(){
        let input = BackendUtils.tryCatch<number>(()=>BackendUtils.parseAsFloat(numberInput),onError);
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
        let input = BackendUtils.tryCatch<number>(()=>BackendUtils.parseAsFloat(primeInput.value),onError);
        primeInput.style.backgroundColor = "var(--theme-input)";
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
    }
</script>

<article class="center-h">
    <h3>Factorization</h3>
    <div class="input-w-btn">
        <input type="number" placeholder="Number"
        bind:this={primeInput}
        on:keydown={(e)=>{FrontendUtils.onEnter(e,checkPrime)}}
        on:focus={()=>{primeInput.style.backgroundColor = "var(--theme-light)"}}>
        <button on:click={checkPrime}>Is Prime</button> 
        <input type="number" placeholder="Number"
        bind:value={numberInput}
        on:keydown={(e)=>{FrontendUtils.onEnter(e,findFactors)}}>
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
        on:keydown={(e)=>{FrontendUtils.onEnter(e,findGCDnLCM)}}>
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