
var sketcher = null;
var brushEraser = null;
var brushDiagonal = null;
var brushCircle = null;
var brushCircleSmall = null;
var brushStar = null;
var brushTriangle = null;
var sliderMouseDownOffset = 0;
var sliderStartX = 0;
var touchID = 0;
var lastTouchTime = 0;

$(document).ready(function(e) {

    window.getSelection().removeAllRanges();              
    $(document).bind( "touchmove", function (e) { e.preventDefault(); return false; } );
    $(document).bind( "touchstart", function (e) { e.preventDefault(); return false; } );

    brushCircleSmall = new Image();
    brushCircleSmall.src = 'assets/brush_circle_small.png';
    brushCircleSmall.onload = function(){
    sketcher = new Sketcher( "canvas", brushCircleSmall );
    $("#sliderThumb").bind( sketcher.mouseDownEvent, onSliderMouseDown );


    $("#btnDiagonal").bind( sketcher.mouseDownEvent, onDiagonalMouseDown );
    $("#btnCircle").bind( sketcher.mouseDownEvent, onCircleMouseDown );
    $("#btnCircleSmall").bind( sketcher.mouseDownEvent, onCircleSmallMouseDown );
    $("#btnStar").bind( sketcher.mouseDownEvent, onStarMouseDown );
    $("#btnTriangle").bind( sketcher.mouseDownEvent, onTriangleMouseDown );

    sketcher.eraserImage = brushEraser;
    }

    brushDiagonal = new Image();
    brushDiagonal.src = 'assets/brush_diagonal.png';

    brushCircle = new Image();
    brushCircle.src = 'assets/brush_circle.png';

    brushStar = new Image();
    brushStar.src = 'assets/brush_star.png';

    brushTriangle = new Image();
    brushTriangle.src = 'assets/brush_triangle.png';

    brushEraser = new Image();
    brushEraser.src = 'assets/brush_eraser.png';
});

function onSliderMouseDown( event ) {
    var d=new Date();
    var now = d.getTime();
    if (( now - lastTouchTime ) > 500 ) {
        cleanup();
    }
    lastTouchTime = now;
    
    
    if ( touchID != 0 ) return;
    
	var target = event.originalEvent.changedTouches[0];
    if ( target ) {
        cleanup();
        touchID = target.identifier;
        
        sliderMouseDownOffset = target.pageX - $("#sliderThumb").offset().left;
        sliderStartX = target.pageX - (sketcher.canvas.offset().left+sliderMouseDownOffset);
        $(document).bind( sketcher.mouseMoveEvent, onSliderMouseMove );
        $(document).bind( sketcher.mouseUpEvent, onSliderMouseUp );
    }
}

function onSliderMouseMove( event ) {
    
    try {
        var target;
        for ( var x=0; x< event.originalEvent.changedTouches.length; x++ ) {
            if ( touchID == event.originalEvent.changedTouches[x].identifier ) {
                target = event.originalEvent.changedTouches[x];
                break;
            }
            
        }
        
        if ( !target ) return;
        
        var leftMin = 95;
        var leftMax = 949;
        
        var eraseLeftMin = 20;
        var eraseLeftMax = 50;
        
        var slider = $("#sliderThumb");
        var canvasOffset = sketcher.canvas.offset();
        var sliderOffset = slider.offset();
        
        var sliderNewX = target.pageX-sliderMouseDownOffset;
        sliderNewX = Math.max( sliderNewX, leftMin );
        sliderNewX = Math.min( sliderNewX, leftMax );
        slider.css( "left", sliderNewX );
        
        sliderNewX -= canvasOffset.left
        
        var start, end;
        if ( sliderStartX > sliderNewX )
        {
            start = sliderNewX+eraseLeftMin;
            end = sliderStartX+(eraseLeftMax);
        }
        else {
            
            start = sliderStartX+eraseLeftMin;
            end = sliderNewX+(eraseLeftMax);
        }
        
        sketcher.erase( start, end );
        sliderStartX = sliderNewX;
        
        lastTouchTime = new Date().getTime();
    }
    catch (error) {
        cleanup();
    }
    
	event.preventDefault();
	return false;
}

function onSliderMouseUp( event ) {
    
    try {
        var target;
        for ( var x=0; x< event.originalEvent.changedTouches.length; x++ ) {
            if ( touchID == event.originalEvent.changedTouches[x].identifier ) {
                target = event.originalEvent.changedTouches[x];
                break;
            }
            
        }
        
        if ( !target ) return;
        cleanup();
    }
    catch (error) {
        cleanup();
    }
}

function cleanup() {
    
    touchID = 0;
    $(document).unbind( sketcher.mouseMoveEvent, onSliderMouseMove );
	$(document).unbind( sketcher.mouseUpEvent, onSliderMouseUp );
}


function onCircleSmallMouseDown( event ) {
	$("#btnCircleSmall").attr( "src", "assets/btn_circle_small_sel.png" );
	$("#btnDiagonal").attr( "src", "assets/btn_diagonal.png" );
	$("#btnCircle").attr( "src", "assets/btn_circle.png" );
	$("#btnStar").attr( "src", "assets/btn_star.png" );
	$("#btnTriangle").attr( "src", "assets/btn_triangle.png" );
	sketcher.brush = brushCircleSmall;
}

function onDiagonalMouseDown( event ) {
	$("#btnCircleSmall").attr( "src", "assets/btn_circle_small.png" );
	$("#btnDiagonal").attr( "src", "assets/btn_diagonal_sel.png" );
	$("#btnCircle").attr( "src", "assets/btn_circle.png" );
	$("#btnStar").attr( "src", "assets/btn_star.png" );
	$("#btnTriangle").attr( "src", "assets/btn_triangle.png" );
	sketcher.brush = brushDiagonal;
}

function onCircleMouseDown( event ) {
	$("#btnCircleSmall").attr( "src", "assets/btn_circle_small.png" );
	$("#btnDiagonal").attr( "src", "assets/btn_diagonal.png" );
	$("#btnCircle").attr( "src", "assets/btn_circle_sel.png" );
	$("#btnStar").attr( "src", "assets/btn_star.png" );
	$("#btnTriangle").attr( "src", "assets/btn_triangle.png" );
	sketcher.brush = brushCircle;
}

function onStarMouseDown( event ) {
	$("#btnCircleSmall").attr( "src", "assets/btn_circle_small.png" );
	$("#btnDiagonal").attr( "src", "assets/btn_diagonal.png" );
	$("#btnCircle").attr( "src", "assets/btn_circle.png" );
	$("#btnStar").attr( "src", "assets/btn_star_sel.png" );
	$("#btnTriangle").attr( "src", "assets/btn_triangle.png" );
	sketcher.brush = brushStar;
}

function onTriangleMouseDown( event ) {
	$("#btnCircleSmall").attr( "src", "assets/btn_circle_small.png" );
	$("#btnDiagonal").attr( "src", "assets/btn_diagonal.png" );
	$("#btnCircle").attr( "src", "assets/btn_circle.png" );
	$("#btnStar").attr( "src", "assets/btn_star.png" );
	$("#btnTriangle").attr( "src", "assets/btn_triangle_sel.png" );
	sketcher.brush = brushTriangle;
}


