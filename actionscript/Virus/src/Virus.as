package
{
	// Collaboration service references
	import com.adobe.rtc.authentication.AdobeHSAuthenticator;
	import com.adobe.rtc.core.session_internal;
	import com.adobe.rtc.events.CollectionNodeEvent;
	import com.adobe.rtc.events.SessionEvent;
	import com.adobe.rtc.events.SharedObjectEvent;
	import com.adobe.rtc.events.UserEvent;
	import com.adobe.rtc.messaging.NodeConfiguration;
	import com.adobe.rtc.session.ConnectSession;
	import com.adobe.rtc.sharedModel.SharedObject;
	
	import flash.desktop.NativeApplication;
	import flash.display.DisplayObject;
	import flash.display.Loader;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.DisplacementMapFilter;
	import flash.filters.GlowFilter;
	import flash.geom.Point;
	import flash.net.URLRequest;
	import flash.system.Capabilities;

	import com.greensock.TweenMax;	
	
	[SWF( width="1024", height="600", frameRate="24" )]
	public class Virus extends Sprite
	{
		// Constants
		public static const CONNECTING_HEIGHT:Number = 68;
		public static const CONNECTING_WIDTH:Number = 415;
		public static const REFRESH_RATE:Number = 8;
		public static const TWEEN_RATE:Number = 0.35;
		public static const ROOM_URL:String = "https://connectnow.acrobat.com/khoytsdk/virus";

		// SWF Assets
		[Embed( source="assets/virus.swf", symbol="Background" )]
		private var Background:Class;		
		
		[Embed( source="assets/virus.swf", symbol="BlueVirus" )]
		private var BlueVirus:Class;		
		
		[Embed( source="assets/virus.swf", symbol="Connecting" )]
		private var Connecting:Class;				
		
		[Embed( source="assets/virus.swf", symbol="GoldVirus" )]
		private var GoldVirus:Class;		
		
		[Embed( source="assets/virus.swf", symbol="GreenVirus" )]
		private var GreenVirus:Class;		
		
		[Embed( source="assets/virus.swf", symbol="OrangeVirus" )]
		private var OrangeVirus:Class;
		
		[Embed( source="assets/virus.swf", symbol="PurpleVirus" )]
		private var PurpleVirus:Class;		
		
		// Private variables
		private var auth:AdobeHSAuthenticator = null;
		private var germs:Array = null;
		private var session:ConnectSession = null;
		private var count:Number = 0;
		private var icon:Number = 0;
		private var location:Point = null;
		private var positions:SharedObject = null;
		private var background:Sprite = null;
		private var connecting:Sprite = null;		
		
		// Constructor
		public function Virus()
		{
			super();
			init();
		}
		
		// Called to create a germ icon instance
		// Identifies instance by user ID
		private function create( userid:String, origin:Point, icon:Number = 0 ):void
		{
			var virus:Sprite = null;
			
			// Keep users icon consistent across screens
			// Initial icon randomly generated by user interaction
			switch( icon )
			{
				case 0:
					virus = new BlueVirus();
					break;
				case 1:
					virus = new GoldVirus();
					break;			
				case 2:
					virus = new GreenVirus();
					break;			
				case 3:
					virus = new OrangeVirus();
					break;				
				case 4:
					virus = new PurpleVirus();
					break;				
			}
			
			// Position and add to stage
			virus.name = userid;
			virus.filters = [new GlowFilter( 0x2D1111, 0.70, 10, 10, 2, BitmapFilterQuality.MEDIUM )];
			virus.x = origin.x;
			virus.y = origin.y;
			addChild( virus );
		}
		
		// Called by constructor to initialize application
		private function init():void
		{
			// Manage resize and layout manually
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
		
			// Exit application on Android when pushed to background
			if( Capabilities.cpuArchitecture == "ARM" )
			{
				NativeApplication.nativeApplication.addEventListener( Event.DEACTIVATE, doDeactivate );
			}						
			
			// Keep track of germs being displayed
			germs = new Array();
			
			// Background image
			background = new Background();
			background.alpha = 0;
			addChild( background );
			
			// Let the user know the application is connecting
			connecting = new Connecting();
			connecting.filters = [new GlowFilter( 0x2D1111, 0.70, 10, 10, 2, BitmapFilterQuality.MEDIUM )];			
			addChild( connecting );			
			
			// Collaboration authentication
			// Room auto-promotes so no credentials needed
			auth = new AdobeHSAuthenticator();
			
			// Collaboration session
			// You may need to use the admin username and password initially
			// Doing so will create the remote properties
			// Login is not required after properties are configured
			session = new ConnectSession();
			session.authenticator = auth;
			session.roomURL = ROOM_URL;
			session.addEventListener( SessionEvent.SYNCHRONIZATION_CHANGE, doSessionSync );
			session.login();
			
			// Watch for layout changes
			stage.addEventListener( Event.RESIZE, doResize );
			layout();
		}
		
		// Called to layout the application
		private function layout():void 
		{
			// Fit the background image best for the display size
			if( stage.stageWidth > background.width )
			{
				background.width = stage.stageWidth					
			}
			
			if( stage.stageHeight > background.height )
			{
				background.height = stage.stageHeight					
			}				
			
			// Layout based on best fit
			background.x = ( stage.stageWidth - background.width ) / 2;
			background.y = ( stage.stageHeight - background.height ) / 2;				

			// Fade background in during initial placement
			if( background.alpha == 0 )
			{
				TweenMax.to( background, 0.80, {
					alpha: 1		
				} );
			}			

			// Position the connecting indicator (graphic)
			connecting.x = ( stage.stageWidth - CONNECTING_WIDTH ) / 2;
			connecting.y = ( stage.stageHeight - CONNECTING_HEIGHT ) / 2;				
		}
		
		// Remove icon from stage
		// Triggered on mouse up
		private function remove( userid:String ):void
		{
			var germ:Sprite = getChildByName( userid ) as Sprite;
			
			if( germ != null )
			{
				removeChild( germ );				
			}
		}
		
		// **
		// Events
		// **
		
		// Quit application when deactivated
		// Designed for mobile optimization
		protected function doDeactivate( event:Event ):void
		{
			NativeApplication.nativeApplication.exit();
		}
		
		// Called every frame once the user has connected
		// Updates icon locations based on current user status
		protected function doEnterFrame( event:Event ):void
		{
			var data:Object = null;
			var germ:Sprite = null;
			
			// Update three times per second (roughly)
			if( count == REFRESH_RATE )
			{
				count = 0;
				
				trace( "Germs: " + germs.length );
				
				// Iterate through user data and update instances
				for( var g:Number = 0; g < germs.length; g++ )
				{
					germ = getChildByName( germs[g].userid ) as Sprite;
					
					TweenMax.to( germ, TWEEN_RATE, {
						x: germs[g].location.x,
						y: germs[g].location.y,
						overwrite: true
					} );
				}
				
				// Update this user location if mouse is down
				// For others to see
				if( location != null )
				{
					data = new Object();
					data.location = location;
					data.icon = icon;
					
					positions.setProperty( session.userManager.myUserID, data );					
				}
			} else {
				count = count + 1;
			}
		}
		
		// Called when a user has put their mouse down
		protected function doPositionsAdd( event:SharedObjectEvent ):void
		{
			var data:Object = null;			
			var origin:Point = null;
			
			// Check for connected state
			if( positions.isSynchronized )
			{
				// Update only for other (remote) users
				if( event.propertyName != session.userManager.myUserID )
				{
					trace( "User Down" );
					
					// Create a new icon instance
					origin = new Point( event.value.location.x, event.value.location.y );
					create( event.propertyName, origin, event.value.icon );
					
					// Store local reference for future updates
					data = new Object();
					data.userid = event.propertyName;
					data.location = origin;
					data.icon = event.value.icon;
					germs.push( data );
				}
			}
		}
		
		// Called when a user moves their mouse (when down)
		protected function doPositionsChange( event:SharedObjectEvent ):void
		{
			var data:Object = null;
			
			// Check connected state
			if( positions.isSynchronized )
			{
				// Update only for other (remove) users
				if( event.propertyName != session.userManager.myUserID )
				{
					trace( "User Move" );
					
					// Get reference to the users data
					// Store in a simple data structure
					data = new Object();
					data.userid = event.propertyName;
					data.location = new Point( event.value.location.x, event.value.location.y );
					data.icon = event.value.icon;
					
					// Find user and update their data for the next update
					// Updating done by enter frame logic
					for( var g:Number = 0; g < germs.length; g++ )
					{
						if( germs[g].userid == event.propertyName )
						{
							germs[g] = data;
							break;
						}
					}
				}
			}
		}		
		
		// Called when the user lifts their mouse
		protected function doPositionsRemove( event:SharedObjectEvent ):void
		{
			// Check for connected state
			if( positions.isSynchronized )
			{
				// Update only for other (remote) users
				if( event.propertyName != session.userManager.myUserID )
				{
					trace( "User Up" );
					
					// Remove instance from state
					remove( event.propertyName );
					
					// Find and remove remote user data from updates
					for( var g:Number = 0; g < germs.length; g++ )
					{
						if( germs[g].userid == event.propertyName )
						{
							germs.splice( g, 1 );
							break;
						}
					}
				}
			}
		}				
		
		// Called upon initial connection
		// TODO: Update display for any users with their mouse already down
		protected function doPositionsSync( event:CollectionNodeEvent ):void
		{
			if( positions.isSynchronized )
			{
				trace( "Existing Users" );
			}
		}
		
		// Called when the stage resizes
		protected function doResize( event:Event ):void
		{
			layout();
		}
		
		// Called when the collaboration session has connected
		// Also disconnected
		protected function doSessionSync( event:SessionEvent ):void
		{
			var config:NodeConfiguration = null;
			
			// Check for connected
			if( session.isSynchronized )
			{
				// Configure shared object if not already created
				// Shared object manages synchronizing user data
				if( positions == null )
				{
					config = new NodeConfiguration();
					config.userDependentItems = true;
					
					positions = new SharedObject();
					positions.setNodeConfiguration( config );
					positions.connectSession = session;
					positions.nodeName = "sharedPositions";
					positions.addEventListener( CollectionNodeEvent.SYNCHRONIZATION_CHANGE, doPositionsSync );
					positions.addEventListener( SharedObjectEvent.PROPERTY_ADD, doPositionsAdd );
					positions.addEventListener( SharedObjectEvent.PROPERTY_CHANGE, doPositionsChange );					
					positions.addEventListener( SharedObjectEvent.PROPERTY_REMOVE, doPositionsRemove );
					positions.subscribe();	
				}
				
				// Start listening for remote updates
				// Listen for local mouse changes to update remote data
				addEventListener( Event.ENTER_FRAME, doEnterFrame );
				stage.addEventListener( MouseEvent.MOUSE_DOWN, doStageDown );
				stage.addEventListener( MouseEvent.MOUSE_UP, doStageUp );				
				
				// Remove the connecting status graphic
				TweenMax.to( connecting, 0.80, {
					alpha: 0,
					visible: false
				} );
				
				trace( "Connected" );
			} else {
				trace( "Disconnected" );
				
				// Undo any event listening when disconnected
				removeEventListener( Event.ENTER_FRAME, doEnterFrame );
				stage.removeEventListener( MouseEvent.MOUSE_DOWN, doStageDown );
				stage.removeEventListener( MouseEvent.MOUSE_UP, doStageUp );								
				
				// Show the connecting graphics
				TweenMax.to( connecting, 0.80, {
					alpha: 0,
					visible: false,
					startAt: {
						visible: true
					}
				} );				
			}
		}
		
		// Called when the local user puts their mouse down
		protected function doStageDown( event:MouseEvent ):void
		{
			var data:Object = new Object();
			
			// Get the mouse location and pick an icon
			location = new Point( event.stageX, event.stageY );
			icon = Math.round( Math.random() * 4 );
			
			// Store in simple data structure
			// Good for quick reference across screens
			data.location = location;
			data.icon = icon;
			
			// Create the local user instance
			// Update their instance data across screens
			create( session.userManager.myUserID, location, icon );			
			positions.setProperty( session.userManager.myUserID, data );			
			
			// Start listening for mouse movement
			stage.addEventListener( MouseEvent.MOUSE_MOVE, doStageMove );
		}
		
		// Called when the mouse moves while down
		protected function doStageMove( event:MouseEvent ):void
		{
			var germ:Sprite = null;
			
			// Get the current mouse location
			location = new Point( event.stageX, event.stageY );
			
			// Update the local instance
			germ = getChildByName( session.userManager.myUserID ) as Sprite;
			germ.x = event.stageX;
			germ.y = event.stageY;
		}
		
		// Called when the mouse is released after being down
		protected function doStageUp( event:MouseEvent ):void
		{
			// Remove the mouse move listener
			stage.removeEventListener( MouseEvent.MOUSE_MOVE, doStageMove );
			
			// Remove the local instance
			// Tell remote screens to remove the instance
			remove( session.userManager.myUserID );
			positions.removeProperty( session.userManager.myUserID );
			
			// Reset any variables used during movement
			location = null;
			icon = 0;
		}		
	}
}