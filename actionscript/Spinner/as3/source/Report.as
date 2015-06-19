package
{
	import flash.display.GradientType;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Matrix;
	import flash.net.FileReference;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.net.URLRequestMethod;
	import flash.net.URLVariables;
	
	public class Report extends Sprite
	{
		private var background:Shape = null;
		private var start:Calendar = null;
		private var end:Calendar = null;
		private var file:FileReference = null;
		private var generate:OuterButton = null;
		private var form:Sprite = null;
		private var tabs:TabBar = null;
		
		public function Report()
		{
			super();
			init();
		}
		
		private function init():void
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			
			background = new Shape();
			addChild( background );
			
			form = new Sprite();
			addChild( form );
			
			start = new Calendar( "Start Date" );
			start.addEventListener( CalendarEvent.DATE_CHANGED, doDateChanged );
			form.addChild( start );
			
			end = new Calendar( "End Date" );
			end.x = 420;
			end.addEventListener( CalendarEvent.DATE_CHANGED, doDateChanged );
			form.addChild( end );
			
			generate = new OuterButton();
			generate.x = 285;
			generate.y = 410;
			generate.addEventListener( MouseEvent.CLICK, doGenerateClick );
			form.addChild( generate );
			
			tabs = new TabBar();
			addChild( tabs );			
			
			stage.addEventListener( Event.RESIZE, doResize );
			layout();
		}
		
		private function layout():void
		{
			var alphas: Array = [1, 1];
			var colors:Array = [0x8A929D, 0x575E69];
			var ratios:Array = [0x00, 0xFF];
			var matrix:Matrix = new Matrix();
			
			matrix.createGradientBox( stage.stageWidth, stage.stageHeight, 90 * ( Math.PI / 180 ) );
			
			background.graphics.clear();
			background.graphics.lineStyle( 1, 0x00FF00, 0 );
			background.graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
			background.graphics.drawRect( 0, 0, stage.stageWidth, stage.stageHeight );
			background.graphics.endFill();
			
			form.x = Math.round( ( stage.stageWidth - form.width ) / 2 );
			form.y = Math.round( ( stage.stageHeight - 442 ) / 2 ) + 32;
			
			if( form.y <= 70 )
			{
				form.y = 70;
			}
		}

		private function pad( value:String, size:Number, digit:String = "0" ):String
		{
			while( value.length < size )
			{
				value = digit + value;
			}
			
			return value;
		}
		
		protected function doDateChanged( event:CalendarEvent ):void
		{
			if( start.date.time > end.date.time )
			{
				generate.enabled = false;
			} else {
				generate.enabled = true;
			}
		}
		
		protected function doFileComplete( event:Event ):void
		{
			generate.enabled = true;
			
			file.removeEventListener( Event.COMPLETE, doFileComplete );
			file.removeEventListener( Event.SELECT, doFileSelect );
			file = null;
		}
		
		protected function doFileSelect( event:Event ):void
		{
			generate.enabled = false;
		}
		
		protected function doGenerateClick( event:MouseEvent ):void
		{
			var request:URLRequest = new URLRequest( "http://www.kevinhoyt.com/content/report.cfm" );
			// var request:URLRequest = new URLRequest( "http://localhost:8305/aggregator/report.cfm" );
			var params:URLVariables = new URLVariables();
			
			params.start = ( start.date.month + 1 ) + "/" + pad( start.date.date.toString(), 2 ) + "/" + start.date.fullYear;
			params.end = 
				( end.date.month + 1 ) + 
				"/" + 
				pad( end.date.date.toString(), 2 ) + 
				"/" + 
				end.date.fullYear + 
				" 11:59:59 PM";
			
			request.method = URLRequestMethod.POST;
			request.data = params;
			
			file = new FileReference();
			file.addEventListener( Event.COMPLETE, doFileComplete );
			file.addEventListener( Event.SELECT, doFileSelect );
			file.download( request, "report.xls" );
		}
		
		protected function doResize( event:Event ):void
		{
			layout();
		}
	}
}