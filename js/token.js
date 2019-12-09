var tokenpositions=[];

function generateTokenPositions(){
    var i;
    for(i=0; i<MAX_TOKENS; i++){
	tokenPositions[i]=[ 
	    traveler.vMin[0]+Math.random()*(traveler.vMax[0]-traveler.vMin[0]),
	    traveler.vMin[1]+Math.random()*(traveler.vMax[1]-traveler.vMin[1]),
	    traveler.vMin[2]+Math.random()*(traveler.vMax[2]-traveler.vMin[2])
        ];
	tokenPositions[i].collected=false;
    }

    tokenPositions.remaining=MAX_TOKENS;
}

function checkTokens()
{
    var i;
    var vTraveler=[traveler.x,traveler.y,traveler.z];
    collectedAlert = false;
    for(i=0; i<tokenPositions.length; i++)
    {
	if(!tokenPositions[i].collected && maxDistance(vTraveler, tokenPositions[i])<1) {
	    animation.stop();
            tokenPositions[i].collected= true;
            tokenPositions.remaining--;
            collectedAlert= true;
	    showAndHideMessage("<span style='font-size:60px;'>"+tokenPositions.remaining+"</span>",  MESSAGE_DELAY);
	    sbx_renderRandomCube(gl); // always prepare new skybox 
	    // showAndHideMessage("REMAINING TOKENS: "+tokenPositions.remaining,  MESSAGE_DELAY);
	}
    }
    if( collectedAlert ) sbx_renderRandomCube(gl); // always prepare new skybox 
    if(tokenPositions.remaining===0) {
	cancelCallbacks();
	
	startGame();
    }
}



