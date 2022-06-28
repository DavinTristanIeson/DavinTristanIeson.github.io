<script type="ts">
    import { createEventDispatcher } from "svelte";
    import { GraphParser } from "../Calculation/Displays/GraphParser";
    import { BSTNode, HuffmanNode } from "../Calculation/Elements/BinarySearchTree";
    import { BackendUtils, FrontendUtils } from "../Utils";
    const dispatch = createEventDispatcher();
    function onError(message){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }
    let sourceString = "";
    let treatAsNumber = false;
    let traversePaths = ["","",""];
    let adjacencyListString = "";
    function toBST(){
        try {
            let bstProto:string[]|number[];
            if (treatAsNumber) bstProto = sourceString.split(' ').map(x => BackendUtils.parseAsInteger(x));
            else bstProto = sourceString.split(' ');
            const root = BSTNode.createTree(bstProto);
            const inorder = root.inorder();
            traversePaths[0] = BSTNode.formatPath(root.preorder());
            traversePaths[1] = BSTNode.formatPath(inorder);
            traversePaths[2] = BSTNode.formatPath(root.postorder());
            adjacencyListString = GraphParser.stringifyAdjacencyList(root.toAdjacencyList());
        } catch (e){
            BackendUtils.errorHandling(e,onError);
            return;
        }
    }

    let huffmanString = "", huffmanDictionary = {}, huffmanDictString = "", huffmanToBeEncoded = "", huffmanEncodedString = "";
    function huffmanEncode(){
        try {
            const root = HuffmanNode.encode(HuffmanNode.counter(huffmanString.split('')));
            huffmanDictionary = root.dictionary('');
            huffmanDictString = Object.entries(huffmanDictionary).map(x => `${x[0]}: ${x[1]}`).join('\n');;
        } catch (e){
            BackendUtils.errorHandling(e,onError);
        }
    }
    function huffman(){
        try {
            const strArray = huffmanToBeEncoded.split('');
            huffmanEncodedString = strArray.map(x => huffmanDictionary[x] ?? x).join(' ');
        } catch (e){
            BackendUtils.errorHandling(e,onError);
        }
    }
</script>

<h3>Binary Search Tree</h3>
<textarea cols="30" rows="10" bind:value={sourceString} placeholder="Source Array (separated by spaces)"
on:keydown={(e)=>{FrontendUtils.onEnter(e,toBST)}}></textarea>
<button class="full-width" on:click={toBST}>Binary Search Tree</button>
<label><input type="checkbox" bind:checked={treatAsNumber}/> As Number</label>
<table class="full-width">
    <tr>
        <th>Preorder</th>
        <td>{traversePaths[0]}</td>
    </tr>
    <tr>
        <th>Inorder</th>
        <td>{traversePaths[1]}</td>
    </tr>
    <tr>
        <th>Postorder</th>
        <td>{traversePaths[2]}</td>
    </tr>
    <tr>
        <th>Adjacency List</th>
        <td class="max-500-y prewrap">{adjacencyListString}</td>
    </tr>
</table>
<hr>
<h3>Huffman Encoding</h3>
<textarea cols="30" rows="10" bind:value={huffmanString} placeholder="Source String"
on:keydown={(e)=>{FrontendUtils.onEnter(e,huffmanEncode)}}></textarea>
<div class="full-width result max-500-y">{huffmanDictString}</div>
<hr/>
<div class="input-w-btn">
    <input type="text" placeholder="String to be encoded" bind:value={huffmanToBeEncoded}
    on:keydown={(e)=>FrontendUtils.onEnter(e,huffman)}/>
    <button on:click={huffman}>Encode</button>
</div>
<div class="full-width result">{huffmanEncodedString}</div>
