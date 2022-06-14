<script type="ts">
    import TableInputs from "../UI/TableInputs.svelte";
    import { GraphParser } from "../Calculation/Displays/GraphParser";
    import { createEventDispatcher } from "svelte";
    import { Graph } from "../Calculation/Elements/Graph";
    import { BackendUtils, FrontendUtils } from "../Utils";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }

    let djikstraSource:string = "";
    let graphString:string = "";
    let djikstra:[string,string,number][] = [];
    function executeDjikstra(){
        try {
            const graph = new Graph(GraphParser.parseWeightedAdjacencyListString(graphString));
            const paths = graph.djikstraPaths(djikstraSource);
            djikstra = Object.entries(paths).map(x => [x[0],x[1][0].join(" -> "),x[1][1]]);
        } catch (e){
            onError("Failed to parse the inputted graph");
            return;
        }
    }
    /*
1 2 3 4 5 6 7 8 9
0 4 0 0 0 0 0 8 0
4 0 8 0 0 0 0 11 0
0 8 0 7 0 4 0 0 2
0 0 7 0 9 14 0 0 0
0 0 0 9 0 10 0 0 0
0 0 4 14 10 0 2 0 0
0 0 0 0 0 2 0 1 6
8 11 0 0 0 0 0 0 7
0 0 2 0 0 0 6 7 0
    */
</script>

<div class="center-h">
    <textarea cols="30" rows="10" bind:value={graphString} placeholder="Weighted Adjacency List"></textarea>
    <label>
        Source: 
        <input type="text" bind:value={djikstraSource}
        class="shorter"
        on:keydown={(e)=>{
            FrontendUtils.onEnter(e,executeDjikstra)
        }}>
    </label>
    <table class="full-width">
        <tr>
            <th class="pct10">Vertex</th>
            <th>Path</th>
            <th class="pct10">Cost</th>
        </tr>
        {#each djikstra as edges}
        <tr>
            <td>{edges[0]}</td>
            <td class="left-align">{edges[1]}</td>
            <td>{edges[2]}</td>
        </tr>
        {/each}
    </table>
</div>

<style>
    .pct10 {width: 10%;}
    .left-align {padding: 5px 10px;}
</style>