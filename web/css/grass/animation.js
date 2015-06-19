// Work on touch and mouse driven interactions
var touch = null;

// Called when the animation ends
// Displays an informational message
function doSunEnding()
{
	var sun = null;
	
	sun = document.querySelector( '#sun' );
	
	// Remove animation events
	// Firefox
	sun.style.MozAnimation = '';
	sun.removeEventListener( 'animationstart', doSunStarting );
	sun.addEventListener( 'animationiteration', doSunIteration );	
	sun.addEventListener( 'animationend', doSunEnding );
		
	// WebKit
	sun.style.webkitAnimation = '';	
	sun.removeEventListener( 'webkitAnimationStart', doSunStarting );
	sun.removeEventListener( 'webkitAnimationIteration', doSunIteration );	
	sun.removeEventListener( 'webkitAnimationEnd', doSunEnding );		
	
	console.log( 'Ending' );	
}

// Called when the animation completes an iteration
// Displays an informational message
// Iteration here is across and back
function doSunIteration()
{
	console.log( 'Iteration' );	
}

// Called when the user interacts with the sun
// Animates the sun across the screen
function doSunStart()
{
	var sun = null;
		
	// Reference to the item to animate
	sun = document.querySelector( '#sun' );	
	
	// Set animation rules to reflect screen width
	// Brute force approach is used here
	// You really should iterate through rules
	document.styleSheets[1].cssRules[0].deleteRule( '50%' );
	document.styleSheets[1].cssRules[0].insertRule( '50% {' +
		'left: ' +
		( window.innerWidth - sun.clientWidth ) +
		'px; ' +
		( sun.style.MozAnimation == null ? '-webkit-' : '-moz-' ) +
		'transform: rotate( 360deg );' +
		'}' );
		
	// Set the animation in motion
	sun.style.MozAnimation = 'across 4s ease-in-out 0s 5 alternate';
	sun.style.webkitAnimation = 'across 4s ease-in-out 0s 5 alternate';	
	
	// Listen for events that happen during the animation
	// Firefox
	sun.addEventListener( 'animationstart', doSunStarting );
	sun.addEventListener( 'animationiteration', doSunIteration );	
	sun.addEventListener( 'animationend', doSunEnding );
		
	// WebKit
	sun.addEventListener( 'webkitAnimationStart', doSunStarting );
	sun.addEventListener( 'webkitAnimationIteration', doSunIteration );	
	sun.addEventListener( 'webkitAnimationEnd', doSunEnding );	
}

// Called when the animation starts
// Displays an informational message
function doSunStarting()
{
	console.log( 'Starting' );	
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
	
	// Plant some grass for this sunny day
	plant();
}

// Catch when the page has loaded
window.onload = doWindowLoad;