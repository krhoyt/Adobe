var WebSocketServer = require( 'websocket' ).server;
var Http = require( 'http' );
var clients = new Array();

var server = Http.createServer( function( request, response ) {
    // Process HTTP request
	// Just Web Sockets here so nothing to see here
	// Move along!
} );
server.listen( 8080, function() {;} );

// Create Web Socket server
var sockets = new WebSocketServer( {
    httpServer: server
} );

// Web Socket server implementation
sockets.on( 'request', function( request ) {
    var connection = request.accept( null, request.origin );

	// Keep track of the clients
	clients.push( connection );

    // Handle client messages
	connection.on( 'message', function( message ) {
        if( message.type === 'utf8' ) 
		{
            // Process socket messages
			// In this case just send back out to all clients
			for( var i = 0; i < clients.length; i++ ) 
			{
            	clients[i].sendUTF( message.utf8Data );
            }			
        }
    } );

	// Close the connection
	// Probably should remove client from list
    connection.on( 'close', function( connection ) {;} );
} );