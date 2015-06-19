// Canvas reference used throughout
// Keep fill color consistent while drawing
// Track if this is a tablet
var canvas = null;	
var context = null;
var fill = null;
var touch = null;

// Called when the mouse is down on the canvas
// Chooses a random color
// Configures event listeners for drawing
function doCanvasDown()
{
	// Random color generation
	fill = {
		red: Math.round( Math.random() * 255 ),
		green: Math.round( Math.random() * 255 ),
		blue: Math.round( Math.random() * 255 )
	};
	
	// Event listeners for drawing
	// Conditional check for tablets
	canvas.addEventListener( touch ? 'touchmove' : 'mousemove', doCanvasMove );
	canvas.addEventListener( touch ? 'touchend' : 'mouseup', doCanvasUp );
}

// Called when the mouse is down and moving on the canvas
// Draws a translucent circle to emulate spray paint
function doCanvasMove( evt )
{
	var clientX = null;
	var clientY = null;
	var gradient = null;
	
	// If the device is a tablet
	if( touch )
	{
		// Do not drag screen around
		evt.preventDefault();
		
		// Get the touch coordinates
		clientX = evt.touches[0].clientX;
		clientY = evt.touches[0].clientY;
	} else {
		// Not a tablet so grab mouse coordinates
		clientX = evt.clientX;
		clientY = evt.clientY;
	}
	
	// Radial gradient fill for the spray paint
	gradient = context.createRadialGradient( 
		clientX, 
		clientY, 
		0, 
		clientX + 20, 
		clientY + 20, 
		40 
	);
	
	// Start with partial opacity
	// End with completely transparent				
	gradient.addColorStop( 
		0, 
		'rgba( ' + fill.red + ', ' + fill.green + ', ' + fill.blue + ', 0.5 )' 
	);
	gradient.addColorStop( 
		1, 
		'rgba( ' + fill.red + ', ' + fill.green + ', ' + fill.blue + ', 0 )' 
	);
	
	// Assign the radial gradient fill
	// Remove the stroke		
	context.fillStyle = gradient;
	context.strokeStyle = 'rgba( 0, 255, 0, 0 )';												
				
	// Draw a circle for the current point
	context.beginPath();
	context.arc( clientX, clientY, 40, 0, Math.PI * 2, true );									
	context.stroke();
	context.fill();	
}

// Called when the mouse is released over the canvas
// Stops drawing
function doCanvasUp()
{
	// Conditionally watch for tablets
	canvas.removeEventListener( touch ? 'touchmove' : 'mousemove', doCanvasMove );
	canvas.removeEventListener( touch ? 'touchend' : 'mouseup', doCanvasUp );	
}

// Called when the document has loaded
// Determines if the device is a tablet
// Setup the canvas
// Configure layout management
function doLoad()
{	
	// Determine if this device is a tablet
	touch = ( 'ontouchstart' in document.documentElement ) ? true : false;
	
	// Get a reference to the canvas element
	canvas = document.querySelector( '#wall' );
	
	// See if this browser supports canvas at all
	if( canvas.getContext )
	{
		// Get the drawing context
		// Listen for the mouse down to start painting
		// Conditionally listen for touch events on a tablet
		context = canvas.getContext( '2d' );
		canvas.addEventListener( touch ? 'touchstart' : 'mousedown', doCanvasDown );	
	}
	
	// Size the canvas to fill the screen
	// Perform initial layout
	window.onresize = doResize;
	doResize();
}

// Called when the window is resized
// Used to fit the canvas to the entire viewable space
function doResize()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}