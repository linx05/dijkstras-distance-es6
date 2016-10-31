import Graph from './graph';

class Control {
    constructor () {
        this.graph = new Graph(
            this._onNodeUpdate.bind(this),
            this._onEdgeUpdate.bind(this),
            this._onSelectedNodeUpdate.bind(this)
        );
        this.setupAddNode();
        this.setupShowNewNode();
        this.setupDijkstra();
    }


    setupShowNewNode () {
        $('#ConnectedToNode').on('click', (event) => {
            this.toggleAddConectedNode();
        });
    }

    setupAddNode () {
        $('#AddNode').on('click', (event) => {
            this.graph.addNode();
        })
    }

    setupDijkstra(){
        $('#CalculatePath').on('click', ()=> {
            let points = this.graph.calculatePath();
            points = this.graph.calculateDistances(points);
            this._pathTable(points);
            let distance = _.reduce(points,(sum,point)=>{
                return sum+point.distance;
            },0);
            this._addPathDistance(distance);
        })
    }


    toggleAddConectedNode () {
        $('#ConnectToNewNode').toggleClass('hide-div');
    }

    deleteNode (name) {
        this.graph.removeNode(name);
    }

    _onSelectedNodeUpdate(nodes) {
        this._onUpdate(nodes, '#SelectedNodes', 'selected');
    }

    _onNodeUpdate (nodes) {
        this._onUpdate(nodes, '#TableNodes', 'node');
    }

    _onEdgeUpdate (edges) {
        this._onUpdate(edges, '#TableEdges', 'edge');
    }

    _onUpdate (points, element, type) {
        let tableRows = $(`${element} tbody`);
        tableRows.find("tr").remove();
        let sortedPoints = _.sortBy(points, '-id');
        switch (type) {
            case 'path':
                this._addPathPointsRow(tableRows, sortedPoints);
                break;
            case 'selected':
                this._addSelectedNodesRow(tableRows, sortedPoints);
                break;
            case 'node':
                this._addNodeRow(tableRows, sortedPoints);
                this._addListenersTableDeleteButton(element, type);
                break;
            case 'edge':
                this._addEdgeRow(tableRows, sortedPoints);
                break;
            default: return;
        }
    }

    _pathTable(points) {
        this._onUpdate(points,'#NodePath','path')
    }

    _addPathDistance(distance){
        let tableRows = $(`#NodePath tbody`);
        tableRows.append(
            `<tr><td></td><td></td><td></td><td><b>${distance}</b></td>/tr>`);
    }


    _addPathPointsRow(table, nodes) {
        for(let i=0;i<nodes.length;i++){
            table.append(
                `<tr><td>${nodes[i].name}</td><td>${nodes[i].to}</td><td>${nodes[i].distance}</td><td></td>/tr>`);
        }
    }

    _addSelectedNodesRow(table, nodes) {
        nodes.map(node => {
            table.append(
                `<tr><td>${node}</td></tr>`);
        });
    }

    _addNodeRow (table, nodes) {
        nodes.map(node => {
            table.append(
                `<tr><td>${node.id}</td><td class="is-icon"><a href="#"><i class="fa fa-trash"></i></a></td></tr>`);
        });
    }

    _addEdgeRow (table, edges) {
        edges.map(edge => {
            table.append(`<tr>
                            <td>${edge.id}</td>
                            <td>${edge.from}</td>
                            <td>${edge.to}</td>
                            <td>${edge.label}</td>
                        </tr>`);
        });
    }


    _getNodeRow (element) {
        return element.closest('tr');
    }

    _addListenersTableDeleteButton (el, type) {
        $(`${el}`).find('a').map((i, e) => {
            let element = $(e);
            let point = this._getNodeRow(element).children('td').first().text();
            element.on('click', (event) => {
                if (type === 'node') this.deleteNode(point);
            });
        });
    }


}

export default Control

