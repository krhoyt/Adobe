// https://github.com/voodootikigod/node-serialport
var SerialPort = require( 'serialport' );

// https://github.com/Worlize/WebSocket-Node
var WebSocketServer = require( 'websocket' ).server;

// HTTP server that ships with Node.js
var Http = require( 'http' );

// Port name looked up in Arduino IDE
var HRMI_PORT = '/dev/tty.usbmodem1d11711';

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

// List ports
// Here for debugging purposes
SerialPort.list( function( err, ports ) {
	ports.forEach( function(port) {
		console.log( port.comName )
		console.log( port.manufacturer );
    } );
} );

// Connect to weather board
// Look for newline delimiter
var serial = new SerialPort.SerialPort( HRMI_PORT, {
	parser: SerialPort.parsers.readline( '\n' ) 	
} );

// Serial data captured from weather board
serial.on( 'data', function( data ) {
	// Send to console for debugging
	console.log( data );

	// Send to all connected clients
	for( var c = 0; c < clients.length; c++ )
	{
		clients[c].sendUTF( data );
	}
} );
