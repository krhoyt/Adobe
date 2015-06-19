var alternate = [
	'11101100',
	'00010001'
];
var table = [
	{character: '0', value: 0},
	{character: '1', value: 1},
	{character: '2', value: 2},
	{character: '3', value: 3},
	{character: '4', value: 4},
	{character: '5', value: 5},
	{character: '6', value: 6},
	{character: '7', value: 7},				
	{character: '8', value: 8},
	{character: '9', value: 9},
	{character: 'A', value: 10},
	{character: 'B', value: 11},
	{character: 'C', value: 12},
	{character: 'D', value: 13},
	{character: 'E', value: 14},
	{character: 'F', value: 15},							
	{character: 'G', value: 16},
	{character: 'H', value: 17},
	{character: 'I', value: 18},
	{character: 'J', value: 19},
	{character: 'K', value: 20},
	{character: 'L', value: 21},
	{character: 'M', value: 22},
	{character: 'N', value: 23},				
	{character: 'O', value: 24},
	{character: 'P', value: 25},
	{character: 'Q', value: 26},
	{character: 'R', value: 27},
	{character: 'S', value: 28},
	{character: 'T', value: 29},
	{character: 'U', value: 30},
	{character: 'V', value: 31},
	{character: 'W', value: 32},
	{character: 'X', value: 33},
	{character: 'Y', value: 34},
	{character: 'Z', value: 35},
	{character: ' ', value: 36},
	{character: '$', value: 37},
	{character: '%', value: 38},
	{character: '*', value: 39},				
	{character: '+', value: 40},
	{character: '-', value: 41},
	{character: '.', value: 42},
	{character: '/', value: 43},
	{character: ':', value: 44}
];

function bin2dec( value )
{
	var current = null;
	var result = null;

	current = 128;
	result = new Number( value.charAt( 0 ) ) * current;

	for( var i = 1; i <= 7; i++ )
	{
		current = current / 2;
		result = result + ( eval( value.charAt( i ) ) * current );
	}	

	return result;
}

function encode( value )
{
	var result = null;
	
	for( var c = 0; c < value.length; c++ )
	{
		for( var t = 0; t < table.length; t++ )
		{
			if( value.charAt( c ) == table[t].character )
			{
				if( c == 0 )
				{
					result = 45 * table[t].value;
				} else {
					result = result + table[t].value;
				}
				
				break;
			}
		}
	}
	
	result = result.toString( 2 );
	result = pad( result, '0', 11 );
	
	return result;
}

function pad( value, marker, length )
{
	var result = null;
	
	result = new String( value );
	
	while( result.length < length )
	{
		result = marker + result;	
	}
	
	return result;
}

function qr( value )
{
	var binary = null;
	var count = null;
	var index = null;
	var letters = null;
	var mode = null;
	var terminator = null;
	var words = null;
	
	mode = '0010';
	binary = '0010';
	
	count = new Number( value.length );
	count = count.toString( 2 );
	count = pad( count, '0', 9 );
	binary = binary + count;
	
	letters = new Array();
	
	for( var p = 0; p < value.length; p = p + 2 )
	{
		letters.push( encode( value.substr( p, 2 ) ) );
		binary = binary + letters[letters.length - 1];
	}
	
	terminator = '0000';
	binary = binary + '0000';

	// Eight (8) bits even
	for( var b = ( binary.length % 8 ); b < 8; b++ )
	{
		binary = binary + '0';	
	}

	index = 0;

	// Nine (9) words
	// Per version and ECC table
	while( ( binary.length / 8 ) < 9 )
	{
		binary = binary + alternate[index % 2];
		index = index + 1;
	}

	words = new Array();
	
	// Convert binary words to decimal values
	for( var w = 0; w < binary.length; w = w + 8 )
	{
		words[w % 8] = binary.substr( w, 8 );
		words[w % 8] = bin2dec( words[w % 8] );
	}
}