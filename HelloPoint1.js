var VSHADER_SOURCE = 
'attribute vec4 a_pos;\n'+
'void main() {\n' +
'gl_Position = a_pos;\n' +
'gl_PointSize = 10.0;\n' +
'}';
var FSHADER_SOURCE = 
'void main() {\n' +
'gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
'}';
var gl_points = [];
function click(ev, gl, canvas, a_pos){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y-rect.top))/(canvas.height/2);
    gl_points.push([x, y]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = gl_points.length;
    for (var i = 0; i < len; i++){
        gl.vertexAttrib3f(a_pos, gl_points[i][0], gl_points[i][1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

function main(){
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl)
        return;
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        return;
    }
    var a_pos = gl.getAttribLocation(gl.program, 'a_pos');
    if (a_pos<0)
        return;
    canvas.onmousedown = function(ev) { click(ev, gl, canvas, a_pos) };
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}