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
	var ball = null;
	var left = null;
	var top = null;
	
	// Reference to the ball element
	ball = document.querySelector( '#ball' );
	
	// Get the top position
	top = pixels( ball.style.top );
	
	// Make some effort to keep it on the screen
	if( ( top + vertical ) <= 0 )
	{
		top = 0;
	} else {
		top = top + vertical;
	}

	// Get the left position
	left = ball.offsetLeft;
	
	// Make some effort to keep it on the screen
	if( ( left + horizontal ) <= 0 )
	{
		left = 0;
	} else {
		left = left + horizontal;
	}	
	
	// Update the ball location
	ball.style.left = left + 'px';	
	ball.style.top = top + 'px';		
}

// Called when device motion is detected
// Not supported on all devices
// Calls to update the position of the ball
function doDeviceMotion( evt )
{
	update( evt.accelerationIncludingGravity.x, evt.accelerationIncludingGravity.y );	
}

// Called when the device orientation changes
// Not supported on all devices
// Calls to update the position of the ball
function doDeviceOrientation( evt ) 
{
	update( evt.gamma, evt.beta );	
}

// Called when the document has loaded
// Configures initial layout and event handling
function doLoad()
{
	var ball = null;
	
	// Center the ball vertically
	ball = document.querySelector( '#ball' );
	ball.style.top = Math.round( ( document.body.offsetHeight - ball.offsetHeight ) / 2 ) + 'px';		
	
	// Listen for orientation events if they are supported
	if( window.DeviceOrientationEvent )
	{
		window.addEventListener( 'deviceorientation', doDeviceOrientation );
	}
	
	// Listen for motion events if they are supported
	if( window.DeviceMotionEvent )
	{
		window.addEventListener( 'devicemotion', doDeviceMotion );
	}	
	
	// Listen for the window to resize
	// Keep the hole positioned in the same place
	window.onresize = doResize();
	doResize();		
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