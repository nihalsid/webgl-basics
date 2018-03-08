var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'attribute vec2 a_tcord;\n'+
'varying vec2 v_tcord;\n'+
'void main() {\n' +
'gl_Position = a_pos;\n' +
'v_tcord = a_tcord;\n' +
'}';
var FSHADER_SOURCE = 
'#ifdef GL_ES\n' +
  'precision mediump float;\n' +
'#endif\n' +
'uniform sampler2D u_sampler;\n' +
'varying vec2 v_tcord;\n' +
'void main() {\n' +
'gl_FragColor = texture2D(u_sampler, v_tcord);\n' +
'}';

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');
    canvas.setAttribute('crossorigin', 'anonymous');
    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // Set the vertex information
    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the vertex information');
      return;
    }
  
    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
  
    // Set texture
    if (!initTextures(gl, n)) {
      console.log('Failed to intialize the texture.');
      return;
    }
}
  
function initVertexBuffers(gl){
    var vertices = new Float32Array(
        [-0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
        ]);
    var n = 4;
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var FSIZE = vertexBuffer.BYTES_PER_ELEMENT;

    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    var a_tcord = gl.getAttribLocation(gl.program, 'a_tcord');

    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.vertexAttribPointer(a_tcord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);

    gl.enableVertexAttribArray(a_pos);
    gl.enableVertexAttribArray(a_tcord);

    return n;
}

function initTextures(gl, n){
    var text = gl.createTexture();
    var u_sampler = gl.getUniformLocation(gl.program, 'u_sampler');
    var image = new Image();
    image.onload = function(){
        loadTexture(gl, n, text, u_sampler, image);
    };
    image.src = './resources/sky.jpg';
    return true;
}

function loadTexture(gl, n, texture, u_sampler, image){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_sampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}