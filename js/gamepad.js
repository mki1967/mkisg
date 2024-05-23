var gamepad={}
// axes indexes ( https://w3c.github.io/gamepad/#remapping )
const GPA_AxisRightX=2
const GPA_AxisRightY=3
const GPA_AxisLeftX=0
const GPA_AxisLeftY=1

// buttons indexes ( https://w3c.github.io/gamepad/#remapping )
const GPB_AxisLeftTrigger=6
const GPB_AxisRightTrigger=7
const GPB_ButtonDpadUp=12
const GPB_ButtonDpadDown=13
const GPB_ButtonDpadLeft=14
const GPB_ButtonDpadRight=15
const GPB_ButtonA=0
const GPB_ButtonStart=9
const GPB_ButtonHome=16



gamepad.animation = null;
gamepad.lastCallback = null;
// gamepad.lastStop = null;
gamepad.stop = false;
gamepad.stopActionSet = false;
gamepad.waitForNoAction = false;

gamepad.stopAction = function(){
    console.log("stopAction")
    gamepad.stop=false;
    gamepad.stopActionSet=false;
    gamepad.waitForNoAction = true; // force the user to release the gamepad controllers
    gamepad.check()
}

gamepad.setNextAction = function (callback) {
    if( animation.currentCallback === callback ) {
	if( gamepad.stop ) {
	    window.cancelAnimationFrame(animation.requestId); 
	    animation.requestId = 0;
	}
	return // continue the same action
    } else {
	console.log("NEW ACTION")
	if (animation.requestId) {
	    window.cancelAnimationFrame(animation.requestId);
	}
	animation.requestId = 0;
	// normal mode
	animation.start( callback );
    }
}

gamepad.check= function(){
    /// set cleaning of the old (pre-lastStop) animations
    if( gamepad.stop && gamepad.stopActionSet ) {
	return; // do nothing - gamepad is stoped and its unblocking is scheduled
    }
    if( gamepad.stop && (! gamepad.stopActionSet ) ) {
	if (animation.requestId) {
	    window.cancelAnimationFrame(animation.requestId);
	}
        console.log("scheduling stopActionSet");
	gamepad.stopActionSet=true
	animation.start( gamepad.stopAction ) // enqueue the action to ublock the gamepad
	return;
    }

    nextAction=gamepad.whatAction();
    if( nextAction != null ) {
	if( gamepad.waitForNoAction ) {
	    gamepad.setNextAction( animation.noAction )
	} else {
	    
	    gamepad.setNextAction( nextAction )
	}
    }  /* !!!!! else {
	animation.stop() // gamepad disconnected ?!
    } */
}


gamepad.whatAction = function() {
    const gp = navigator.getGamepads();
    // console.log( gp );///
    if (gp[0]) {
	//console.log(gp);
	let nextAction=animation.noAction ; // default
	if( gp[0].axes[GPA_AxisRightX] < -0.5 ) {
	    nextAction= rl;
	} else if ( gp[0].axes[GPA_AxisRightX] > 0.5 ) {
	    nextAction= rr;
	} else if ( gp[0].axes[GPA_AxisRightY] < -0.5 ) {
	    nextAction= rd;
	} else if ( gp[0].axes[GPA_AxisRightY] > 0.5 ) {
	    nextAction= ru;
	} else if ( gp[0].axes[GPA_AxisLeftY] < -0.5 ) {
	    nextAction= mf;
	} else if ( gp[0].axes[GPA_AxisLeftY] > 0.5 ) {
	    nextAction= mb;
	} else if ( gp[0].axes[GPA_AxisLeftX] < -0.5 ) {
	    nextAction= ml;
	} else if ( gp[0].axes[GPA_AxisLeftX] > 0.5 ) {
	    nextAction= mr;
	} else {
	    // remains nextAction === animation.noAction
	    gamepad.waitForNoAction = false
	}
	
	return nextAction;
	
    } else {
	null; // gamepad disconnected ?!
    }
    
}



/* FROM mki3dgame/gamepad.go:
   
   var nextAction ActionIndex = ActionNIL

   switch {
   case gamepadStatePtr.Axes[glfw.AxisRightX] < -0.5:
   nextAction = ActionRL
   case gamepadStatePtr.Axes[glfw.AxisRightX] > 0.5:
   nextAction = ActionRR

   case gamepadStatePtr.Axes[glfw.AxisRightY] < -0.5:
   nextAction = ActionRD
   case gamepadStatePtr.Axes[glfw.AxisRightY] > 0.5:
   nextAction = ActionRU

   case gamepadStatePtr.Axes[glfw.AxisLeftY] < -0.5:
   nextAction = ActionMF
   case gamepadStatePtr.Axes[glfw.AxisLeftY] > 0.5:
   nextAction = ActionMB

   case gamepadStatePtr.Axes[glfw.AxisLeftX] < -0.5:
   nextAction = ActionML
   case gamepadStatePtr.Axes[glfw.AxisLeftX] > 0.5:
   nextAction = ActionMR

   case gamepadStatePtr.Axes[glfw.AxisRightTrigger] > -0.95:
   nextAction = ActionMF
   case gamepadStatePtr.Axes[glfw.AxisLeftTrigger] > -0.95:
   nextAction = ActionMB

   case gamepadStatePtr.Buttons[glfw.ButtonDpadUp] == glfw.Press:
   nextAction = ActionMU
   case gamepadStatePtr.Buttons[glfw.ButtonDpadDown] == glfw.Press:
   nextAction = ActionMD

   case gamepadStatePtr.Buttons[glfw.ButtonDpadLeft] == glfw.Press:
   nextAction = ActionML
   case gamepadStatePtr.Buttons[glfw.ButtonDpadRight] == glfw.Press:
   nextAction = ActionMR

   case gamepadStatePtr.Buttons[glfw.ButtonA] == glfw.Press:
   nextAction = ActionLV

   case gamepadStatePtr.Buttons[glfw.ButtonStart] == glfw.Press:
   fmt.Println("RELOADING RANDOM STAGE ...")
   ZenityInfo("NEXT RANDOM STAGE ...", "1")
   g.NextStage()

   }

   if nextAction != ActionNIL {
   g.Paused = false // new version for single-thread version
   g.LastActivityTime = glfw.GetTime()
   }

   if nextAction == g.LastGamepadAction {
   return // continuation of the same action or noaction
   }

   if nextAction != g.LastGamepadAction {
   g.CancelAction() // the action is changed -- reset speed
   }

   g.LastGamepadAction = nextAction       // record  as the last gamepad action
   g.SetAction(g.ActionArray[nextAction]) // set current action

   }

*/
