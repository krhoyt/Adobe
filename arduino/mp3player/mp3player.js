// https://github.com/voodootikigod/node-serialport
var SerialPort = require( 'serialport' );

// https://github.com/Worlize/WebSocket-Node
var WebSocketServer = require( 'websocket' ).server;

// HTTP server that ships with Node.js
var Http = require( 'http' );

// Port name looked up in Arduino IDE
var ARDUINO_PORT = '/dev/tty.usbmodem1411';

// List ports
// Arduino will display for manufacturer
// Here for debugging purposes
SerialPort.list( function( err, ports ) {
	ports.forEach( function(port) {
		console.log( port.comName )
		console.log( port.manufacturer );
    } );
} );

// Connect to Arduino
// No parser needed for this example
var serial = new SerialPort.SerialPort( ARDUINO_PORT );

// Web Sockets start life as HTTP requests
var server = Http.createServer( function( request, response ) {
    // Process HTTP request
	// Just Web Sockets here so nothing to see here
	// Move along!
} );
server.listen( 8080, function() {;} );

// Create Web Socket server
var socket = new WebSocketServer( {
    httpServer: server,
    fragmentOutgoingMessages: false
} );

var clients = [];

// Handle Web Socket requests from browser
socket.on( 'request', function( request ) {
    var connection = request.accept( null, request.origin );

	// Keep track of the clients
	clients.push( connection );
	console.log( 'New Web Socket connection' );

	// Handle incoming client messages
	// Send messages to the Arduino	
	connection.on( 'message', function( message ) {
		serial.write( message.utf8Data );
		console.log( message.utf8Data );
	} );

	// Close the connection
	// Update client list
    connection.on( 'close', function( connection ) {
		var index = clients.indexOf( connection );
        
		// Remove client from list
		if( index !== -1 ) 
		{
            clients.splice( index, 1 );
        }		
	} );
} );
