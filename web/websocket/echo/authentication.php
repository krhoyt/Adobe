<?php
require( 'lib/Pusher.php' );

$app_id = '23843';
$app_key = 'b8b884ca6cde9b60a4bc';
$app_secret = '89139de3be5688c4f68d';

$pusher = new Pusher( $app_key, $app_secret, $app_id );
echo $pusher -> socket_auth( $_POST['channel_name'], $_POST['socket_id'] );
?>