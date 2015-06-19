// Constants used for layout management
var MAXIMUM_WIDTH = 217;
var PADDING_HORIZONTAL = 38;
var PADDING_VERTICAL = 12;
var SCENE_TOP = 0.20;

// Create a text message bubble
// Emulates iOS SMS behavior
function balloon( message )
{
	var echo = null;
	var element = null;
	var measure = null;
	var top = null;

	// Used to measure text width
	// Populated behind the scenes	
	measure = document.querySelector( '#measure' );
	
	if( measure == null )
	{
		measure = document.createElement( 'div' );
		measure.id = 'measure';
		
		document.body.insertBefore( measure, document.querySelector( 'form' ) );
	}
	
	// Populate with provided text
	measure.innerHTML = message;
	
	// Perform initial position calculations
	element = document.querySelector( '#canyon' );
	
	// Do not let bubble appear in the sky part of the scene
	top = element.offsetHeight * SCENE_TOP;
	top = top + Math.floor( Math.random() * ( element.offsetHeight - top ) );
	
	// Do not let bubble push off the right edge of the scene
	left = element.offsetWidth - MAXIMUM_WIDTH;
	left = Math.floor( Math.random() * left );
	
	// Create the balloon element
	echo = document.createElement( 'div' );
	echo.addEventListener( 'webkitTransitionEnd', doEchoEnd );
	echo.className = 'echo';
	
	// Limit width of balloon to match width limit on iOS
	if( ( measure.offsetWidth + PADDING_HORIZONTAL ) > MAXIMUM_WIDTH )
	{
		echo.style.width = MAXIMUM_WIDTH + 'px';		
	} else {
		echo.style.width = ( measure.offsetWidth + PADDING_HORIZONTAL ) + 'px';		
	}
	
	// Element maps the balloon image as a background
	// Using border image style for scaling
	element = document.createElement( 'div' );
	element.className = 'balloon';
	echo.appendChild( element );
	
	// Contains the actual text message
	element = document.createElement( 'span' );
	element.innerHTML = message;
	echo.appendChild( element );
	
	// Add created bubble to document
	document.body.appendChild( echo );
	
	// Must be added before measurements are available
	// Determines rendered text height
	// Bitmap background scales to match
	echo.style.height = ( element.offsetHeight + PADDING_VERTICAL ) + 'px';

	// Final positioning
	echo.style.left = left + 'px';
	echo.style.top = ( top - element.offsetHeight - PADDING_VERTICAL ) + 'px';
	echo.style.opacity = 0;
}

// Called when the echo balloon has finished displaying
// Remvoes balloon element from document
function doEchoEnd( evt )
{
	document.body.removeChild( this );	
}