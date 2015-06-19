// Constants
var FRAME_RATE = 45;
var MOVE_RATE = 3;

// Track loop doing the animation
var interval = null;

// Work on touch and mouse driven interactions
var touch = null;

// Called when an animation frame elapses
// Moves the sun further across the sky if needed
// Otherwise stops and resets the animation
function doSunMove()
{
	var sun = null;
	
	// Reference to the sun
	sun = document.querySelector( '#sun' );
	
	// If there is space to move
	if( sun.offsetLeft < ( window.innerWidth - sun.width ) )
	{
		sun.style.left = ( sun.offsetLeft + MOVE_RATE ) + 'px';		
	} else {
		// At the far edge so stop animation
		clearInterval( interval );
		interval = null;		
		
		// Put the sun back at the start
		sun.style.left = '0px';
	}	
}

// Called when the user interacts with the sun
// Starts the animation
function doSunStart()
{
	// Only animate if not currently animating
	if( interval == null )
	{
		interval = setInterval( doSunMove, FRAME_RATE );
	}
}

// Called when the page has loaded
// Configures event listener on the sun
function doWindowLoad()
{
	var sun = null;
	
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