package
{
	import comps.SmoothList;
	import comps.VirtualList;
	
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.filesystem.File;
	import flash.filesystem.FileMode;
	import flash.filesystem.FileStream;
	import flash.ui.Multitouch;
	import flash.ui.MultitouchInputMode;
	
	import images.SearchBar;
	import images.TitleBar;
	
	import renderers.AndroidLineItem;
	import renderers.JobTitleItem;
	
	[SWF( width="480", height="816" )]
	public class FrigginLasers extends Sprite
	{
		// Test data file with 6,000+ job titles
		public static const JOB_TITLES:String = "job-titles.txt";
		
		private var search:SearchBar = null;
		private var title:TitleBar = null;
		private var list:SmoothList = null;
		
		// Constructor
		public function FrigginLasers()
		{
			super();
			init();
		}
		
		private function init():void
		{
			var items:Array = new Array();
			var file:File = File.applicationDirectory.resolvePath( JOB_TITLES );
			var stream:FileStream = new FileStream();
			var jobs:String = null;
			
			// Let the application handle scaling
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
		
			// Use device gestures over mouse events
			Multitouch.inputMode = MultitouchInputMode.TOUCH_POINT;
						
			/*
			// iOS chrome
			title = new TitleBar();
			addChild( title );
			
			search = new SearchBar();
			search.y = 88;
			addChild( search );
			*/
			
			// Read sample data
			stream.open( file, FileMode.READ );
			jobs = stream.readMultiByte( stream.bytesAvailable, File.systemCharset );
			stream.close();
			stream = null;
			file = null;
			
			// Split data into array
			items = jobs.split( "\n" );			
			
			// Create list component
			
			// iOS list
			// list = new SmoothList( JobTitleItem, items, 88, 640, 744 );
			
			// Android list
			// Renderer, data, row height, list width, list height
			list = new SmoothList( AndroidLineItem, items.slice( 0, 100 ), 97, 480, 816 );
			
			// Test resizing
			// Can be done on the constructor
			// list.setSize( 640, 744 );
			
			// Position and add list to stage
			// list.y = 176;
			addChild( list );
		}
	}
}