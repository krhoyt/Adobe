package 
{
	import flash.events.Event;
	
	public class CalendarEvent extends Event
	{
		public static const DATE_CHANGED:String = "dateChanged";
		
		public var date:Date = null;
		
		public function CalendarEvent( type:String, bubbles:Boolean = false, cancelable:Boolean = false )
		{
			super( type, bubbles, cancelable );
		}
		
		override public function clone():Event
		{
			return new CalendarEvent( type, bubbles, cancelable );
		}
	}
}