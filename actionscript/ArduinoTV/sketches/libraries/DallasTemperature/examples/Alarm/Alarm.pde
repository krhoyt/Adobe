#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2
#define TEMPERATURE_PRECISION 9

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

// arrays to hold device addresses
uint8_t insideThermometer[8], outsideThermometer[8];

void setup(void)
{
  // start serial port
  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");

  // Start up the library
  sensors.begin();
  
  // locate devices on the bus
  Serial.print("Locating devices...");
  Serial.print("Found ");
  Serial.print(sensors.getDeviceCount(), DEC);
  Serial.println(" devices.");

  // search for devices on the bus and assign based on an index.  ideally,
  // you would do this to initially discover addresses on the bus and then 
  // use those addresses and manually assign them (see above) once you know 
  // the devices on your bus (and assuming they don't change).
  if (!sensors.getAddress(insideThermometer, 0)) Serial.println("Unable to find address for Device 0"); 
  if (!sensors.getAddress(outsideThermometer, 1)) Serial.println("Unable to find address for Device 1"); 

  // show the addresses we found on the bus
  Serial.print("Device 0 Address: ");
  printAddress(insideThermometer);
  Serial.println();

  Serial.print("Device 0 Alarms: ");
  printAlarms(insideThermometer);
  Serial.println();
  
  Serial.print("Device 1 Address: ");
  printAddress(outsideThermometer);
  Serial.println();

  Serial.print("Device 1 Alarms: ");
  printAlarms(outsideThermometer);
  Serial.println();
  
  Serial.println("Setting alarm temps...");

  // alarm when temp is higher than 30C
  sensors.setHighAlarmTemp(insideThermometer, 30);
  
  // alarm when temp is lower than -10C
  sensors.setLowAlarmTemp(insideThermometer, -10);
  
  // alarm when temp is higher than 31C
  sensors.setHighAlarmTemp(outsideThermometer, 31);
  
  // alarn when temp is lower than 27C
  sensors.setLowAlarmTemp(outsideThermometer, 27);
  
  Serial.print("New Device 0 Alarms: ");
  printAlarms(insideThermometer);
  Serial.println();
  
  Serial.print("New Device 1 Alarms: ");
  printAlarms(outsideThermometer);
  Serial.println();
}

// function to print a device address
void printAddress(uint8_t deviceAddress[])
{
  for (uint8_t i = 0; i < 8; i++)
  {
    Serial.print(deviceAddress[i], HEX);
    if (i < 7) Serial.print(" ");
  }
}

// function to print the temperature for a device
void printTemperature(uint8_t deviceAddress[])
{
  // method 1 - slower
  //Serial.print("Temp C: ");
  //Serial.print(sensors.getTempC(deviceAddress));
  //Serial.print(" Temp F: ");
  //Serial.print(sensors.getTempF(deviceAddress));

  // method 2 - faster
  float tempC = sensors.getTempC(deviceAddress);
  Serial.print("Temp C: ");
  Serial.print(tempC);
  Serial.print(" Temp F: ");
  Serial.print(DallasTemperature::toFahrenheit(tempC));
}

void printAlarms(uint8_t deviceAddress[])
{
  char temp;
  temp = sensors.getHighAlarmTemp(deviceAddress);
  Serial.print("High Alarm: ");
  Serial.print(temp, DEC);
  Serial.print("C/");
  Serial.print(DallasTemperature::toFahrenheit(temp));
  Serial.print("F | Low Alarm: ");
  temp = sensors.getLowAlarmTemp(deviceAddress);
  Serial.print(temp, DEC);
  Serial.print("C/");
  Serial.print(DallasTemperature::toFahrenheit(temp));
  Serial.print("F");
}

// main function to print information about a device
void printData(uint8_t deviceAddress[])
{
  Serial.print("Device Address: ");
  printAddress(deviceAddress);
  Serial.print(" ");
  printTemperature(deviceAddress);
  Serial.println();
}

void checkAlarm(uint8_t deviceAddress[])
{
  if (sensors.hasAlarm(deviceAddress))
  {
    Serial.print("ALARM: ");
    printData(deviceAddress);
  }
}

void loop(void)
{ 
  // call sensors.requestTemperatures() to issue a global temperature 
  // request to all devices on the bus
  Serial.print("Requesting temperatures...");
  sensors.requestTemperatures();
  Serial.println("DONE");

  // check each address individually for an alarm condition
  checkAlarm(insideThermometer);
  checkAlarm(outsideThermometer);

/*
  // Alternate method:
  // Search the bus and iterate through addresses of devices with alarms
  
  // space for the alarm device's address
  uint8_t alarmAddr[8];

  Serial.println("Searching for alarms...");
  
  // resetAlarmSearch() must be called before calling alarmSearch()
  sensors.resetAlarmSearch();
  
  // alarmSearch() returns false when there are no devices with alarms
  while (sensors.alarmSearch(alarmAddr))
  {
    Serial.print("ALARM: ");
    printData(alarmAddr);
  }
*/

}

