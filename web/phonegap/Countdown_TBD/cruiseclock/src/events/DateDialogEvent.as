package events
{
	import flash.events.Event;
	
	public class DateDialogEvent extends Event
	{
		public static const CANCEL:String = "cancel";
		public static const SET:String = "set";		
		
		public var debarcation:Date = null;
		
		public function DateDialogEvent( type:String, bubbles:Boolean = false, cancelable:Boolean = false )
		{
			super( type, bubbles, cancelable );
		}
		
		override public function clone():Event
		{
			return new DateDialogEvent( type, bubbles, cancelable );
		}
	}
}