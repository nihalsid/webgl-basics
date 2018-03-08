var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'uniform mat4 u_xFormMat;\n'+
'void main() {\n' +
'gl_Position = u_xFormMat * a_pos;\n' +
'}';
var FSHADER_SOURCE = 
'void main() {\n' +
'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
'}';

function initVertexBuffers(gl){
    var vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_pos);
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
    var rad = Math.PI * 90 / 180.0;
    var cosB = Math.cos(rad);
    var sinB = Math.sin(rad);

    var xFormMat = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    var u_xFormMat = gl.getUniformLocation(gl.program, 'u_xFormMat');
    gl.uniformMatrix4fv(u_xFormMat, false, xFormMat);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}