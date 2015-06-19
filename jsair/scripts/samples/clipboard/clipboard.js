$( document ).ready( function() {
	
	$( '#putcliptxt' ).click( function( e ) {
		var message = 'Hello World!';
		
		air.Clipboard.generalClipboard.clear();
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.TEXT_FORMAT, message );
		
		alert( 'The string of text:\n\n' + message + '\n\nIs now on the clipboard.' );
	} );

	$( '#putclipfile' ).click( function( e ) {
		var file = air.File.applicationStorageDirectory.resolvePath( 'document.txt' );
		var stream = new air.FileStream();
		
		stream.open( file, air.FileMode.WRITE );
		stream.writeMultiByte( 'Hello World!', air.File.systemCharset );
		stream.close();
		
		air.Clipboard.generalClipboard.clear();		
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.FILE_LIST_FORMAT, [file] );
		
		alert( 'A text file from:\n\n' + file.nativePath + '\n\nIs now on the clipboard.' );
	} );
	
	$( '#putclipmulti' ).click( function( e ) {
		var file = null;
		var list = new Array();
		var stream = new air.FileStream();
		
		for( var f = 0; f < 10; f++ )
		{
			file = air.File.applicationStorageDirectory.resolvePath( f + '.txt' );
	
			stream.open( file, air.FileMode.WRITE );
			stream.writeMultiByte( '#' + f + ') Hello World!', air.File.systemCharset );
			stream.close();	
			
			list.push( file );
		}
		
		air.Clipboard.generalClipboard.clear();		
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.FILE_LIST_FORMAT, list );
		
		alert( 'Ten new text files have been put on the clipboard.' );
	} );	

	$( '#putclipboth' ).click( function( e ) {
		var file = air.File.applicationStorageDirectory.resolvePath( 'document.txt' );
		var message = 'Hello World!';
		var stream = new air.FileStream();
		
		stream.open( file, air.FileMode.WRITE );
		stream.writeMultiByte( message, air.File.systemCharset );
		stream.close();
		
		air.Clipboard.generalClipboard.clear();		
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.TEXT_FORMAT, message );
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.FILE_LIST_FORMAT, [file] );
		
		alert( 'Text and file representations of the string "Hello World!" are on the clipboard.' );
	} );
	
	$( '#putclipbmp' ).click( function( e ) {
		var bmp = new air.BitmapData( window.htmlLoader.width, window.htmlLoader.height );
		
		bmp.draw( window.htmlLoader );
		
		air.Clipboard.generalClipboard.clear();		
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.BITMAP_FORMAT, bmp );
		
		alert( 'A raw bitmap screen capture of this application is now on the clipboard.' );
	} );	
	
	$( '#determineclip' ).click( function( e ) {
		var mess = null;
										  
		if( air.Clipboard.generalClipboard.formats.length == 0 )
		{
			alert( 'There is nothing on the clipboard.' );
			return;
		}
						
		mess = 'There are ' + 
				air.Clipboard.generalClipboard.formats.length + 
				' items on the clipboard of types:\n\n';						
						
		for( var f = 0; f < air.Clipboard.generalClipboard.formats.length; f++ )
		{
			mess += air.Clipboard.generalClipboard.formats[f] + '\n';
		}
		
		alert( mess );
	} );
	
	$( '#getcliptxt' ).click( function( e ) {
		var content = air.Clipboard.generalClipboard.getData( air.ClipboardFormats.TEXT_FORMAT );

		if( content == null )
		{
			alert( 'There is no text content on the clipboard.' );
		} else {
			alert( 'The text content on the clipboard is:\n\n' + content );	
		}
	} );	
	
	$( '#getclipfile' ).click( function( e ) {
		var list = air.Clipboard.generalClipboard.getData( air.ClipboardFormats.FILE_LIST_FORMAT );
		var mess = 'The files on the clipbard are:\n\n';

		if( list == null )
		{
			alert( 'There are no files on the clipboard.' );
			return;
		}
		
		for( var f = 0; f < list.length; f++ )
		{
			mess += list[f].name + '\n';
		}
		
		alert( mess );
	} );		

	$( '#getclipbmp' ).click( function( e ) {
		var bmp = air.Clipboard.generalClipboard.getData( air.ClipboardFormats.BITMAP_FORMAT );							   
		var file = null;
		var png = null;
		var save = null;
		var stream = null;
					
		if( bmp == null )
		{
			alert( 'There is no bitmap content available on the clipboard.' );
			return;
		}
		
		png = runtime.com.adobe.images.PNGEncoder.encode( bmp );
		
		file = air.File.createTempFile();
		
		stream = new air.FileStream();
		stream.open( file, air.FileMode.WRITE );
		stream.writeBytes( png );
		stream.close();
		
		air.Clipboard.generalClipboard.clearData( air.ClipboardFormats.FILE_LIST_FORMAT );
		air.Clipboard.generalClipboard.setData( air.ClipboardFormats.FILE_LIST_FORMAT, [file] );

		save = air.File.desktopDirectory;
		save.addEventListener( air.Event.SELECT, function( e ) {
			var list = air.Clipboard.generalClipboard.getData( air.ClipboardFormats.FILE_LIST_FORMAT );
			var out = new air.File( e.target.url + air.File.separator + 'bitmap.png' );
			
			list[0].moveTo( out );
			
			alert( 'The bitmap data on the clipboard has been encoded as a PNG and moved to:\n\n' + out.nativePath );
		} );
		save.browseForDirectory( 'Where to save image file?' );
	} );

	$( '#clipclear' ).click( function( e ) {
		air.Clipboard.generalClipboard.clear();
		
		alert( 'All data has been cleared from the clipboard.' );
	} );
	
	$( '#clipclearone' ).click( function( e ) {
		var format = null;
										 
		if( air.Clipboard.generalClipboard.formats.length == 0 )
		{
			alert( 'There is no content on the clipboard to be cleared.' );
			return;
		}
		
		format = air.Clipboard.generalClipboard.formats[0];
		air.Clipboard.generalClipboard.clearData( air.Clipboard.generalClipboard.formats[0] );
		
		alert( 'Any "' + format + '" data has been removed from the clipboard.' );
	} );	

} );