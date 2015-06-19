package
{
	import Box2D.Collision.Shapes.b2CircleShape;
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2BodyDef;
	import Box2D.Dynamics.b2DebugDraw;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;
	
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.AccelerometerEvent;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	import flash.sensors.Accelerometer;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	
	public class Timeout extends Sprite
	{
		public static const PIXELS_PER_METER:Number = 30;
		public static const WALL_WIDTH:Number = 2;		
		
		private var gyro:Accelerometer = null;
		private var world:b2World = null;
		private var iterations:Number = 0;
		private var timestep:Number = 0;	
		
		public function Timeout()
		{
			super();
			init();
		}
		
		private function init():void
		{
			stage.align = StageAlign.TOP_LEFT;
			stage.scaleMode = StageScaleMode.NO_SCALE;
					
			// Use accelerometer on a device
			// Use mouse for desktop testing
			if( Accelerometer.isSupported )
			{
				gyro = new Accelerometer();
				gyro.addEventListener( AccelerometerEvent.UPDATE, doGyroUpdate );
			} else {
				stage.addEventListener( MouseEvent.MOUSE_MOVE, doMouseMove );
			}
			
			stage.addEventListener( Event.RESIZE, doResize );
		}
		
		private function makeDebug():void
		{
			var debug:b2DebugDraw = new b2DebugDraw();
			var debugsprite:Sprite = new Sprite();
			
			addChild( debugsprite );
			
			debug.SetSprite( debugsprite );
			debug.SetDrawScale( 30.0 );
			debug.SetFillAlpha( 0.3 );
			debug.SetLineThickness( 1.0 );
			debug.SetFlags( b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit );
			
			world.SetDebugDraw( debug );
		}		
		
		private function makeScene():void
		{
			var face:b2CircleShape = new b2CircleShape( 190 / PIXELS_PER_METER );
			var fixture:b2FixtureDef = null;
			var watch:b2BodyDef= new b2BodyDef();
			var whole:b2Body = null;
			
			watch.position.Set( ( stage.stageWidth / 2 ) / PIXELS_PER_METER, ( stage.stageHeight - 190 ) / PIXELS_PER_METER );
			watch.type = b2Body.b2_dynamicBody;
			 
			fixture = new b2FixtureDef();			
			fixture.shape = face;
			fixture.density = 1.0;
			
			whole = world.CreateBody( watch );
			whole.CreateFixture( fixture );
		}
		
		private function makeWalls():void
		{
			var wall:b2PolygonShape = new b2PolygonShape();
			var walldef:b2BodyDef = new b2BodyDef();
			var wallbody:b2Body = null;
			
			// Left
			walldef.position.Set( ( 0 - WALL_WIDTH ) / PIXELS_PER_METER, ( stage.stageHeight / 2 ) / PIXELS_PER_METER );
			wall.SetAsBox( WALL_WIDTH / PIXELS_PER_METER, ( stage.stageHeight / 2 ) / PIXELS_PER_METER );
			wallbody = world.CreateBody( walldef );
			wallbody.CreateFixture2( wall );
			
			// Right
			walldef.position.Set( ( ( stage.stageWidth - WALL_WIDTH ) + ( WALL_WIDTH + 1 ) ) / PIXELS_PER_METER, ( stage.stageHeight / 2 ) / PIXELS_PER_METER );
			wallbody = world.CreateBody( walldef );
			wallbody.CreateFixture2( wall );
			
			// Top
			walldef.position.Set( ( stage.stageWidth / 2 ) / PIXELS_PER_METER, ( 0 - WALL_WIDTH ) / PIXELS_PER_METER );
			wall.SetAsBox( ( stage.stageWidth / 2 ) / PIXELS_PER_METER, 2 / PIXELS_PER_METER );
			wallbody = world.CreateBody( walldef );
			wallbody.CreateFixture2( wall );			

			// Bottom
			walldef.position.Set( ( stage.stageWidth / 2 ) / PIXELS_PER_METER, ( stage.stageHeight + WALL_WIDTH - 1 ) / PIXELS_PER_METER );			
			wallbody = world.CreateBody( walldef );
			wallbody.CreateFixture2( wall );
		}		
		
		private function makeWorld():void
		{
			var gravity:b2Vec2 = new b2Vec2( 0.0, 10.0 );
			var sleep:Boolean = false;
			
			world = new b2World( gravity, sleep );
			world.SetWarmStarting( true );
			
			timestep = 1.0 / 30.0;
			iterations = 10;			
		}		
		
		private function update( event:Event = null ):void
		{
			world.Step( timestep, iterations, iterations );
			world.ClearForces();
			world.DrawDebugData();
		}		
		
		protected function doEnterFrame( event:Event ):void
		{
			update();
		}
		
		protected function doGyroUpdate( event:AccelerometerEvent ):void
		{
			var vecx:Number = 10 * ( 0 - event.accelerationX );
			var vecy:Number = 10 - vecx;
			
			world.SetGravity( new b2Vec2( vecx, vecy ) );			
		}
		
		// Desktop testing
		protected function doMouseMove( event:MouseEvent ):void
		{
			var atan:Number = 0;
			var deg:Number = 0;
			var center:Point = new Point( stage.stageWidth / 2, stage.stageHeight / 2 );
			var lega:Number = event.stageY - center.y;
			var legb:Number = event.stageX - center.x;
			var pct:Number = 0;
			var vecx:Number = 0;
			var vecy:Number = 0;
			
			atan = lega / legb;
			atan = Math.atan( atan );
			
			deg = atan * 180 / Math.PI;

			if( deg < 0 )
			{
				deg = 0 - ( 90 + deg );
			} else {
				deg = 180 - ( deg + 90 );
			}
		
			pct = deg / 90;
		
			vecy = 10 * pct;
			vecx = 10 - pct;
			
			world.SetGravity( new b2Vec2( vecy, vecx ) );
		}
		
		protected function doResize( event:Event ):void
		{
			stage.removeEventListener( Event.RESIZE, doResize );
			
			makeWorld();
			makeWalls();
			makeScene();
			makeDebug();			
			
			addEventListener( Event.ENTER_FRAME, doEnterFrame );		
		}
	}
}