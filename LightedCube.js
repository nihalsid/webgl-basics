var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'attribute vec4 a_col;\n'+
'attribute vec4 a_norm;\n'+
'varying vec4 v_col;\n' +
'uniform mat4 u_mvpmat;\n'+
'uniform vec3 u_lightcol;\n'+
'uniform vec3 u_lightdir;\n'+
'void main() {\n' +
'gl_Position = u_mvpmat * a_pos;\n' +
'vec3 norm = normalize(vec3(a_norm));\n'+
'float ndotl =  max(dot(u_lightdir, norm),0.0);\n'+
'vec3 diffuse = u_lightcol * vec3(a_col) * ndotl;\n'+
'v_col = vec4(diffuse,a_col.a);\n'+
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
    var vertices = new Float32Array([   // Coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);


    var colors = new Float32Array([    // Colors
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0    // v4-v7-v6-v5 back
    ]);


    var normals = new Float32Array([    // Normal
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]
    ); 
    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    var vertexBuffer = gl.createBuffer();
    var colorBuffer = gl.createBuffer();
    var indexBuffer = gl.createBuffer();
    var normalBuffer = gl.createBuffer();
    
    if (!vertexBuffer) {
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_pos);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
    var a_col = gl.getAttribLocation(gl.program, 'a_col');
    gl.vertexAttribPointer(a_col, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_col);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    var a_norm = gl.getAttribLocation(gl.program, 'a_norm');
    gl.vertexAttribPointer(a_norm, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_norm);
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
    var u_lightcol = gl.getUniformLocation(gl.program, 'u_lightcol');
    gl.uniform3f(u_lightcol, 1.0, 1.0, 1.0);
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();     // Normalize
    var u_lightdir = gl.getUniformLocation(gl.program, 'u_lightdir');
    gl.uniform3fv(u_lightdir, lightDirection.elements);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}