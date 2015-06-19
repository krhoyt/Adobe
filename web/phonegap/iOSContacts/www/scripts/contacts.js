$( document ).bind( 'deviceready', function() {

	$( '#btnCreate' ).bind( 'touchstart', function() {
		var contact = navigator.contacts.create();
		var name = null;
				
		contact.displayName = 
			$( '#txtFirst' ).attr( 'value' ) + ' ' +
			$( '#txtLast' ).attr( 'value' );
		contact.nickname = 
			$( '#txtFirst' ).attr( 'value' ) + ' ' +
			$( '#txtLast' ).attr( 'value' );
				
		name = new ContactName();
		name.givenName = $( '#txtFirst' ).attr( 'value' );
		name.familyName = $( '#txtLast' ).attr( 'value' );
		contact.name = name;
			
		contact.emails = [
			new ContactField( 'home', $( '#txtEmail' ).attr( 'value' ), true )
		];
		contact.phoneNumbers = [
			new ContactField( 'mobile', $( '#txtMobile' ).attr( 'value' ), true )
		];
		
		contact.save( function() {
			// Success indicated by clearing out of the fields
			$( '#txtFirst' ).attr( 'value', '' );
			$( '#txtLast' ).attr( 'value', '' );
			$( '#txtEmail' ).attr( 'value', '' );
			$( '#txtMobile' ).attr( 'value', '' );			
		}, function () {
			console.log( 'Error' );
		} );
	} );
	
	$( '#btnFind' ).bind( 'touchstart', function() {
		// Search all fields
		// Return all fields
		// Return more than one contact
		var fields = ['*'];
		var options = {
			filter: $( '#txtLast' ).attr( 'value' ),
			multiple: true
		};
		
		navigator.contacts.find( fields, function( contacts ) {
			// Only put the first record in the display fields
			$( '#txtFirst' ).attr( 'value', contacts[0].name.givenName );
			$( '#txtLast' ).attr( 'value', contacts[0].name.familyName );
			$( '#txtEmail' ).attr( 'value', contacts[0].emails[0].value );
			$( '#txtMobile' ).attr( 'value', contacts[0].phoneNumbers[0].value );			
		}, function( error ) {
			console.log( 'Error' );
		}, 
		options );
	} );

} );