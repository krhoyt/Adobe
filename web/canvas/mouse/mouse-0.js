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

}

// Called when the mouse moves while down on the canvas
function doCanvasMove( evt )
{

}

// Called when the mouse is released from the canvas
function doCanvasUp()
{
	
}

// Called when the document has loaded
// Configures layout management
// Configures canvas references
function doLoad()
{

}

// Called when the document is resized
function doResize()
{
	// Layout the canvas in the center of the document
	canvas.style.left = Math.round( ( document.body.offsetWidth - canvas.offsetWidth ) / 2 ) + 'px';
	canvas.style.top = Math.round( ( document.body.offsetHeight - canvas.offsetHeight ) / 2 ) + 'px';		
}