<?php

// Thanks to the following content for pointers
// Query String - http://ditio.net/2008/06/12/php-query-string/
// CURL POST - http://davidwalsh.name/curl-post
// HTTPS and SSL - http://unitstep.net/blog/2009/05/05/using-curl-in-php-to-access-https-ssltls-protected-sites/

// Imp address
// Values to be passed
// URL to Imp passed in from XHR request
// $url = 'https://api.electricimp.com/v1/134045bb5c6addca/30d2dcd967a157ea';
$fields = array(
	'value' => $_POST['value']
);

// Stringify the URL
foreach( $fields as $key => $value ) 
{ 
	$fields_string .= $key . '=' . $value . '&'; 
}

// Trim that last "&" symbol
rtrim( $fields_string, '&' );

// Create the request
$request = curl_init();

// Set the parameters
// Do not verify SSL peer
// Imp address is HTTPS
curl_setopt( $request, CURLOPT_URL, $_POST['url'] );
curl_setopt( $request, CURLOPT_POST, count( $fields ) );
curl_setopt( $request, CURLOPT_POSTFIELDS, $fields_string );
curl_setopt( $request, CURLOPT_SSL_VERIFYPEER, false );

// Execute the request
// Get the response
$response = curl_exec( $request );

// Close the connection
curl_close( $request );

// Show the response for informational purposes
echo $response

?>