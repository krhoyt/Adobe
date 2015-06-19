package
{
	import flash.events.Event;
	
	public class ScanEvent extends Event 
	{
		public static const SCAN:String = "scan";
		public static const REGISTER:String = "register";		
		
		public var barcode:String = null;
		public var isbn:String = null;
		
		public function ScanEvent( type:String, barcode:String ) 
		{
			super( type );

			this.barcode = barcode;
		}

		override public function clone():Event {
			return new ScanEvent( type, barcode );
		}
	}
}