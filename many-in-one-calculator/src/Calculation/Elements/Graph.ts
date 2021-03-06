import { UserError } from "../../Utils";
import { PriorityQueue } from "./PriorityQueue";

export type AdjacencyList = {
    [key:string]: string[]
};
export type AdjacencyMatrix = (number|string)[][];
export type EdgeList = [string,string][];
export type WeightedAdjacencyList = {
    [key:string]: [string,number][]
};
export type WeightedEdgeList = [string,string,number][];

export class GraphEdge {
    endpoint:string;
    weight:number;
    constructor(endpoint:string,weight:number = 1){
        this.endpoint = endpoint;
        this.weight = weight;
    }
}

type GraphAdjacencyList = {
    [key:string]: GraphEdge[]
};

enum GraphEulerianStatus {
    NOT_EULERIAN,
    SEMI_EULERIAN,
    EULERIAN
};
export class Graph {
    readonly graph:GraphAdjacencyList;
    readonly length:number;
    readonly vertices:string[];
    constructor(adjlist:WeightedAdjacencyList){
        this.graph = {};
        for (let vertex in adjlist){
            this.graph[vertex] = [];
            for (let endpoint of adjlist[vertex]){
                this.graph[vertex].push(new GraphEdge(endpoint[0],endpoint[1]));
            }
        }
        this.vertices = Object.keys(adjlist);
        this.length = this.vertices.length;
    }
    get inDegrees():{[key:string]:number} {
        let inDegrees:{
            [key:string]:number
        } = {};
        for (let vertex in this.graph){
            for (let edges of this.graph[vertex]){
                if (edges.endpoint in inDegrees){
                    inDegrees[edges.endpoint]++;
                } else {
                    inDegrees[edges.endpoint] = 1;
                }
            }
        }
        return inDegrees;
    }
    get outDegrees():{[key:string]:number} {
        let outDegrees:{
            [key:string]:number
        } = this.mapVertices((v,e)=>this.graph[v].length);
        return outDegrees;
    }
    mapVertices<T>(func:(vertex?:string,edgeList?:GraphEdge[])=>T): {[key:string]:T}{
        const map:{[key:string]:T} = {};
        for (let vertex of this.vertices){
            map[vertex] = func(vertex,[...this.graph[vertex]]);
        }
        return map;
    }
    find(func:(vertex:string,edge:GraphEdge)=>boolean):[string,GraphEdge]|null{
        for (let vertex of this.vertices){
            for (let edge of this.graph[vertex]){
                if (func(vertex,edge)){
                    return [vertex,edge];
                }
            }
        }
        return null;
    }
    isEulerian(): GraphEulerianStatus {
        // https://www.geeksforgeeks.org/eulerian-path-and-circuit/
        if (!this.isEulerianConnected()) return GraphEulerianStatus.NOT_EULERIAN;
        let oddDegrees = 0;
        for (let vertex in this.graph){
            if (this.graph[vertex].length % 2 !== 0) oddDegrees++;
        }
        if (oddDegrees === 0) return GraphEulerianStatus.EULERIAN;
        else if (oddDegrees === 2) return GraphEulerianStatus.SEMI_EULERIAN;
        else return GraphEulerianStatus.NOT_EULERIAN;
    }
    isEulerianConnected(){
        // returns True if all non-zero-edge vertices are connected
        const visited : {
            [key:string]:boolean
        } = this.mapVertices(()=>false);
        
        const nonZeroDeg = this.find((v)=>this.graph[v].length > 1);
        if (!nonZeroDeg) return true;
        this.visitNodes(nonZeroDeg[0],visited);
        for (let vertex in visited){
            if (!visited[vertex] && this.graph[vertex].length > 0) return false;
        }
        return true;
    }
    isConnected(){
        const visited : {
            [key:string]:boolean
        } = this.mapVertices(()=>false);
        this.visitNodes(this.vertices[0],visited);
        for (let vertex in visited){
            if (!visited[vertex]) return false;
        }
        return true;
    }
    visitNodes(current:string,visited:{[key:string]:boolean}){
        visited[current] = true;
        if (!this.graph?.[current] || this.graph[current].length === 0) return;
        for (let edge of this.graph[current]){
            if (visited[edge.endpoint]) continue;
            this.visitNodes(edge.endpoint,visited);
        }
    }
    eulerTour(): string[] {
        if (this.isEulerian() === GraphEulerianStatus.NOT_EULERIAN) return [];
        // https://www.geeksforgeeks.org/hierholzers-algorithm-directed-graph/
        const graphCopy = this.mapVertices((v,e)=>[...e]);
        const edgeCount = this.mapVertices((vertex,edgeList)=>edgeList.length);
        const vertices = this.vertices;
        if (vertices.length === 0) return [];

        const currentPathStack:string[] = [];
        const circuit:string[] = [];
        currentPathStack.push(vertices[0]);
        while (currentPathStack.length > 0){
            const current = currentPathStack[currentPathStack.length-1]
            if (edgeCount[current] > 0){
                edgeCount[current]--;
                currentPathStack.push(graphCopy[current].pop().endpoint);
            } else {
                circuit.push(current);
                currentPathStack.pop();
            }
        }
        circuit.reverse();
        return (this.assertAllEdgesRemoved(edgeCount) ? circuit : []);
    }
    undirectedEulerTour(){
        if (!this.isUndirected() || this.isEulerian() === GraphEulerianStatus.NOT_EULERIAN) return [];
        // https://www.geeksforgeeks.org/hierholzers-algorithm-directed-graph/
        const graphCopy = this.mapVertices((v,e)=>[...e]);
        const edgeCount = this.mapVertices((vertex,edgeList)=>edgeList.length);
        const vertices = this.vertices;
        if (vertices.length === 0) return [];

        const currentPathStack:string[] = [];
        const circuit:string[] = [];
        currentPathStack.push(vertices[0]);
        while (currentPathStack.length > 0){
            const current = currentPathStack[currentPathStack.length-1]
            if (edgeCount[current] > 0){
                const endpoint = (graphCopy[current].pop().endpoint);
                edgeCount[current]--;
                edgeCount[endpoint]--;
                const findme = graphCopy[endpoint].findIndex(x => x.endpoint === current);
                if (findme >= 0) graphCopy[endpoint].splice((findme),1);
                else return [];
                currentPathStack.push(endpoint);
            } else {
                circuit.push(current);
                currentPathStack.pop();
            }
        }
        circuit.reverse();
        return (this.assertAllEdgesRemoved(edgeCount) ? circuit : []);
    }
    assertAllEdgesRemoved(edgeCount:{[key:string]:number}){
        for (let vertex in edgeCount){
            if (edgeCount[vertex] > 0) return false;
        }
        return true;
    }
    isUndirected(){
        const inDegrees = this.inDegrees;
        const outDegrees = this.outDegrees;
        
        for (const vertex in inDegrees){
            if (inDegrees[vertex] !== outDegrees[vertex]) return false;
        }
        return true;
    }
    isBipartite(){
        // https://www.geeksforgeeks.org/bipartite-graph/
        const colors = this.mapVertices(()=>-1);
        colors[this.vertices[0]] = 1;

        const queue = [];
        queue.push(this.vertices[0]);
        while (queue.length > 0){
            const cur = queue.shift();
            if (this.graph[cur].includes(cur)) return false;
            for (let edge of this.graph[cur]){
                if (colors[edge.endpoint] === -1){
                    colors[edge.endpoint] = 1 - colors[cur];
                    queue.push(edge.endpoint);
                } else if (colors[edge.endpoint] === colors[cur]){
                    return false;
                }
            }
        }
        return true;
    }
    isCyclic(){
        const visited = this.mapVertices(()=>false);
        for (let vertex in visited){
            if (visited[vertex]) continue;
            if (this.exploreUntilLoop(vertex,visited)){
                return true;
            }
        }
        return false;
    }
    exploreUntilLoop(current:string,visited:{[key:string]:boolean}): boolean {
        if (visited[current]) return true;
        visited[current] = true;
        if (this.graph[current] === undefined || this.graph[current].length === 0) return false;
        for (let edge of this.graph[current]){
            if (this.exploreUntilLoop(edge.endpoint,visited)) return true;
        }
        return false;
    }
    djikstra(src:string){
        if (!(src in this.graph)) throw new UserError("Source node doesn't exist in the graph!");
        const bfsq = new PriorityQueue<string>([[src,0]]);
        const result = this.mapVertices(()=>Infinity);
        const visited = new Set<string>([src]);
        result[src] = 0;
        while (!bfsq.isEmpty()){
            const cur = bfsq.dequeue();
            visited.add(cur[0]);
            for (let neighbor of this.graph[cur[0]]){
                if (visited.has(neighbor.endpoint)) continue;
                bfsq.enqueue(neighbor.endpoint,cur[1]+neighbor.weight);
                result[neighbor.endpoint] = Math.min(result[neighbor.endpoint],cur[1]+neighbor.weight);
            }
        }
        return result;
    }
    djikstraPaths(src:string){
        if (!(src in this.graph)) throw new UserError("Source node doesn't exist in the graph!");
        const bfsq = new PriorityQueue<[string,string[]]>([[[src,[src]],0]]);
        const result:{
            [key:string]: [string[],number]
        } = this.mapVertices(()=>[[],Infinity]);
        const visited = new Set<string>([src]);
        result[src] = [[src],0];
        while (!bfsq.isEmpty()){
            const cur = bfsq.dequeue();
            visited.add(cur[0][0]);
            for (let neighbor of this.graph[cur[0][0]]){
                const next = neighbor.endpoint;
                if (visited.has(next)) continue;
                const newPath = [...cur[0][1],next];
                const newSum = cur[1]+neighbor.weight
                bfsq.enqueue([next,newPath],newSum);
                if (newSum < result[next][1]){
                    result[next] = [newPath,newSum];
                }
            }
        }
        return result;
    }
    kruskal(): WeightedEdgeList {
        const result:WeightedEdgeList = [];
        const edgeList = this.toEdgeList();
        edgeList.sort((a,b)=>a[2] - b[2]);
        
        let i = 0, e = 0;
        const parent = this.mapVertices(v => v);
        const rank = this.mapVertices(_ => 0);
        while (e < this.length - 1){
            const cur = edgeList[i];
            i++;
            const parent1 = this.find_set(parent,cur[0]);
            const parent2 = this.find_set(parent,cur[1]);
            if (parent1 !== parent2){
                e++;
                result.push([...cur]);
                this.union_set(parent,rank,parent1,parent2);
            }
        }
        return result;
    }
    find_set(parent:{[key:string]:string},node:string){
        if (parent[node] == node) return node;
        return this.find_set(parent,parent[node]);
    }
    union_set(parent:{[key:string]:string},rank:{[key:string]:number},node1:string,node2:string){
        const parent1 = this.find_set(parent,node1);
        const parent2 = this.find_set(parent,node2);
        if (rank[parent1] < rank[parent2]) parent[parent1] = parent2;
        else if (rank[parent2] > rank[parent2]) parent[parent2] = parent1;
        else {
            parent[parent2] = parent1;
            rank[parent1]++;
        }
    }
    prims(source:string): WeightedEdgeList {
        // CREDIT: https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/
        const parent:number[] = [];
        const adjmat = Graph.toAdjacencyMatrix(this.graph);
        const header = adjmat.shift() as string[];
        const keys = Array(adjmat.length).fill(Infinity);
        const mstSet = Array(adjmat.length).fill(false);

        const start = header.indexOf(source);
        if (start < 0) throw new UserError("Source not found in graph!");
        keys[start] = 0; parent[start] = -1;
        for (let e = 0; e < adjmat.length-1; e++){
            let u = this.primsMinKey(keys,mstSet);
            mstSet[u] = true;
            for (let v = 0; v < adjmat.length; v++){
                if (adjmat[u][v] && mstSet[v] == false && adjmat[u][v] < keys[v]){
                    parent[v] = u; keys[v] = adjmat[u][v];
                }
            }
        }
        const edgeList:WeightedEdgeList = [];
        for (let i = 0; i < adjmat.length; i++){
            if (parent[i] < 0) continue;
            edgeList.push([header[parent[i]],header[i],adjmat[i][parent[i]] as number])
        }
        return edgeList;
    }
    private primsMinKey(keys:number[],mstSet:boolean[]){
        let min = Infinity, min_index;
        for (let v = 0; v < this.length; v++){
            if (!mstSet[v] && keys[v] < min){
                min = keys[v]; min_index = v;
            }
        }
        return min_index;
    }
    toEdgeList(): WeightedEdgeList {
        const edgeList:WeightedEdgeList = []
        for (let v of this.vertices){
            for (let e of this.graph[v]){
                edgeList.push([v,e.endpoint,e.weight]);
            }
        }
        return edgeList;
    }
    static toWeightedAdjacencyList(adjlist:AdjacencyList): WeightedAdjacencyList {
        const weighted:WeightedAdjacencyList = {};
        for (let vertex in adjlist){
            weighted[vertex] = [];
            for (let endpoint of adjlist[vertex]){
                weighted[vertex].push([endpoint,1]);
            }
        }
        return weighted;
    }
    static toAdjacencyMatrix(adjlist:GraphAdjacencyList): AdjacencyMatrix {
        const matrix:AdjacencyMatrix = [];
        const adjarr = Object.entries(adjlist);
        matrix.push(adjarr.map(x => x[0]));
        for (let r = 0; r < adjarr.length; r++){
            matrix.push(Array(adjarr.length).fill(0));
            for (let c = 0; c < adjarr.length; c++){
                const findme = adjarr[r][1].find(e => e.endpoint === adjarr[c][0]);
                if (!findme) continue;
                matrix[r+1][c] = findme.weight;
            }
        }
        return matrix;
    }
    static toParseableAdjacencyList(graph:GraphAdjacencyList): WeightedAdjacencyList {
        const vertices = Object.keys(graph);
        const result = {}
        for (let v of vertices){
            result[v] = graph[v].map(edge => [edge.endpoint,edge.weight])
        }
        return result;
    }
}