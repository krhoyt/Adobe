// Constants
var BLADE_COUNT = 150;
var GREEN_AMOUNT = 125;
var GREEN_BASE = 100;
var ROTATE_AMOUNT = 10;
var SKEW_AMOUNT = 10;
var WIND_SPEED = 2000;

// Called when the page has been loaded
// Creates grass scene at bottom of screen
// Accepts no arguments
// Has no return value
function plant()
{
	var blade = null;
	var change = null;
	var clone = null;
	var grass = null;
	var height = null;
	var rotate = null;
	var skew = null;
	var width = null;
	
	blade = document.querySelector( '#blade' );
	height = blade.height.baseVal.value;
	width = blade.width.baseVal.value;		
	
	// Get reference to scene in document
	grass = document.querySelector( '#grass' );
	
	// Create blades of grass in the scene
	for( var g = 0; g < BLADE_COUNT; g++ )
	{
		// Clone the SVG node
		// Remove the reference ID
		// Randomly position the blade of grass
		clone = blade.cloneNode( true );
		clone.removeAttribute( 'id' );
		clone.style.position = 'absolute';
		clone.style.bottom = ( 0 - Math.round( Math.random() * height ) ) + 'px';
		clone.style.left = Math.round( 
			Math.random() * window.innerWidth ) + 
			( 0 - ( Math.random() * width ) ) +
			'px';
		
		// Determine a random rotation value
		rotate = Math.round( Math.random() * ROTATE_AMOUNT );
		rotate = Math.random() > 0.50 ? 0 - rotate : rotate;
		
		// Determine a random skew value
		skew = Math.round( Math.random() * SKEW_AMOUNT );
		skew = Math.random() > 0.50 ? 0 - skew : skew;			
		
		// Store in data attribute for future reference
		clone.setAttribute( 'data-rotate', rotate );
		clone.setAttribute( 'data-skew', skew );
		
		// Set the CSS transform property with rotation and skew
		// WebKit
		clone.style.webkitTransition = 'all 1s ease-out';
		clone.style.webkitTransformOrigin = 
			Math.round( width / 2 ) + 
			'px ' +
			height + 
			'px';
		clone.style.webkitTransform = 'rotate( ' + 
			rotate + 
			'deg ) skew( ' +
			skew +
			'deg )';
			
		// Account for different browsers
		// Even though it is effectively the same code	
		// Firefox
		clone.style.MozTransition = 'all 1s ease-out';			
		clone.style.MozTransformOrigin = 
			Math.round( width / 2 ) + 
			'px ' +
			height + 
			'px';
		clone.style.MozTransform = 'rotate( ' + 
			rotate + 
			'deg ) skew( ' +
			skew +
			'deg )';
			
		// Opera
		clone.style.oTransition = 'all 1s ease-out';			
		clone.style.oTransformOrigin = 
			Math.round( width / 2 ) + 
			'px ' +
			height + 
			'px';
		clone.style.oTransform = 'rotate( ' + 
			rotate + 
			'deg ) skew( ' +
			skew +
			'deg )';							
		
		// Random shade of green for each blade of grass
		// Within a threshold to avoid too extreme colors
		change = clone.querySelectorAll( 'path' )[0];
		change.setAttribute( 'fill', 'rgb( 0, ' +
			( Math.round( Math.random() * GREEN_AMOUNT ) + GREEN_BASE ) + 
			', 0 )' );
			
		// Add the blade of grass to the scene
		grass.appendChild( clone );			
	}
	
	// Remove the original blade of grass from the display
	document.body.removeChild( blade );
	
	// Once all the grass has been added to the scene
	// Start the random movement of grass to simulate wind
	timeout = setTimeout( doWindBlow, Math.round( Math.random() * WIND_SPEED ) ); 
}

// Called randomly to move blades of grass
// Accepts no arguments
// Has no return value
function doWindBlow()
{
	var end = null;
	var grass = null;
	var index = null;
	var rotate = null;
	var skew = null;
	var start = null;
	var transform = null;
	
	// Remove the timeout
	clearTimeout( timeout );
	
	// Get the blades of grass
	grass = document.querySelectorAll( '#grass > svg' );	
	
	// Determine which element we are going to animate
	index = Math.floor( Math.random() * ( grass.length - 1 ) );
	
	rotate = grass[index].getAttribute( 'data-rotate' );
	
	// If negative then make it positive
	// If positive then make it negative
	if( rotate > 0 )
	{
		rotate = 0 - rotate;	
	} else {
		rotate = Math.abs( rotate );	
	}
	
	skew = grass[index].getAttribute( 'data-skew' );
	
	// If negative then make it positive
	// If positive then make it negative	
	if( skew > 0 )
	{
		skew = 0 - skew;	
	} else {
		skew = Math.abs( skew );	
	}	
	
	// Place new values in data attributes for next reference
	grass[index].setAttribute( 'data-rotate', rotate );
	grass[index].setAttribute( 'data-skew', skew );
	
	// WebKit
	grass[index].style.webkitTransform = 'rotate( ' +
		rotate +
		'deg ) skew( ' +
		skew +
		'deg )';
		
	// Firefox
	grass[index].style.MozTransform = 'rotate( ' +
		rotate +
		'deg ) skew( ' +
		skew +
		'deg )';
	
	// Play it again some time later
	// Uses timeout for more random result
	timeout = setTimeout( doWindBlow, Math.round( Math.random() * WIND_SPEED ) );
}