$( document ).ready( function() {
	
	$.preloadImages(
		'images/icon_minimize_over13.png',
		'images/icon_maximize_over13.png',
		'images/icon_close_over13.png'		
	);		
	
	$( '#chrome' ).mousedown( function() {
		window.nativeWindow.startMove();								   
	} );
	
	$( '#maximize' ).click( function() {
		if( window.nativeWindow.displayState == air.NativeWindowDisplayState.NORMAL )
		{
			window.nativeWindow.maximize();	
		} else {
			window.nativeWindow.restore();
		}
	} );
		
	$( '#minimize' ).click( function() {
		window.nativeWindow.minimize();	
	} );		

	$( '#close' ).click( function() {
		window.nativeWindow.close();							  
	} );

	window.nativeWindow.x = ( air.Capabilities.screenResolutionX - window.nativeWindow.width ) / 2;
	window.nativeWindow.y = ( air.Capabilities.screenResolutionY - window.nativeWindow.height ) / 2;	
	window.nativeWindow.visible = true;

} );