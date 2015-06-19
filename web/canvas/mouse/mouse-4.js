// Variables used repeatedly throughout
var canvas = null;
var context = null;

// Called to generate a random color
// Applied to drawing
function randomColor()
{
	var red = null;
	var green = null;
	var blue = null;	
	
	// Randomly generated color
	red = Math.round( Math.random() * 255 );
	green = Math.round( Math.random() * 255 );
	blue = Math.round( Math.random() * 255 );	
	
	// Return a CSS formatted color value
	return 'rgb( ' + red + ', ' + green + ', ' + blue + ' )';		
}

// Called when the mouse is down on the canvas
// Generates a random color
// Starts tracing a new line based on mouse position
function doCanvasDown( evt )
{
	var red = null;
	var green = null;
	var blue = null;	
	
	// Randomly generated color
	red = Math.round( Math.random() * 255 );
	green = Math.round( Math.random() * 255 );
	blue = Math.round( Math.random() * 255 );		
	
	// Setup a new stroke
	// Begin the path
	context.strokeStyle = 'rgb( ' + red + ', ' + green + ', ' + blue + ' )';			
	context.moveTo( evt.offsetX, evt.offsetY );
	context.beginPath();
	
	// Listen for the mouse to move
	// Listen for when the mouse is released
	canvas.addEventListener( 'mousemove', doCanvasMove );
	canvas.addEventListener( 'mouseup', doCanvasUp );
}

// Called when the mouse moves while down on the canvas
function doCanvasMove( evt )
{
	// Draw the most recent segment of the line	
	// Based on mouse coordinates relative to canvas
	context.lineTo( evt.offsetX, evt.offsetY );		
	context.stroke();	
}

// Called when the mouse is released from the canvas
function doCanvasUp()
{
	// Remove event listeners
	// Allows drawing only when the mouse is down on the canvas
	canvas.removeEventListener( 'mousemove', doCanvasMove );
	canvas.removeEventLsitener( 'mouseup', doCanvasUp );	
}

// Called when the document has loaded
// Configures layout management
// Configures canvas references
function doLoad()
{
	// Reference to the canvas element
	canvas = document.querySelector( '#paper' );
	
	// Check to see if canvas is supported
	if( canvas.getContext )
	{
		// Get the drawing surface
		// Listen for the mouse to be pressed on the canvas
		context = canvas.getContext( '2d' );
		canvas.addEventListener( 'mousedown', doCanvasDown );
	}
	
	// Layout canvas in center of page
	window.onresize = doResize;
	doResize();			
}

// Called when the document is resized
function doResize()
{
	// Layout the canvas in the center of the document
	canvas.style.left = Math.round( ( document.body.offsetWidth - canvas.offsetWidth ) / 2 ) + 'px';
	canvas.style.top = Math.round( ( document.body.offsetHeight - canvas.offsetHeight ) / 2 ) + 'px';		
}