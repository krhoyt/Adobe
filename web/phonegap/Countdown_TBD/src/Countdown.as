package
{
	import com.greensock.TweenLite;
	
	import comp.Clock;
	import comp.Menu;
	import comp.Scenes;
	import comp.Speedo;
	
	import events.MenuEvent;
	
	import flash.desktop.NativeApplication;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.GestureEvent;
	import flash.events.MouseEvent;
	import flash.events.TransformGestureEvent;
	import flash.ui.Multitouch;
	import flash.ui.MultitouchInputMode;
	
	import images.Cayman;
	import images.Cozumel;
	import images.Montego;
	
	[SWF( frameRate="24", width="854", height="442" )]
	public class Countdown extends Sprite
	{
		private var clock:Clock = null;
		private var menu:Menu = null;
		private var scenes:Scenes = null;
		private var speedo:Speedo = null;
		
		public function Countdown()
		{
			super();
			init();
		}
		
		private function init():void
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			
			Multitouch.inputMode = MultitouchInputMode.GESTURE;

			NativeApplication.nativeApplication.addEventListener( Event.DEACTIVATE, doDeactivate, false, 0, true );
			
			scenes = new Scenes();
			addChild( scenes );
			
			clock = new Clock();
			addChild( clock );
			
			speedo = new Speedo();
			speedo.y = 442;
			speedo.visible = false;
			addChild( speedo );
			
			menu = new Menu();
			menu.addEventListener( MenuEvent.SPEEDO_ENABLE, doSpeedoEnable );
			menu.addEventListener( MenuEvent.SPEEDO_DISABLE, doSpeedoDisable );
			addChild( menu );
			
			stage.addEventListener( Event.RESIZE, doResize );
			layout();
		}
		
		private function layout():void
		{
			clock.x = Math.round( ( stage.stageWidth - 776 ) / 2 );
			clock.y = 39;
			
			scenes.x = Math.round( ( stage.stageWidth - 854 ) / 2 );
		}
		
		protected function doDeactivate( event:Event ):void
		{
			NativeApplication.nativeApplication.exit();
		}
		
		protected function doResize( event:Event ):void
		{
			layout();
		}
		
		protected function doSpeedoComplete():void
		{
			if( speedo.y == 0 )
			{
				scenes.visible = false;
			} else {
				speedo.visible = false;
			}
		}
		
		protected function doSpeedoDisable( event:MenuEvent ):void
		{
			scenes.visible = true;
			
			TweenLite.to( clock, 0.80, {
				y: 39 
			} );
			
			TweenLite.to( scenes, 0.80, {
				y: 0 
			} );			
			
			TweenLite.to( speedo, 0.80, {
				y: 442,
				onComplete: doSpeedoComplete
			} );
		}		
		
		protected function doSpeedoEnable( event:MenuEvent ):void
		{
			speedo.visible = true;
			
			TweenLite.to( clock, 0.80, {
				y: clock.y - 442 
			} );
			
			TweenLite.to( scenes, 0.80, {
				y: -442 
			} );			
			
			TweenLite.to( speedo, 0.80, {
				y: 0,
				onComplete: doSpeedoComplete
			} );
		}
	}
}