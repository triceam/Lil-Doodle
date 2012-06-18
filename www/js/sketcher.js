

function Sketcher( canvasID, brushImage ) {
	this.brush = brushImage;
	this.touchSupported = Modernizr.touch;
	this.canvasID = canvasID;
	this.canvas = $("#"+canvasID);
	this.context = this.canvas.get(0).getContext("2d");	
	this.context.strokeStyle = "#000000";
	this.context.lineWidth = 3;
	this.eraserImage = null;
	this.lastMousePoint = {x:0, y:0};
    
    this.renderData = [];
    
    
	if (this.touchSupported) {
		this.mouseDownEvent = "touchstart";
		this.mouseMoveEvent = "touchmove";
		this.mouseUpEvent = "touchend";
	}
	else {
		this.mouseDownEvent = "mousedown";
		this.mouseMoveEvent = "mousemove";
		this.mouseUpEvent = "mouseup";
	}
	
	this.canvas.bind( this.mouseDownEvent, this.onCanvasMouseDown() );
	this.canvas.bind( this.mouseMoveEvent, this.onCanvasMouseMove() );
    
    var FPS = 60;
    var interval = 1000/FPS;
    var self = this;
    (function animationLoop(){
        setTimeout(animationLoop, interval);
        self.render();
    })();
}

Sketcher.prototype.onCanvasMouseDown = function () {
	var self = this;
	return function(event) {
        
        var targetTouches = event.originalEvent.targetTouches;
        
        for ( var x=0; x< targetTouches.length; x++ ) {
            var touch = targetTouches[x];
            var touchXY = self.getTouchXY( touch );
            var touchData = [touchXY, touchXY];
            var id = touch.identifier;
            self.renderData[ id ] = touchData;
        }
        
     	event.preventDefault();
    	return false;
	}
}


Sketcher.prototype.onCanvasMouseMove = function () {
	var self = this;
	return function(event) {
        
        var changedTouches = event.originalEvent.changedTouches;
        
        for ( var x=0; x< changedTouches.length; x++ ) {
            var touch = changedTouches[x];
            var touchXY = self.getTouchXY( touch );
            var id = touch.identifier;
            self.renderData[ id ].push( touchXY );
        }
        
     	event.preventDefault();
    	return false;
	}
}

Sketcher.prototype.getTouchXY = function ( touch ) {
    
    if  (this.canvasOffset == null)
        this.canvasOffset = this.canvas.offset();
    
    var result = {};
    
	result.x = touch.pageX - this.canvasOffset.left;
	result.y = touch.pageY - this.canvasOffset.top;
    return result;
}
                           
Sketcher.prototype.render = function () {
    
    //alert( "render" );
    for ( var key in this.renderData ) {
        var points = this.renderData[ key ];
        if (points.length > 1 ) {
            for ( var i=0; i<points.length-1; i++ )
            {
                this.renderBrushLine( points[i], points[i+1] );
            }
            this.renderData[ key ] = [ points[points.length-1] ];
        }
    }
}
                           
                 
Sketcher.prototype.renderBrushLine = function (start, end) {
    var halfBrushW = this.brush.width/2;
    var halfBrushH = this.brush.height/2;
                           
    var distance = parseInt( Trig.distanceBetween2Points( start, end ) );
    var angle = Trig.angleBetween2Points( start, end );
                           
    var x,y;
                           
    for ( var z=0; (z<=distance || z==0); z++ ) {
        x = start.x + (Math.sin(angle) * z) - halfBrushW;
        y = start.y + (Math.cos(angle) * z) - halfBrushH;
        this.context.drawImage(this.brush, x, y);
    }
}
                    
        

Sketcher.prototype.clear = function () {

	var c = this.canvas[0];
	this.context.clearRect( 0, 0, c.width, c.height );
}


Sketcher.prototype.erase = function (startX, endX) {

	var c = this.canvas[0];
	if ( endX < startX )
	{
		//this.context.clearRect( Math.round(endX), 0, Math.round(startX-endX), c.height );
		this.eraseCanvasByBrush( Math.round(endX), Math.round(startX) );
	}
	else {
		//this.context.clearRect( Math.round(startX), 0, Math.round(endX-startX), c.height );
		this.eraseCanvasByBrush( Math.round(startX), Math.round(endX) );
	}
}
		
Sketcher.prototype.eraseCanvasByBrush = function (start, end) {
	var halfBrushW = this.brush.width/2;
	
	var distance = end-start;
	
	var x,y = 0;
	this.context.globalCompositeOperation = "destination-out";
	for ( var z=0; (z<=distance || z==0); z += 3 )
	{
		x = start + z - halfBrushW;
		
		this.context.drawImage(this.eraserImage, x, y);
	}
	this.context.globalCompositeOperation = "source-over";
}
	