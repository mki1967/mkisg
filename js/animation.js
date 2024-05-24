
// ANIMATION

var animation={}
animation.requestId=0
animation.startTime=0 // global starting time
animation.lastTime=0  // time of last animation
animation.deltaTime=0 // delta between the last and this animation

animation.initialSpeed= 0.001 // initial move speed
animation.maxSpeed= 0.060 // maximal move per milisecond

animation.acceleration= 0.000015 // move acceleration per milisecond

animation.movSpeed= animation.initialSpeed;  // move per milisecond

animation.speedUpdate= function(){ // acceleration
    animation.movSpeed = Math.min( animation.maxSpeed,  animation.movSpeed + animation.deltaTime * animation.acceleration );
}


animation.rotSpeed= 0.08 // rotation per milisecond





var mu=animation.movUp= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,step,0] );
    animation.speedUpdate();
}

var md=animation.movDown= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,-step,0] );
    animation.speedUpdate();
}

var ml=animation.movLeft= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [-step,0,0] );
    animation.speedUpdate();
}

var mr=animation.movRight= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [step,0,0] );
    animation.speedUpdate();
}

var mf=animation.movForward= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,0,step] );
    animation.speedUpdate();
}

var mb=animation.movBack= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,0,-step] );
    animation.speedUpdate();
}

var ru=animation.rotUp= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateYZ(traveler, -step );
}

var rd=animation.rotDown= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateYZ(traveler, step );
}

var rl=animation.rotLeft= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateXZ(traveler, step );
    animation.totalRotXZ+=step
    if( Math.abs(animation.totalRotXZ) >= 360 ) animation.stop();
}

var rr=animation.rotRight= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateXZ(traveler, -step );
    animation.totalRotXZ+=step
    if( Math.abs(animation.totalRotXZ) >= 360 ) animation.stop();
}


var secretTaps=0; // superfluous taps on the middle sector

var lv= function(){
    if( traveler.rotYZ == 0) {
	old=traveler.rotXZ;
	traveler.rotXZ= nearestRightAngle(traveler.rotXZ);
	if( traveler.rotXZ == old ) {
	    secretTaps++;
	} else {
	    secretTaps=0;
	}
    } else {
	traveler.rotYZ=0;
	secretTaps=0;
    }
    animation.stop();
    if( secretTaps == 4 ) {
	secretTaps=0;
	startGame();
    }
}

animation.initRotXZ=0;   // initial XZ rotation
animation.totalRotXZ= 0; // total XZ rotation


// animation sectors table
animation.sectors= [
    [mf, mf, mu, mu, mf, mf],
    [mf, mf, ru, ru, mf, mf],
    [ml, rl, lv, lv, rr, mr],
    [ml, rl, lv, lv, rr, mr],
    [mb, mb, rd, rd, mb, mb],
    [mb, mb, md, md, mb, mb]
]




animation.keyAction=false; // indicates that current animation is caused by key press
animation.KeyUpStopAction = false; // keyUp event stops action


animation.currentCallback=null;


/* reset amimation functions */
animation.speedReset= function(){
    animation.movSpeed = animation.initialSpeed;
}

animation.rotReset = function(){
    animation.initRotXZ= traveler.rotXZ;
    animation.totalRotXZ= 0;
}

animation.reset = function(){
    // console.log("RESET")
    animation.speedReset()
    animation.rotReset()
    animation.startTime = window.performance.now();
    animation.lastTime = animation.startTime;    
}

/* callback(animation) -- performs callbacks using animation parameters */
animation.start= function( callback ) {

    if(messageCanceledByAction) hideMessage(); 

    let myLaststop=animation.lastStop;
    
    var animate = function() {
	if( myLaststop != animation.lastStop  ) {
	    console.log( myLaststop, animation.lastStop ) /// too old
	    return; // obsolete request ?!
	}
	
	if( animation.requestId == 0 ) return; // animation was cancelled
	var time=window.performance.now();
	animation.deltaTime=time-animation.lastTime
	animation.lastTime=time;
	callback();
	drawScene();  
	if( animation.requestId == 0 ) return; // animation was cancelled by the callback ?
	if( !(callback === gamepad.stopAction) ) {
	    animation.requestId = window.requestAnimationFrame(animate); // ask for next animation
	}
    }

    if( animation.requestId != 0 ) animation.stop(); // cancell old action

    drawScene();
    animation.currentCallback=callback;
    animation.reset(); //
    animation.requestId = window.requestAnimationFrame(animate);
}


animation.lastStop = 0;

animation.stop = function() {
    animation.lastStop++;
    console.log("lastStop = ", animation.lastStop)
    if (animation.requestId)
	window.cancelAnimationFrame(animation.requestId);
    animation.requestId = 0;
    drawScene();
    animation.reset();
    animation.currentCallback=null; ///
    // check for the gamepad
    const gp = navigator.getGamepads();
    if (gp[0]) {
	gamepad.waitForNoAction = true;
	animation.start( gamepad.loop )
    }

}

animation.MouseUpStopAction =  true;
