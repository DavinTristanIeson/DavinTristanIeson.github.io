<script type="ts">
    import { onDestroy } from "svelte";
    import { useMediaQuery } from "../Utils";
    import Dropdown from "../UI/Dropdown.svelte";
    import { GraphRepresentationConverter } from "../Calculation/Displays/GraphRepresentation";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }
    function onAltKey(e:KeyboardEvent){
        if (e.key === 'Alt'){
            e.preventDefault();
            swap();
        }
    }

    const converter = new GraphRepresentationConverter(onError);
    let isWeighted:boolean = false;
    function swap(){
        const temp = converter.from;
        converter.from = converter.to;
        converter.to = temp;
        const tempType = converter.fromType;
        converter.fromType = converter.toType;
        converter.toType = tempType;
    }
    function convert(sideEffect:boolean){
        if (sideEffect && !converter.from) return;
        converter.isWeighted = isWeighted;
        converter.convert();
        converter.to = converter.to;
        converter.isWeighted = converter.isWeighted;
    }
    function analyze(){
        converter.isWeighted = isWeighted;
        converter.analyze();
        converter.vertices = converter.vertices;
        converter.inDegrees = converter.inDegrees;
        converter.outDegrees = converter.outDegrees;
        converter.directedEulerianPath = converter.directedEulerianPath;
        converter.undirectedEulerianPath = converter.undirectedEulerianPath;
        converter.isBipartite = converter.isBipartite;
        converter.isCyclic = converter.isCyclic;
        converter.isConnected = converter.isConnected;
        converter.isUndirected = converter.isUndirected;
    }
    function yesNo(bool:boolean|null){
        if (bool === null) return "-";
        return (bool ? "YES" : "NO");
    }
    function addRemoveWeight(){
        converter.isWeighted = isWeighted;
        converter.addRemoveWeight();
        converter.from = converter.from;
        isWeighted = converter.isWeighted;
    }

    let isSmallScreen:boolean = false;
    const unsubscriber = useMediaQuery("screen and (max-width: 540px)").subscribe(data => {isSmallScreen = data});
    onDestroy(unsubscriber);
</script>
<div class="center-h">
    <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen} id="select-types">
        <Dropdown contents={GraphRepresentationConverter.ALL_TYPES}
            on:selected={(e)=>{convert(true)}}
            bind:selected={converter.fromType}
        />
        <label>
            <input type="checkbox" bind:checked={isWeighted}
            on:click={
                (e)=>{
                    convert(true);
                }
            }> Weighted
        </label>
        <Dropdown contents={GraphRepresentationConverter.ALL_TYPES}
            on:selected={(e)=>{convert(true)}}
            bind:selected={converter.toType}
        />
    </div>
    <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen}>
        <textarea cols="30" rows="10"
        bind:value={converter.from}
        on:keydown={(e)=>{
            if (e.key === 'Enter'){
                if (e.ctrlKey){
                    e.preventDefault();
                    convert(false);
                }
                if (e.shiftKey){
                    e.preventDefault();
                    analyze();
                }
                return;
            } else if (e.key === '+'){
                addRemoveWeight();
                e.preventDefault();
            }
            onAltKey(e);
        }}></textarea>
        <button on:click={()=>{swap()}}>&#8646;</button>
        <textarea cols="30" rows="10" disabled
        bind:value={converter.to}></textarea>
    </div>
    <button class="full-width" on:click={()=>{convert(false)}}>Convert</button>
    <button class="full-width" on:click={()=>{addRemoveWeight()}}>{isWeighted ? "Remove" : "Add"} Weight</button>
    <button class="full-width" on:click={()=>{analyze()}}>Analyze</button>
    <table class="full-width">
        <tr>
            <th>Vertices</th>
            <td>{converter.vertices}</td>
        </tr>
        <tr>
            <th>In-Degrees</th>
            <td>{converter.inDegrees}</td>
        </tr>
        <tr>
            <th>Out-Degrees</th>
            <td>{converter.outDegrees}</td>
        </tr>
        <tr>
            <th>Is Undirected</th>
            <td>{yesNo(converter.isUndirected)}</td>
        </tr>
        <tr>
            <th>Directed Eulerian Trail</th>
            <td>{converter.directedEulerianPath}</td>
        </tr>
        <tr>
            <th>Undirected Eulerian Trail</th>
            <td>{converter.undirectedEulerianPath}</td>
        </tr>
        <tr>
            <th>Is Connected</th>
            <td>{yesNo(converter.isConnected)}</td>
        </tr>
        <tr>
            <th>Is Bipartite</th>
            <td>{yesNo(converter.isBipartite)}</td>
        </tr>
        <tr>
            <th>Is Cyclic</th>
            <td>{yesNo(converter.isCyclic)}</td>
        </tr>
    </table>

    <a href="https://csacademy.com/app/graph_editor/" target="_blank">Online Graph Editor (by CSAcademy)</a>
</div>
<style>
    th {
        width: 30%;
    }
</style>