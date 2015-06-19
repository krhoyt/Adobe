// Called to strip pixel suffix from CSS values
function pixels( value )
{
	var result = null;
	
	// Get the passed in value as a string
	// Parse off the ending
	result = value.toString();
	result = parseFloat( result.substr( 0, result.length - 2 ) );
	
	// Return the numeric value
	return result;
}

// Called to update the position of the ball
// Applies motion to CSS values
// May be called by orientation or motion
function update( horizontal, vertical )
{

}

// Called when device motion is detected
// Not supported on all devices
// Calls to update the position of the ball
function doDeviceMotion( evt )
{

}

// Called when the device orientation changes
// Not supported on all devices
// Calls to update the position of the ball
function doDeviceOrientation( evt ) 
{

}

// Called when the document has loaded
// Configures initial layout and event handling
function doLoad()
{

}

// Called when the window is resized
// Keeps the hole positioned
function doResize()
{
	var hole = null;
	
	// Position the hole centered vertically
	hole = document.querySelector( '#hole' );
	hole.style.top = Math.round( ( document.body.offsetHeight - hole.offsetHeight ) / 2 );	
}