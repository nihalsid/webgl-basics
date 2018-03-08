var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'attribute vec4 a_col;\n'+
'varying vec4 v_col;\n'+
'uniform mat4 u_viewmat;\n'+
'void main() {\n' +
'gl_Position = u_viewmat * a_pos;\n' +
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
        // Vertex coordinates and color(RGBA)
         0.0,  0.5,  -0.4,  0.4,  1.0,  0.4, // The back green one
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
         0.5, -0.5,  -0.4,  1.0,  0.4,  0.4, 
       
         0.5,  0.4,  -0.2,  1.0,  0.4,  0.4, // The middle yellow one
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
         0.0, -0.6,  -0.2,  1.0,  1.0,  0.4, 
    
         0.0,  0.5,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
         0.5, -0.5,   0.0,  1.0,  0.4,  0.4, 
      ]);
    var n = 9;
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
    var u_viewmat = gl.getUniformLocation(gl.program, 'u_viewmat');
    var viewmat = new Matrix4();
    //viewmat.setLookAt(0.0, 0.0, 0, 0, 0, -1, 0, 1, 0);
    viewmat.setLookAt(0.20, 0.25, 0.25, 0,0,0, 0,1,0);
    gl.uniformMatrix4fv(u_viewmat, false, viewmat.elements);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}