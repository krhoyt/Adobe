package 
{
	import flash.events.Event;
	
	public class SpinnerEvent extends Event
	{
		public static const SPINNER_STOPPED:String = "spinnerStopped";
		
		public function SpinnerEvent( type:String, bubbles:Boolean = false, cancelable:Boolean = false )
		{
			super( type, bubbles, cancelable );
		}
		
		override public function clone():Event
		{
			return new SpinnerEvent( type, bubbles, cancelable );
		}
	}
}