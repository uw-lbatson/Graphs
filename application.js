const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


let vertices = [];
let edges = [];
let selection = undefined;


function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // draw every edge
    for (let i = 0; i < edges.length; i++) {
        let fromVertex = edges[i].from;
        let toVertex = edges[i].to;
        context.beginPath();
        context.strokeStyle = fromVertex.strokeStyle;
        context.moveTo(fromVertex.x, fromVertex.y);
        context.lineTo(toVertex.x, toVertex.y);
        context.stroke();
    }

    // draw every vertex
    for (let i = 0; i < vertices.length; i++) {
        let vertex = vertices[i];

        context.beginPath();
        context.fillStyle = vertex.selected ? vertex.selectedFill : vertex.fillStyle;
        context.arc(vertex.x, vertex.y, vertex.radius, 0, Math.PI * 2, true);
        context.strokeStyle = vertex.strokeStyle;
        context.fill();
        context.stroke();
    }

}

/**
 * finds first vertex around (x, y)
 */
function within(x, y) {
    return vertices.find(v => {
        return x > (v.x - v.radius) &&
            y > (v.y - v.radius) &&
            x < (v.x + v.radius) &&
            y < (v.y + v.radius);
    });
}




/* Mouse functions */

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
            edges.push({ from: selection, to: target });
        }
        selection = target;
        selection.selected = true;
        draw();
    }
}

function up(e) {
    if (!selection) {
        let vertex = {
            number: vertices.length + 1,
            x: e.x,
            y: e.y,
            radius: 10,
            fillStyle: '#8c92ff',
            strokeStyle: '#000000',
            selectedFill: '#ff2b59',
            selected: false
        };
        vertices.push(vertex);
        draw();
    }

    if (selection && !selection.selected) {
        selection = undefined;
    }

    draw();
}

window.onmousemove = move;
window.onmouseup = up;
window.onmousedown = down;




function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resize;
resize();