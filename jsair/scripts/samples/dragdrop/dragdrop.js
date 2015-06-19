var bitmap = 'image/x-vnd.adobe.air.bitmap';
var drag = null;
var files = 'application/x-vnd.adobe.air.file-list';
var pngurl = 'image/png';
var text = 'text/plain';

$( document ).ready( function() {
	
	$( '#dragtxtout' )
		.css( '-webkit-user-drag', 'element' )
		.bind( 'dragstart', function( e ) {
			e.originalEvent.dataTransfer.effectAllowed = 'copy';
			e.originalEvent.dataTransfer.setData( text, 'Hello World!' );
	} );
		
	$( '#dragfileout' )
		.css( '-webkit-user-drag', 'element' )
		.bind( 'dragstart', function( e ) {
			var file = air.File.applicationStorageDirectory.resolvePath( 'document.txt' );
			var message = 'Hello World!';
			var stream = new air.FileStream();
			
			stream.open( file, air.FileMode.WRITE );
			stream.writeMultiByte( message, air.File.systemCharset );
			stream.close();
			
			e.originalEvent.dataTransfer.effectAllowed = 'copy';
			e.originalEvent.dataTransfer.setData( files, [file] );
	} );
	
	$( '#dragstuff' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'drop', function( e ) {
			var mess = 'Content types available from drop operation:\n\n';
			
			for( var t = 0; t < e.originalEvent.dataTransfer.types.length; t++ )
			{
				mess += e.originalEvent.dataTransfer.types[t] + '\n';
			}
			
			alert( mess );						 
	} );
		
	$( '#dragtextin' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'drop', function( e ) {
			var content = e.originalEvent.dataTransfer.getData( text );
			
			if( content == null )
			{ 
				alert( 'No text content was dropped.' );
				return;
			}
			
			alert( 'The text content that was dropped is:\n\n' + content );
	} );

	$( '#dragfilein' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'drop', function( e ) {
			var list = e.originalEvent.dataTransfer.getData( files );
			var mess = 'The names of the files dropped here are:\n\n';
			
			if( list == null )
			{ 
				alert( 'No file content was dropped.' );
				return;
			}
			
			for( var f = 0; f < list.length; f++ )
			{
				mess += list[f].name + '\n';	
			}
			
			alert( mess );
	} );

	$( '#dragbmpin' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'drop', function( e ) {
			var bmp = e.originalEvent.dataTransfer.getData( bitmap );
			
			if( bmp == null )
			{ 
				alert( 'No bitmap content was dropped.' );
				return;
			}
			
			alert( 'A bitmap of ' + bmp.width + 'x' + bmp.height + ' dimensions was dropped.' );
	} );
		
	$( '#dragbmppng' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'drop', function( e ) {
			var bmp = e.originalEvent.dataTransfer.getData( bitmap );
			var file = air.File.desktopDirectory.resolvePath( 'dropped.png' );
			var png = null;
			var stream = new air.FileStream();
			
			if( bmp == null )
			{ 
				alert( 'No bitmap content was dropped.' );
				return;
			}

			png = bmp.toDataURL( pngurl );
			png = png.substr( 22, png.length - 22 );
			png = runtime.com.dynamicflash.util.Base64.decodeToByteArray( png );
			
			stream.open( file, air.FileMode.WRITE );
			stream.writeBytes( png );
			stream.close();
			
			alert( 'The bitmap as a PNG file is located at:\n' + file.nativePath );
	} );		

	$( '#dragonlytxt' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { 
			var found = false;									
									
			for( var t = 0; t < e.originalEvent.dataTransfer.types.length; t++ )
			{
				if( e.originalEvent.dataTransfer.types[t] == text )
				{
					found = true;
					break;
				}	
			}
			
			if( found ) 
			{
				e.originalEvent.preventDefault();										
			}
		} )
		.bind( 'drop', function( e ) {
			var content = e.originalEvent.dataTransfer.getData( text );
			
			alert( 'The text content dropped was:\n\n' + content );						 
	} );		

	$( '#dragonlyfile' )
		.bind( 'dragenter', function( e ) { e.originalEvent.preventDefault(); } )
		.bind( 'dragover', function( e ) { 
			var found = false;									
									
			for( var t = 0; t < e.originalEvent.dataTransfer.types.length; t++ )
			{
				if( e.originalEvent.dataTransfer.types[t] == files )
				{
					found = true;
					break;
				}	
			}
			
			if( found ) 
			{
				e.originalEvent.preventDefault();										
			}		
		} )
		.bind( 'drop', function( e ) {
			var list = e.originalEvent.dataTransfer.getData( files );
			var mess = 'The names of the dropped files are:\n\n';
			
			for( var f = 0; f < list.length; f++ )
			{
				mess += list[f].name + '\n';	
			}
			
			alert( mess );						 
	} );		

} );