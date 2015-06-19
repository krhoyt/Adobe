package comp
{
	import flash.display.Sprite;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	
	import images.Colon;
	
	public class Clock extends Sprite
	{
		public static const MILLIS_DAY:Number = 86400000;
		public static const MILLIS_HOUR:Number = 3600000;
		public static const MILLIS_MINUTE:Number = 60000;
		
		private var debarcation:Date = null;
		
		private var dayhundred:Digit = null;
		private var dayten:Digit = null;
		private var dayone:Digit = null;
		private var daycolon:Colon = null;
		
		private var hourten:Digit = null;
		private var hourone:Digit = null;
		private var hourcolon:Colon = null;
		
		private var minuteten:Digit = null;
		private var minuteone:Digit = null;
		private var minutecolon:Colon = null;
		
		private var secondten:Digit = null;
		private var secondone:Digit = null;
		
		private var timer:Timer = null;
		
		public function Clock()
		{
			super();
			init();
		}
		
		private function clear():void
		{
			dayhundred.value = 0;
			dayten.value = 0;
			dayone.value = 0;
			
			hourten.value = 0;
			hourone.value = 0;			
			
			minuteten.value = 0;
			minuteone.value = 0;						
			
			secondten.value = 0;
			secondone.value = 0;			
		}
		
		private function init():void
		{
			var now:Date = null;
			
			dayhundred = new Digit();
			addChild( dayhundred );
			
			dayten = new Digit();
			dayten.x = 78;
			addChild( dayten );
			
			dayone = new Digit();
			dayone.x = 156;
			addChild( dayone );
			
			daycolon = new Colon();
			daycolon.x = 231;
			daycolon.y = 6;
			addChild( daycolon );
			
			hourten = new Digit();
			hourten.x = 259;
			addChild( hourten );
			
			hourone = new Digit();
			hourone.x = 337;
			addChild( hourone );
			
			hourcolon = new Colon();
			hourcolon.x = 412;
			hourcolon.y = 6;
			addChild( hourcolon );			
			
			minuteten = new Digit();
			minuteten.x = 440;
			addChild( minuteten );
			
			minuteone = new Digit();
			minuteone.x = 518;
			addChild( minuteone );			
			
			minutecolon = new Colon();
			minutecolon.x = 593;
			minutecolon.y = 6;
			addChild( minutecolon );			
			
			secondten = new Digit();
			secondten.x = 621;
			addChild( secondten );
			
			secondone = new Digit();
			secondone.x = 699;
			addChild( secondone );	
			
			now = new Date();
			
			debarcation = new Date( 2012, 3, 29, 21, 0, 0 );
			debarcation.minutes = debarcation.minutes - debarcation.timezoneOffset;
			
			if( now.time > debarcation.time )
			{
				clear();
			} else {
				update();
				
				timer = new Timer( 1000 );
				timer.addEventListener( TimerEvent.TIMER, doTimer );
				timer.start();				
			}
		}
		
		public function pad( value:String, length:Number ):String
		{
			while( value.length < length )
			{
				value = "0" + value;
			}
			
			return value;
		}
		
		public function update():void
		{
			var now:Date = new Date();			
			var delta:Number = 0;
			var days:Number = 0;
			var hours:Number = 0;
			var minutes:Number = 0;
			var seconds:Number = 0;
			var combo:String = null;
			
			delta = debarcation.time - now.time;			
			
			days = Math.floor( delta / MILLIS_DAY );
			delta = delta - ( days * MILLIS_DAY );
			
			hours = Math.floor( delta / MILLIS_HOUR );
			delta = delta - ( hours * MILLIS_HOUR );			
			
			minutes = Math.floor( delta / MILLIS_MINUTE );
			delta = delta - ( minutes * MILLIS_MINUTE );
			
			seconds = Math.floor( delta / 1000 );
			delta = delta - ( seconds * 1000 );			
			
			combo = pad( days.toString(), 3 ) + 
				pad( hours.toString(), 2 ) + 
				pad( minutes.toString(), 2 ) + 
				pad( seconds.toString(), 2 );
			
			dayhundred.value = parseInt( combo.substr( 0, 1 ) );
			dayten.value = parseInt( combo.substr( 1, 1 ) );
			dayone.value = parseInt( combo.substr( 2, 1 ) );
			
			hourten.value = parseInt( combo.substr( 3, 1 ) );
			hourone.value = parseInt( combo.substr( 4, 1 ) );			
			
			minuteten.value = parseInt( combo.substr( 5, 1 ) );
			minuteone.value = parseInt( combo.substr( 6, 1 ) );						
			
			secondten.value = parseInt( combo.substr( 7, 1 ) );
			secondone.value = parseInt( combo.substr( 8, 1 ) );			
		}
		
		protected function doTimer( event:TimerEvent ):void
		{
			update();						
		}
	}
}