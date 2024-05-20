var gamepad={}
// axes indexes ( https://w3c.github.io/gamepad/#remapping )
const GPA_AxisRightX=2
const GPA_AxisRightY=2
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
