var socket = io();

// for debugging
socket.on('connect', function() {
    console.log('socket is open');
});
socket.on('disconnect', function() {
    console.log('socket is closed');
});

let brick_sz = 50;
let border_w = 5;
let gridSelect = d3.select('body')
    .append('svg')
        .attr("width", 8*brick_sz+border_w*(4+1)+1)
        .attr("height", 8*brick_sz+border_w*(4+1)+1);

function AddRect(sel,w,h,x,y,f,s=0,o=1.0) {
    // console.log('AddRect ', w, h, x, y, f, s, o);
    return sel.append('rect')
        .attr("width", w)
        .attr('height', h)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', f)
        .attr('stroke', f != 'black' ? 'black' : '#aaa')
        .attr('stroke-width', s)
        .attr('opacity', o);
}

function AddBlock(n,x,y) {
    if (n < 0 || n > 15) { console.log("invalid n: " + n); return; }
    let b1 = n & 0b0001;
    let b2 = n & 0b0010;
    let b3 = n & 0b0100;
    let b4 = n & 0b1000;
    AddRect(gridSelect, brick_sz, brick_sz, (2*x+0)*brick_sz+border_w*(x+1), (2*y+0)*brick_sz+border_w*(y+1), b1?'blue':'orange');
    AddRect(gridSelect, brick_sz, brick_sz, (2*x+0)*brick_sz+border_w*(x+1), (2*y+1)*brick_sz+border_w*(y+1), b2?'blue':'orange');
    AddRect(gridSelect, brick_sz, brick_sz, (2*x+1)*brick_sz+border_w*(x+1), (2*y+0)*brick_sz+border_w*(y+1), b3?'blue':'orange');
    AddRect(gridSelect, brick_sz, brick_sz, (2*x+1)*brick_sz+border_w*(x+1), (2*y+1)*brick_sz+border_w*(y+1), b4?'blue':'orange');
}

function DrawArray(ar) {
    AddRect(gridSelect, 8*brick_sz+border_w*(4+1), 8*brick_sz+border_w*(4+1), 0, 0, 'black')
    for (let i=0;i<ar.length;i++) {
        AddBlock(ar[i],Math.floor(i/4),i%4);
    }
}

socket.on('json', function(data) {
    console.log('received message: ' + data.random_array);
    DrawArray(JSON.parse(data.random_array));
});
socket.emit('random', 15);

