/*
  skybox creator by mki1967@gmail.com

  use three selected functions from sbx_fun for RGB components
*/

/* sbx_ - prefix for objects of this library */

/* general procedures */

var sbx_makeShaderProgramTool= function(gl, vertexShaderSource, fragmentShaderSource){
    /* Parameters:
       gl - WebGL context
    */

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(vertexShader));
	console.log(vertexShaderSource);
	return null;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
	console.log(gl.getShaderInfoLog(fragmentShader));
	console.log(fragmentShaderSource);
	return null;
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	console.log("Could not initialise shaders");
	return null;
    }
    
    // SUCCESS
    return shaderProgram;
};



const sbx_CUBE_SIZE= 512;

var sbx_srcCubeSize= "const int cubeSize= " + sbx_CUBE_SIZE +";\n";
var sbx_srcPI= "const float PI = " + Math.PI +";\n";
var sbx_srcFunRPrefix= "float fR(float x,float y,float z){ return ";
var sbx_srcFunGPrefix= "float fG(float x,float y,float z){ return ";
var sbx_srcFunBPrefix= "float fB(float x,float y,float z){ return ";
var sbr_srcFunSuffix= "; }\n";

var sbx_srcFunStrings= [
    " x",
    " y",
    " z",
    " sin( x * PI * 2.0 )",
    " sin( z * PI * 2.0 )",
    " sin( y * PI * 2.0 )",
    " sin( (x+y) * PI * 2.0 )",
    " sin( (y+z) * PI * 2.0 )",
    " sin( (z+x) * PI * 2.0 )",
    " cos( x * PI * 2.0 )",
    " cos( z * PI * 2.0 )",
    " cos( y * PI * 2.0 )",
    " sin( x * PI * 2.0 )*cos( y * PI * 2.0 )",
    " sin( x * PI * 2.0 )*cos( z * PI * 2.0 )",
    " sin( x * PI * 4.0 )",
    " sin( z * PI * 4.0 )",
    " sin( y * PI * 4.0 )",
    " cos( x * PI * 4.0 )",
    " cos( z * PI * 4.0 )",
    " cos( y * PI * 4.0 )",
    " sin( x * PI * 4.0 )*cos( y * PI * 4.0 )",
    " sin( x * PI * 4.0 )*cos( z * PI * 4.0 )"
];

var sbx_renderTextureVS= function() {
    return ""+ 
	"attribute vec2 vIn;\n"+
	// "uniform float v;\n"+
	// "const int cubeSize= " + sbx_CUBE_SIZE +";\n"+
	"const float depth=1.0;\n"+
	"uniform mat3 xyz;\n"+
	"varying vec4 color;\n"+
	"varying vec3 vxyz;\n"+
	"void main()\n"+
	"{\n"+
	// "  float h=h-float(cubeSize)/2.0;\n"+
	// "  float v=v-float(cubeSize)/2.0;\n"+
	// "  float d=depth*float(cubeSize)-float(cubeSize)/2.0;\n"+
	"  vec3 xyd= vec3(vIn, depth);\n"+
	"  vxyz=xyz*xyd;\n"+
	"  gl_Position = vec4( vIn.x, vIn.y, 0.0, 1.0 );\n"+ 
	// "  gl_PointSize=1.0;\n"+ /// test it
	"}\n";
}

var sbx_renderTextureFS= function( r, g, b) { // r,g,b are the color functions: (x,y,z) -> color component
    return ""+
	"precision mediump float;\n"+
	"const float PI = " + Math.PI +";\n"+
	r+
	g+
	b+
	"varying vec3 vxyz;\n"+
	"varying vec4 color;\n"+
	"void main()\n"+
	"{\n"+
	"  vec3 v=normalize( vxyz);\n"+ 
	"  float x= v.x;\n"+
	"  float y= v.y;\n"+
	"  float z= v.z;\n"+
	"  gl_FragColor= 0.5*vec4( fR(x,y,z), fG(x,y,z), fB(x,y,z), 0.5 )+vec4(0.5,0.5,0.5,0.5);\n"+
	"}\n";
}

/* to be created by sbx_makeRenderTextureShaderProgram */
// var sbx_renderTextureVS=null;
var sbx_renderTextureShaderProgram=null;
var  sbx_hBufferId=null; // array: [0,1, ..., sbx_CUBE_SIZE-1]
var sbx_vInLocation;
var sbx_xyzLocation;

