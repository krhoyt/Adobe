// Constants for layout and connectivity
var DISTANCE_CLOSE = '0px';
var DISTANCE_OPEN = '94px';
var PUSHER_AUTH = 'authentication.php';
var PUSHER_KEY = 'b8b884ca6cde9b60a4bc';

// Communications
var channel = null;
var socket = null;

// Called when the document is fully loaded
// Configures connection to server
function doLoad()
{
	// Tell Pusher where to authorize
	Pusher.channel_auth_endpoint = PUSHER_AUTH;	

	// Instantiate new connection
	socket = new Pusher( PUSHER_KEY );
	
	// Listen to echo channel messages
	// Show message interface when subscribed
	channel = socket.subscribe( 'private-echo' );
	channel.bind( 'pusher:subscription_succeeded', doOpen );
	channel.bind( 'client-message', doMessage );
	
	// Listen for click on send button
	document
		.querySelector( '#send' )
		.addEventListener( 'click', doSend );
}

// Called when a message is received from the server
// Creates an echo balloon on the screen
function doMessage( data )
{
	balloon( data );
}

// Called when the connection is subscribed
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
		.querySelector( '#message input:first-child' )
		.value;
		
	// Send the message to Pusher service
	// Show local message as well
	// Pushed doesn't echo to sending client
	channel.trigger( 'client-message', data );
	balloon( data );			
	
	// Clear the message
	document
		.querySelector( '#message input:first-child' )
		.value = '';
		
	// Return false to stop form submission
	return false;	
}