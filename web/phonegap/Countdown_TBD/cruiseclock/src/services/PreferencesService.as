package services
{
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;

	public class PreferencesService
	{
		public var debarcation:Date = null;
		
		public function PreferencesService()
		{
			super();
			init();
		}
		
		private function init():void
		{
			var prefs:File = null;
			var stream:FileStream = null;
			var content:String = null;
			
			prefs = File.userDirectory.resolvePath( "CruiseClock" );
			
			if( !prefs.exists )
			{
				prefs.createDirectory();
			}
			
			prefs = File.userDirectory.resolvePath( "CruiseClock/preferences.txt" );
			
			if( prefs.exists )
			{
				stream = new FileStream();
				stream.open( prefs, FileMode.READ );
				content = stream.readMultiByte( stream.bytesAvailable, File.systemCharset );
				stream.close();
				
				debarcation = new Date( new Number( content ) );
			}
		}
		
		public function storeDebarcation( value:Date ):void
		{
			var prefs:File = File.userDirectory.resolvePath( "CruiseClock/preferences.txt" );
			var stream:FileStream = new FileStream();
			
			stream.open( prefs, FileMode.WRITE );
			stream.writeMultiByte( value.time.toString(), File.systemCharset );
			stream.close();
		}
	}
}