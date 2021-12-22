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

export function addEdge(edge) {
    edges.push(edge);
}

export function addVertex(vertex) {
    vertices.push(vertex);
}

export function removeVertex() {
    let removedVertex = vertices.pop();
    edges = edges.filter(edge => !vertexOnEdge(removedVertex, edge));
}

export function removeEdge() {
    edges.pop();
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