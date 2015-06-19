// Track if the animation is playing or not
var playing = false;

// Work on touch and mouse driven interactions
var touch = null;

// Called when the animation is complete
// Changes reference to denote animation is not playing
// Resets animation for another run
function doSunComplete()
{
	var sun = null;
	
	// Clear playing reference
	playing = false;	
	
	// Reset the position of the sun
	sun = document.querySelector( '#sun' );
	sun.style.left = '0px';
}

// Called when the user interacts with the sun
// Animates the sun across the screen
// Uses the GreenSock tweening library
function doSunMove()
{
	var sun = null;
	
	// Do not run animation if already playing
	if( !playing )
	{
		// Reference to the sun
		sun = document.querySelector( '#sun' );
		
		// Note that the animation is playing
		playing = true;
		
		// Animate the sun across the screen
		// Two seconds
		// CSS left property
		// Call custom function when complete
		TweenLite.to( 
			sun,
			2,
			{
				css: {
					left: ( window.innerWidth - sun.clientWidth ) + 'px'	
				},
				ease: Cubic.easeInOut,
				onComplete: doSunComplete
			}
		);		
	}	
}

// Called when the page has loaded
// Configures required event handlers
function doWindowLoad()
{
	var sun = null;
	
	// Figure out if this is a touch enabled screen
	touch = ( 'ontouchstart' in document.documentElement ) ? true : false;	
	
	// Click on the sun to trigger animation
	// Alternatively touch the sun to trigger animation
	sun = document.querySelector( '#sun' );
	sun.addEventListener( touch ? 'touchstart' : 'click', doSunMove );	
	
	// Plant some grass for this sunny day
	plant();
}

// Capture when the page has loaded
window.onload = doWindowLoad;