package events
{
	import flash.events.Event;
	
	public class DialEvent extends Event
	{
		public static const DIAL_END:String = "dialEnd";
		
		public function DialEvent( type:String, bubbles:Boolean = false, cancelable:Boolean = false )
		{
			super( type, bubbles, cancelable );
		}
		
		override public function clone():Event
		{
			return new DialEvent( type, bubbles, cancelable );
		}
	}
}