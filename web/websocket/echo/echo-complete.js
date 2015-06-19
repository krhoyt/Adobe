// Constants for layout and connectivity
// Web Socket server is publicly available
var DISTANCE_CLOSE = '0px';
var DISTANCE_OPEN = '94px';
var ECHO_SERVER = 'ws://localhost:8080';

// Web Socket itself
var socket = null;

// Called when the connection is closed
// Hides the input form to send messages
function doClose()
{
	document
		.querySelector( '#canyon' )
		.style
		.bottom = DISTANCE_CLOSE;	
}

// Called when the document is fully loaded
// Configures Web Socket
function doLoad()
{
	// Account for different naming conventions
	window.WebSocket = window.WebSocket || window.MozWebSocket;	
	
	// Configure the Web Socket
	socket = new WebSocket( ECHO_SERVER );
	socket.onopen = doOpen;
	socket.onmessage = doMessage;
	socket.onclose = doClose;
	
	// Listen for click on send button
	document
		.querySelector( '#send' )
		.addEventListener( 'click', doSend );
}

// Called when a message is received from the server
// Creates an echo balloon on the screen
function doMessage( evt )
{
	balloon( evt.data );
}

// Called when the socket connection is open
// Makes form area available for input
function doOpen()
{
	document
		.querySelector( '#canyon' )
		.style
		.bottom = DISTANCE_OPEN;	
}

// Called when the send button is clicked
// Also called when the form is submitted
// Sends the typed message to the server
function doSend()
{
	var data = null;
	
	// Get the message to send
	data = document
		.querySelector( '#message' )
		.value;
		
	// Send the message to the Web Socket server
	socket.send( data );
	
	// Clear the message
	document
		.querySelector( '#message' )
		.value = '';
		
	// Return false to stop form submission
	return false;	
}