var sbx_makeRenderTextureShaderProgram= function (gl){
    var fun=sbx_srcFunStrings;
    var r=Math.floor( Math.random()* fun.length );
    var g=Math.floor( Math.random()* fun.length );
    var b=Math.floor( Math.random()* fun.length );

    var sbx_srcFunR = sbx_srcFunRPrefix +sbx_srcFunStrings[r]+sbr_srcFunSuffix;
    // var sbx_srcFunR = sbx_srcFunRPrefix + "0.0"+sbr_srcFunSuffix;
    var sbx_srcFunG = sbx_srcFunGPrefix + sbx_srcFunStrings[g]+sbr_srcFunSuffix;
    var sbx_srcFunB = sbx_srcFunBPrefix + sbx_srcFunStrings[b]+sbr_srcFunSuffix;
    /*
      sbx_renderTextureVS= 
      sbx_srcCubeSize + 
      sbx_srcPI +
      sbx_srcFunR +
      sbx_srcFunG +
      sbx_srcFunB +
      sbx_renderTextureVS2;
    */
    // console.log(sbx_renderTextureVS); // tests

    if( sbx_renderTextureShaderProgram ) gl.deleteProgram( sbx_renderTextureShaderProgram );

    sbx_renderTextureShaderProgram=  sbx_makeShaderProgramTool(gl, sbx_renderTextureVS() , sbx_renderTextureFS( sbx_srcFunR, sbx_srcFunG, sbx_srcFunB  ) )
    /* set vertex attributes locations */
    sbx_vInLocation=gl.getAttribLocation(sbx_renderTextureShaderProgram, "vIn");

    /* set uniform variables locations */
    sbx_xyzLocation=gl.getUniformLocation(sbx_renderTextureShaderProgram, "xyz");

    /* load buffer data */
    if( sbx_hBufferId=== null) {
	sbx_hBufferId= gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sbx_hBufferId );

	var hIn=[-1,-1,
		 -1, 1,
		 1, 1,
		 1,-1
		];
	// for(var i=0; i< sbx_CUBE_SIZE+4; i++) hIn.push(i-2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( hIn ) , gl.STATIC_DRAW );
    }

    let err=gl.getError();
    if( err != gl.NO_ERROR ) sbx_Disable(err);

};


function sbx_Disable(err){
    console.log("Disabling skybox to to GL ERROR: "+err)
    sbx_makeShaderProgram= sbx_renderRandomCube= sbx_makeRenderTextureShaderProgram= sbx_makeShaderProgramTool= sbx_drawSkybox= function(){}
}


/* texture parameters */
var sbx_textureId=null;
var sbx_textureUnit=0; // default
// var sbx_textureSize=1024; 
var sbx_frameBufferId=null;


/* arguments permutations */
var sbx_xyzXPlus    = [ 0, 0,-1,
			0, 1, 0,
			1, 0, 0];  //[z,y,-x];
var sbx_xyzXMinus   = [ 0, 0, 1,
			0, 1, 0,
			-1, 0, 0];  //[-z,y,x];

var sbx_xyzYPlus    =   [ 1, 0, 0, 
			  0, 0, 1,
			  0,-1, 0]; //[x,-z,y];

var sbx_xyzYMinus  = [ 1, 0, 0,
		       0, 0,-1,
		       0, 1, 0]; //[x,z,-y];

var sbx_xyzZPlus  = [1, 0, 0,
		     0, 1, 0,
		     0, 0, 1];  // [x,y,z];
var sbx_xyzZMinus = [-1, 0, 0,
                     0, 1, 0,
		     0, 0,-1]; // [-x,y,-z];



var sbx_xyzArray=[ 
    sbx_xyzXPlus,
    sbx_xyzXMinus,
    sbx_xyzYPlus,
    sbx_xyzYMinus,
    sbx_xyzZPlus,
    sbx_xyzZMinus
];




/* rendering random skybox in a frame */
var sbx_renderRandomCube=function(gl){
    var i,j;
    var defaultFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    var hth= gl.viewportHeight;
    var wth=  gl.viewportWidth;

    if(sbx_textureId===null) {
	/* create texture object and allocate image memories */
	sbx_textureId=gl.createTexture();
	gl.activeTexture(gl.TEXTURE0+sbx_textureUnit);
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);
	for(i=0; i<6; i++)
	    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X+i , 0, gl.RGBA, sbx_CUBE_SIZE, sbx_CUBE_SIZE, 0 /* border */,
			  gl.RGBA, gl.UNSIGNED_BYTE, null);   
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    
    if(sbx_frameBufferId===null) {
	/* create framebuffer object */
	sbx_frameBufferId=gl.createFramebuffer();
    }
    if(sbx_renderTextureShaderProgram != null) 
	gl.deleteProgram(sbx_renderTextureShaderProgram);
    sbx_makeRenderTextureShaderProgram(gl);
    gl.useProgram(sbx_renderTextureShaderProgram);

    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);

    gl.bindFramebuffer(gl.FRAMEBUFFER, sbx_frameBufferId);
    gl.viewport(0,0,sbx_CUBE_SIZE,sbx_CUBE_SIZE);


    gl.enableVertexAttribArray(sbx_vInLocation);
    for(i=0; i<6; i++){
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X+i,sbx_textureId, 0);
	// console.log(gl.checkFramebufferStatus(gl.FRAMEBUFFER)); // test
	// console.log(gl); // test

	gl.uniformMatrix3fv(sbx_xyzLocation, gl.FALSE,  sbx_xyzArray[i] );
	gl.bindBuffer(gl.ARRAY_BUFFER, sbx_hBufferId);
	gl.vertexAttribPointer( sbx_vInLocation, 2, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
    gl.disableVertexAttribArray(sbx_vInLocation);
    
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.bindFramebuffer(gl.FRAMEBUFFER, defaultFBO); // return to default screen FBO
    gl.viewportWidth = wth;
    gl.viewportHeight = hth;
    gl.viewport(0,0,wth,hth);

}


