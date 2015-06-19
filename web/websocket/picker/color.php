<?php

if( $_SERVER["REQUEST_METHOD"] == "GET" )
{
	$file = fopen( "color.txt", "r" ) or die( "Cannot open file." );
	$contents = fread( $file, filesize( "color.txt" ) );
	fclose( $file );	
	
	echo $contents;	
} else if( $_SERVER["REQUEST_METHOD"] == "POST" ) {
	$file = fopen( "color.txt", "w" ) or die( "Cannot open file." );
	fwrite( $file, $_POST["color"] );
	fclose( $file );	
	
	echo "Success";
} else {
	echo "Unrecognized method";	
}

?>