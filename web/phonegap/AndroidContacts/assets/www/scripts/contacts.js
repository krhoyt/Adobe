document.addEventListener( 'deviceready', function() {
	document
		.querySelector( '#btnCreate' )
		.addEventListener( 'touchstart', function() {	
		var contact = null;
		var email = null;
		var first = null;
		var last = null;
		var mobile = null;
		var name = null;
		
		first = document.querySelector( '#txtFirst' ).value;
		last = document.querySelector( '#txtLast' ).value;
		email = document.querySelector( '#txtEmail' ).value;
		mobile = document.querySelector( '#txtMobile' ).value;				

		contact = navigator.contacts.create()						
		contact.displayName = first + ' ' + last;
		contact.nickname = first + ' ' + last;
		
		name = new ContactName();
		name.givenName = first;
		name.familyName = last;
		contact.name = name;
			
		contact.emails = [
			new ContactField( 'home', email, false )
		];
		contact.phoneNumbers = [
			new ContactField( 'mobile', mobile, false )
		];
				
		contact.save( function() {
			// Success indicated by clearing out of the fields
			// Unable to set attribute value using DOM elements
			$( '#txtFirst' ).attr( 'value', '' );
			$( '#txtLast' ).attr( 'value', '' );
			$( '#txtEmail' ).attr( 'value', '' );
			$( '#txtMobile' ).attr( 'value', '' );
		}, function ( error ) {
			alert( 'Contact not saved: ' + error.code );
		} );		
	} );
	
	document
		.querySelector( '#btnFind' )
		.addEventListener( 'touchstart', function() {
		// Search all fields
		// Return all fields
		// Return more than one contact
		var fields = ['*'];
		var options = {
			filter: document.querySelector( '#txtLast' ).value,
			multiple: true
		};
		
		navigator.contacts.find( fields, function( contacts ) {
			// Only put the first record in the display fields
			// Unable to set attribute value using DOM elements
			$( '#txtFirst' ).attr( 'value', contacts[0].name.givenName );
			$( '#txtLast' ).attr( 'value', contacts[0].name.familyName );
			$( '#txtEmail' ).attr( 'value', contacts[0].emails[0].value );
			$( '#txtMobile' ).attr( 'value', contacts[0].phoneNumbers[0].value );			
		}, function( error ) {
			alert( 'Problem finding contact: ' + error.code );
		}, 
		options );			
	} );
} );