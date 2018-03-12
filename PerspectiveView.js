var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'attribute vec4 a_col;\n'+
'varying vec4 v_col;\n'+
'uniform mat4 u_projmat;\n'+
'uniform mat4 u_viewmat;\n'+
'void main() {\n' +
'gl_Position = u_projmat * u_viewmat * a_pos;\n' +
'v_col = a_col;\n'+
'}';
var FSHADER_SOURCE =
'#ifdef GL_ES\n' +
  'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_col;'+ 
'void main() {\n' +
'gl_FragColor = v_col\n;' +
'}';

function initVertexBuffers(gl){
    var vertices = new Float32Array([
        // Three triangles on the right side
        0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
        0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
        1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
    
        0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
        0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
        1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
    
        0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
        0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
        1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
    
        // Three triangles on the left side
       -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
       -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
       -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
    
       -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
       -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
       -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
    
       -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
       -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
       -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
      ]);
    var n = 18; // Three vertices per triangle * 6
     
    var vertexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        return -1;
    }
    var FSIZE = vertices.BYTES_PER_ELEMENT;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 6 * FSIZE, 0);
    gl.enableVertexAttribArray(a_pos);
    var a_col = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_col, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_col);

    return n;
}

function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl)
        return;
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        return;
    }
    n = initVertexBuffers(gl);
    var u_projmat = gl.getUniformLocation(gl.program, 'u_projmat');
    var u_viewmat = gl.getUniformLocation(gl.program, 'u_viewmat');
    var projmat = new Matrix4();
    var viewmat = new Matrix4();
    document.onkeydown = function(ev) {
        keydown(ev, gl, n, u_viewmat, viewmat, u_projmat, projmat);
    }
    gl.clearColor(0, 0, 0, 1);
    draw(gl, n, u_viewmat, viewmat, u_projmat, projmat);
}

var g_eyeX = 0.0, g_eyeY = 0.0, g_eyeZ = 5.0;
function keydown(ev, gl, n, u_viewmat, viewmat, u_projmat, projmat) {
    if (ev.keyCode == 39) {
        g_eyeZ += 0.01;
    } else if (ev.keyCode == 37) {
        g_eyeZ -= 0.01;
    } else {
        return;
    }
    draw(gl, n, u_viewmat, viewmat, u_projmat, projmat);
}

function draw(gl, n, u_viewmat, viewmat, u_projmat, projmat){
    viewmat.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, -100, 0, 1, 0);
    projmat.setPerspective(30, 1.0, 1, 100);
    gl.uniformMatrix4fv(u_viewmat, false, viewmat.elements);
    gl.uniformMatrix4fv(u_projmat, false, projmat.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}