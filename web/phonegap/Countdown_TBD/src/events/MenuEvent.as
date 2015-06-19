package events
{
	import flash.events.Event;
	
	public class MenuEvent extends Event
	{
		public static const SPEEDO_ENABLE:String = "speedoEnable";
		public static const SPEEDO_DISABLE:String = "speedoDisable";
		
		public function MenuEvent( type:String, bubbles:Boolean = false, cancelable:Boolean = false )
		{
			super( type, bubbles, cancelable );
		}
		
		override public function clone():Event
		{
			return new MenuEvent( type, bubbles, cancelable );
		}
	}
}