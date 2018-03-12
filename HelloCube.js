var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'attribute vec4 a_col;\n'+
'varying vec4 v_col;\n' +
'uniform mat4 u_mvpmat;\n'+
'void main() {\n' +
'gl_Position = u_mvpmat * a_pos;\n' +
'v_col = a_col;\n'+
'}';
var FSHADER_SOURCE = 
'#ifdef GL_ES\n' +
  'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_col;'+ 
'void main() {\n' +
'gl_FragColor = v_col;\n' +
'}';

function initVertexBuffers(gl){
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
    var vertices = new Float32Array([
    // Vertex coordinates and color
     1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
    -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
    -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
     1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
     1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
     1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
    -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
    -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ]);
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,
        0, 5, 6, 0, 6, 1,
        1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2,
        4, 7, 6, 4, 6, 5
    ]);
    var vertexBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var fsize = vertices.BYTES_PER_ELEMENT;

    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, fsize * 6, 0);
    gl.enableVertexAttribArray(a_pos);
    var a_col = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_col, 3, gl.FLOAT, false, fsize * 6, fsize*3);
    gl.enableVertexAttribArray(a_col);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
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
    var mvpmat = new Matrix4();
    mvpmat.setPerspective(30, 1, 1, 100);
    mvpmat.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0); 
    var u_mvpmat = gl.getUniformLocation(gl.program, 'u_mvpmat');
    gl.uniformMatrix4fv(u_mvpmat, false, mvpmat.elements);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}