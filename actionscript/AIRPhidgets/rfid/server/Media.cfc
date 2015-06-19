<cfcomponent displayname="Media" hint="Display media in the directory">

	<cffunction 
    	access="remote" 
        name="readAll" 
        returntype="array" 
        displayname="readAll" 
        returnformat="json"
        description="Reads all the products in the directory">
		
        <cfset var local = StructNew() />
        
        <cfset local.result = ArrayNew( 1 ) />
        
        <cfdirectory 
        	directory="#ExpandPath( '.' )#" 		
            action="list" 
            name="media" 
            filter="*.jpg" 
            sort="ASC" 
            type="file"
            recurse="no" />
        
        <cfloop query="media">
        
        	<cfimage action="read" name="img" source="#ExpandPath( media.name )#" />
        
        	<cfset local.rfid = Left( media.name, Len( media.name ) - 4 ) & "_" />
        
			<cfset local.item = StructNew() />
            <cfset local.item.rfid = local.rfid />
            <cfset local.item.path = media.name />
            <cfset local.item.width = ImageGetWidth( img ) />
            <cfset local.item.height = ImageGetHeight( img ) />
            
            <cfset success = ArrayAppend( local.result, local.item ) />        
        
        </cfloop>
        
		<cfreturn local.result />

	</cffunction>

</cfcomponent>