///// older ... ///

var sbx_loadCubeFaceFromCanvas= function(gl, canvas, cubeFace){
    /* use after  sbx_makeShaderProgram(gl) */
    /* Parameters:
       gl - WebGL context
       canvas - container of the image
       cubeFace - one of: gl.TEXTURE_CUBE_MAP_POSITIVE_X, ...
    */
    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);
    gl.texImage2D( cubeFace, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
};


/* shaders - see: http://learnopengl.com/#!Advanced-OpenGL/Cubemaps */

var sbx_vertexShaderSource=""+
    "attribute vec3 position;\n"+
    "varying vec3 TexCoords;\n"+
    "uniform mat4 projection;\n"+
    "uniform mat4 view;\n"+
    "void main()\n"+
    "{\n"+
    "    vec4 pos = projection * view * vec4(position, 1.0);\n"+
    "    gl_Position = pos.xyww;\n"+
    //    "    gl_Position = vec4(pos.xy, 1.0,1.0);\n"+
    "    TexCoords = position;\n"+
    "}\n";

var sbx_fragmentShaderSource=""+
    "precision mediump float;\n"+
    "varying vec3 TexCoords;\n"+
    "uniform samplerCube skybox;\n"+
    "void main()\n"+
    "{\n"+
    "    gl_FragColor = textureCube(skybox, TexCoords);\n"+
    //    "    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n"+
    "}\n";


/* shaders */
var sbx_vertexShader=null;
var sbx_fragmentShader=null;
/* shader program */
var sbx_shaderProgram=null;

/* vertex attributes locations */
var sbx_position=null;

/* uniform variables locations */
var sbx_projection=null;
var sbx_view=null;
var sbx_skybox=null;



/* input vertices of cube triangles */
var sbx_Float32Array= new Float32Array( [
    -1,  1, -1,
    -1, -1, -1,
    +1, -1, -1,
    +1, -1, -1,
    +1,  1, -1,
    -1,  1, -1,
    -1, -1,  1,
    -1, -1, -1,
    -1,  1, -1,
    -1,  1, -1,
    -1,  1,  1,
    -1, -1,  1,
    +1, -1, -1,
    +1, -1,  1,
    +1,  1,  1,
    +1,  1,  1,
    +1,  1, -1,
    +1, -1, -1,
    -1, -1,  1,
    -1,  1,  1,
    +1,  1,  1,
    +1,  1,  1,
    +1, -1,  1,
    -1, -1,  1,
    -1,  1, -1,
    +1,  1, -1,
    +1,  1,  1,
    +1,  1,  1,
    -1,  1,  1,
    -1,  1, -1,
    -1, -1, -1,
    -1, -1,  1,
    +1, -1, -1,
    +1, -1, -1,
    -1, -1,  1,
    +1, -1,  1
]);

var sbx_arrayBuffer=null;


function sbx_makeShaderProgram(gl){
    /* Parameters:
       gl - WebGL context
    */


    sbx_shaderProgram= sbx_makeShaderProgramTool(gl,  sbx_vertexShaderSource,  sbx_fragmentShaderSource);
    gl.useProgram(sbx_shaderProgram);

    /* set vertex attributes locations */
    sbx_position=gl.getAttribLocation(sbx_shaderProgram, "position");

    /* set uniform variables locations */
    sbx_projection=gl.getUniformLocation(sbx_shaderProgram, "projection");
    sbx_view=gl.getUniformLocation(sbx_shaderProgram, "view");
    sbx_skybox=gl.getUniformLocation(sbx_shaderProgram, "skybox");

    /* load buffer data */
    sbx_arrayBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sbx_arrayBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, sbx_Float32Array , gl.STATIC_DRAW );

    // SUCCESS
    return sbx_shaderProgram;
};


var sbx_drawSkybox= function ( gl, view, projection ) {
    /* use after drawing the scene */
    /* Parameters:
       gl - WebGL context
       view, projection - gl matrices 4x4 (column major)
       textureUnit - integer from [0 ... gl.MAX_TEXTURE_IMAGE_UNITS]
    */
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(sbx_shaderProgram);

    gl.uniformMatrix4fv(sbx_view, false, view);
    gl.uniformMatrix4fv(sbx_projection, false, projection);
    
    gl.enableVertexAttribArray(sbx_position);
    gl.bindBuffer(gl.ARRAY_BUFFER, sbx_arrayBuffer);
    gl.vertexAttribPointer(sbx_position, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0+sbx_textureUnit );
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);
    gl.uniform1i(sbx_skybox, sbx_textureUnit );
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, sbx_textureId);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.disableVertexAttribArray(sbx_position);
    gl.depthFunc(gl.LESS);
}


