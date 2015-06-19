#include <WiShield.h>

#define WIRELESS_MODE_INFRA	1
#define WIRELESS_MODE_ADHOC	2

// Wireless configuration parameters
unsigned char local_ip[] = {10,0,1,5};	        // IP address of WiShield
unsigned char gateway_ip[] = {192,168,15,1};	// Router or gateway IP address
unsigned char subnet_mask[] = {255,255,255,0};	// Subnet mask for the local network
const prog_char ssid[] PROGMEM = {"Hoyt"};		// Maximum 32 bytes

// 0 - open
// 1 - WEP
// 2 - WPA
// 3 - WPA2
unsigned char security_type = 3;

// WPA/WPA2 passphrase
// Maximum 64 characters
const prog_char security_passphrase[] PROGMEM = {"Paige123"};	// max 64 characters

// WEP 128-bit keys
prog_uchar wep_keys[] PROGMEM = {	0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,	// Key 0
									0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	0x00,	// Key 1
									0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	0x00,	// Key 2
									0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	0x00	// Key 3
								};

// Setup the wireless mode
// Infrastructure - Connect to AP
// AdHoc - Connect to another WiFi device
unsigned char wireless_mode = WIRELESS_MODE_INFRA;

unsigned char ssid_len;
unsigned char security_passphrase_len;

// Setup
void setup()
{
	WiFi.init();
}

// Loop count
unsigned char loop_cnt = 0;

// Web site IP
char site_ip[] = {208,112,3,152};

// Web site HTTP GET request
const prog_char twitter[] PROGMEM = {"GET /wishield.cfm HTTP/1.1\r\nHost: www.kevinhoyt.org\r\n"};

// Loop construct
void loop()
{
	// Send the request on first iteration
	if( loop_cnt == 0 ) 
	{
		webclient_get( site_ip, 80, "/" );
		loop_cnt = 1;
	}
	
	WiFi.run();
}