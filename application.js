import * as graph from './graphFunctions.js';

const canvas = document.getElementById('appCanvas');
canvas.style.display= 'block';
const context = canvas.getContext('2d');
const ONEKEY = 49;
const TWOKEY = 50;
const THREEKEY = 51;
let selection = undefined;

function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // draw every edge
    for (let i = 0; i < graph.edges.length; i++) {
        let fromVertex = graph.edges[i].from;
        let toVertex = graph.edges[i].to;
        context.beginPath();
        context.strokeStyle = fromVertex.strokeStyle;
        context.moveTo(fromVertex.x, fromVertex.y);
        context.lineTo(toVertex.x, toVertex.y);
        context.stroke();
    }

    // draw every vertex
    for (let i = 0; i < graph.vertices.length; i++) {
        let v= graph.vertices[i];

        context.beginPath();
        context.fillStyle = v.selected ? v.selectedFill : v.fillStyle;
        context.arc(v.x, v.y, v.radius, 0, Math.PI * 2, true);
        context.strokeStyle = v.strokeStyle;
        context.fill();
        context.stroke();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '16px arial';
        context.fillStyle = 'black'
        context.fillText(v.number, v.x, v.y);
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




/* Key and mouse functions */

function move(e) {
    if (selection && e.buttons) {
        selection.x = e.x;
        selection.y = e.y;
        draw();
    }
}

function down(e) {
    let target = within(e.x, e.y);

    if (selection && selection.selected) {
        selection.selected = false;
    }

    if (target) {
        if (selection && selection !== target) {
            if (!graph.isEdge(selection, target)) {
                graph.addEdge({ from: selection, to: target });
            }
        }
        selection = target;
        selection.selected = true;
        draw();
    }
}

function up(e) {
    if (!selection) {
        let vertex = {
            number: graph.vertices.length + 1,
            x: e.x,
            y: e.y,
            radius: 12.5,
            fillStyle: '#8c92ff',
            strokeStyle: '#000000',
            selectedFill: '#ff2b59',
            selected: false
        };
        graph.addVertex(vertex);
        draw();
    }

    if (selection && !selection.selected) {
        selection = undefined;
    }

    draw();
}

function keys(e) {
    if (e.keyCode === ONEKEY) {
        graph.removeVertex();
    }

    if (e.keyCode === TWOKEY) {
        graph.removeEdge();
    }

    if (e.keyCode === THREEKEY) {
        graph.clear()
    }

    selection = undefined;
    draw();
}

window.onmousemove = move;
window.onmouseup = up;
window.onmousedown = down;
window.onkeypress = keys;




function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resize;
resize();