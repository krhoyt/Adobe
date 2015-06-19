$( document ).ready( function() {
	
	$( '#determineimg' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var img = new air.ByteArray();
			var start = null;
			var stream = new air.FileStream();
			
			stream.open( e.target, air.FileMode.READ );
			stream.readBytes( img );
			stream.close();
			
			start = img.readUnsignedByte();
			
			switch( start )
			{
				case 255:
					alert( 'The selected file is a JPEG file.' );
					break;
			
				case 137:
					alert( 'The selected file is a PNG file.' );
					break;			
					
				case 71:
					alert( 'The selected file is a GIF file.' );
					break;					
			}
		} );
		file.browseForOpen( 'Select Image File', [new air.FileFilter( 'Image Files', '*.jpeg;*.jpg;*.gif;*.png' )] );
	} );
	
	$( '#determinedim' ).click( function( e ) {
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var format = 0;
			var height = 0;
			var img = new air.ByteArray();
			var marker = 0;
			var start = null;
			var stream = new air.FileStream();
			var width = 0;
			
			stream.open( e.target, air.FileMode.READ );
			stream.readBytes( img );
			stream.close();
			
			start = img.readUnsignedByte();
			
			switch( start )
			{
				case 255:
					img.endian = air.Endian.BIG_ENDIAN;
					img.position = 3;
					format = img.readUnsignedByte();					
	
					while( marker != 0xC0 )
					{
						start = img.readUnsignedShort() - 1;
						img.position = img.position + start;
						marker = img.readUnsignedByte();							
					}											
						
					img.position = img.position + 3;
						
					height = img.readUnsignedShort();
					width = img.readUnsignedShort();				
					
					break;
			
				case 137:
					img.position = 16;							
						
					width = img.readUnsignedInt();
					height = img.readUnsignedInt();				

					break;			
					
				case 71:
					img.position = 6;
					img.endian = air.Endian.LITTLE_ENDIAN;
					
					width = img.readUnsignedShort();
					height = img.readUnsignedShort();				
					
					break;					
			}
			
			alert( 'The image "' + e.target.name + '" is ' + width + ' pixels wide by ' + height + ' pixels high.' );
		} );
		file.browseForOpen( 'Select Image File', [new air.FileFilter( 'Image Files', '*.jpeg;*.jpg;*.gif;*.png' )] );
	} );	
	
	$( '#encodepng' ).click( function( e ) {
		var bmp = new air.BitmapData( window.htmlLoader.width, window.htmlLoader.height );
		var file = air.File.desktopDirectory.resolvePath( 'image.png' );
		var png = null;
		var stream = new air.FileStream();	

		bmp.draw( window.htmlLoader );
		png = runtime.com.adobe.images.PNGEncoder.encode( bmp )
		
		stream.open( file, air.FileMode.WRITE );
		stream.writeBytes( png );
		stream.close();
		
		alert( 'A PNG formatted screen capture of this application is located at:\n\n' + file.nativePath );
	} );
	
	$( '#encodejpg' ).click( function( e ) {
		var bmp = new air.BitmapData( window.htmlLoader.width, window.htmlLoader.height );
		var encoder = new runtime.com.adobe.images.JPGEncoder();
		var file = air.File.desktopDirectory.resolvePath( 'image.jpg' );
		var jpg = null;
		var stream = new air.FileStream();	

		bmp.draw( window.htmlLoader );
		jpg = encoder.encode( bmp )
		
		stream.open( file, air.FileMode.WRITE );
		stream.writeBytes( jpg );
		stream.close();
		
		alert( 'A JPG formatted screen capture of this application is located at:\n\n' + file.nativePath );
	} );	
	
	$( '#scaleimg' ).click( function( e ) {	
		var file = air.File.desktopDirectory;
		
		file.addEventListener( air.Event.SELECT, function( e ) {
			var loader = new air.Loader();
			
			loader.contentLoaderInfo.addEventListener( air.Event.COMPLETE, function( e ) {
				var file = air.File.desktopDirectory.resolvePath( 'thumbnail.png' );
				var png = createIcon( e.target );
				var stream = new air.FileStream();
			
				stream.open( file, air.FileMode.WRITE );
				stream.writeBytes( png );
				stream.close();	
				
				alert( 'An image thumbnail of 48x48 has been created at:\n\n' + file.nativePath );																					
			} );
			loader.load( new air.URLRequest( e.target.url ) );
		} );
		file.browseForOpen( 'Select an Image File', [new air.FileFilter( 'Image Files', '*.jpeg;*.jpg;*.png' )] );
	} ); 
					
} );

function createIcon( target )
{
	var icoHeight = 0;	
	var icon = null;
	var icoWidth = 0;
	var imgHeight = target.height;				
	var imgWidth = target.width;
	var matrix = null;
	var png = null;
	var ratio = 0;
	var source = null;
	
	if( imgWidth > imgHeight )
	{
		icoWidth = 48;
		icoHeight = Math.round( ( 48 / imgWidth ) * imgHeight );
		ratio = 48 / imgWidth;
	} else {
		icoHeight = 48;
		icoWidth = Math.round( ( 48 / imgHeight ) * imgWidth );
		ratio = 48 / imgHeight;		
	}							

	matrix = new air.Matrix();
	matrix.scale( ratio, ratio );

	source = new air.BitmapData( icoWidth, icoHeight );
	source.draw( target.content, matrix );	
	
	icon = new air.BitmapData( 48, 48, true, 0x00FFFFFF );
	icon.copyPixels( 
		source, 
		new air.Rectangle( 0, 0, icoWidth, icoHeight ),  
		new air.Point( 
			Math.round( ( 48 - icoWidth ) / 2 ), 
			Math.round( ( 48 - icoHeight ) / 2 ) )
	);
	
	png = runtime.com.adobe.images.PNGEncoder.encode( icon );	
	
	return png;
}