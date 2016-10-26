import Graph from './graph';

class Control {
    constructor () {
        this.graph = new Graph(this._onNodeUpdate.bind(this));
        this.setupAddNode();
        this.setupShowNewNode();
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

    deleteNode (name) {
        this.graph.removeNode(name);
    }

    _onNodeUpdate (nodes) {
        let tableRows = $("#TableNodes tbody");
        tableRows.find("tr").remove();
        _.sortBy(nodes, '-id').map((node) => {
            tableRows.append(`<tr><td>${node.id}</td><td class="is-icon"><a href="#"><i class="fa fa-trash"></i></a></td></tr>`);
        });
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
                console.log(node);
                this.deleteNode(node);
            });
        });
    }


}

export default Control

