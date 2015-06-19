package 
{
	import flash.display.BitmapData;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.media.Camera;
	import flash.media.Video;
	import flash.net.FileReference;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.utils.ByteArray;

	[SWF( frameRate="30", backgroundColor="0xFFFFFF" )]
	public class TiffCapture extends Sprite
	{
		public var screen:Sprite = null;
		public var label:TextField = null;
		public var webcam:Video = null;
		
		public function TiffCapture()
		{
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		public function layout():void
		{
			webcam.x = ( stage.stageWidth - webcam.width ) / 2;
			webcam.y = ( stage.stageHeight - webcam.height ) / 2;
			
			label.x = ( stage.stageWidth - label.width ) / 2;
			label.y = webcam.y - label.height - 2;
			
			screen.graphics.clear();
			screen.graphics.lineStyle( 1, 0xFF0000, 0, true );
			screen.graphics.beginFill( 0xFF0000, 0 );
			screen.graphics.drawRect( 0, 0, webcam.width, webcam.height );
			screen.graphics.endFill();
			screen.x = webcam.x;
			screen.y = webcam.y;
		}
		
		public function doAdded( event:Event ):void
		{
			var camera:Camera = Camera.getCamera();
			
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
			
			label = new TextField();
			label.type = TextFieldType.DYNAMIC;
			label.defaultTextFormat = new TextFormat( "Verdana", 11, 0x0B333C );
			label.autoSize = TextFieldAutoSize.RIGHT;
			label.selectable = false;			
			label.text = "(click web camera view to capture)";
			addChild( label );
			
			camera.setMode( 320, 240, 30 );
			
			webcam = new Video( 320, 240 );
			webcam.attachCamera( camera );
			addChild( webcam );

			screen = new Sprite();
			screen.addEventListener( MouseEvent.CLICK, doCapture );
			addChild( screen );

			stage.addEventListener( Event.RESIZE, doResize );
			layout();
		}
		
		public function doCapture( event:MouseEvent ):void
		{
			var bmp:BitmapData = new BitmapData( webcam.width, webcam.height );
			var img:ByteArray = null;
			var file:FileReference = new FileReference();

			bmp.draw( webcam );
			
			file.save( TiffEncoder.encode( bmp ), "webcamera.tif" );
		}
		
		public function doResize( event:Event ):void
		{
			layout();
		}
	}
}