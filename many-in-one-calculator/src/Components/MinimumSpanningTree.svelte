<script type="ts">
    import { Graph } from "../Calculation/Elements/Graph";
    import { GraphParser } from "../Calculation/Displays/GraphParser";
    import { BackendUtils,FrontendUtils } from "../Utils";
    import { createEventDispatcher } from 'svelte';
    import { GraphRepresentationConverter } from "../Calculation/Displays/GraphRepresentation";
    const dispatch = createEventDispatcher();
    function onError(message){
        dispatch("alert",{
            type: "snackbar",
            message: message
        });
    }
    let graphString = "";
    let minimumSpanningTree = "";
    let minimumWeight = 0;
    function find_MST(){
        try {
            const parsed = GraphParser.parseWeightedAdjacencyListString(graphString);
            const graph = new Graph(parsed);
            const kruskal = graph.kruskal();
            minimumSpanningTree = GraphParser.stringifyWeightedAdjacencyList(GraphRepresentationConverter.fromWeightedEdgeList(kruskal));
            minimumWeight = 0;
            for (let edge of kruskal){
                minimumWeight += edge[2];
            }
        } catch (e){
            BackendUtils.errorHandling(e,onError);
            return;
        } 
    }
</script>

<textarea cols="30" rows="10" bind:value={graphString} placeholder="Weighted Adjacency List"></textarea>
<button on:click={find_MST} class="full-width">Find MST</button>
<div class="full-width result prewrap">{minimumSpanningTree}</div>
<p>Total Weight</p>
<div class="result">{minimumWeight}</div>