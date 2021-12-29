import * as graph from './graphFunctions.js';

const canvas = document.getElementById('appCanvas');
canvas.style.display = 'block';
const context = canvas.getContext('2d');
const VKEY = 86;
const EKEY = 69;
const CKEY = 67;
let selection = undefined;

function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    //graph.deselectAll();

    // draw every edge
    for (let i = 0; i < graph.edges.length; i++) {
        let edge = graph.edges[i];
        let fromVertex = graph.edges[i].from;
        let toVertex = graph.edges[i].to;
        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = edge.highlight ? '#ff0000' : '#000000';
        context.moveTo(fromVertex.x, fromVertex.y);
        context.lineTo(toVertex.x, toVertex.y);
        context.stroke();
    }

    // draw every vertex
    for (let i = 0; i < graph.vertices.length; i++) {
        let v = graph.vertices[i];

        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = v.selected ? v.selectedFill : v.fillStyle;
        context.arc(v.x, v.y, v.radius, 0, Math.PI * 2, true);
        context.strokeStyle = v.strokeStyle;
        context.fill();
        context.stroke();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '24px arial';
        context.fillStyle = 'black'
        context.fillText(v.number, v.x, v.y);

        if (v.selected) {
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.font = '30px arial';
            context.fillStyle = 'black'

            let nbrs = graph.getNbrNumbers(v).sort((a,b) => a-b);
            context.fillText(`deg(v${v.number}) = ${nbrs.length}`, 10, 10);
            context.fillText(`Neighbours: ${nbrs}`, 10, 40);
        }
    }
}

/**
 * finds first vertex around (x, y)
 */
function within(x, y) {
    return graph.vertices.find(v => {
        return x > (v.x - v.radius) &&
            y > (v.y - v.radius) &&
            x < (v.x + v.radius) &&
            y < (v.y + v.radius);
    });
}

function getVerticesForPath() {
    graph.deselectAll();
    let vertexStr = document.getElementById('pathFinder').value;
    let pathedVertices = vertexStr.split(' ');

    if (pathedVertices.length > 2 || pathedVertices.length < 2) {
        alert("Can only path between two vertices.");
        return;
    }

    if (pathedVertices.some(isNaN)) {
        alert("Vertices must be numeric.");
        return;
    }

    if (!graph.isVertex(pathedVertices[0]) || 
        !graph.isVertex(pathedVertices[1])) {
        alert("Can only path between existing vertices.");
        return;
    }

    let pathList = [];
    let numberOfPaths = graph.getPath(graph.vertices[pathedVertices[0]-1],
                    graph.vertices[pathedVertices[1]-1], pathList);
    let vertexPath = graph.getVertexPath(pathList);
    graph.highlightEdges(vertexPath);
    
    draw();
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.font = '30px arial';
    context.fillStyle = 'black'
    context.fillText(`Exists ${pathedVertices[0]},${pathedVertices[1]} path?: ${pathList}`,
                        10, 70);
    context.fillText(`Total paths: ${numberOfPaths}`, 10, 110);
}

function checkConnectivity() {
    graph.deselectAll();
    let result = graph.isConnected();
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.font = '30px arial';
    context.fillStyle = 'black'
    context.fillText(`Is connected?: ${result}`,
                        10, 70);
}

function returnCycles() {
    graph.deselectAll();
    let allCycles = graph.getCycle([]);
    for (let i = 0; i < allCycles.length; i++) {
        let numberCycle = allCycles[i];
        let vertexCycle = graph.getVertexPath(numberCycle);
        graph.highlightEdges(vertexCycle);
    }

    draw();
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.font = '30px arial';
    context.fillStyle = 'black'
    context.fillText(`Total cycles: ${allCycles.length}`, 10, 70);
    context.fillText(`Girth: ${graph.getSmallestCycle(allCycles)}`, 10, 110);
}



/* Key and mouse functions */

function move(e) {
    if (selection && e.buttons) {
        selection.x = e.x;
        selection.y = e.y;
        draw();
    }
}

function down(e) {
    if(e.target.id === 'appCanvas') {
        graph.deselectAll();
        let target = within(e.x, e.y);

        if (selection && selection.selected) {
            selection.selected = false;
        }

        if (target) {
            if (selection && selection !== target) {
                if (!graph.isEdge(selection, target)) {
                    graph.addEdge(selection, target);
                }
            }
            selection = target;
            selection.selected = true;
            draw();
        }
    }
}

function up(e) {
    if(e.target.id === 'appCanvas') {
        if (!selection) {
            graph.addVertex(e.x, e.y);
            draw();
        }

        if (selection && !selection.selected) {
            selection = undefined;
        }

        draw();
    }
}

function keys(e) {
    if (e.keyCode === VKEY) {
        graph.removeVertex();
    }

    if (e.keyCode === EKEY) {
        graph.removeEdge();
    }

    if (e.keyCode === CKEY) {
        graph.clear()
    }

    selection = undefined;
    draw();
}


window.onmousemove = move;
window.onmouseup = up;
window.onmousedown = down;
window.onkeydown = keys;




document.getElementById("pathBtn").onclick = function() {
    getVerticesForPath();
};

document.getElementById("connectedBtn").onclick = function() {
    checkConnectivity();
};

document.getElementById("cyclesBtn").onclick = function() {
    returnCycles();
};




function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resize;
resize();