export let vertices = [];
export let edges = [];

export function isEdge(v1, v2) {
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        if ((v1 == edge.from && v2 == edge.to) ||
            (v1 == edge.to && v2 == edge.from)) {
            return true;
        }
    }

    return false;
}

export function vertexOnEdge(vertex, edge) {
    if (edge.to == vertex || edge.from == vertex) {
        return true;
    }

    return false;
}

export function addEdge(v1, v2) {
    let edge = { from: v1, to: v2 }
    edges.push(edge);
}

export function addVertex(vx, vy) {
    let vertex = {
        number: vertices.length + 1,
        x: vx,
        y: vy,
        radius: 15,
        fillStyle: '#8c92ff',
        strokeStyle: '#000000',
        selectedFill: '#ff2b59',
        selected: false
    };
    vertices.push(vertex);
}

export function removeVertex() {
    let removedVertex = vertices.pop();
    edges = edges.filter(edge => !vertexOnEdge(removedVertex, edge));
    deselectAll();
}

export function removeEdge() {
    edges.pop();
    deselectAll();
}

export function clear() {
    vertices = [];
    edges = [];
}

export function printEdges() {
    for (let i = 0; i < edges.length; i++) {
        let edge = graph.edges[i];
        console.log(`Edge ${i}: (${edge.from.number}, ${edge.to.number})`);
    }
}

export function getNeighbours(vertex) {
    let neighbours = [];
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];

        if (edge.from == vertex) {
            neighbours.push(edge.to.number);
        }

        if (edge.to == vertex) {
            neighbours.push(edge.from.number);
        }
    }

    return neighbours;
}

function deselectAll() {
    for (let i = 0; i < vertices.length; i++) {
        let vertex = vertices[i];
        vertex.selected = false;
    }
}