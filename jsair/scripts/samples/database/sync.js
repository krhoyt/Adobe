$( document ).ready( function() {
							  
	$( '#createdb' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		
		if( dbfile.exists )
		{
			dbfile.deleteFile();	
		}
		
		conn.open( dbfile, air.SQLMode.CREATE );
		
		alert( 'Database file created at:\n' + dbfile.nativePath );
	} );
	
	$( '#checktbl' ).click( function( e ) {
		var dbfile = air.File.desktopDirectory;
		var exists = true;
	
		dbfile.addEventListener( air.Event.SELECT, function( e ) {
			var conn = new air.SQLConnection();
			var stmt = new air.SQLStatement();
			
			conn.open( e.target );
			
			try {
				conn.loadSchema( null, 'person' );				
			} catch( e ) {
				exists = false;				
			}
			
			if( exists ) 
			{
				alert( 'The table "person" exists.' );
			} else {
				alert( 'The table "person" does not exist.' );				
			}
		} );
		dbfile.browseForOpen( 'Select the Database File' );
	} );
	
	$( '#createtbl' ).click( function( e ) {
		var conn = new air.SQLConnection();	
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var fail = false;
		var stmt = new air.SQLStatement();
		
		conn.open( dbfile, air.SQLMode.CREATE );
		
		stmt.sqlConnection = conn;
		stmt.text = 'CREATE TABLE person ( id INTEGER PRIMARY KEY, name TEXT )';
		
		try {
			stmt.execute();
		} catch( e ) {
			fail = true;
		}
		
		if( fail )
		{	
			alert( 'The table "person" already exists in:\n' + dbfile.nativePath );
		} else {
			alert( 'The table "person" has been created in:\n' + dbfile.nativePath );
		}
	} );	
	
	$( '#filltbl' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var exists = true;
		var stmt = new air.SQLStatement();

		conn.open( dbfile, air.SQLMode.CREATE );
		stmt.sqlConnection = conn;
	
		try {
			conn.loadSchema( null, 'person' );				
		} catch( e ) {
			exists = false;				
		}		
		
		if( !exists )
		{
			stmt.text = 'CREATE TABLE person ( id INTEGER PRIMARY KEY, name TEXT )';
			stmt.execute();
		}
		
		stmt.text = 'INSERT INTO person VALUES ( ?, ? )';
		stmt.parameters[0] = null;
		stmt.parameters[1] = 'Adobe AIR';
		
		for( var p = 0; p < 10; p++ )
		{
			stmt.execute();	
		}
		
		alert( 'Ten "person" records have been created at:\n' + dbfile.nativePath );
	} );
	
	$( '#readrecs' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var exists = true;
		var mess = '';
		var result = null;
		var stmt = new air.SQLStatement();

		conn.open( dbfile, air.SQLMode.CREATE );
		stmt.sqlConnection = conn;
	
		try {
			conn.loadSchema( null, 'person' );				
		} catch( e ) {
			exists = false;				
		}		
		
		if( !exists )
		{
			stmt.text = 'CREATE TABLE person ( id INTEGER PRIMARY KEY, name TEXT )';
			stmt.execute();

			stmt.text = 'INSERT INTO person VALUES ( ?, ? )';
			stmt.parameters[0] = null;
			stmt.parameters[1] = 'Adobe AIR';
			
			for( var p = 0; p < 10; p++ )
			{
				stmt.execute();	
			}
		}
		
		stmt.clearParameters();
		stmt.text = 'SELECT * FROM person';
		stmt.execute();
		
		result = stmt.getResult();
	
		if( result.data != null )
		{
			for( var p = 0; p < result.data.length; p++ )
			{
				mess += '{id: ' + result.data[p].id + ', name: ' + result.data[p].name + '}\n';
			}

			mess += '\nAre the "person" records in:\n' + dbfile.nativePath;

			alert( mess );
		} else {
			alert( 'There is no "person" data.' );	
		}
	} );
	
	$( '#readrec' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var exists = true;
		var result = null;
		var stmt = new air.SQLStatement();

		conn.open( dbfile, air.SQLMode.CREATE );
		stmt.sqlConnection = conn;
	
		try {
			conn.loadSchema( null, 'person' );				
		} catch( e ) {
			exists = false;				
		}		
		
		if( !exists )
		{
			stmt.text = 'CREATE TABLE person ( id INTEGER PRIMARY KEY, name TEXT )';
			stmt.execute();

			stmt.text = 'INSERT INTO person VALUES ( ?, ? )';
			stmt.parameters[0] = null;
			stmt.parameters[1] = 'Adobe AIR';
			
			for( var p = 0; p < 10; p++ )
			{
				stmt.execute();	
			}
		}
		
		stmt.clearParameters();
		stmt.text = 'SELECT COUNT( * ) AS total FROM person';
		stmt.execute();
		
		result = stmt.getResult();
		
		if( result.data[0].total == 0 )
		{
			alert( 'There are no "person" records in:\n' + dbfile.nativePath );				
			return;
		}
		
		stmt.text = 'SELECT MIN( id ) AS id, name FROM person';
		stmt.execute();
		
		result = stmt.getResult();	

		alert( 'The first "person" record is:\n\n{id: ' + 
			   result.data[0].id + 
			   ', name: ' + 
			   result.data[0].name + 
			   '}\n\nIn the database at:\n' +
			   dbfile.nativePath );
	} );	
	
	$( '#updaterec' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var exists = true;
		var key = 0;
		var name = '';
		var previous = '';
		var result = null;
		var stmt = new air.SQLStatement();

		conn.open( dbfile, air.SQLMode.CREATE );
		stmt.sqlConnection = conn;
	
		try {
			conn.loadSchema( null, 'person' );				
		} catch( e ) {
			exists = false;				
		}		
		
		if( !exists )
		{
			stmt.text = 'CREATE TABLE person ( id INTEGER PRIMARY KEY, name TEXT )';
			stmt.execute();

			stmt.text = 'INSERT INTO person VALUES ( ?, ? )';
			stmt.parameters[0] = null;
			stmt.parameters[1] = 'Adobe AIR';
			
			for( var p = 0; p < 10; p++ )
			{
				stmt.execute();	
			}
		}
		
		stmt.clearParameters();
		stmt.text = 'SELECT COUNT( * ) AS total FROM person';
		stmt.execute();
		
		result = stmt.getResult();

		if( result.data[0].total == 0 )
		{
			alert( 'There are no "person" records in:\n' + dbfile.nativePath );				
			return;
		}
		
		stmt.text = 'SELECT MIN( id ) AS id, name FROM person';
		stmt.execute();
		
		result = stmt.getResult();
		
		key = result.data[0].id;
		name = result.data[0].name;
		previous = '{id: ' + key + ', name: ' + name + '}';

		stmt.text = 'UPDATE person SET name = ? WHERE id = ?';
		
		if( name == 'Adobe AIR' )
		{
			stmt.parameters[0] = 'JavaScript';
			name = 'JavaScript';
		} else {
			stmt.parameters[0] = 'Adobe AIR';
			name = 'Adobe AIR';			
		}

		stmt.parameters[1] = key;		
		stmt.execute();

		alert( 'The first "person" record of:\n' + 
			   previous + 
			   '\n\nWas changed to:\n{id: ' + 
			   key + 
			   ', name: ' + 
			   name + 
			   '}\n\nIn the database at:\n' +
			   dbfile.nativePath );
	} );
	
	$( '#deleterec' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var exists = true;
		var key = 0;
		var previous = '';
		var result = null;
		var stmt = new air.SQLStatement();

		conn.open( dbfile, air.SQLMode.CREATE );
		stmt.sqlConnection = conn;
	
		try {
			conn.loadSchema( null, 'person' );				
		} catch( e ) {
			exists = false;				
		}		
		
		if( !exists )
		{
			stmt.text = 'CREATE TABLE person ( id INTEGER PRIMARY KEY, name TEXT )';
			stmt.execute();

			stmt.text = 'INSERT INTO person VALUES ( ?, ? )';
			stmt.parameters[0] = null;
			stmt.parameters[1] = 'Adobe AIR';
			
			for( var p = 0; p < 10; p++ )
			{
				stmt.execute();	
			}
		}
		
		stmt.clearParameters();
		stmt.text = 'SELECT COUNT( * ) AS total FROM person';
		stmt.execute();
		
		result = stmt.getResult();

		if( result.data[0].total == 0 )
		{
			alert( 'There are no "person" records in:\n' + dbfile.nativePath );				
			return;
		}
		
		stmt.text = 'SELECT MIN( id ) AS id, name FROM person';
		stmt.execute();	

		result = stmt.getResult();
		
		key = result.data[0].id;
		previous = '{id: ' + result.data[0].id + ', name: ' + result.data[0].name + '}';

		stmt.text = 'DELETE FROM person WHERE id = ?';
		stmt.parameters[0] = key;		
		stmt.execute();

		alert( 'The record:\n' + 
			   previous + 
			   '\n\nWas removed from the database at:\n' +
			   dbfile.nativePath );
	} );
	
	$( '#deleteall' ).click( function( e ) {
		var conn = new air.SQLConnection();				 
		var dbfile = air.File.desktopDirectory.resolvePath( 'contacts.db' );
		var exists = true;
		var key = 0;
		var previous = '';
		var result = null;
		var stmt = new air.SQLStatement();

		conn.open( dbfile, air.SQLMode.CREATE );
		stmt.sqlConnection = conn;
	
		try {
			conn.loadSchema( null, 'person' );				
		} catch( e ) {
			exists = false;				
		}		

		if( exists )
		{
			stmt.text = 'DELETE FROM person';
			stmt.execute();
			
			alert( 'All records have been removed from:\n' + dbfile.nativePath );
		} else {
			alert( 'The table "person" does not exist.' );	
		}
	} );	
	
} );