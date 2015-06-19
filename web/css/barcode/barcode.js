var MIDDLE_SEPARATOR = '01010';
var MODULE_DIGITS = 7;
var MODULE_WIDTH = 2;
var QUIET_ZONE = 20;
var START_END = '101';

var EAN_CODES = [
	'LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
	'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'
];
var G_CODES = [
	'0100111', '0110011', '0011011', '0100001', '0011101',
	'0111001', '0000101', '0010001', '0001001', '0010111'
];
var UPC_CODES = [
	'0001101', '0011001', '0010011', '0111101', '0100011',
	'0110001', '0101111', '0111011', '0110111', '0001011'
];

function ean( value )
{
	var binary = null;
	var digit = null;
	var letter = null;
	var pattern = null;

	digit = parseInt( value.charAt( 0 ) );
	pattern = EAN_CODES[digit];
	
	binary = START_END;
	
	for( var c = 1; c < value.length; c++ )
	{
		if( c <= pattern.length ) 
		{
			letter = pattern.charAt( c - 1 );
			digit = parseInt( value.charAt( c ) );
			
			if( letter == 'L' )
			{
				binary = binary + UPC_CODES[digit];
			} else {
				binary = binary + G_CODES[digit];
			}
		} else {
			if( c == 7 ) 
			{
				binary = binary + MIDDLE_SEPARATOR;	
			}
			
			digit = parseInt( value.charAt( c ) );
			binary = binary + negation( UPC_CODES[digit] );
		}
	}
	
	binary = binary + START_END;
	generate( binary );
}

function generate( value )
{
	var digit = null;
	var element = null;
	var sticker = document.querySelector( '#barcode' );
	
	for( c = 0; c < value.length; c++ )
	{
		element = document.createElement( 'div' );
		element.style.left = QUIET_ZONE + ( c * MODULE_WIDTH );	
		
		digit = parseInt( value.charAt( c ) );
		
		if( digit == 1 )
		{
			element.className = 'bar';				
		} else {
			element.className = 'space';				
		}

		sticker.appendChild( element );
	}		
	
	sticker.style.width = 
		QUIET_ZONE + 
		( sticker.childNodes.length * MODULE_WIDTH ) +
		QUIET_ZONE;
		
	element = document.createElement( 'div' );
	element.className = 'barcode-label';
	element.innerHTML = '9780596515195';
	
	sticker.appendChild( element );
}

function negation( value )
{
	var digit = null;
	var result = new String();
	
	for( var c = 0; c < value.length; c++ )
	{
		digit = parseInt( value.charAt( c ) );
		
		if( digit == 0 ) 
		{
			result = result + '1';
		} else {
			result = result + '0';
		}
	}
	
	return result;
}

function upc( value )
{
	var binary = null;
	var digit = null;

	binary = START_END;
	
	for( var c = 0; c < value.length; c++ )
	{
		if( c == 6 )
		{
			binary = binary + MIDDLE_SEPARATOR;
		}
		
		digit = parseInt( value.charAt( c ) );
		
		if( c >= 6 )
		{
			binary = binary + negation( UPC_CODES[digit] );	
		} else {
			binary = binary + UPC_CODES[digit];			
		}
	}
	
	binary = binary + START_END;
	generate( binary );
}