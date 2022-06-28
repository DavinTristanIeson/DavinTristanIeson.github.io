import type { DisplayError } from "../../Utils";
import { AdjacencyList,AdjacencyMatrix,EdgeList,Graph,WeightedAdjacencyList,WeightedEdgeList } from "../Elements/Graph";
import { GraphParser } from "./GraphParser";

export enum GraphRepresentationType {
    ADJACENCY_LIST = 0,
    ADJACENCY_MATRIX = 1,
    EDGE_LIST = 2,
};



export class GraphRepresentationConverter implements DisplayError {
    onError: (message: string) => void;
    static ALL_TYPES:[string,any][] =  [
        ["Adjacency List",GraphRepresentationType.ADJACENCY_LIST],
        ["Adjacency Matrix",GraphRepresentationType.ADJACENCY_MATRIX],
        ["Edge List",GraphRepresentationType.EDGE_LIST]
    ]
    from:string = "";
    to:string = "";
    fromType:GraphRepresentationType = GraphRepresentationType.ADJACENCY_LIST;
    toType:GraphRepresentationType = GraphRepresentationType.ADJACENCY_LIST;
    isWeighted:boolean = false;
    vertices:string = "-";
    inDegrees:string = "-";
    outDegrees:string = "-";
    directedEulerianPath:string = "-";
    undirectedEulerianPath:string = "-";
    isBipartite:boolean|null = null;
    isCyclic:boolean|null = null;
    isConnected:boolean|null = null;
    isUndirected:boolean|null = null;
    constructor(onError:(message:string)=>void){
        this.onError = onError;
    }
    convert(){
        try {
            this.to = this.convertTo(this.convertFrom());
        } catch (e){
            this.onError("Failed to parse the inputted graph");
            return;
        }
    }
    convertFrom():AdjacencyList|WeightedAdjacencyList {
        let parsed:AdjacencyList|WeightedAdjacencyList;
        if (this.isWeighted){
            switch (this.fromType){
                case GraphRepresentationType.ADJACENCY_LIST:
                    parsed = GraphParser.parseWeightedAdjacencyListString(this.from);
                    break;
                case GraphRepresentationType.ADJACENCY_MATRIX:
                    parsed = GraphRepresentationConverter.fromWeightedAdjacencyMatrix(GraphParser.parseAdjacencyMatrixString(this.from));
                    break;
                case GraphRepresentationType.EDGE_LIST:
                    parsed = GraphRepresentationConverter.fromWeightedEdgeList(GraphParser.parseWeightedEdgeListString(this.from));
                    break;
            }
        } else {
            switch (this.fromType){
                case GraphRepresentationType.ADJACENCY_LIST:
                    parsed = GraphParser.parseAdjacencyListString(this.from);
                    break;
                case GraphRepresentationType.ADJACENCY_MATRIX:
                    parsed = GraphRepresentationConverter.fromAdjacencyMatrix(GraphParser.parseAdjacencyMatrixString(this.from));
                    break;
                case GraphRepresentationType.EDGE_LIST:
                    parsed = GraphRepresentationConverter.fromEdgeList(GraphParser.parseEdgeListString(this.from));
                    break;
            }
        }
        return parsed;
    }
    convertTo(representation:AdjacencyList|WeightedAdjacencyList){
        let stringified:string;
        let converted;
        if (this.isWeighted){
            switch (this.toType){
                case GraphRepresentationType.ADJACENCY_LIST:
                    stringified = GraphParser.stringifyWeightedAdjacencyList(representation as WeightedAdjacencyList);
                    break;
                case GraphRepresentationType.ADJACENCY_MATRIX:
                    converted = GraphRepresentationConverter.toWeightedAdjacencyMatrix(representation as WeightedAdjacencyList)
                    stringified = GraphParser.stringifyAdjacencyMatrix(converted);
                    break;
                case GraphRepresentationType.EDGE_LIST:
                    converted = GraphRepresentationConverter.toWeightedEdgeList(representation as WeightedAdjacencyList);
                    stringified = GraphParser.stringifyEdgeList(converted);
                    break;
            }
        } else {
            switch (this.toType){
                case GraphRepresentationType.ADJACENCY_LIST:
                    stringified = GraphParser.stringifyAdjacencyList(representation as AdjacencyList);
                    break;
                case GraphRepresentationType.ADJACENCY_MATRIX:
                    converted = GraphRepresentationConverter.toAdjacencyMatrix(representation as AdjacencyList)
                    stringified = GraphParser.stringifyAdjacencyMatrix(converted);
                    break;
                case GraphRepresentationType.EDGE_LIST:
                    converted = GraphRepresentationConverter.toEdgeList(representation as AdjacencyList);
                    stringified = GraphParser.stringifyEdgeList(converted);
                    break;
            }
        }
        return stringified;
    }

