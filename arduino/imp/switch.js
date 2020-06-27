// Fake constants
var IMP_URL = 'https://api.electricimp.com/v1/134045bb5c6addca/30da96b7da1e4861';
var SWITCH_OFF = 0;
var SWITCH_ON = -500;
var SWITCH_URL = 'switch.php';

// Global variables for light state and XHR
var state = 0;
var xhr = null;

// Called when the switch is clicked
// Toggles the image to show opposite state
// Calls PHP script for pass through to Electric Imp
function doLightClick()
{
	var light = null;
	
	// The light switch content
	light = document.querySelector( '.switch' );
	
	// If the switch is in the "on" position
	if( state )
	{
		// Turn the light switch off
		// Update state reference
		light.style.backgroundPosition = SWITCH_OFF + 'px';
		state = 0;
	} else {
		// Turn the light switch on
		light.style.backgroundPosition = SWITCH_ON + 'px';
		state = 1;
	}
	
	// Make an XHR request to the PHP script
	// Asynchronous
	// Using HTTP POST
	// Single "value" value is the state of the switch
	xhr = new XMLHttpRequest();
	xhr.addEventListener( 'load', doLightLoad );
	xhr.open( 'POST', SWITCH_URL, true );
	xhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );		
	xhr.send( 'value=' + state + '&url=' + IMP_URL );
}

// Called when the PHP script has returned
// Logs message to console for reference
// Cleans up XHR
function doLightLoad()
{
	xhr.removeEventListener( 'load', doLightLoad );
	console.log( xhr.responseText );
	xhr = null;
}

// Called when the window loads
// Adds the click handler to the switch
// Sets up initial positioning
function doWindowLoad()
{
	var light = null;
	
	// Click event handler on switch
	light = document.querySelector( '.switch' );
	light.addEventListener( 'click', doLightClick );
	
	// Position switch in center of screen
	doWindowResize();	
}

// Called when the window resizes
// Also called when layout updates are needed
// Centers the switch in the center of the screen
function doWindowResize()
{
	var light = null;
	
	// Center the switch using margins
	// Might alternatively use absolute positioning
	light = document.querySelector( '.switch' );
	light.style.marginLeft = Math.round( ( window.innerWidth - light.clientWidth ) / 2 ) + 'px';
	light.style.marginTop = Math.round( ( window.innerHeight - light.clientHeight ) / 2 ) + 'px';		
}

// Initial event hooks to kick the whole thing off
window.onload = doWindowLoad;
window.onresize = doWindowResize;