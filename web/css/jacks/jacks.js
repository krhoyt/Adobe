// Constants used for measurement
var JACK_HEIGHT = 100;
var JACK_WIDTH = 150;
var THE_FLOOR = 10;

// Keep track of game statistics
var score = null;
var tries = null;

// Called to start a new game
// Resets game statistics
// Randomly positions jacks
function toss()
{
	var jacks = null;
	var left = null;
	var top = null;
	
	// Reset game statistics
	score = 0;
	tries = 0;
	
	// Get all of the jacks on the page
	jacks = document.querySelectorAll( '.jack' );

	// Randomly position the jacks
	for( var j = 0; j < jacks.length; j++ )
	{
		// Generate random position
		left = Math.round( Math.random() * ( document.body.clientWidth - JACK_WIDTH ) );
		top = Math.round( Math.random() * ( document.body.clientHeight - JACK_HEIGHT ) );
		
		// Layout jack element
		// Make jack element visible
		jacks[j].style.left = left + 'px';
		jacks[j].style.top = top + 'px';	
		jacks[j].style.visibility = 'visible';		
	}	
}

// Called when the ball is clicked
// Plays bouncing animation
function doBallClick()
{
	var ball = null;
	var jacks = null;
	var shadow = null;

	// If all the jacks have been gathered
	if( score == 5 )
	{
		// Reset the game
		// No need to actually bounce this time
		toss();
		return;	
	}
	
	// Get all the jacks on the page
	jacks = document.querySelectorAll( '.jack' );
	
	// Configure event listeners during bounce animation
	for( var j = 0; j < jacks.length; j++ )
	{
		jacks[j].addEventListener( 'click', doJackClick );
	}

	// Get a reference to the ball and the ball shadow
	ball = document.querySelector( '#ball' );
	shadow = document.querySelector( '#shadow' );
	
	// Listen for the animation to be complete
	// Animate the ball and ball shadow using CSS
	ball.addEventListener( 'webkitAnimationEnd', doBounceEnd );
	ball.style.setProperty( '-webkit-animation', 'bouncing 2s' );
	shadow.style.setProperty( '-webkit-animation', 'shadowing 2s' );
}

// Called when the bounce animation has finished
// Checks score
// Cleans up elements affects by the bounce
function doBounceEnd()
{
	var ball = null;
	var jacks = null;
	var shadow = null;
	
	// Increment the number of tries
	tries = tries + 1;
	
	// Get all the jacks on the page
	jacks = document.querySelectorAll( '.jack' );
	
	// Remove the click event listener
	// Cannot click on jack unless ball is bouncing
	for( var j = 0; j < jacks.length; j++ )
	{
		jacks[j].removeEventListener( 'click', doJackClick );	
	}
	
	// Get a reference to the ball and ball shadow
	ball = document.querySelector( '#ball' );
	shadow = document.querySelector( '#shadow' );
	
	// Remove bounce animation CSS
	ball.style.removeProperty( '-webkit-animation' );
	shadow.style.removeProperty( '-webkit-animation' );
	
	// Remove event listener for end of animation
	ball.removeEventListener( 'webkitAnimationEnd', doBounceEnd );
	
	// Watch for a winning score
	// Alert the user in that case
	if( score == 5 )
	{
		alert( 'You won in ' + tries + ' tries!' );	
	}
}

// Called when a jack is clicked and the ball is bouncing
function doJackClick()
{
	// Remove selected jack
	// Increment score
	this.style.visibility = 'hidden';
	score = score + 1;
}

// Called when the document has finished loading
// Configures layout management
// Configures ball event listeners to start game play
function doLoad()
{
	var ball = null;
	
	// Listen for the window to resize
	// Keep ball centered in window
	// Initial layout by direct invocation
	window.onresize = doResize;
	doResize();

	// Listen for the ball to be clicked
	// Make ball visible after all assets are loaded
	ball = document.querySelector( '#ball' );
	ball.addEventListener( 'click', doBallClick );
	ball.style.visibility = 'visible';

	// Start the game play
	toss();
}

// Called when the window is resized
// Manages layout of ball and ball shadow
// Keeps them centered in window
function doResize() 
{
	var ball = null;
	var rules = null;
	var shadow = null;
	var top = null;	
	
	// Get a reference to the ball element
	// Center in window
	ball = document.querySelector( '#ball' );
	ball.style.left = Math.round( ( document.body.offsetWidth - ball.offsetWidth ) / 2 );	
	
	// Get a reference to the ball shadow element
	// Center in window
	shadow = document.querySelector( '#shadow' );
	shadow.style.left = Math.round( ( document.body.offsetWidth - shadow.offsetWidth ) / 2 );	
		
	// Look at the CSS rules used on this page
	rules = document.styleSheets[0].cssRules;
	
	for( var r = 0; r < rules.length; r++ )
	{
		// Look for an animation keyframe rule
		// This rule manages the bouncing of the ball
		if( rules[r].name == 'bouncing' )
		{
			// Update CSS animation to reflect dimensions of screen
			top = document.body.offsetHeight - ball.offsetHeight - THE_FLOOR;			
			rules[r].findRule( '50%' ).style.setProperty( 'top', ( top + 15 ) + 'px' );
		}

		// This rule manages the movement of the ball shadow
		if( rules[r].name == 'shadowing' )
		{
			// Update CSS animation to reflect the dimension of the screen
			top = document.body.offsetHeight - shadow.offsetHeight - THE_FLOOR;			
			rules[r].findRule( '50%' ).style.setProperty( 'top', top + 'px' );
		}
	}	
}