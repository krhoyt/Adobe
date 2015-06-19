var socket = null;
var url = null;

$( document ).ready( function() {
	
	socket = new air.SocketMonitor( 'irc.umich.edu', '6667' );
	socket.start();
	
	url = new air.URLMonitor( new air.URLRequest( 'http://www.adobe.com' ) );
	url.addEventListener( air.StatusEvent.STATUS, function( e ) {
		if( !e.target.available )
		{
			alert( 'You have lost connection to: ' + e.target.urlRequest.url );	
		}
	} );
	url.start();
	
	$( '#httpcheck' ).click( function( e ) {
		if( url.available )
		{
			alert( 'The web site "' + url.urlRequest.url + '" can be reached.' );	
		} else {
			alert( 'The web site "' + url.urlRequest.url + '" cannot be reached.' );				
		}
	} );

	$( '#socketcheck' ).click( function( e ) {
		if( socket.available )
		{
			alert( 'You are connected to ' + socket.host + '.' );	
		} else {
			alert( 'You are not connected to ' + socket.host + '.' );				
		}
	} );


} );