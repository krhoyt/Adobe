<?php

// May need to adjust settings on the port
// exec( "mode /dev/cu.usbmodem411: BAUD=9600 PARITY=N data=8 stop=1 xon=off" );

// Open the USB port
$fp = fopen( "/dev/cu.usbmodem621", "w" );

// Make sure it worked before writing instructions
if( !$fp ) 
{
    echo "Could not access USB device.\n";
} else {
	// Write the instructions from the query string
	// Close the USB port connection
    fwrite( $fp, $_GET["action"] );
	fclose( $fp );
}

?>