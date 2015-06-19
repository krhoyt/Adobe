var MAX_TILT = 485;
var SOCKET_URI = 'ws://192.168.1.59/';
var START_POSITION = 100;

var socket = null;

function distance( first, second )
{
	var fx = null;
	var fy = null;
	var result = null;
	var sx = null;
	var sy = null;
	
	// Determine the location of the ball on the screen
	// Account for width of ball image
	// Work distance formula from center of both elements
	fx = pixels( window.getComputedStyle( first, null ).getPropertyValue( 'left' ) );
	fx = fx + Math.round( first.clientWidth / 2 );
	fy = pixels( window.getComputedStyle( first, null ).getPropertyValue( 'top' ) );
	fy = fy + Math.round( first.clientHeight / 2 )
	
	// Determine the location of the hole on the screen
	// Account for width of hole image
	// Also account for hole alignment with right side of screen	
	sx = pixels( window.getComputedStyle( second, null ).getPropertyValue( 'right' ) );
	sx = document.body.clientWidth - sx - second.clientWidth;
	sx = sx + Math.round( second.clientWidth / 2 )
	sy = pixels( window.getComputedStyle( second, null ).getPropertyValue( 'top' ) );
	sy = sy + Math.round( second.clientWidth / 2 )	
	
	// Perform distance calculation
	result = Math.sqrt( Math.pow( ( sx - fx ), 2 ) + Math.pow( ( sy - fy ), 2 ) );

	// Return a rounded result value
	return Math.round( result );
}

// Called to strip pixel suffix from CSS values
function pixels( value )
{
	var result = null;
	
	// Get the passed in value as a string
	// Parse off the ending
	result = value.toString();
	result = parseFloat( result.substr( 0, result.length - 2 ) );
	
	// Return the numeric value
	return result;
}


// Called to start general game play
// Positions ball and adds orientation event listeners
function play()
{
	var ball = null;
	
	// Center the ball vertically
	// Position the ball on the left side of the screen
	ball = document.querySelector( '#ball' );
	ball.style.top = Math.round( ( document.body.offsetHeight - ball.offsetHeight ) / 2 ) + 'px';		
	ball.style.left = START_POSITION + 'px';
	
	// Web Socket hooks to server
	if( socket == null )
	{
		socket = new WebSocket( SOCKET_URI );
	}
	
	socket.addEventListener( 'open', doSocketOpen );
	socket.addEventListener( 'message', doSocketMessage );
}

// Called to update the position of the ball
// Applies motion to CSS values
// May be called by orientation or motion
function update( horizontal, vertical )
{
	var ball = null;
	var hole = null;
	var left = null;
	var top = null;
	
	// Reference to the hole in the ground
	hole = document.querySelector( '#hole' );
	
	// Reference to the ball element
	ball = document.querySelector( '#ball' );
	
	// Get the top position
	top = pixels( ball.style.top );
	
	// Make some effort to keep it on the screen
	if( ( top + vertical ) <= 0 )
	{
		top = 0;
	} else {
		top = top + vertical;
	}

	// Get the left position
	left = pixels( ball.style.left );
	
	// Make some effort to keep it on the screen
	if( ( left + horizontal ) <= 0 )
	{
		left = 0;
	} else {
		left = left + horizontal;
	}	
	
	// Check to see if the ball should fall into the hole
	// Use distance formula between the center of ball and hole
	if( distance( ball, hole ) < 20 )
	{		
		socket.removeEventListener( 'message', doSocketMessage );
		
		// Calculate the leftmost side of the hole
		// Center ball in hole based on provided dimensions
		left = pixels( window.getComputedStyle( hole, null ).getPropertyValue( 'right' ) );
		left = document.body.clientWidth - left - hole.clientWidth;
		left = left + Math.round( ( hole.clientWidth - ball.clientWidth ) / 2 );		
	
		// Center the ball in the hole based on provided dimensions
		// Does not account for shadow
		// Probably should be moved into a constant over the long term
		top = pixels( window.getComputedStyle( hole ).getPropertyValue( 'top' ) );
		top = top + Math.round( ( hole.clientHeight - ( ball.clientHeight - 5 ) ) / 2 );
	
		// Let the user click on the ball to start over
		ball.addEventListener( 'click', doBallClick );
	}
	
	// Update the ball location
	ball.style.left = left + 'px';	
	ball.style.top = top + 'px';		
}

// Called when the ball is clicked once the game is over
// Starts the game anew
function doBallClick( evt )
{
	// Remove the click listener to start the game over
	this.removeEventListener( 'click', doBallClick );
	
	// Start the new game
	play();
}

// Called when the document has loaded
// Configures initial layout
// Makes the call to start the game
function doLoad()
{
	// Listen for the window to resize
	// Keep the hole positioned in the same place
	window.onresize = doResize();
	doResize();		

	// Start the game
	play();
}

// Called when the window is resized
// Keeps the hole positioned
function doResize()
{
	var hole = null;
	
	// Position the hole centered vertically
	hole = document.querySelector( '#hole' );
	hole.style.top = Math.round( ( document.body.offsetHeight - hole.offsetHeight ) / 2 );	
}

function doSocketMessage( mess )
{
	var values = null;
	
	console.log( mess.data );	
	
	values = mess.data.split( ',' );	
	update( 
		Math.round( ( Number( values[1] ) / 480 ) * 3 ), 
		Math.round( ( Number( values[0] ) / 480 ) * 3 )
	);
}

function doSocketOpen()
{
	console.log( 'Socket open.' );	
}