    analyze(){
        try {
            const adjlist:AdjacencyList|WeightedAdjacencyList = this.convertFrom();
            let graph:Graph;
            if (this.isWeighted) graph = new Graph(adjlist as WeightedAdjacencyList);
            else graph = new Graph(Graph.toWeightedAdjacencyList(adjlist as AdjacencyList));
            this.vertices = graph.vertices.join(", ");
            this.inDegrees = Object.entries(graph.inDegrees).map(x => `(${x[0]},${x[1]})`).join(", ");
            this.outDegrees = Object.entries(graph.outDegrees).map(x => `(${x[0]},${x[1]})`).join(", ");
            const directedEulerTour = graph.eulerTour();
            const undirectedEulerTour = graph.undirectedEulerTour();
            this.directedEulerianPath = directedEulerTour.length === 0 ? "None" : directedEulerTour.join(" => ");
            this.undirectedEulerianPath = undirectedEulerTour.length === 0 ? "None" : undirectedEulerTour.join(" => ");
            this.isUndirected = graph.isUndirected();
            this.isBipartite = graph.isBipartite();
            this.isConnected = graph.isConnected();
            this.isCyclic = graph.isCyclic();
        } catch (e) {
            this.onError("Failed to parse the inputted graph");
            return;
        }
    }
    addRemoveWeight(){
        try {
            if (this.isWeighted){
                let parsed:WeightedAdjacencyList|AdjacencyMatrix|WeightedEdgeList;
                let light:AdjacencyList|AdjacencyMatrix|EdgeList;
                switch (this.fromType){
                    case GraphRepresentationType.ADJACENCY_LIST:
                        parsed = GraphParser.parseWeightedAdjacencyListString(this.from);
                        light = GraphRepresentationConverter.removeWeightFromAdjacencyList(parsed as WeightedAdjacencyList);
                        this.from = GraphParser.stringifyAdjacencyList(light as AdjacencyList);
                        break;
                    case GraphRepresentationType.ADJACENCY_MATRIX:
                        parsed = GraphParser.parseAdjacencyMatrixString(this.from);
                        light = GraphRepresentationConverter.removeWeightFromAdjacencyMatrix(parsed as AdjacencyMatrix);
                        this.from = GraphParser.stringifyAdjacencyMatrix(light as AdjacencyMatrix);
                        break;
                    case GraphRepresentationType.EDGE_LIST:
                        parsed = GraphParser.parseWeightedEdgeListString(this.from);
                        light = GraphRepresentationConverter.removeWeightFromEdgeList(parsed as WeightedEdgeList);
                        this.from = GraphParser.stringifyEdgeList(light as EdgeList);
                        break;
                }
            } else {
                let parsed:AdjacencyList|AdjacencyMatrix|EdgeList;
                let light:WeightedAdjacencyList|AdjacencyMatrix|WeightedEdgeList;
                switch (this.fromType){
                    case GraphRepresentationType.ADJACENCY_LIST:
                        parsed = GraphParser.parseAdjacencyListString(this.from);
                        light = GraphRepresentationConverter.addWeightToAdjacencyList(parsed as AdjacencyList);
                        this.from = GraphParser.stringifyWeightedAdjacencyList(light as WeightedAdjacencyList);
                        break;
                    case GraphRepresentationType.ADJACENCY_MATRIX:
                        parsed = GraphParser.parseAdjacencyMatrixString(this.from);
                        this.from = GraphParser.stringifyAdjacencyMatrix(parsed as AdjacencyMatrix);
                        break;
                    case GraphRepresentationType.EDGE_LIST:
                        parsed = GraphParser.parseEdgeListString(this.from);
                        light = GraphRepresentationConverter.addWeightToEdgeList(parsed as EdgeList);
                        this.from = GraphParser.stringifyEdgeList(light as WeightedEdgeList);
                        break;
                }
            }
            this.isWeighted = !this.isWeighted;
        } catch (e){
            this.onError("Failed to parse the inputted graph");
            return;
        }
    }
    addRemoveDirection(toDirected:boolean){
        const execute = (adjmat:AdjacencyMatrix)=>{
            if (toDirected) return GraphRepresentationConverter.toDirectedGraph(adjmat);
            else return GraphRepresentationConverter.toUndirectedGraph(adjmat);
        }
        try {
            if (this.isWeighted){
                let parsed:AdjacencyMatrix;
                let directmat:AdjacencyMatrix;
                switch (this.fromType){
                    case GraphRepresentationType.ADJACENCY_LIST:
                        parsed = GraphRepresentationConverter.toWeightedAdjacencyMatrix(GraphParser.parseWeightedAdjacencyListString(this.from));
                        directmat = execute(parsed);
                        this.from = GraphParser.stringifyWeightedAdjacencyList(GraphRepresentationConverter.fromWeightedAdjacencyMatrix(directmat));
                        break;
                    case GraphRepresentationType.ADJACENCY_MATRIX:
                        parsed = GraphParser.parseAdjacencyMatrixString(this.from);
                        directmat = execute(parsed);
                        this.from = GraphParser.stringifyAdjacencyMatrix(directmat);
                        break;
                    case GraphRepresentationType.EDGE_LIST:
                        parsed = GraphRepresentationConverter.toWeightedAdjacencyMatrix(GraphRepresentationConverter.fromWeightedEdgeList(GraphParser.parseWeightedEdgeListString(this.from)));
                        directmat = execute(parsed);
                        this.from = GraphParser.stringifyEdgeList(GraphRepresentationConverter.toWeightedEdgeList(GraphRepresentationConverter.fromWeightedAdjacencyMatrix(directmat)));
                        break;
                }
            } else {
                let parsed:AdjacencyMatrix;
                let directmat:AdjacencyMatrix;
                switch (this.fromType){
                    case GraphRepresentationType.ADJACENCY_LIST:
                        parsed = GraphRepresentationConverter.toAdjacencyMatrix(GraphParser.parseAdjacencyListString(this.from));
                        directmat = execute(parsed);
                        this.from = GraphParser.stringifyAdjacencyList(GraphRepresentationConverter.fromAdjacencyMatrix(directmat));
                        break;
                    case GraphRepresentationType.ADJACENCY_MATRIX:
                        parsed = GraphParser.parseAdjacencyMatrixString(this.from);
                        directmat = execute(parsed);
                        this.from = GraphParser.stringifyAdjacencyMatrix(directmat);
                        break;
                    case GraphRepresentationType.EDGE_LIST:
                        parsed = GraphRepresentationConverter.toAdjacencyMatrix(GraphRepresentationConverter.fromEdgeList(GraphParser.parseEdgeListString(this.from)));
                        directmat = execute(parsed);
                        this.from = GraphParser.stringifyEdgeList(GraphRepresentationConverter.toEdgeList(GraphRepresentationConverter.fromAdjacencyMatrix(directmat)));
                        break;
                }
            }
        } catch (e){
            console.warn(e);
            this.onError("Failed to parse the inputted graph");
            return;
        }
    }

