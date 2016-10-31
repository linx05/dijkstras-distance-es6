import vis from 'vis/dist/vis';
import Dijktra from '../dijskstra-helper';
import buckets from 'buckets-js';

class GraphControls {
    constructor (cbOnNodeChanges, cbOnEdgeChanges, cbOnSelectedChanges) {
        this._onNodeChanges = cbOnNodeChanges;
        this._onEdgeChanges = cbOnEdgeChanges;
        this._onSelectedChanges = cbOnSelectedChanges;
        this.dijkstra = new Dijktra();
        this.selectedNodes = new buckets.Stack();
        this._nodes = new vis.DataSet([
            {id: 'A', label: 'A'},
            {id: 'B', label: 'B'},
            {id: 'C', label: 'C'},
            {id: 'D', label: 'D'},
            {id: 'E', label: 'E'},
            {id: 'F', label: 'F'},
        ]);

        this._edges = new vis.DataSet([
            {from: 'A', to: 'C', label: 4},
            {from: 'A', to: 'B', label: 10},
            {from: 'B', to: 'D', label: 2},
            {from: 'B', to: 'E', label: 2},
            {from: 'A', to: 'F', label: 2},
            {from: 'F', to: 'E', label: 2}
        ]);

        this._nodes.on('*', () => {
            console.log('changes on nodes');
            this._onNodeChanges(this._nodes.get());
        });

        this._edges.on('*', () => {
            console.log('changes on edges');
            this._onEdgeChanges(this._edges.get());
        });

        this._options = {
            physics    : {
                enabled: true
            },
            interaction: {
                selectable: true
            },
            layout     : {randomSeed: 2}
        };
        // create a network
        this._container = document.getElementById('mynetwork');
        // initialize your network!
        this.startNetwork();
    }

    ////////////////////////////////////////////////////////////////

    calculatePath () {
        return this.dijkstra.calculateDijkstra(this._nodes.get(), this._edges.get(), this.selectedNodes.toArray());
    }


    addNode () {
        try {
            let newNodes = [];

            let value = document.getElementById('NuevoNodo').value;
            let hasConnectedValue = document.getElementById('ConnectedToNode').checked;

            let valueExists = this._nodes.get(value);
            if (!valueExists) {
                console.log('Add Node: ', value);
                newNodes.push({
                    id   : value,
                    label: value
                });
            }
            if (hasConnectedValue) {
                let connectedValue = document.getElementById('NodoConectado').value;
                let distance = document.getElementById('Distancia').value;
                if (!this._nodes.get(connectedValue)) {
                    console.log('Add Node: ', connectedValue);
                    newNodes.push({
                        id   : connectedValue,
                        label: connectedValue
                    })
                }
                this.addEdge(value, connectedValue, distance);
            }

            if (newNodes.length > 0) this._nodes.add(newNodes);
        }
        catch (err) {
            console.log(err);
        }
    }

    removeNode (node) {
        try {
            if (!this._nodes.get(node)) return;
            console.log('Delete Node: ', node);
            this._nodes.remove({id: node});
            this.getEdges(node).map((edge) => {
                console.log('Delete Edge: ', edge.id);
                this.removeEdge(edge.id)
            });
            if(this.selectedNodes.contains(node)) this.clearSelectedNodes();
        }
        catch (err) {
            alert(err);
        }
    }

    addEdge (node1, node2, distance = 0) {
        try {
            let connection = this.hasConnection(node1, node2);
            if (connection && connection.length > 0) return this.updateEdge(connection[0], node1, node2, distance);
            console.log('Adding Edge: ', node1 + node2);
            this._edges.add({
                id   : `${node1}-${node2}`,
                from : node1,
                to   : node2,
                label: distance
            });
        }
        catch (err) {
            alert(err);
        }
    }

    getEdges (node) {
        return this._edges.get({
            filter: (item) => {
                return (item.from == node || item.to == node)
            }
        })
    }

    updateEdge (connection, node1, node2, distance) {
        try {
            let obj = Object.assign({}, connection, {
                from : node1,
                to   : node2,
                label: distance
            });
            return this._edges.update(obj);
        }
        catch (err) {
            alert(err);
        }
    }

    removeEdge (id) {
        try {
            this._edges.remove({id});
        }
        catch (err) {
            alert(err);
        }
    }

    getSelected() {
        return this.selectedNodes.toArray();
    }

    clearSelectedNodes() {
        this.selectedNodes.clear();
        this._onSelectedChanges(this.selectedNodes.toArray());
    }


    hasConnection (node1, node2) {
        return this._edges.get({
            filter: (item) => {
                return ((item.from === node1 && item.to === node2) || (item.to === node1 && item.from === node2))
            }
        });
    }

    calculateDistances(nodes) {
        let result = [];
        for(let i=0;i<nodes.length-1;i++){
            let point = {};
            point.name = nodes[i];
            point.to = nodes[i+1];
            point.distance = this.getDistance(nodes[i],nodes[i+1]);
            result.push(point);
        }
        return result;
    }

    getDistance (node1, node2) {
        return this.hasConnection(node1, node2)[0].label;
    }

    resetNetwork () {
        if (this._network !== null) {
            this._network.destroy();
            this._network = null;
        }
        this.startNetwork();
    }

    startNetwork () {

        let data = {
            nodes: this._nodes,
            edges: this._edges
        };

        this._network = new vis.Network(this._container, data, this._options);
        this._network = this._addNetworkEvents(this._network);
        this._network.on('click', this._clickNode.bind(this));
        this._onNodeChanges(this._nodes.get());
        this._onEdgeChanges(this._edges.get());
    }


    //////"Private" Methods
    _addNetworkEvents (network) {
        let _network = network;
        _network.on('click', this._clickNode);
        return _network;
    }


    _clickNode (obj) {
        let node = obj.nodes[0];
        if (!node || !this.selectedNodes) return;
        if (this.selectedNodes.contains(node)) {
            let backupstack = new buckets.Stack();
            this.selectedNodes.forEach(node=> {
                backupstack.add(node);
            });
            this.selectedNodes.clear();
            backupstack.forEach(oldNode => {
                if (oldNode != node) this.selectedNodes.add(oldNode);
            });
        }
        else {
            if (this.selectedNodes.size() < 2) {
                this.selectedNodes.add(node);
            }
            else {
                this.selectedNodes.pop();
                this.selectedNodes.add(node);
            }
        }
        this._onSelectedChanges(this.selectedNodes.toArray());
    }

}

export default GraphControls;