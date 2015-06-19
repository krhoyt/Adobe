document.addEventListener( 'deviceready', function() {
	var watchId = 0;

	watchId = navigator.compass.watchHeading( function( heading ) {
		$( '#compass' ).css( '-webkit-transform', 'rotate( ' + heading.magneticHeading + 'deg )' );
	}, function( error ) {
		console.log( 'Error' );
	}, {
		frequency: 100
	} );
	
	$( '#tomspot' ).bind( 'touchstart', function() {
		$( '#tombaker' ).css( 'visibility', 'visible' );
	} ).bind( 'touchend', function() {
		$( '#tombaker' ).css( 'visibility', 'hidden' );		
	} );
	
	$( '#dalekspot' ).bind( 'touchstart', function() {
		$( '#daleks' ).css( 'visibility', 'visible' );
	} ).bind( 'touchend', function() {
		$( '#daleks' ).css( 'visibility', 'hidden' );		
	} );	
} );