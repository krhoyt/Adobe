$( document ).ready( function() {
	
	$( '#putels' ).click( function( e ) {
		var data = new air.ByteArray();
		
		data.writeMultiByte( 'Hello World!', air.File.systemCharset );
		air.EncryptedLocalStore.setItem( 'message', data );
		
		alert( 'The string "Hello World!" has been added to the local store using the name "message".' );
	} );

	$( '#getels' ).click( function( e ) {
		var data = new air.ByteArray();
		var mess = null;
		
		data = air.EncryptedLocalStore.getItem( 'message' );
		
		if( data == null )
		{
			alert( 'There is no value in the local store with the name "message".' );
			return;
		}
		
		mess = data.readMultiByte( data.bytesAvailable, air.File.systemCharset );
		
		alert( 'Retrieved the string "' + mess + '" from the local store using the name "message".' );
	} );
	
	$( '#removeels' ).click( function( e ) {
		air.EncryptedLocalStore.removeItem( 'message' );

		alert( 'Retrieved the value from the local store using the name "message".' );
	} );	
	
	$( '#resetels' ).click( function( e ) {
		air.EncryptedLocalStore.reset();

		alert( 'All data has been removed from the local store.' );
	} );		

} );