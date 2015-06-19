function Entry( contents, tags, offset, start )
{
	// Constants
	this.TAG_TYPES = {
		1: {name: 'BYTE', size: 1},
		2: {name: 'ASCII', size: 1},
		3: {name: 'SHORT', size: 2},
		4: {name: 'LONG', size: 4},
		5: {name: 'RATIONAL', size: 8},
		7: {name: 'UNDEFINED', size: 1},
		9: {name: 'SLONG', size: 4},
		10: {name: 'SRATIONAL', size: 8}		
	}
	
	// Properties
	this.tagid = 0;
	this.tag = null;
	this.name = null;
	this.typeid = 0;
	this.type = null;
	this.data = null;
	this.numbered = 0;
	this.follow = 0;
	
	// Method
	this.content = content;
	
	// Work
	this.tagid = short( contents, exifinfo.endian, offset );
	offset = offset + 2;
	
	for( var t = 0; t < tags.length; t++ )
	{
		if( tags[t].id == this.tagid )
		{
			this.tag = tags[t];
			break;
		}
	}
	
	this.typeid = short( contents, exifinfo.endian, offset );
	offset = offset + 2;
	
	if( this.tag == null )
	{
		// alert( 'Unknown tag: ' + this.typeid + ' at ' + ( offset - 2 ) );		
	} else {
		this.name = this.tag.field;		
	}
	this.type = this.TAG_TYPES[this.typeid];

	this.numbered = integer( contents, exifinfo.endian, offset );
	offset = offset + 4;
	this.follow = offset + 4;
	
	if( !this.type )
	{
		// alert( 'Unrecognizable' );
		this.data = 'Unrecognizable';
	} else {
		if( ( this.numbered * this.type.size ) > 4 )
		{
			offset = integer( contents, exifinfo.endian, offset ) + start;
		}
		
		this.content( contents, offset );
	}
}

function content( contents, offset ) 
{
	switch( this.typeid )
	{
		case 1:
			this.data = byte( contents, offset );
			break;	
			
		case 2:
			this.data = contents.slice( offset, offset + this.numbered );
			break;
			
		case 3:
			this.data = new Array();
			
			for( var i = 0; i < this.numbered; i++ )
			{
				this.data.push( short( contents, exifinfo.endian, offset ) );
				offset = offset + 2;
			}
			
			break;
			
		case 4:
			this.data = new Array();
			
			for( var i = 0; i < this.numbered; i++ )
			{
				this.data.push( integer( contents, exifinfo.endian, offset ) );
				offset = offset + 4;
			}
			
			break;	
			
		case 5:
			this.data = new Array();
			
			for( var i = 0; i < this.numbered; i++ )
			{
				this.data.push( rational( contents, exifinfo.endian, offset ) );
				offset = offset + 8;
			}
			
			break;
			
		case 7:
			this.data = new Array();
			
			for( var i = 0; i < this.numbered; i++ )
			{
				this.data.push( byte( contents, offset ) );
				offset = offset + 1;
			}
			
			break;								
	}
	
	/*
	if( this.tag != null )
	{
		alert( this.tag.name + ': ' + this.data );		
	} else {
		alert( 'Unknown data: ' + this.data );	
	}
	*/
}