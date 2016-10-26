import vis from 'vis/dist/vis';

class GraphControls {
    constructor (cbOnChanges) {
        this._onChange = cbOnChanges;
        this._nodes = new vis.DataSet([{id: 1, label: 'Node 1'},
            {id: 2, label: 'Node 2'},
            {id: 3, label: 'Node 3'},
            {id: 4, label: 'Node 4'},
            {id: 5, label: 'Node 5'}]);
        this._edges = new vis.DataSet([
            {from: 1, to: 3, label: 4},
            {from: 1, to: 2},
            {from: 2, to: 4},
            {from: 2, to: 5}
        ]);

        this._nodes.on('*', () => {
            //this._onChange(this._nodes.get());
        });
        //this._edges.on('*', this._onChange);

        this._options = {
            physics: {
                enabled: false
            }
        };
        // create a network
        this._container = document.getElementById('mynetwork');
        // initialize your network!
        this.startNetwork();
    }

    ////////////////////////////////////////////////////////////////
    addNode () {
        try {
            let newNodes = [];

            let value = document.getElementById('NuevoNodo').value;
            let hasConnectedValue = document.getElementById('ConnectedToNode').checked;

            let valueExists = this._nodes.get(value);
            if (!valueExists) {
                newNodes.push({
                    id   : value,
                    label: value
                });
            }
            if (hasConnectedValue) {
                let connectedValue = document.getElementById('NodoConectado').value;
                let distance = document.getElementById('Distancia').value;
                if (!this._nodes.get(connectedValue)) {
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
            this._nodes.remove({id: node});
            this.getEdges(node).map((edge) => {
                this.removeEdge(edge.id)
            });
        }
        catch (err) {
            alert(err);
        }
    }

    addEdge (node1, node2, distance = 0) {
        try {
            let connection = this.hasConnection(node1, node2);
            if (connection && connection.length>0) return this.updateEdge(connection[0], node1, node2, distance);

            this._edges.add({
                id   : node1 + node2,
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
                return (item.from === node || item.to === node)
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


    hasConnection (node1, node2) {
        return this._edges.get({
            filter: (item) => {
                return ((item.from === node1 && item.to === node2) || (item.to === node1 && item.from === node2))
            }
        });
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
    }


    //////"Private" Methods
    _addNetworkEvents (network) {
        let _network = network;
        _network.on('selectNode', this._clickNode);
        _network.on('deselectNode', this._clickNode);
        return _network;
    }

    _clickNode (obj) {

    }

}

export default GraphControls;