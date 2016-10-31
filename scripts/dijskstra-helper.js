import Dijstra from './dijkstra';

class DijkstraHelper {
    constructor () {
        this.dijkstra = new Dijstra();
    }

    calculateDijkstra (nodes, edges, from, to) {
        this.nodesToVertex(nodes,edges);
        return this.dijkstra.calculateDijkstra(from, to);
    }

    nodesToVertex (nodes, edges) {
        let nodeEdges = _.reduce(nodes,(val, node)=> {
            val[node.label] = this.getEdges(node, edges);
            return val;
        }, {});

        let dijkstraEdges = _.reduce(nodeEdges, (result, group, key)=> {
            let value = group.reduce((val, edge)=> {
                val.name = key;
                let label = edge.to === key ? edge.from : edge.to;
                val.edges[label] = edge.label;
                return val;
            }, {edges: {}});
            result.push(value);
            return result;
        }, []);
        return this.dijkstra.addVertices(dijkstraEdges);
    }

    getEdges (node, edges) {
        return _.filter(edges, (item) => {
            return (item.from == node.label || item.to == node.label)
        });
    }
}

export default DijkstraHelper;