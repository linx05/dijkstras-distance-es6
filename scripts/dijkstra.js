class PriorityQueue {

    constructor () {
        this._nodes = [];
    }

    enqueue (priority, key) {
        this._nodes.push({key: key, priority: priority});
        this.sort();
    }

    dequeue () {
        return this._nodes.shift().key;
    }

    sort () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }

    isEmpty () {
        return !this._nodes.length;
    }
}

class Dijkstra {

    constructor () {
        this.INFINITY = 1 / 0;
        this.vertices = {};
    }

    _addVertexes (vertexes) {
        _.map(vertexes, vertex => {
            this._addVertex(vertex.name, vertex.edges);
        });
    }

    _addVertex (name, edges) {
        this.vertices[name] = edges;
    }

    _shortestPath (start, finish) {
        var nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            smallest, alt;
        _.forEach(this.vertices, (vertice, vertex)=> {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = this.INFINITY;
                nodes.enqueue(this.INFINITY, vertex);
            }

            previous[vertex] = null;
        });

        while (!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            if (smallest === finish) {

                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }

                break;
            }

            if (!smallest || distances[smallest] === this.INFINITY) {
                continue;
            }

            _.forEach(this.vertices[smallest], (value, neighbor)=> {

                alt = distances[smallest] + this.vertices[smallest][neighbor];

                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            });
        }
        if(path.length>0) path.push(start);
        return path;
    }

    _calculateDistance() {

    }

    addVertices (vertexes) {
        this.vertices = {};
        this._addVertexes(vertexes);
        return this.vertices;
    }

    calculateDijkstra (start, finish) {
        return this._shortestPath(start, finish);
    }
}

export default Dijkstra;