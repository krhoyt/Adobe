$( document ).ready( function() {
		
	$( '#newnative' ).click( function( e ) {
		air.HTMLLoader.createRootWindow();
	} );
		
	$( '#noresize' ).click( function( e ) {
		var options = new air.NativeWindowInitOptions();
		
		options.resizable = false;
									 
		air.HTMLLoader.createRootWindow( true, options );
	} );	
	
	$( '#nomaxwin' ).click( function( e ) {
		var options = new air.NativeWindowInitOptions();
		
		options.maximizable = false;
		options.resizable = false;
									 
		air.HTMLLoader.createRootWindow( true, options );
	} );	
	
	$( '#maxsizewin' ).click( function( e ) {
		var loader = air.HTMLLoader.createRootWindow();
									 
		loader.stage.nativeWindow.maxSize = new air.Point( 640, 480 );
	} );	

	$( '#minsizewin' ).click( function( e ) {
		var loader = air.HTMLLoader.createRootWindow();
									 
		loader.stage.nativeWindow.minSize = new air.Point( 160, 120 );
	} );	

	$( '#centerwin' ).click( function( e ) {
		var loader = air.HTMLLoader.createRootWindow();
									 
		loader.stage.nativeWindow.x = ( air.Capabilities.screenResolutionX - loader.stage.nativeWindow.width ) / 2;
		loader.stage.nativeWindow.y = ( air.Capabilities.screenResolutionY - loader.stage.nativeWindow.height ) / 2;		
	} );	
	
	$( '#nativebounds' ).click( function( e ) {
		var loader = air.HTMLLoader.createRootWindow();
		var bounds = new air.Rectangle();
		
		bounds.x = ( air.Capabilities.screenResolutionX - 1024 ) / 2;
		bounds.y = ( air.Capabilities.screenResolutionY - 768 ) / 2;
		bounds.width = 1024;
		bounds.height = 768;

		loader.stage.nativeWindow.bounds = bounds;
	} );					
	
	$( '#nativeinit' ).click( function( e ) {
		var loader = air.HTMLLoader.createRootWindow();
		var bounds = new air.Rectangle();
		
		bounds.x = ( air.Capabilities.screenResolutionX - 1024 ) / 2;
		bounds.y = ( air.Capabilities.screenResolutionY - 768 ) / 2;
		bounds.width = 1024;
		bounds.height = 768;

		loader.stage.nativeWindow.bounds = bounds;
		loader.load( new air.URLRequest( 'http://www.adobe.com/go/air' ) );
	} );					
	
	$( '#frontwin' ).click( function( e ) {
		var loader = air.HTMLLoader.createRootWindow();
	
		loader.stage.nativeWindow.alwaysInFront = true;
	} );		
	
	$( '#nakedwin' ).click( function( e ) {
		var close = air.File.applicationDirectory.resolvePath( 'assets' + 
															   air.File.separator + 
															   'html' +
															   air.File.separator +
															   'helper.html' );
		var loader = null;
		var options = new air.NativeWindowInitOptions();
		
		options.systemChrome = air.NativeWindowSystemChrome.NONE;
		
		loader = air.HTMLLoader.createRootWindow( true, options );
		loader.load( new air.URLRequest( close.url ) );
	} );		
	
	$( '#seethruwin' ).click( function( e ) {
		var close = air.File.applicationDirectory.resolvePath( 'assets' + 
															   air.File.separator + 
															   'html' +
															   air.File.separator +
															   'helper.html' );
		var loader = null;
		var options = new air.NativeWindowInitOptions();
		
		options.systemChrome = air.NativeWindowSystemChrome.NONE;
		options.transparent = true;
		
		loader = air.HTMLLoader.createRootWindow( true, options );
		loader.load( new air.URLRequest( close.url ) );
	} );		
	
	$( '#closewin' ).click( function( e ) {
		window.nativeWindow.close();								 
	} );
	
	$( '#maxwin' ).click( function( e ) {
		window.nativeWindow.maximize();								 
	} );	
	
	$( '#restorewin' ).click( function( e ) {
		if( window.nativeWindow.displayState == air.NativeWindowDisplayState.MAXIMIZED )
		{			
			window.nativeWindow.restore();
		} else {
			alert( 'Window is not maximized.' );	
		}
	} );		
	
	$( '#minwin' ).click( function( e ) {
		window.nativeWindow.minimize();								 
	} );		

	$( '#movewin' ).mousedown( function( e ) {
		window.nativeWindow.startMove();								 
	} );		

	$( '#chromewin' ).click( function( e ) {
		var close = air.File.applicationDirectory.resolvePath( 'assets' + 
															   air.File.separator + 
															   'html' +
															   air.File.separator +
															   'chrome.html' );
		var loader = null;
		var options = new air.NativeWindowInitOptions();
		
		options.systemChrome = air.NativeWindowSystemChrome.NONE;
		options.transparent = true;
		
		loader = air.HTMLLoader.createRootWindow( true, options );
		loader.load( new air.URLRequest( close.url ) );
	} );			

} );