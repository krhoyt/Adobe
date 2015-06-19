$( document ).ready( function() {
	
	$( '#createtxt' ).click( function( e ) {
		var file = air.File.desktopDirectory.resolvePath( 'document.txt' );
		var stream = new air.FileStream();
		
		stream.open( file, air.FileMode.WRITE );
		stream.writeMultiByte( 'Hello World!', air.File.systemCharset );
		stream.close();

		alert( 'Text file created at:\n' + file.nativePath );
	} );
	
	$( '#selectany' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			alert( 'You selected:\n' + e.target.nativePath );												  
		} );
		file.browseForOpen( 'Select Any File' );
	} );	
	
	$( '#selecttxt' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			alert( 'You selected:\n' + e.target.nativePath );												  
		} );
		file.browseForOpen( 'Select a Text File', [new air.FileFilter( 'Text File', '*.txt' )] );
	} );
	
	$( '#selectmulti' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.FileListEvent.SELECT_MULTIPLE, function( e ) {
			var mess = 'You selected ' + e.files.length + ' files:\n\n';
			
			for( var f = 0; f < e.files.length; f++ )
			{
				mess += e.files[f].name + '\n';
			}
			
			alert( mess );												  
		} );
		file.browseForOpenMultiple( 'Select Image Files', [new air.FileFilter( 'Image Files', '*.jpg;*.jpeg;*.png;*.gif' )] );
	} );	
	
	$( '#selectdir' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			alert( 'You selected:\n' + e.target.nativePath );												  
		} );
		file.browseForDirectory( 'Select a Directory' );
	} );	
	
	$( '#dirlisting' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var list = e.target.getDirectoryListing();
			var mess = 'The following files:\n\n';
	
			for( var f = 0; f < list.length; f++ )
			{
				if( !list[f].isDirectory && !list[f].isHidden )
				{
					mess += list[f].name + '\n';	
				}
			}
	
			mess += '\nAre in the directory:\n' + e.target.nativePath;
	
			alert( mess );												  
		} );
		file.browseForDirectory( 'Select a Directory' );
	} );		
	
	$( '#checkexists' ).click( function( e ) {
		var file = air.File.desktopDirectory.resolvePath( 'document.txt' );

		if( file.exists )
		{
			alert( 'The file exist:\n' + file.nativePath );	
		} else {
			alert( 'The file does not exist:\n' + file.nativePath );			
		}
	} );		
	
	$( '#getsize' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			alert( 'The file you selected is ' + Math.round( e.target.size / 1024 ) + ' KB.' );												  
		} );
		file.browseForOpen( 'Select Any File' );
	} );		
	
	$( '#readtxt' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var content = null;														  
			var stream = new air.FileStream();
			var words = null;
			
			stream.open( e.target, air.FileMode.READ );
			content = stream.readMultiByte( stream.bytesAvailable, air.File.systemCharset );
			stream.close();
			
			words = content.split( ' ' );
			
			alert( 'The file "' + e.target.name + '" contains ' + words.length + ' words.' );
		} );
		file.browseForOpen( 'Select a Text File', [new air.FileFilter( 'Text File', '*.txt' )] );
	} );	
	
	$( '#deleteone' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var rsp = confirm( 'Delete the selected file?' );
			
			if( rsp )
			{
				e.target.deleteFile();
				alert( 'The file has been deleted.' );
			}
		} );
		file.browseForOpen( 'Delete a File' );
	} );	
	
	$( '#makedir' ).click( function( e ) {
		var file = air.File.desktopDirectory.resolvePath( 'adobeair' );
		
		file.createDirectory();
		
		alert( 'An "adobeair" directory has been created at:\n' + file.nativePath );
	} );			
	
	
	$( '#deletedir' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var rsp = confirm( 'Delete the directory?' );
			
			if( rsp )
			{
				e.target.deleteDirectory( true );
				alert( 'The directory and files have been deleted.' );
			}
		} );
		file.browseForDirectory( 'Select a Directory' );
	} );	
	
	$( '#appendtxt' ).click( function( e ) {
		var file = air.File.desktopDirectory.resolvePath( 'document.txt' );

		file.addEventListener( air.Event.SELECT, function( e ) {
			var stream = new air.FileStream();
			
			stream.open( e.target, air.FileMode.APPEND );
			stream.writeMultiByte( '\nHello World!', air.File.systemCharset );
			stream.close();
			
			alert( 'The text "Hello World!" has been appended to the file.' );
		} );
		file.browseForOpen( 'Select a Text File', [new air.FileFilter( 'Text Files', '*.txt' )] );
	} );	
	
	$( '#createtmp' ).click( function( e ) {
		var file = air.File.createTempFile();
		var stream = new air.FileStream();
		
		stream.open( file, air.FileMode.WRITE );
		stream.writeMultiByte( 'I once was temporary.', air.File.systemCharset );
		stream.close();
		
		alert( 'A temporary file exists at:\n' + file.nativePath );
	} );		

	$( '#movetmp' ).click( function( e ) {
		var dest = air.File.desktopDirectory;
				
		dest.addEventListener( air.Event.SELECT, function( e ) {
			var stream = new air.FileStream();
			var temp = air.File.createTempFile();		

			stream.open( temp, air.FileMode.WRITE );
			stream.writeMultiByte( 'I once was temporary.', air.File.systemCharset );
			stream.close();
			
			temp.moveTo( e.target, true );
			
			stream.open( e.target, air.FileMode.APPEND );
			stream.writeMultiByte( '\nBut now am at: ' + e.target.nativePath, air.File.systemCharset );
			stream.close();
			
			alert( 'The temporary file create at:\n\n' + temp.nativePath + '\n\nHas been moved to:\n\n' + e.target.nativePath );
		} );
		dest.browseForSave( 'Select Destination' );
	} );		

} );