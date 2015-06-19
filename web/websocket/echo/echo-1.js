// Constants for layout and connectivity
// Web Socket server is publicly available
var DISTANCE_CLOSE = '0px';
var DISTANCE_OPEN = '94px';
var ECHO_SERVER = 'ws://echo.websocket.org?encoding=text';

// Web Socket itself
var socket = null;

// Called when the connection is closed
// Hides the input form to send messages
function doClose()
{

}

// Called when the document is fully loaded
// Configures Web Socket
function doLoad()
{
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

}

// Called when the socket connection is open
// Makes form area available for input
function doOpen()
{

}

// Called when the send button is clicked
// Also called when the form is submitted
// Sends the typed message to the server
function doSend()
{

}