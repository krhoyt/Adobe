// Constants
var FRAME_RATE = 45;
var MOVE_RATE = 3;

// When the animation started
var start = null;

// Work on touch and mouse driven interactions
var touch = null;

// Called when the browser is setting up to repaint
// Moves the sun further across the sky if needed
// Otherwise no longer requests a repaint notification
function doSunMove( timestamp )
{
	var distance = null;
	var duration = null;
	var progress = null;
	var steps = null;
	var sun = null;
	
	// Reference to the sun
	sun = document.querySelector( '#sun' );		
	
	// Time since last repaint
	progress = timestamp - start;	
	
	// Total distance across the screen
	distance = window.innerWidth - sun.width;
	
	// How many steps to get across the screen
	steps = distance / MOVE_RATE
	
	// How long the animation should take
	duration = steps * FRAME_RATE;
	
	// Move the sun
	sun.style.left = Math.round( ( progress / duration ) * distance ) + 'px';
	
	// Move the sun again if needed
	if( sun.offsetLeft < distance ) 
	{
		requestAnimationFrame( doSunMove );	
	} else {
		// Do not request a repaint
		// Clear timing variable
		start = null;	
		
		// Put the sun back at the start
		sun.style.left = '0px';
	}
}

// Called when the user interacts with the sun
// Starts the animation
function doSunStart()
{
	// Only animate if not currently animating
	if( start == null )
	{
		// Track when the animation began
		// Allows us to calculate where it should be
		start = Date.now();
		requestAnimationFrame( doSunMove );
	}
}

// Called when the page has loaded
// Configures event listener on the sun
function doWindowLoad()
{
	var sun = null;
	
	// Map the browser specific method name to the standard method name	
	window.requestAnimationFrame = 
		window.requestAnimationFrame || 
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame;
	
	// Figure out if this is a touch enabled screen
	touch = ( 'ontouchstart' in document.documentElement ) ? true : false;	
	
	// Click on the sun to trigger animation
	// Alternatively touch the sun to trigger animation
	sun = document.querySelector( '#sun' );	
	sun.addEventListener( touch ? 'touchstart' : 'click', doSunStart );
	
	// Plant some grass for this sunny day
	plant();
}

// Catch the page load event
window.onload = doWindowLoad;