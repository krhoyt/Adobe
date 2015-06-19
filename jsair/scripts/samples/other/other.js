var bridge = {};

$( document ).ready( function() {
	
	$( '#playsound' ).click( function( e ) {
		var mp3 = air.File.applicationDirectory.resolvePath( 'assets' + 
															 air.File.separator + 
															 'sound' + 
															 air.File.separator +
															 'doh.mp3' );
		var sound = new air.Sound( new air.URLRequest( mp3.url ) );
		
		sound.play();
	} );
	
	$( '#callnonapp' ).click( function( e ) {
		document.getElementById( 'sandbox' ).contentWindow.childSandboxBridge.greetings( 'Adobe AIR' );
	} );
		
} );