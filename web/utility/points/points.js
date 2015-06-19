// Constants
var MAXIMUM_GAP = 50;

// Record line start and end points
var end = null;
var start = null;

// Determine the distance between two points
function distance( start, end )
{
	var result = null;
	
	// Math for the win!
	result = Math.sqrt( Math.pow( ( end.x - start.x ), 2 ) + Math.pow( ( end.y - start.y ), 2 ) );
	
	return result;
}

// Interpolates points between two points
// Interpolate means to figure out what is between two points
function interpolate()
{
	// Used to put a marker element for each point
	var elem = null;
	var elemh = null;
	var elemw = null;
	
	// Clean up start and end points
	// Isolate values as necessary
	var xabs = Math.abs( start.x - end.x );
	var yabs = Math.abs( start.y - end.y );	
	var xdiff = end.x - start.x;
	var ydiff = end.y - start.y;

	// Figure out the length of the line
	// Figure out how many steps needed to fill the gap between start and end points
	// Figure out the movement along the line
	var length = Math.sqrt( ( Math.pow( xabs, 2 ) + Math.pow( yabs, 2 ) ) );
	var steps = length / MAXIMUM_GAP;
	var xstep = xdiff / steps;
	var ystep = ydiff / steps;

	// Hold the new point
	var newx = 0;
	var newy = 0;

	// Iterate through the steps needed to fill the gaps
	for( var s = 1; s < steps; s++ ) 
	{
		// Get the new point
		newx = Math.round( start.x + ( xstep * s ) );
		newy = Math.round( start.y + ( ystep * s ) );
        
		// Create an element to show that point
		elem = document.createElement( 'div' );
		elem.className = 'marker';
		
		// Put the element in the page so it can be measured
		document.body.appendChild( elem );
		
		// Calculate offset to center element around new point
		elemw = pixels( window.getComputedStyle( elem, null ).getPropertyValue( 'width' ) );
		elemw = Math.round( newx - ( elemw / 2 ) );
		elemh = pixels( window.getComputedStyle( elem, null ).getPropertyValue( 'height' ) );		
		elemh = Math.round( newy - ( elemh / 2 ) );
		
		// Position the element centered on the new point
		elem.style.left = elemw + 'px';
		elem.style.top = elemh + 'px';
		elem.style.visibility = 'visible';  
	}
}

// Converts CSS pixel values to numeric pixel values
function pixels( value )
{
	var result = null;
	
	// Get the provided value as a string
	result = value.toString();
	
	// Check to see if this is a CSS pixel value
	if( result.indexOf( 'px' ) >= 0 )
	{
		// Peel off CSS pixel notation and return numeric value
		result = parseFloat( result.substr( 0, result.length - 2 ) );
	} else {
		// Force numeric conversion
		result = parseFloat( result );
	}	
	
	return result;	
}

// Called when the document body is clicked
// Adds elements representing points along a line
function doBodyClick( evt )
{
	var circle = null;
	var height = null;
	var width = null;
	
	// If a complete line has already been drawn
	// Clear all the previous points to reset
	if( start != null && end != null )
	{
		// Find all the circle elements
		circle = document.querySelectorAll( 'div' );
		
		// Iterate through the found elements
		for( var c = 0; c < circle.length; c++ )
		{
			// Remove the current element of the iteration
			document.body.removeChild( circle[c] );	
		}
		
		// Reset line start and end points
		start = null;
		end = null;
	}
	
	// Create a new circle element to show click point
	circle = document.createElement( 'div' );
	document.body.appendChild( circle );
	
	// If the start of the line has not been defined
	if( start == null )
	{
		// Record the line start
		start = {
			x: evt.clientX,
			y: evt.clientY
		};
		
		// Style the element to show as a starting point
		circle.className = 'start';
	// Else a start point has already been defined
	// Define an ending point for the line
	} else {
		
		// Record the line ending
		end = {
			x: evt.clientX,
			y: evt.clientY
		};
		
		// Style the element to reflect the ending point
		circle.className = 'end';	
		
		// Check the distance of the line
		// Interpolate the distance if necessary
		if( distance( start, end ) > MAXIMUM_GAP )
		{
			interpolate();	
		}
	}
	
	// Determine calculated values of element size
	// Work from CSS values and not hard coded values
	width = pixels( window.getComputedStyle( circle, null ).getPropertyValue( 'width' ) );
	height = pixels( window.getComputedStyle( circle, null ).getPropertyValue( 'height' ) );
	
	// Position the line start or end point
	// Show the point to the user	
	circle.style.left = ( evt.clientX - Math.round( width / 2 ) ) + 'px';
	circle.style.top = ( evt.clientY - Math.round( height / 2 ) ) + 'px';
	circle.style.visibility = 'visible';	
}

// Called when the document has loaded
// Attaches click event listener to document body
function doLoad()
{
	document.body.addEventListener( 'click', doBodyClick );	
}