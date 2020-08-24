/* Frame animation */


animation={}
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

animation.speedReset= function(){
    animation.movSpeed = animation.initialSpeed;
}

animation.rotSpeed= 0.08 // rotation per milisecond





mu=animation.movUp= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,step,0] );
    animation.speedUpdate();
}

md=animation.movDown= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,-step,0] );
    animation.speedUpdate();
}

ml=animation.movLeft= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [-step,0,0] );
    animation.speedUpdate();
}

mr=animation.movRight= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [step,0,0] );
    animation.speedUpdate();
}

mf=animation.movForward= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,0,step] );
    animation.speedUpdate();
}

mb=animation.movBack= function(){
    var step =  animation.movSpeed*animation.deltaTime
    move( traveler, [0,0,-step] );
    animation.speedUpdate();
}

ru=animation.rotUp= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateYZ(traveler, -step );
}
    
rd=animation.rotDown= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateYZ(traveler, step );
}

rl=animation.rotLeft= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateXZ(traveler, step );
    animation.totalRotXZ+=step
    if( Math.abs(animation.totalRotXZ) >= 360 ) animation.stop();
}

rr=animation.rotRight= function(){
    var step =  animation.rotSpeed*animation.deltaTime
    rotateXZ(traveler, -step );
    animation.totalRotXZ+=step
    if( Math.abs(animation.totalRotXZ) >= 360 ) animation.stop();
}


var secretTaps=0; // superfluous taps on the middle sector

lv= function(){
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

/* callback(animation) -- performs callbacks using animation parameters */
animation.start= function( callback ) {
    if(messageCanceledByAction) hideMessage(); 
    
    var animate = function() {
	if( animation.requestId == 0 ) return; // animation was cancelled
	var time=window.performance.now();
	animation.deltaTime=time-animation.lastTime
	animation.lastTime=time;
	callback();
	drawScene();  
	if( animation.requestId == 0 ) return; // animation was cancelled by the callback ?
	animation.requestId = window.requestAnimationFrame(animate); // ask for next animation
    }

    if( animation.requestId != 0 ) animation.stop(); // cancell old action

    
    animation.initRotXZ= traveler.rotXZ;
    animation.totalRotXZ= 0;
    
    animation.startTime = window.performance.now();
    animation.lastTime = animation.startTime;
    drawScene();  
    animation.requestId = window.requestAnimationFrame(animate);
}


animation.stop = function() {
    if (animation.requestId)
	window.cancelAnimationFrame(animation.requestId);
    animation.requestId = 0;
    drawScene();
    animation.speedReset();
}

animation.MouseUpStopAction =  true;
