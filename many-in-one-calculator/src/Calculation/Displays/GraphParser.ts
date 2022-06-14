import type { AdjacencyList,AdjacencyMatrix,EdgeList,WeightedAdjacencyList,WeightedEdgeList } from "../Elements/Graph";
import { UserError,BackendUtils } from "../../Utils";

export class GraphParser {
    static parseAdjacencyListString(adjlistString:string):AdjacencyList {
        const adjlist:AdjacencyList = {}
        const lines = adjlistString.split('\n').filter(x => x.length !== 0).map(row => row.split(/\s+/)).map(row => {
            const src = row.shift();
            if (!(src in adjlist)){
                adjlist[src] = row;
            } else {
                adjlist[src].push(...row);
            }
        });
        return adjlist;
    }
    static parseWeightedAdjacencyListString(adjlistString:string):WeightedAdjacencyList {
        const pattern = /\(([a-zA-Z0-9]+),([0-9]+)\)/;
        const adjlist:WeightedAdjacencyList = {};
        const lines = adjlistString.split('\n').filter(x => x.length !== 0).map(row => row.split(/\s+/)).map(row => {
            const src = row.shift();
            const items = row.map(item => {
                const match = item.match(pattern);
                if (!match || match.length <= 2) throw new UserError("Failed to parse weighted adjacency list node");
                return [match[1],BackendUtils.parseAsInteger(match[2])] as [string,number];
            });
            if (!(src in adjlist)){
                adjlist[src] = items;
            } else {
                adjlist[src].push(...items);
            }
        });
        return adjlist;
    }
    static parseAdjacencyMatrixString(adjmatString:string): AdjacencyMatrix {
        const lines = adjmatString.split('\n').filter(x => x.length !== 0);
        const header = lines.shift().split(/\s+/);
        let body:AdjacencyMatrix;
        body = lines.map(row => row.split(/\s+/).map(elem => BackendUtils.parseAsInteger(elem)));
        
        if (!body.every(x => x.length === body.length)) throw new UserError("Failed to parse Adjacency Matrix");
        body.unshift(header);
        return body;
    }
    static parseEdgeListString(edgelistString:string): EdgeList {
        return edgelistString.split('\n').filter(x => x.length !== 0).map(row => row.split(/\s+/,2) as [string,string]);
    }
    static parseWeightedEdgeListString(edgelistString:string): WeightedEdgeList {
        return edgelistString.split('\n').filter(x => x.length !== 0).map(row => {
            const edge = row.split(/\s+/,3);
            return [edge[0],edge[1],BackendUtils.parseAsInteger(edge[2])];
        });
    }
    static stringifyAdjacencyList(adjlist:AdjacencyList): string {
        return Object.entries(adjlist).map(
            row => row[0] + ' ' + row[1].join(' ')
        ).join("\n");
    }
    static stringifyWeightedAdjacencyList(adjlist:WeightedAdjacencyList): string {
        return Object.entries(adjlist).map(
            row => row[0] + ' ' + (row[1].map(node => `(${node[0]},${node[1]})`).join(' '))
        ).join('\n');
    }
    static stringifyAdjacencyMatrix(adjmat:AdjacencyMatrix):string {
        console.log(adjmat);
        return adjmat.map(row => row.join(' ')).join('\n');
    }
    static stringifyEdgeList(edgelist:EdgeList|WeightedEdgeList):string {
        return edgelist.map(row => row.join(' ')).join('\n');
    }
}