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