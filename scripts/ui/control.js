import Graph from './graph';

class Control {
    constructor () {
        this.graph = new Graph(this._onNodeUpdate);
        this.setupAddNode();
        this.setupShowNewNode();
        this._addListenersTableDeleteButton();
    }


    setupShowNewNode () {
        $('#ConnectedToNode').on('click', (event) => {
            this.toggleAddConectedNode();
        });
    }

    setupAddNode() {
        $('#AddNode').on('click', (event) => {
            this.graph.addNode();
        })
    }


    toggleAddConectedNode () {
        $('#ConnectToNewNode').toggleClass('hide-div');
    }

    addNode (name, to = null, distance = null) {
        //Backend logic

    }

    deleteNode (name) {
        this.graph.removeNode(name);
        console.log('deleting node: ',name);
    }


    _onNodeUpdate (nodes) {
        nodes.map((node) => {
            $('#TableNodes').find('tr:last').after(`<tr><td>${node.id}</td><td class="is-icon"><a href="#"><i class="fa fa-trash"></i></a></td></tr>`);
        });
        this._addListenersTableDeleteButton();
    }

    _onEdgeUpdate (edges) {

    }

    _addNodeDOM (node) {
        $('#TableNodes').find('tr:last').after(`<tr><td>${node}</td><td class="is-icon"><a href="#"><i class="fa fa-trash"></i></a></td></tr>`);
        this._addListenersTableDeleteButton();
    }


    _getNodeRow(element) {
        return element.closest('tr');
    }

    _addListenersTableDeleteButton () {
        $('#TableNodes').find('a').map((i, e) => {
            let element = $(e);
            let node = this._getNodeRow(element).children('td').first().text();
            element.on('click', (event) => {
                this.deleteNode(node);
            });
        });
    }


}

export default Control