    static toAdjacencyMatrix(adjlist:AdjacencyList): AdjacencyMatrix {
        const matrix:AdjacencyMatrix = [];
        const adjarr = Object.entries(adjlist);
        matrix.push(adjarr.map(x => x[0]));
        for (let r = 0; r < adjarr.length; r++){
            matrix.push(Array(adjarr.length).fill(0));
            for (let c = 0; c < adjarr.length; c++){
                if (!adjarr[r][1].includes(adjarr[c][0])) continue;
                matrix[r+1][c] = 1;
            }
        }
        return matrix;
    }
    static toWeightedAdjacencyMatrix(adjlist:WeightedAdjacencyList): AdjacencyMatrix {
        const matrix:AdjacencyMatrix = [];
        const adjarr = Object.entries(adjlist);
        matrix.push(adjarr.map(x => x[0]));
        for (let r = 0; r < adjarr.length; r++){
            matrix.push(Array(adjarr.length).fill(0));
            for (let c = 0; c < adjarr.length; c++){
                const findme = adjarr[r][1].find(x => x[0] === adjarr[c][0]);
                if (!findme) continue;
                matrix[r+1][c] = findme[1];
            }
        }
        return matrix;
    }
    static toEdgeList(adjlist:AdjacencyList): EdgeList {
        const edgeList:EdgeList = [];
        for (let src in adjlist){
            for (let endpoint of adjlist[src]){
                edgeList.push([src,endpoint]);
            }
        }
        return edgeList;
    }
    static toWeightedEdgeList(adjlist:WeightedAdjacencyList): WeightedEdgeList {
        const edgeList:WeightedEdgeList = [];
        for (let src in adjlist){
            for (let endpoint of adjlist[src]){
                edgeList.push([src,endpoint[0],endpoint[1]]);
            }
        }
        return edgeList;
    }
    static fromAdjacencyMatrix(adjmat:AdjacencyMatrix): AdjacencyList {
        const adjlist:AdjacencyList = {};
        const vertices = adjmat.shift();
        for (let vertice of vertices){
            adjlist[vertice] = [];
        }
        for (let r = 0; r < adjmat.length; r++){
            for (let c = 0; c < adjmat.length; c++){
                if (adjmat[r][c] != 0){
                    adjlist[vertices[r]].push(vertices[c].toString());
                }
            }
        }
        return adjlist;
    }
    static fromWeightedAdjacencyMatrix(adjmat:AdjacencyMatrix): WeightedAdjacencyList {
        const adjlist:WeightedAdjacencyList = {};
        const vertices = adjmat.shift();
        for (let vertice of vertices){
            adjlist[vertice] = [];
        }
        for (let r = 0; r < adjmat.length; r++){
            for (let c = 0; c < adjmat.length; c++){
                if (adjmat[r][c] != 0){
                    adjlist[vertices[r]].push([vertices[c].toString(),adjmat[r][c] as number]);
                }
            }
        }
        return adjlist;
    }
    static fromEdgeList(edgelist:EdgeList): AdjacencyList {
        const adjlist:AdjacencyList = {};
        for (let edge of edgelist){
            if (!(edge[0] in adjlist)){
                adjlist[edge[0]] = [edge[1]];
            } else {
                adjlist[edge[0]].push(edge[1]);
            }
        }
        return adjlist;
    }
    static fromWeightedEdgeList(edgelist:WeightedEdgeList): WeightedAdjacencyList {
        const adjlist:WeightedAdjacencyList = {};
        for (let edge of edgelist){
            if (!(edge[0] in adjlist)){
                adjlist[edge[0]] = [[edge[1],edge[2]]];
            } else {
                adjlist[edge[0]].push([edge[1],edge[2]]);
            }
        }
        return adjlist;
    }
    static addWeightToAdjacencyList(adjlist:AdjacencyList):WeightedAdjacencyList {
        const weighted = {};
        for (const vertex in adjlist){
            weighted[vertex] = [];
            for (const edge of adjlist[vertex]){
                weighted[vertex].push([edge,1]);
            }
        }
        return weighted;
    }
    static addWeightToEdgeList(edgelist:EdgeList):WeightedEdgeList {
        const weighted:WeightedEdgeList = [];
        for (const edge of edgelist){
            weighted.push([edge[0],edge[1],1]);
        }
        return weighted;
    }
    static removeWeightFromAdjacencyList(adjlist:WeightedAdjacencyList):AdjacencyList {
        const light = {};
        for (const vertex in adjlist){
            light[vertex] = [];
            for (const edge of adjlist[vertex]){
                light[vertex].push(edge[0]);
            }
        }
        return light;
    }
    static removeWeightFromAdjacencyMatrix(adjmat:AdjacencyMatrix):AdjacencyMatrix {
        const light:AdjacencyMatrix = [adjmat.shift()];
        for (let r = 0; r < adjmat.length; r++){
            light.push([]);
            for (let c = 0; c < adjmat.length; c++){
                light[r+1].push((adjmat[r][c] === 0 ? 0 : 1));
            }
        }
        return light;
    }
    static removeWeightFromEdgeList(edgelist:WeightedEdgeList): EdgeList {
        const light:EdgeList = [];
        for (const edge of edgelist){
            light.push([edge[0],edge[1]]);
        }
        return light;
    }
    static toUndirectedGraph(adjmat:AdjacencyMatrix){
        const header = adjmat.shift();
        const result:AdjacencyMatrix = adjmat.map(r => r.map(c => c));
        for (let r = 0; r < adjmat.length; r++){
            for (let c = 0; c < r; c++){
                if (result[r][c] > 0 && result[c][r] > 0){
                    result[r][c] = 0;
                }
            }
        }
        result.unshift(header);
        return result;
    }
    static toDirectedGraph(adjmat:AdjacencyMatrix){
        const header = adjmat.shift();
        const result:AdjacencyMatrix = adjmat.map(r => r.map(c => c));
        for (let r = 0; r < adjmat.length; r++){
            for (let c = 0; c < r; c++){
                if (result[r][c] > 0){
                    result[c][r] = result[r][c];
                } else if (result[c][r] > 0){
                    result[r][c] = result[c][r];
                }
            }
        }
        result.unshift(header);
        return result;
    }
}