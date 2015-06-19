$( document ).ready( function() {
	
	$.preloadImages(
		'../images/icon_minimize_over13.png',
		'../images/icon_maximize_over13.png',
		'../images/icon_close_over13.png'		
	);		

	$( '#chrome' ).mousedown( function( e ) {
		window.nativeWindow.startMove();								   
	} );
	
	$( '#maximize' ).click( function( e ) {
		if( window.nativeWindow.displayState == air.NativeWindowDisplayState.NORMAL )
		{
			window.nativeWindow.maximize();	
		} else {
			window.nativeWindow.restore();
		}
	} );
		
	$( '#minimize' ).click( function( e ) {
		window.nativeWindow.minimize();	
	} );		

	$( '#close' ).click( function( e ) {
		window.nativeWindow.close();							  
	} );

	$( '#grip' ).mousedown( function( e ) {
		window.nativeWindow.startResize( air.NativeWindowResize.BOTTOM_RIGHT );								 
	} );

	window.nativeWindow.x = ( air.Capabilities.screenResolutionX - window.nativeWindow.width ) / 2;
	window.nativeWindow.y = ( air.Capabilities.screenResolutionY - window.nativeWindow.height ) / 2;	
	window.nativeWindow.visible = true;

} );