function byte( contents, offset )
{
	return contents.slice( offset, offset + 1 );
}

function integer( contents, endian, offset )
{
	var value = 0;
	
	if( endian == 'big' ) 
	{
		value = ( contents.charCodeAt( offset ) << 24 ) | 
				( contents.charCodeAt( offset + 1 ) << 16 ) | 
				( contents.charCodeAt( offset + 2 ) << 8 ) | 
				( 0xFF & contents.charCodeAt( offset + 3 ) );		
	} else {
		value = ( contents.charCodeAt( offset + 3 ) << 24 ) | 
				( contents.charCodeAt( offset + 2 ) << 16 ) | 
				( contents.charCodeAt( offset + 1 ) << 8 ) | 
				( 0xFF & contents.charCodeAt( offset ) );	
	}
	
	return value;	
}

function rational( contents, endian, offset )
{
	var denominator = integer( contents, endian, offset );
	var numerator = null;
	
	offset = offset + 4;
	
	numerator = integer( contents, endian, offset );
	
	return denominator / numerator;
}

function short( contents, endian, offset )
{
	var value = null;
	
	if( endian == 'big' )
	{
		value = ( ( contents.charCodeAt( offset ) << 8 ) | ( contents.charCodeAt( offset + 1 ) & 0xFF ) );
	} else {
		value = ( ( contents.charCodeAt( offset + 1 ) << 8 ) | ( contents.charCodeAt( offset ) & 0xFF ) );	
	}
	
	return  value;	
}

function signedInteger()
{
	
}

function signedRational()
{
	
}