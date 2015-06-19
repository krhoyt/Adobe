// Work on touch and mouse driven interactions
var touch = null;

// Called when the animation has ended
// Here it only cleans up a little
// Alternatively might take next actions
function doSunEnd()
{
	var sun = null;
	
	// Remove event listener
	// Reset the animation
	sun = document.querySelector( '#sun' );
	sun.removeEventListener( 'oTransitionEnd', doSunEnd );	
	sun.removeEventListener( 'transitionEnd', doSunEnd );	
	sun.removeEventListener( 'webkitTransitionEnd', doSunEnd );
	
	// Visual notification
	// What happens if we reset the animation?
	alert( 'Next animation...' );
}

// Called when the user interacts with the sun
// Animates the sun across the screen
function doSunStart()
{
	var sun = null;
	
	sun = document.querySelector( '#sun' );
	
	// Change the desired CSS styles
	// Everything else is taken care of for you
	// This includes being CPU friendly
	sun.style.left = ( window.innerWidth - sun.clientWidth ) + 'px';	
	sun.style.MozTransform = 'rotate( 360deg )';
	sun.style.oTransform = 'rotate( 360deg )';	
	sun.style.webkitTransform = 'rotate( 360deg )';
	
	// Alternatively listen for the end of the animation
	// Might use this to string events together
	sun.addEventListener( 'oTransitionEnd', doSunEnd );	
	sun.addEventListener( 'transitionend', doSunEnd );	
	sun.addEventListener( 'webkitTransitionEnd', doSunEnd );
}

// Called when the page has loaded
// Configures event listeners
function doWindowLoad()
{
	var sun = null;
	
	// Figure out if this is a touch enabled screen
	touch = ( 'ontouchstart' in document.documentElement ) ? true : false;		
	
	// Click on the sun to trigger animation
	// Alternatively touch the sun to trigger animation
	sun = document.querySelector( '#sun' );
	sun.addEventListener( touch ? 'touchstart' : 'click', doSunStart );	
	
	// Plant some grass on this sunny day
	plant();
}

// Catch when the page has loaded
window.onload = doWindowLoad;