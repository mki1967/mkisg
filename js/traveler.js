
// TRAVELER

function rotateXZ(traveler, angle)
{
    traveler.rotXZ=(traveler.rotXZ+angle+360)%360;
}

function rotateYZ(traveler, angle)
{
    traveler.rotYZ += angle;
    
    if(angle>0 && traveler.rotYZ > maxYZAngle) {
	animation.stop();
	traveler.rotYZ = maxYZAngle;
    }

    if(angle<0 && traveler.rotYZ < -maxYZAngle) {
	animation.stop();
	traveler.rotYZ = -maxYZAngle;
    }

}

function move(traveler, vector)
{
    var v=worldRotatedVector( traveler, vector );

    traveler.x= Math.max(  traveler.vMin[0]-XMargin, Math.min( traveler.vMax[0]+XMargin, traveler.x+v[0] ));
    traveler.y= Math.max(  traveler.vMin[1]-YMargin, Math.min( traveler.vMax[1]+YMargin, traveler.y+v[1] ));
    traveler.z= Math.max(  traveler.vMin[2]-ZMargin, Math.min( traveler.vMax[2]+ZMargin, traveler.z+v[2] ));
    checkTokens();
}
