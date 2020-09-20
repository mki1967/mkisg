
// MESSAGE

var showMessage = function( textHTML ){
    var message =document.querySelector('#messageDiv');
    if( message ) {
	message.innerHTML= textHTML;
	message.style.display="block"; // show
    }
}

var hideMessage = function(){
    var message =document.querySelector('#messageDiv');
    if( message ) {
	message.style.display="none"; // hide
    }
}



var helpMessage = `
<div  style="font-size:20px;">
    <h2>HELP SCREEN:</h2>
    <h3>Key bindings:</h3>
    <dl>
    <dt>'H':</dt>
    <dd>Display this help message</dd>
    <dt>Enter,'F' / Backspace, 'B', 'V':</dt>
    <dd>Move forward / backward.</dd>
    <dt>Arrow keys:</dt>
    <dd>Rotate up/down/left/right.</dd>
    <dt>'I'/'J'/'K'/'L':</dt>
    <dd>Move up/down/left/right.</dd>
    <dt>'T'</dt>
    <dd>Toggle mouse-click inertia on/off.</dd>
    <dt>Escape:</dt>
    <dd>Hide the message box</dd>
    </dl>
 </div>  
 `

var messageCanceledByAction=true;

