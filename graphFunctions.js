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
    let edge = { from: v1, to: v2, highlight: false }
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
    deselectAll();
}

export function printEdges() {
    for (let i = 0; i < edges.length; i++) {
        let edge = graph.edges[i];
        console.log(`Edge ${i}: (${edge.from.number}, ${edge.to.number})`);
    }
}

export function isVertex(vertexNumber) {
    for (let i = 0; i < vertices.length; i++) {
        let v = vertices[i];
        if (v.number == vertexNumber) {
            return true;
        }
    }

    return false;
}

export function getNbrNumbers(vertex) {
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

export function findPath(v1, v2, visited, queue) {
    visited[v1.number - 1] = true;
    queue[queue.length] = v1;

    if (v1 == v2) {
        return queue;
    }

    let vertexNbrs = getNeighbours(v1);
    if (vertexNbrs.includes(v2)) {
        queue[queue.length] = v2;
        return queue;
    }

    for (let i = 0; i < vertexNbrs.length; i++) {
        if (!visited[vertexNbrs[i].number - 1]) {
            if (findPath(vertexNbrs[i], v2, visited, queue)) {
                return queue;
            }
        }
    }

    return false;
}

export function getPathNumbers(path) {
    if (path) {
        let pathNumbers = [];
        for (let i = 0; i < path.length; i++) {
            pathNumbers.push(path[i].number);
        }
        return pathNumbers;
    }
    return false;
}

export function highlightEdges(path) {
    for (let i = 0; i < path.length - 1; i++) {
        highlightEdge(path[i], path[i+1]);
    }
}

export function deselectAll() {
    for (let i = 0; i < vertices.length; i++) {
        let vertex = vertices[i];
        vertex.selected = false;
    }

    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        edge.highlight = false;
    }
}

export function isConnected() {
    if (vertices.length == 0) {
        return "Graph has no vertices";
    }

    let startingVertex = vertices[0];
    for (let i = 0; i < vertices.length; i++) {
        if (findPath(startingVertex, vertices[i], [], [])) {
            continue;
        } else {
            return false;
        }
    }

    return true;
}






function getNeighbours(vertex) {
    let neighbours = [];
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];

        if (edge.from == vertex) {
            neighbours.push(edge.to);
        }

        if (edge.to == vertex) {
            neighbours.push(edge.from);
        }
    }

    return neighbours;
}

function highlightEdge(v1, v2) {
    if (isVertex(v1.number) && isVertex(v2.number)) {
        for (let i = 0; i < edges.length; i++) {
            let edge = edges[i];
            if ((v1 == edge.to && v2 == edge.from) ||
                (v1 == edge.from && v2 == edge.to)) {
                edge.highlight = true;
            }
        }
    }
}