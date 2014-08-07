(function(kity, window) {

/**
 * @build
 */

var exports = exports || window;

var kc = {};

kc.version = '1.0.1';

kc.fx = true;

exports.kc = kc;

var Ruler = kc.Ruler = kity.createClass( 'Ruler', {
    constructor: function ( from, to ) {
        this.ref_grid = [];
        this.map_grid = [];
        this.ref( from, to );
        this.map( from, to );
    },

    ref: function ( from, to ) {
        if ( !arguments.length ) return this._ref;
        this._ref = {
            from: +from,
            to: +to,
            dur: +to - +from
        };
        return this;
    },

    map: function ( from, to ) {
        if ( !arguments.length ) return this._map;
        this._map = {
            from: +from,
            to: +to,
            dur: +to - +from
        };
        return this;
    },

    reverse: function () {
        var ref = this._ref,
            map = this._map;
        return new Ruler( map.from, map.to ).map( ref.from, ref.to );
    },

    measure: function ( value ) {
        // 强烈鄙视 JS 除零不报错，气死劳资了 —— techird
        if ( this._ref.dur === 0 ) return 0;
        var ref = this._ref,
            map = this._map;

        return map.from + ( value - ref.from ) / ref.dur * map.dur;
    },

    grid: function ( start, step, alignRef ) {
        var ref = this._ref,
            map = this._map,
            ref_grid = [],
            map_grid = [],
            current;

        if( kity.Utils.isArray( start ) ){
            ref_grid = start;
        }else{
            for ( current = start; current < ref.to + step; current += step ) {
                ref_grid.push( current );
            }
        }

        this.ref_grid = ref_grid;

        if(alignRef){
            this.ref( ref_grid[0], ref_grid[ref_grid.length-1] );
        }

        for ( var i = 0; i < ref_grid.length; i++ ) {
            map_grid.push( this.measure( ref_grid[i] ) );
        }
        
        this.map_grid = map_grid;

        return {
            ref: ref_grid,
            map: map_grid
        };
    },

    gridBySize: function ( size ) {
        var ref = this._ref;
        var start = kc.sugar.snap( ref.from, size, 'right' );
        return this.grid( start, size );
    },

    // find a good mod
    fagm: function ( count ) {
        var dur = this._ref.dur,
            sdur = dur / count,
            adjust = 1;

        while(sdur > 100) {
            sdur /= 10;
            adjust *= 10;
        }

        while(sdur < 10) {
            sdur *= 10;
            adjust /= 10;
        }

        return (sdur | 0) * adjust;
    },

    align : function ( value, mod, dir ) {
        var left = value > 0 ?
            value - value % mod :
            value - value % mod - mod,
            right = left + mod;
        return dir == 'left' ? left :
            ( dir == 'right' ? right : (
            value - left < right - value ? left : right ) );
    },

    gridByCount: function ( count, mod, alignRef, start) {
        mod = mod || this.fagm( count );
        var ref = this._ref;
        start = kity.Utils.isNumber( start )? start : this.align( ref.from, mod, 'left' );
        var size = mod;
        while ( size * count < ref.dur ) size += mod;
        return this.grid( start, size, alignRef );
    },

    gridByArray: function( arr ){
        return this.grid( arr, null, true );
    },

    gridByCategories : function( count ){
        var ref_grid = [],
            map_grid = [],
            i;
        for (i = 0; i < count; i++) {
            ref_grid.push( i );
        }

        this.ref_grid = ref_grid;

        for (i = 0; i < ref_grid.length; i++) {
            map_grid.push( this.measure( ref_grid[i] ) );
        }

        this.map_grid = map_grid;

        return {
            ref: ref_grid,
            map: map_grid
        };
    },

    checkOverflow: function ( value ) {
        if ( value < this._ref.from ) {
            return -1;
        }
        if ( value > this._ref.to ) {
            return 1;
        }
        return 0;
    },

    leanTo: function( num, type ){
        var grid = type == 'map'? this.map_grid : this.ref_grid;
        if( !grid || grid.length == 0 ) return null;

        if( grid.length == 1 ){
            return {
                value: grid[ 0 ],
                index: 0
            }
        }

        var first = grid[ 0 ];
        if( num < first ){
            return {
                value: first,
                index: 0
            }
        }

        var last = grid[ grid.length-1 ];
        if( num > last ){
            return {
                value: last,
                index: grid.length-1
            }
        }

        var mod = grid[1] - grid[0];
        var result = this.align( num, mod );
        var index = Math.round( result/mod );

        return {
            value: result,
            index: index
        }
    }
} );

Ruler.from = function ( from ) {
    return {
        to: function ( to ) {
            return new Ruler( from, to );
        }
    };
};

/**
 * @author techird
 *
 * 将坐标对齐至能绘制清晰的线条的位置
 *
 * @param  {Number|Point} p
 *         原始坐标位置（数字或点）
 * @return {Number|Point}
 *         修正后的坐标位置
 */
kc.sharpen = function ( p ) {
    if ( typeof ( p ) == 'number' ) return ( p | 0 ) + 0.5;
    if ( 'x' in p && 'y' in p ) return {
        x: ( p.x | 0 ) + 0.5,
        y: ( p.y | 0 ) + 0.5
    };
};

var ChartEvent = kc.ChartEvent = kity.createClass( "ChartEvent", {
    constructor: function ( target, kityEvent ) {
        if ( kityEvent ) {
            this.kityEvent = kityEvent;
        }
        this.target = target;
    },

    getTargetChartElement: function() {
    	var shape = this.kityEvent.targetShape;

    	while(shape && !shape.host) {
    		shape = shape.container;
    	}

    	return shape.host;
    }
} );

var EventHandler = kc.EventHandler = kity.createClass( 'EventHandler', ( function () {

    var DOMEvents = 'click dblclick mousedown contextmenu mouseup mouseout mouseover mouseenter mouseleave mousemove mousewheel touchstart touchmove touchend'.split( ' ' );

    function wrapCallback( callback, context ) {
        return function ( e ) {
            callback.call( context, new kc.ChartEvent( context, e ) );
        };
    }

    return {

        constructor: function () {
            this._initEvents();
        },
        on: function ( e, callback ) {
            var _eventCallbacks = this._eventCallbacks;
            var eList = e.split( " " );
            for ( var i = 0; i < eList.length; i++ ) {
                var _arr = _eventCallbacks[ eList[ i ] ];
                if ( !_arr ) {
                    _eventCallbacks[ eList[ i ] ] = [];
                }
                if ( ~DOMEvents.indexOf( eList[ i ] ) && this.canvas ) {
                    this.canvas.on( eList[ i ], wrapCallback( callback, this ) );
                } else {
                    _eventCallbacks[ eList[ i ] ].push( callback );
                }
            }
        },
        off: function ( e, callback ) {

        },
        trigger: function ( e, p ) {
            if ( ~DOMEvents.indexOf( e ) && this.canvas ) {
                this.canvas.fire( e, p );
            } else {
                this._fire( e, p );
            }
        },
        _fire: function ( eve, p ) {
            var me = this;
            var e;
            if ( typeof eve === 'string' ) {
                e = new kc.ChartEvent( me );
                e.name = eve;
            } else {
                e = eve;
            }
            e.data = p;
            var _callbacks = me._eventCallbacks[ e.name ];
            if ( !_callbacks ) {
                return false;
            }
            for ( var i = 0; i < _callbacks.length; i++ ) {
                _callbacks[ i ].call( me, e );
            }
        },
        _initEvents: function () {
            this._eventCallbacks = {};
        },
        _resetEvents: function () {
            this._bindEvents();
        }
    };
} )() );

var Data = kc.Data = kity.createClass( 'Data', {

    mixins: [ kc.EventHandler ],

    constructor: function ( origin ) {
        this.origin = origin || {};
        this.callMixin();
    },

    format: function () {
        return this.origin;
    },

    /**
     * 更新指定路径的数据，会覆盖或新增到当前的数据中，并且触发 update 事件
     *
     * @param  {plain} delta  要更新的路径
     *
     * @example
     *
     * data.update({
     *     female: {
     *         value: 10,
     *         color: 'blue'
     *     },
     *     male: {
     *         value: 13,
     *         color: 'red'
     *     }
     * });
     *
     */
    update: function ( delta ) {
        this.origin = kity.Utils.extend( this.origin, delta );
        this.trigger( 'update' );
    },

    clear: function () {
        this.origin = {};
        this.trigger( 'update' );
    },
    reset: function ( data ) {
        this.origin = data;
    }
    // getStandard: function () {
    //     return this.format( this.origin );
    // }
} );

function getCamelName( name ) {
    return name.replace( /_(\w)/ig, function ( match ) {
        return match[ 1 ].toUpperCase();
    } );
}

var elementUUID = 0;

var ChartElement = kc.ChartElement = kity.createClass( 'ChartElement', {
    mixins: [ kc.EventHandler ],

    constructor: function ( param ) {

        this.canvas = new kity.Group();
        this.canvas.host = this;

        this.visible = true;

        this.param = param || {};
        //挂载数据在图形上，交互的时候通过container获取
        this._bindData();

        this.elements = {};

        this.callMixin();
    },

    addElement: function ( key, chartElement ) {
        if ( arguments.length === 1 ) {
            chartElement = key;
            key = 'ChartElement_' + elementUUID++;
        }

        this.elements[ key ] = chartElement;
        this.canvas.addShape( chartElement.canvas );
        chartElement.container = this;
        return chartElement;
    },

    getElement: function ( key ) {
        return this.elements[ key ] || null;
    },

    removeElement: function ( key ) {
        var chartElement = this.elements[ key ];
        if ( chartElement ) {
            delete chartElement.container;
            this.canvas.removeShape( chartElement.canvas );
            delete this.elements[ key ];
        } else if ( key === undefined ) {
            for ( var k in this.elements ) {
                chartElement = this.elements[ k ];
                delete chartElement.container;
                this.canvas.removeShape( chartElement.canvas );
                delete this.elements[ k ];
            }
        }
    },

    setVisible: function ( value ) {
        if ( value !== undefined ) {
            this.visible = value;
            this.canvas.setStyle( {
                display: value ? 'inline' : 'none'
            } );
        }
        return this;
    },

    isVisible: function () {
        return this.visible;
    },

    setPosition: function ( x, y ) {
        if ( ( typeof ( x ) == 'object' ) && ( 'x' in x ) && ( 'y' in x ) ) {
            y = x.y || 0;
            x = x.x || 0;
        }
        x = x || 0;
        y = y || 0;
        var dx = x - ( this.x || 0 ),
            dy = y - ( this.y || 0 );
        this.x = x;
        this.y = y;
        this.canvas.translate( dx, dy );
    },

    getPosition: function () {
        return {
            x: this.param.x || 0,
            y: this.param.y || 0
        };
    },

    // 兴趣点表示这个元素的关键位置
    getInterestPoint: function () {
        return this.getPosition();
    },

    registerUpdateRules: function () {
        return {
            'setPosition': [ 'x', 'y' ],
            'setOpacity': [ 'opacity' ],
            'setVisible': [ 'visible' ]
        };
    },

    updateByRule: function ( method, methodParams, param, animatedBeginValueCopy, progress ) {
        var shouldCall, lastParam, i, k;
        lastParam = this.param;


        for ( i = 0; i < methodParams.length; i++ ) {
            k = methodParams[ i ];
            // 值没有改变的话，不更新
            if ( k in param && ( !this._firstUpdate || lastParam[ k ] !== param[ k ] ) ) { //用!=符号， "" == 0为true
                shouldCall = true;
                break;
            }
        }

        if ( shouldCall ) {
            var currentParam = methodParams.map( function ( name ) {
                return name in param ? param[ name ] : lastParam[ name ];
            } );

            currentParam = currentParam.concat( [ animatedBeginValueCopy, progress ] );
            this[ method ].apply( this, currentParam );
        }
    },

    update: function ( param, animatedBeginValueCopy, progress ) {

        var key, rules, method, params, i, shouldCall, updated;

        // 挂载数据在图形上
        this._bindData();

        // 没有被更新过，需要把所有参数都更新一遍，达到初始效果
        if ( !this._updateRules ) {
            this._updateRules = this.registerUpdateRules();
            param = kity.Utils.extend( this.param, param );
        }

        rules = this._updateRules;

        if ( !param ) {
            param = this.param;
        }

        updated = [];
        // 从更新规则中更新
        for ( method in rules ) {
            this.updateByRule( method, rules[ method ], param, animatedBeginValueCopy, progress );
            updated = updated.concat( rules[ method ] );
        }


        if ( param && param != this.param ) {

            kity.Utils.extend( this.param, param );

        }

        // 更新子元素
        for ( key in param ) {
            if ( !~updated.indexOf( key ) && this.elements[ key ] ) {
                this.elements[ key ].update( param[ key ] );
            }
        }

        this._firstUpdate = this._firstUpdate || +new Date();
        this.trigger( 'update' );
        return this;
    },

    getBoundaryBox: function () {
        return this.canvas.getBoundaryBox();
    },

    getSize: function () {
        var box = this.getBoundaryBox();
        return {
            width: box.width,
            height: box.height
        };
    },

    flipX: function () {
        this.canvas.scale( -1, 1 );
    },

    flipY: function () {
        this.canvas.scale( 1, -1 );
    },

    getParam: function ( k ) {
        return this.param[ k ];
    },

    setParam: function ( k, v ) {
        this.param[ k ] = v;
    },

    setOpacity: function ( opacity ) {
        this.canvas.setOpacity( opacity );
    },

    _bindData: function () {
        if ( this.param.bind !== undefined ) {
            this.canvas.bind = this.param.bind;
        }
    },

    setBindData: function ( val ) {
        this.canvas.bind = val;
    },

    getBindData: function () {
        return this.canvas.bind;
    },

    getPaper: function () {
        var tmp = this.canvas;
        while ( tmp && tmp.container ) {
            tmp = tmp.container;
            if ( tmp instanceof kity.Paper ) {
                break;
            }
        }
        return tmp;
    }
} );

( function ( kc, kity ) {

    kc.AnimatedChartElement = kity.createClass( "AnimatedChartElement", {
        base: kc.ChartElement,

        getAnimatedParam: function () {
            throw new Error( '请实现接口: getAnimatedParam()' );
        },

        fxEnabled: function () {
            return kc.fx && this.param.fx != 'off';
        },

        stop: function () {
            if ( this.timeline ) {
                this.timeline.stop();
            }
            return this;
        },

        animate: function ( afterAnimated, duration, easing, callback ) {
            if ( !this.fxEnabled() ) {
                return this.update( afterAnimated );
            }

            var canAnimated = this.getAnimatedParam(),
                beforeAnimated = this.param,
                beforeAnimatedCopy = kity.Utils.copy( beforeAnimated ),
                beginParam = {},
                finishParam = {},
                staticParam = {},
                animator;
            canAnimated.push( 'x' );
            canAnimated.push( 'y' );

            for ( var p in afterAnimated ) {
                if ( p in beforeAnimated && ~canAnimated.indexOf( p ) ) {
                    beginParam[ p ] = beforeAnimated[ p ];
                    finishParam[ p ] = afterAnimated[ p ];
                } else {
                    staticParam[ p ] = afterAnimated[ p ];
                }
            }

            this.update( staticParam );

            animator = new kity.Animator( {
                beginValue: beginParam,
                finishValue: finishParam,
                setter: function ( target, param, timeline ) {
                    var progress = timeline.getValueProportion();
                    if ( progress > 1 ) progress = 1;
                    target.update( param, beforeAnimatedCopy, progress );
                }
            } );

            if ( this.timeline ) this.timeline.stop();

            this.timeline = animator.start( this,
                duration || this.param.fxTiming || this.fxTiming || 500,
                easing || this.param.fxEasing || this.fxEasing || 'ease',
                callback );

            return this;
        }
    } );

} )( kc, kity );

var Chart = kc.Chart = kity.createClass( 'Chart', {
    base: kc.AnimatedChartElement,
    constructor: function ( target, param ) { //传入render目标
        this.callBase( param );
        this.setData( {} );

        if ( typeof ( target ) == 'string' ) {
            target = document.getElementById( target );
        }
        target.setAttribute( 'onselectstart', 'return false' );
        
        this.paper = new kity.Paper( target );
        this.paper.addShape( this.canvas );
        
        this.container = target;
        target.paper = this.paper;
    },
    getWidth: function () {
        return this.paper.getContainer().clientWidth;
    },
    getHeight: function () {
        return this.paper.getContainer().clientHeight;
    },
    setData: function ( data ) {
        if ( this._dataBind ) {
            this.data.off( 'update', this._dataBind );
        }
        this.data = data instanceof kc.Data ? data : new kc.Data( data );
        this.data.on( 'update', this._dataBind = ( function () {
            this.update();
        } ).bind( this ) );
    },
    getData: function () {
        return this.data;
    },
    update: function ( param ) {
        var data = this.data.format();
        this.callBase( param, data );
        if (this.updateChart) {
            this.updateChart(this.param, data);
        }
    }
} );

var ConfigHandler = kc.ConfigHandler = kity.createClass( 'ConfigHandler', {

    constructor: function ( config ) {
        // this.config = config || {};
    },

    getConfig: function () {
        return this.config;
    },

    /*
     * path形式为"plotOptions.label.text", 即访问this.config.plotOptions.label.text
     */
    getOption: function ( path ) {
        return kity.Utils.queryPath( path, this.config );
    },

    setConfig : function( config ){
        this.config = config;
    },

    /*
     * path同getOption参数path
     */
    setOption: function ( path, value ) {
        if( path.indexOf('series') >= 0 ){
            console.log('该接口不支持设置series');
            return;
        }

        var arr = path.split('.');
        arr.unshift('config');
        var  i = 1, p, cur, exp;

        while(i < arr.length){
            cur = arr[i];
            p = getPath( i-1, arr );
            if( !eval('"' + cur + '" in this.' + p ) ){ //属性不存在
                exp = 'this.' + p + '.' + cur + ' = ' + (i == arr.length-1 ? 'value' : '{}');
                eval( exp );
            }else{ //属性存在
                if( i == arr.length-1 ){
                    exp = 'this.' + p + '.' + cur + ' = value';
                    eval( exp );
                }
            }

            i++
        }

        function getPath( index, arr ){
            var p = [];
            for(var i=0; i<=index; i++){
                p.push( arr[i] );
            }
            return p.join('.');
        }


    }

} );

/**
 * @build
 */

var Pie = kity.Pie = kity.createClass( "Pie", {
    base: kity.Path,
    constructor: function ( outerRadius, pieAngle, startAngle, innerRadius ) {
        this.callBase();
        this.outerRadius = outerRadius || 100;
        this.pieAngle = pieAngle || 90;
        this.startAngle = startAngle || 0;
        this.innerRadius = innerRadius || 0;
        this.draw();
    },
    draw: function () {
        var d = this.getDrawer().clear();
        var r = this.innerRadius,
            R = this.outerRadius,
            sa = this.startAngle,
            pa = this.pieAngle;

        if(pa > 0 && pa % 360 === 0) pa = 359.99;
        if(pa < 0 && pa % 360 === 0) pa = -359.99;

        var p1 = kity.Point.fromPolar( r, sa ),
            p2 = kity.Point.fromPolar( R, sa ),
            p3 = kity.Point.fromPolar( R, sa + pa % 360 ),
            p4 = kity.Point.fromPolar( r, sa + pa % 360 );
        var largeFlag = Math.abs( pa ) > 180 ? 1 : 0;
        var sweepFlag = pa > 0 ? 1 : 0;

        d.moveTo( p1.x, p1.y );
        d.lineTo( p2.x, p2.y );
        d.carcTo( R, largeFlag, sweepFlag, p3.x, p3.y );
        d.lineTo( p4.x, p4.y );
        d.carcTo( r, largeFlag, sweepFlag ? 0 : 1, p1.x, p1.y );
        d.close();
    }
} );

// {
//             x1: 0,
//             y1: 0,
//             x2: 100,
//             y2: 0,
//             bound: null,
//             width: 1,
//             color: 'black',
//             dash: null
//         }
var Line = kc.Line = kity.createClass( "Line", {
    base: kc.AnimatedChartElement,
    constructor: function ( param ) {
        this.callBase( kity.Utils.extend( {
            x1: 0,
            y1: 0,
            x2: 100,
            y2: 0,
            bound: null,
            width: 1,
            color: 'black',
            dash: null
        }, param ) );
        this.line = new kity.Path();
        this.canvas.addShape( this.line );
    },

    getAnimatedParam: function () {
        return [ 'x1', 'y1', 'x2', 'y2', 'width' ];
    },

    registerUpdateRules: function () {
        return kity.Utils.extend( this.callBase(), {
            draw: [ 'x1', 'y1', 'x2', 'y2', 'bound' ],
            stroke: [ 'color', 'width', 'dash' ]
        } );
    },

    draw: function ( x1, y1, x2, y2, bound ) {
        var drawer = this.line.getDrawer(),
            s = kc.sharpen;

        if ( bound ) {
            bound = this.boundTo( x1, y1, x2, y2, bound );
        }
        bound = bound || [
            [ x1, y1 ],
            [ x2, y2 ]
        ];
        drawer.clear();
        drawer.moveTo( s( bound[ 0 ][ 0 ] ), s( bound[ 0 ][ 1 ] ) );
        drawer.lineTo( s( bound[ 1 ][ 0 ] ), s( bound[ 1 ][ 1 ] ) );

    },

    stroke: function ( color, width, dash ) {
        var pen = new kity.Pen();
        pen.setWidth( width );
        pen.setColor( color );
        if ( dash ) {
            pen.setDashArray( dash );
        }
        this.line.stroke( pen );
    },

    boundTo: function ( x1, y1, x2, y2, bound ) {
        var b = bound,
            bx1 = b.x1,
            by1 = b.y1,
            bx2 = b.x2,
            by2 = b.y2,
            k, kk, bx1y, bx2y, by1x, by2x;

        function inRange( x, a, b ) {
            return ( a <= x && x <= b ) || ( a >= x && x >= b );
        }

        if ( x1 == x2 ) {
            return [ [ x1, b.y1 ], [ x2, b.y2 ] ];
        }
        if ( y1 == y2 ) {
            return [ [ b.x1, y1 ], [ b.x2, y2 ] ];
        }

        k = ( x1 - x2 ) / ( y1 - y2 );
        kk = 1 / k;
        bx1y = kk * ( bx1 - x1 ) + y1;
        bx2y = kk * ( bx2 - x1 ) + y1;
        by1x = k * ( by1 - y1 ) + x1;
        by2x = k * ( by2 - y1 ) + x1;

        var inc = [];
        if ( inRange( bx1y, by1, by2 ) ) {
            inc.push( [ bx1, bx1y ] );
        }
        if ( inRange( bx2y, by1, by2 ) ) {
            inc.push( [ bx2, bx2y ] );
        }
        if ( inRange( by1x, bx1, bx2 ) ) {
            inc.push( [ by1x, by1 ] );
        }
        if ( inRange( by2x, bx1, bx2 ) ) {
            inc.push( [ by2x, by2 ] );
        }
        if ( inc.length > 1 ) {
            return inc;
        }
    }
} );

// {
//     points: [
//         [0, 0],
//         [100, 100],
//         [100, 200]
//     ],
//     width: 1,
//     color: 'black',
//     dash: null
// }
var Polyline = kc.Polyline = kity.createClass( "Polyline", {
    base: kc.AnimatedChartElement,
    constructor: function ( param ) {
        this.callBase( kity.Utils.extend( {
            points: [
                [ 0, 0 ],
                [ 0, 0 ]
            ],
            width: 3,
            color: 'black',
            dash: null,
            animatedDir: 'y',
            fxEasing: 'ease',
            factor: 0,
            close: false,
            fill: null
        }, param ) );

        this.polyline = new kity.Path();
        this.canvas.addShape( this.polyline );
    },

    getAnimatedParam: function () {
        return [ 'factor' ];
    },

    registerUpdateRules: function () {
        return kity.Utils.extend( this.callBase(), {
            draw: [ 'points', 'factor', 'close', 'fill' ],
            stroke: [ 'color', 'width', 'dash' ]
        } );
    },

    parsePoint: function ( index, pos, points ) {
        if ( points && points[ index ] ) {
            return points[ index ][ pos ];
        } else {
            return 0;
        }
    },

    draw: function ( points, factor, close, fill, animatedBeginValueCopy, progress ) {
        var drawer = this.polyline.getDrawer(),
            s = kc.sharpen;

        if ( points.length > 0 ) {
            drawer.clear();
            var dir = this.param.animatedDir,
                xDir, yDir;
            ( dir == 'x' || dir == 'both' ) && ( xDir = true );
            ( dir == 'y' || dir == 'both' ) && ( yDir = true );

            if ( animatedBeginValueCopy ) {
                var prevPoints = animatedBeginValueCopy.points;
                var firstPointX = this.parsePoint( 0, 0, prevPoints );
                var firstPointY = this.parsePoint( 0, 1, prevPoints );
                var pointX, pointY;
                drawer.moveTo(
                    xDir ? s( ( points[ 0 ][ 0 ] - firstPointX ) * progress + firstPointX ) : s( points[ 0 ][ 0 ] ),
                    yDir ? s( ( points[ 0 ][ 1 ] - firstPointY ) * progress + firstPointY ) : s( points[ 0 ][ 1 ] )
                );

                for ( var i = 1; i < points.length; i++ ) {
                    if ( xDir ) pointX = this.parsePoint( i, 0, prevPoints );
                    if ( yDir ) pointY = this.parsePoint( i, 1, prevPoints );
                    drawer.lineTo(
                        xDir ? s( ( points[ i ][ 0 ] - pointX ) * progress + pointX ) : s( points[ i ][ 0 ] ),
                        yDir ? s( ( points[ i ][ 1 ] - pointY ) * progress + pointY ) : s( points[ i ][ 1 ] )
                    );
                }

            } else {
                drawer.moveTo( s( points[ 0 ][ 0 ] ), s( points[ 0 ][ 1 ] ) );
                for ( var i = 1; i < points.length; i++ ) {
                    drawer.lineTo( s( points[ i ][ 0 ] ), s( points[ i ][ 1 ] ) );
                }
            }
            if ( close ) {
                drawer.close();

                var f = fill;
                var pl = this.polyline;
                if( kity.Utils.isArray( fill ) ){ //判断fill是否为数组，是则为渐变

                    this.polyline.whenPaperReady(function(paper){
                        f = new kity.LinearGradientBrush().pipe( function() {
                            var g;
                            for( var i = 0; i < fill.length; i++ ){
                                g = fill[i];
                                this.addStop( g.pos, g.color||'#000', fill[i].opacity );
                            }
                            this.setStartPosition(0, 0);
                            this.setEndPosition(0, 1);
                            paper.addResource( this );
                        });
                    });

                }

                this.polyline.fill( f );

            }
        }
    },

    stroke: function ( color, width, dash ) {
        if(width === 0) width = 0.001;
        
        var pen = new kity.Pen();
        pen.setWidth( width );
        pen.setColor( color );
        if ( dash ) {
            pen.setDashArray( dash );
        }
        this.polyline.stroke( pen );
    }

} );

/**
 * 表示标签
 * @param {string} text
 *        标签的文本
 *
 * @param {string} at
 *        标签文本的位置，是指相对于标签本身坐标的方向
 *        允许取值为：center（默认）、left、right、up、down
 *
 * @param {int} margin
 *        文本离标签坐标在指定方向上的距离
 *
 * @param {Plain} style
 *        文本的样式（CSS）
 *
 * @param {int} color
 *        文本颜色
 */
var Label = kc.Label = kity.createClass( "Label", {

    base: kc.AnimatedChartElement,

    constructor: function ( param ) {
        this.callBase( kity.Utils.extend( {
            text: '',
            at: 'center',
            margin: 0,
            style: {
                fontFamily: 'Arial',
                fontSize : 'auto'
            },
            color: 'black',
            rotate: 0
        }, param ) );
        this.text = new kity.Text().setFont( {
            'fontSize': 'auto',
            'fontFamily': 'Arial'
        } );
        this.canvas.addShape( this.text );
    },

    registerUpdateRules: function () {
        return kity.Utils.extend( this.callBase(), {
            'updateText': [ 'text' ],
            'updateAnchor': [ 'at', 'margin', 'rotate' ],
            'updateColor': [ 'color' ],
            'updateStyle': [ 'style' ]
        } );
    },

    getAnimatedParam: function () {
        return [];
    },

    updateText: function ( text ) {
        this.text.setContent( text );
        this.updateSize();

        // 文本更新需要更新位置
        this.updateAnchor( this.param.at, this.param.margin, this.param.rotate );
    },

    updateSize: function () {
        this.size = 0;
        this.size = this.getSize();
        this.trigger( 'sizechanged' );
    },

    getSize: function () {
        return this.size || this.callBase();
    },

    updateStyle: function ( style ) {
        this.text.setStyle( style );
        this.updateSize();
        // this.updateAnchor( this.param.at, this.param.margin, this.param.rotate );
    },

    updateAnchor: function ( at, margin, rotate ) {
        var hh = this.size.height / 2;
        switch ( at ) {
        case 'left':
            this.text.setTextAnchor( 'end' ).setPosition( margin, hh / 1.5 );
            break;
        case 'right':
            this.text.setTextAnchor( 'start' ).setPosition( margin, hh / 1.5 );
            break;
        case 'up':
        case 'top':
            this.text.setTextAnchor( 'middle' ).setPosition( 0, hh - margin );
            break;
        case 'down':
        case 'bottom':
            var anchor = 'middle';
            if ( rotate !== 0 ) anchor = 'end';
            this.text.setTextAnchor( anchor ).setPosition( 0, hh + margin );
            break;
        default:
            this.text.setTextAnchor( 'middle' ).setPosition( 0, hh * 0.75 );
        }

        if ( rotate !== 0 ) this.text.setRotate( rotate );
    },

    updateColor: function ( color ) {
        this.text.fill( color );
    }

} );

/**
 *
 * @class Bar
 *
 * @param {int} dir
 *        指 Bar 的方向要冲下还是冲上，-1 是冲上（默认），1 是冲下
 *
 * @param {Number} width [Animatable]
 *        指实例的宽度
 *
 * @param {Number} height [Animatable]
 *        指实例的高度
 *        animatable: true
 *
 * @param {Number} offset [Animatable]
 *        指实例的位置
 *        animatable: true
 *
 * @param {kity.Color|String} [Animatable]
 *        指实例的颜色
 *        animatable: true
 */

( function ( kity, kc ) {

    var Bar = kc.Bar = kity.createClass( "Bar", {
        base: kc.AnimatedChartElement,

        constructor: function ( param ) {
            this.callBase( kity.Utils.extend( {
                dir: -1,
                offset: 0,
                color: '#000',
                width: 10,
                height: 0,
                rotate: 0,
                label: {
                    at: 'bottom',
                    color: 'black',
                    text: null,
                }
            }, param ) );
            this.rect = new kity.Path();
            this.canvas.addShape( this.rect );
            this.addElement( 'label', new kc.Label() );
        },

        registerUpdateRules: function () {
            return kity.Utils.extend( this.callBase(), {
                draw: [ 'width', 'height', 'dir', 'offset', 'rotate' ],
                fill: [ 'color' ],
                // updateText: [ 'labelText' ]
            } );
        },

        getAnimatedParam: function () {
            return [ 'width', 'height', 'offset']; //color暂时去掉color
        },

        // updateText: function ( labelText ) {
        //     this.getElement( 'label' ).update( {
        //         text: labelText
        //     } ).setRotate( rotate );
        // },

        fill: function ( color ) {
            this.rect.fill( color );
        },

        draw: function ( width, height, dir, offset, rotate ) {

            var ww = width / 2;

            var seq = [];

            seq.push( 'M', -ww, -offset );
            seq.push( 'L', -ww, -offset + dir * height );
            seq.push( 'L',  ww, -offset + dir * height );
            seq.push( 'L',  ww, -offset );
            seq.push( 'L',  ww, -offset );
            seq.push( 'Z' );

            this.rect.setPathData( seq ).setRotate( rotate );

            this.interestPoint = {
                x: 0,
                y: dir * height
            };
        },

        getInterestPoint: function () {
            return this.canvas.getTransform().transformPoint( this.interestPoint );
        }
    } );
} )( kity, kc );

/**
 * @build
 * @require base/ChartElement.js
 */

/* abstract */
var Coordinate = kc.Coordinate = kity.createClass( "Coordinate", ( function () {
	return {
        base: kc.ChartElement,
	};
} )() );

/**
 * 直角坐标系
 * @param {Array} dataSet
 *        要显示在坐标系上的数据集（每个元素需要 x, y 数据）
 *
 * @param {Number} width
 *        坐标系要渲染的宽度
 *
 * @param {Number} height
 *        坐标系要渲染的高度
 */
var CategoryCoordinate = kc.CategoryCoordinate = kity.createClass( "CategoryCoordinate", ( function () {
    function defaultFormat( number, index ) {
        if ( number > 1000 ) {
            return number / 1000 + 'K';
        }
        number = ( ( number * 10 ) | 0 ) / 10;
        return number;
    }

    var arrowParam = {
        w: 0,
        h: 1,
        a: 7,
        b: 2,
        c: 3,
        d: 0,
        t: 0
    };

    var allComponents = [ "xMesh", "yMesh", "xCat", "yCat", "xAxis", "yAxis" ];

    var componentsIniter = {
        "xMesh" : function(){
            !this.getElement( 'xMesh') && this.addElement( 'xMesh', new kc.Mesh( {
                type: 'vertical'
            } ) );
        },
        "yMesh" : function(){
            !this.getElement( 'yMesh') && this.addElement( 'yMesh', new kc.Mesh( {
                type: 'horizon',
                dir: 1
            } ) );
        },
        "xCat" : function(){
            !this.getElement( 'xCat') && this.addElement( 'xCat', new kc.Categories( {
                at: 'bottom',
                rotate: this.param.xLabelRotate
            } ) );
        },
        "yCat" : function(){
            !this.getElement( 'yCat') && this.addElement( 'yCat', new kc.Categories( {
                at: 'left',
                rotate: this.param.yLabelRotate
            } ) );
        },
        "xAxis" : function(){
            !this.getElement( 'xAxis') && this.addElement( 'xAxis', new kc.Line( {
                color: '#999'
            } ) );
            
            if( this.param.xAxisArrow && !this.xArrow )
                this.canvas.addShape( this.xArrow = new kity.Arrow( arrowParam ).fill( '#999' ) );
        },
        "yAxis" : function(){
            !this.getElement( 'yAxis') && this.addElement( 'yAxis', new kc.Line( {
                color: '#999'
            } ) );

            if( this.param.yAxisArrow && !this.yArrow )
                this.canvas.addShape( this.yArrow = new kity.Arrow( arrowParam ).fill( '#999' ) );
        }
    };

    return {
        base: kc.Coordinate,
        constructor: function ( param ) {

            var mix = kity.Utils.extend({
                components : null,
                dataSet: [],
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 90,
                    left: 100
                },
                padding: {
                    top: 20,
                    right: 20,
                    bottom: 0,
                    left: 0
                },

                unitX: null,
                unitY: null,
                meshX: true,
                meshY: true,
                formatX: null,
                formatY: null,
                rangeX: [ 0, 100 ],
                rangeY: [ 0, 100 ],
                minX: null,
                minY: null,
                xLabelsAt: null,
                yLabelsAt: null,
                labelMargin: 10,
                xAxisArrow: null,
                yAxisArrow: null,
                xLabelRotate: 0,
                yLabelRotate: 0,
                xLabelFont : null,
                yLabelFont : null,
                xAxisStyle : null,
                yAxisStyle : null
            }, param );

            this.callBase( mix );

            this._initRulers();
            // this._initElements();

        },
        _initRulers: function () {
            this.xRuler = new kc.Ruler();
            this.yRuler = new kc.Ruler();
        },
        _initElements: function (components) {
            components = ( !components )? allComponents : components;
            this._processComponents( components );
        },
        registerUpdateRules: function () {
            return kity.Utils.extend( this.callBase(), {
                'updateAll': [ 
                    'components',
                    'dataSet',
                    'margin',
                    'padding',
                    'unitX',
                    'unitY',
                    'meshX',
                    'meshY',
                    'formatX',
                    'formatY',
                    'rangeX',
                    'rangeY',
                    'minX',
                    'minY',
                    'xLabelsAt',
                    'yLabelsAt',
                    'labelMargin',
                    'xAxisArrow',
                    'yAxisArrow',
                    'xLabelRotate',
                    'yLabelRotate',
                    'xLabelFont',
                    'yLabelFont',
                    'xAxisStyle',
                    'yAxisStyle'
                ]
            } );
        },
        getXRuler: function () {
            return this.xRuler;
        },
        getYRuler: function () {
            return this.yRuler;
        },

        _processComponents : function(components){
            var i, key;
            for( i in allComponents ){
                key = allComponents[ i ];
                if( ~components.indexOf( key ) ){
                    func = componentsIniter[ key ];
                    func && func.bind(this)();
                }else{
                    this.removeElement( key );
                }
            }
        },

        getXLabels : function(){
            return this.xLabels;
        },

        getYLabels : function(){
            return this.yLabels;
        },

        measurePoint : function( point ){
            var p = this.param;
            var x = this.xRuler.measure(point[0]) + p.margin.left,
                y = this.yRuler.measure(point[1]) + p.margin.top + p.padding.top;
            return [ x, y ];
        },

        measurePointX : function( x ){
            return this.xRuler.measure(x) + this.param.margin.left;
        },

        measurePointY : function( y ){
            return this.yRuler.measure(y) + this.param.margin.top + this.param.padding.top;
        },

        measureValueRange : function( val, type ){
            var method = type == 'x'? 'measurePointX' : 'measurePointY';
            return  this[ method ]( val ) - this[ method ]( 0 );
        },

        updateAll: function (
                components,
                dataSet,
                margin,
                padding,
                unitX,
                unitY,
                meshX,
                meshY,
                formatX,
                formatY,
                rangeX,
                rangeY,
                minX,
                minY,
                xLabelsAt,
                yLabelsAt,
                labelMargin,
                xAxisArrow,
                yAxisArrow,
                xLabelRotate,
                yLabelRotate,
                xLabelFont,
                yLabelFont,
                xAxisStyle,
                yAxisStyle
        ){

            this._initElements( components );

            var width = this.container.getWidth() - margin.left - margin.right,
                height = this.container.getHeight() - margin.top - margin.bottom;

            var xCategories = dataSet.xAxis && dataSet.xAxis.categories;
            var yCategories = dataSet.yAxis && dataSet.yAxis.categories;

            var xGridArr = dataSet.xAxis && dataSet.xAxis.grid;
            var yGridArr = dataSet.yAxis && dataSet.yAxis.grid;

            var xFormat = formatX || defaultFormat,
                yFormat = formatY || defaultFormat;

            var xRuler = this.xRuler, xMin, xMax, xCount;
            var yRuler = this.yRuler, yMin, yMax, yCount;

            if( xCategories ){
                rangeX = [0, xCategories.length-1];
            }
            xMin = kity.Utils.isNumber( minX )? minX : rangeX[ 0 ];
            xMax = rangeX[ 1 ];

            if( yCategories ){
                rangeY = [0, yCategories.length-1];
            }
            yMin = kity.Utils.isNumber( minY )? minY : rangeY[ 0 ];
            yMax = rangeY[ 1 ]; 


            xRuler.ref( xMin, xMax ).map( padding.left, width - padding.right );
            if(xCategories){
                xGrid = xRuler.gridByCategories( xCategories.length );
            }else if( kity.Utils.isArray(xGridArr) ){
                xGrid = xRuler.gridByArray( xGridArr );
            }else{
                xCount = width / 60 | 0;
                xGrid = xRuler.gridByCount( xCount, null, true, minX );
            }
          
            yRuler.ref( yMin, yMax ).map( height - padding.top - padding.bottom, 0 );
            if(yCategories){
                yGrid = yRuler.gridByCategories( yCategories.length );
            }else if( kity.Utils.isArray(yGridArr) ){
                yGrid = yRuler.gridByArray( yGridArr );
            }else{
                yCount = height / 40 | 0;
                yGrid = yRuler.gridByCount( yCount, null, true, minY );
            }

            for (var i = 0; i < yGrid.map.length; i++) {
                yGrid.map[i] = yGrid.map[i] + padding.top;
            }

            var xAxis = this.getElement( 'xAxis' ),
                yAxis = this.getElement( 'yAxis' ),
                xCat  = this.getElement( 'xCat' ),
                yCat  = this.getElement( 'yCat' ),
                xMesh = this.getElement( 'xMesh' ),
                yMesh = this.getElement( 'yMesh' );

            xAxis && xAxis.update({
                x1: 0,
                y1: height,
                x2: width,
                y2: height,
                width: xAxisStyle.width,
                color: xAxisStyle.color
            });

            yAxis && yAxis.update({
                x1: 0,
                y1: 0,
                x2: 0,
                y2: height,
                width: yAxisStyle.width,
                color: yAxisStyle.color
            });

            if( unitX ){
                this.unitXLabel = this.unitXLabel || this.addElement( 'unitXLabel', new kc.Label() );
                this.unitXLabel.update({
                    text: '(' + unitX + ')',
                    at: 'right',
                    margin: 0,
                    style : xLabelFont,
                    color: xLabelFont.color || '#000',
                    x : width + 10,
                    y : height + 16
                }); 
            }

            if( unitY ){
                this.unitYLabel = this.unitYLabel || this.addElement( 'unitYLabel', new kc.Label() );

                this.unitYLabel.update({
                    text: '(' + unitY + ')',
                    at: yLabelsAt,
                    margin: 0,
                    style: yLabelFont,
                    color: yLabelFont.color || '#000',
                    x : -8,
                    y : -14
                });
            }

            var xLabels = xCategories ? xCategories : xGrid.ref.map( xFormat );
            if(xCat){
                xCat.update( {
                    rules: xGrid.map,
                    labels: xLabels,
                    y: height,
                    step: dataSet.xAxis && dataSet.xAxis.step || 1,
                    at : xLabelsAt || 'bottom',
                    font : xLabelFont
                } );
            }
            if(xCategories){
                this.xLabels = xLabels;
            }

            var yLabels = yCategories ? yCategories : yGrid.ref.map( yFormat );
            if(yCat){
                margin = yLabelsAt == 'right'? xRuler._map.to + labelMargin : labelMargin;

                yCat.update( {
                    rules: yGrid.map,
                    labels: yLabels,
                    x: 0,
                    step: dataSet.yAxis && dataSet.yAxis.step || 1,
                    at : yLabelsAt || 'left',
                    margin : margin,
                    font : yLabelFont
                } );
            }
            if(yCategories){
                this.yLabels = yLabels;
            }

            xMesh && xMesh.update( {
                rules: xGrid.map,
                length: height,
                y: height,
                step: dataSet.xAxis && dataSet.xAxis.step || 1
            } );

            yMesh && yMesh.update( {
                rules: yGrid.map,
                length: width, //xGrid.map[ xGrid.map.length - 1 ],
                x: 0,
                y: 0,
                step: dataSet.yAxis && dataSet.yAxis.step || 1
            } );

            this.xArrow && this.xArrow.setTranslate( width, height + 0.5 );
            this.yArrow && this.yArrow.setRotate( -90 ).setTranslate( 0.5, 0 );
        },

        setCoordinateConf : function( conf ) {
            var result = {},
                components = [];

            var xAxis = conf.xAxis,
                yAxis = conf.yAxis,
                tmp;

            // 组件
            xAxis.axis.enabled  && components.push( 'xAxis' );
            xAxis.ticks.enabled && components.push( 'xMesh' );
            xAxis.label.enabled && components.push( 'xCat' );
            yAxis.axis.enabled  && components.push( 'yAxis' );
            yAxis.ticks.enabled && components.push( 'yMesh' );
            yAxis.label.enabled && components.push( 'yCat' );
            result.components = components;

            result.xAxisArrow = xAxis.axis.arrow;
            result.xAxisStyle = {
                width : xAxis.axis.width,
                color : xAxis.axis.color
            };

            result.yAxisArrow = yAxis.axis.arrow;
            result.yAxisStyle = {
                width : yAxis.axis.width,
                color : yAxis.axis.color
            };

            // 外部空隙
            var xm = xAxis.margin,
                ym = yAxis.margin;
            result.margin = {
                left   : xm.left || 0,
                right  : xm.right || 0,
                top    : ym.top || 0,
                bottom : ym.bottom || 0
            };

            // 内部空隙
            var xp = xAxis.padding,
                yp = yAxis.padding;
            result.padding = {
                left   : xp.left || 0,
                right  : xp.right || 0,
                top    : yp.top || 0,
                bottom : yp.bottom || 0
            };

            // 指定刻度最小值
            var minX = kity.Utils.queryPath('xAxis.min', conf);
            if( kity.Utils.isNumber( minX ) ){
                result['minX'] = minX;
            }
            var minY = kity.Utils.queryPath('yAxis.min', conf);
            if( kity.Utils.isNumber( minY ) ){
                result['minY'] = minY;
            }

            // 指定范围
            conf.rangeX && (result.rangeX = conf.rangeX);
            conf.rangeY && (result.rangeY = conf.rangeY);

            // label位置
            // result.xLabelsAt = xAxis.label.at || "middle";
            result.xLabelRotate = xAxis.label.rotate;
            result.xLabelFont = xAxis.label.font;

            result.yLabelsAt = yAxis.label.at || "left";
            result.yLabelRotate = yAxis.label.rotate;
            result.yLabelFont = yAxis.label.font;

            result.labelMargin = yAxis.label.margin || 10;

            // 坐标轴标签格式化
            result.formatX = kity.Utils.queryPath('xAxis.label.format', conf);
            result.formatY = kity.Utils.queryPath('yAxis.label.format', conf);

            // 单位
            result.unitX = kity.Utils.queryPath('xAxis.unit.text', conf) || '';
            result.unitY = kity.Utils.queryPath('yAxis.unit.text', conf) || '';

            result.x = kity.Utils.queryPath('xAxis.margin.left', conf) || 0;
            result.y = kity.Utils.queryPath('yAxis.margin.top', conf) || 0;

            var confCopy = kity.Utils.copy( conf );

            // categories 判断
            if( confCopy.yAxis.inverted ){
                confCopy.yAxis.categories = confCopy.xAxis.categories;
                delete( confCopy.xAxis.categories );

                result['minX'] = minY;
                delete result['minY'];
                
            }else{
                delete( confCopy.yAxis.categories );
            }

            result.dataSet = confCopy;
            return result;
        }
    };
} )() );

var ElementList = kc.ElementList = kity.createClass( "ElementList", {
    base: kc.ChartElement,
    constructor: function ( param ) {
        // param
        this.callBase( kity.Utils.extend( {
            list: [],
            fx: true,
            common: {}
        }, param ) );

        this.elementList = [];
        this.updateClass( this.param.elementClass );
        this.fxTimers = [];
    },

    getElementList: function () {
        return this.elementList;
    },

    registerUpdateRules: function () {
        return kity.Utils.extend( this.callBase(), {
            updateClass: [ 'elementClass' ],
            updateCommon: [ 'common' ],
            updateList: [ 'list' ]
        } );
    },

    updateCommon: function ( common ) {
        this.elementList.forEach( function ( element ) {
            element.update( common );
        } );
    },

    updateList: function ( list ) {
        var me = this;
        var elementList = this.elementList,
            growth = list.length - elementList.length,
            fx = kc.fx && this.param.fx,
            delay = 0,
            delayBase = 500 / list.length,
            fxTimers = this.fxTimers;

        this.adjust( growth );

        while ( fxTimers.length ) {
            clearTimeout( this.fxTimers.pop() );
        }

        var count = elementList.length,
            fill = 0,
            me = this;

        function checkFinish() {
            if ( fill == count ) {
                me.trigger( 'listupdatefinish' );
            }
        }
        elementList.forEach( function ( element, index ) {

            if ( fx && ( 'animate' in element ) ) {
                
                fxTimers.push( setTimeout( function () {
                    element.animate( list[ index ], me.param.animateDuration || 600, me.param.fxEasing || 'ease' ).timeline.on( 'finish', function () {
                        fill++;
                        checkFinish();
                    } );

                }, list[ index ].delay || delay ) );

                delay += Math.random() * delayBase;

            } else {

                fill++;
                checkFinish();
                element.update( list[ index ] );
            }

        } );
    },

    updateClass: function ( elementClass ) {
        if ( !elementClass || this.elementClass == elementClass ) return;
        this.elementClass = elementClass;
        this.shrink( this.elementList.lenght );
    },

    adjust: function ( growth ) {
        if ( growth > 0 ) {
            this.grow( growth );
        } else if ( growth < 0 ) {
            this.shrink( -growth );
        }
    },

    grow: function ( size ) {
        var element;
        while ( size-- ) {
            element = new this.elementClass();
            element.container = this;
            this.canvas.addShape( element.canvas );
            this.elementList.push( element );
            element.update( this.param.common );
            if ( this.param.fx ) {
                element.canvas.setOpacity( 0 ).fadeIn( 200, 'ease' );
            } else {
                element.canvas.setOpacity( 1 );
            }
        }
    },

    shrink: function ( size ) {
        var removed = this.elementList.splice( -size );
        while ( removed.length ) {
            this.canvas.removeShape( removed.pop().canvas );
        }
    },

    find: function ( id ) {
        for ( var i = 0, ii = this.elementList.length; i < ii; i++ ) {
            if ( this.elementList[ i ].param.id == id ) return this.elementList[ i ];
        }
    }
} );

/**
 * 具有一个扇环的单点类型
 *
 * @param {String} label
 *        标签显示的文本
 *
 * @param {String} labelColor
 *        标签的颜色
 *
 * @param {String} labelPosition
 *        标签出现的位置，允许取值为：inside, left, top, right, bottom, auto
 *
 * @param {Number} pieInnerRadius
 *        半径大小
 *
 * @param {Number} pieOuterRadius
 *        扇环的大小
 *
 * @param {Number} pieAngle
 *        扇环的角度
 *
 * @param {String} pieColor
 *        扇环的颜色
 */
var Pie = kc.Pie = kity.createClass( "Pie", {

	base: kc.AnimatedChartElement,

	constructor: function ( param ) {
		this.callBase( kity.Utils.extend( {
			labelText: null,
			labelColor: '#62a9dd',
			labelPosition: 'inside',

			connectLineWidth: 1,
			connectLineColor: '#62a9dd',

			innerRadius: 0,
			outerRadius: 0,
			startAngle: 0,
			pieAngle: 0,

			strokeWidth: 1,
			strokeColor: '#FFF',

			color: '#62a9dd'
		}, param ) );

		this.pie = new kity.Pie();

		this.canvas.addShape( this.pie );
		this.label = this.addElement( 'label', new kc.Label() );
		this.connectLine = this.addElement( 'connectLine', new kc.Line() );
	},

	registerUpdateRules: function () {
		return kity.Utils.extend( this.callBase(), {
			updatePies: [ 'innerRadius', 'outerRadius', 'startAngle', 'pieAngle', 'strokeWidth', 'strokeColor' ],
			updatePiesColor: [ 'color' ],
			updateLabel: [ 'labelText', 'labelColor', 'labelPosition', 'outerRadius', 'startAngle', 'pieAngle' ],
			updateConnectLine: [ 'labelText', 'connectLineWidth', 'connectLineColor', 'labelPosition', 'innerRadius', 'outerRadius', 'startAngle', 'pieAngle' ]
		} );
	},

	getAnimatedParam: function () {
		return [ 'startAngle', 'pieAngle' ];
	},

	updatePiesColor: function ( color ) {
		// color = kity.Color.parse( color );
		this.pie.fill( color );
	},

	updatePies: function ( innerRadius, outerRadius, startAngle, pieAngle, strokeWidth, strokeColor ) {

		this.pie.innerRadius = innerRadius;
		this.pie.outerRadius = outerRadius;
		this.pie.startAngle = startAngle-90;
		this.pie.pieAngle = pieAngle;
		this.pie.draw();
		// this.pie.bringTop();
		if(strokeWidth===0)strokeWidth=0.001;
		var pen = new kity.Pen();
		pen.setWidth( strokeWidth );
		pen.setColor( strokeColor );
		this.pie.stroke( pen );

	},

	updateLabel: function ( labelText, labelColor, labelPosition, outerRadius, startAngle, pieAngle ) {
		if( labelPosition == 'none' ) return;

		var r = labelPosition == 'inside' ? outerRadius - 30 : outerRadius + 50;
		var a = ( startAngle + pieAngle / 2 ) / 180 * Math.PI;

		this.label.setVisible( true );
		this.label.update( {
			text: labelText,
			color: labelColor,
			at: 'bottom',
			margin: 0,
			x: r * Math.cos( a ),
			y: r * Math.sin( a )
		} );

	},

	updateConnectLine: function ( labelText, connectLineWidth, connectLineColor, labelPosition, innerRadius, outerRadius, startAngle, pieAngle ) {
		if ( labelPosition != 'outside' || !labelText ) return;

		var r = outerRadius + 30;
		var a = ( startAngle + pieAngle / 2 ) / 180 * Math.PI;

		this.connectLine.update( {
			x1: ( innerRadius + 2 ) * Math.cos( a ),
			y1: ( innerRadius + 2 ) * Math.sin( a ),
			x2: r * Math.cos( a ),
			y2: r * Math.sin( a ),
			width: connectLineWidth,
			color: connectLineColor
		} );

	}

} );

/**
 * 在一个序列上渲染文字
 *
 * @param {String} at
 *        序列方向，支持 'left'|'bottom'
 *
 * @param {Array} rules
 *        刻度位置，由小到大排序
 *
 * @param {Array} labels
 *        刻度文本，要求和 rules 有同样的长度，一一对应
 *
 * @param {String} color
 *        文字颜色
 */
var Categories = kc.Categories = kity.createClass( 'Categories', {

	base: kc.ChartElement,

	constructor: function ( param ) {
		this.callBase( kity.Utils.extend( {
			at: 'bottom',
			rules: [],
			labels: [],
			color: 'black',
			margin: 10,
			step: 1,
			rotate: 0,
			font : {}
		}, param ) );

		this.addElement( 'labels', new kc.ElementList( {
			elementClass: kc.Label
		} ) );
	},

	registerUpdateRules: function () {
		return kity.Utils.extend( this.callBase(), {
			'updateCategories': [ 'rules', 'labels', 'at', 'margin', 'rotate', 'font', 'step' ],
			'updateCommon': 'common'
		} );
	},

	updateCategories: function ( rules, labels, at, margin, rotate, font, step ) {
		var i, rule, x, y, list = [];

		// step == 0 不绘制
		for (i = 0; i < rules.length; i += step) {
			rule = rules[i];
			if ( at == 'left' ) {
				x = -margin;
				y = rule;
			} else if ( at == 'bottom' ) {
				x = rule;
				y = margin;
			} else if ( at == 'right' ) {
				x = margin;
				y = rule;
			}

			list.push({
				x: x,
				y: y,
				at: at,
				rotate: rotate,
				text: labels[ i ],
				style : font,
				color : font && font.color || 'black'
			});
		}

		this.getElement( 'labels' ).update( {
			list: list,
			fx: true
		} );
	}
} );

kc.ChartsConfig = (function(){

    var _configs = {};

    function add( key, val ){
        _configs[key] = val;
    }

    function remove( key ){
        delete _configs[key];
    }

    function init( type ){
        var base = kity.Utils.copy(_configs.base), mix;

        if( type in _configs ){
            return kity.Utils.deepExtend( base, _configs[ type ] );
        }else{
            return  base;
        }
    }

    return {
        add : add,
        init : init
    }

})();

kc.ChartsConfig.add('base', {
    color : [
        'rgb(31, 119, 180)',
        'rgb(174, 199, 232)',
        'rgb(255, 127, 14)',
        'rgb(255, 187, 120)',
        'green'
    ],

    finalColor: 'rgb(255, 187, 120)',

    xAxis : {

        ticks: {
            enabled : true,
            dash : null,
            width: 1,
            color: '#808080'
        },

        axis : {
            enabled : true,
            arrow : true,
            width : 1,
            color : '#000'
        },

        label : {
            enabled : true,
            rotate : 0,
            font : {
                color : "#000",
                fontSize : 12,
                family : "Arial"
            }
        },

        padding : {
            left : 0,
            right : 20
        },

        margin : {
            left : 80,
            right : 50
        }
    },

    yAxis : {
        categories : [],

        ticks: {
            enabled : true,
            dash : null,
            value: 0,
            width: 1,
            color: '#808080'
        },

        axis : {
            enabled : true,
            arrow : true,
            width : 1,
            color : '#000'
        },

        label : {
            enabled : true,
            rotate : 0,
            font : {
                color : "#000",
                fontSize : 12,
                family : "Arial"
            }
        },

        padding : {
            top: 20,
            bottom : 0
        },

        margin : {
            top : 20,
            bottom : 60
        }

    },

    plotOptions : {

        label : {
            enabled : false,
            text : {
                color : '#333',
                margin : -15
            }
        }

    },

    interaction : {

        indicatrix : {
            enabled : false,
            color : '#BBB',
            width : 1,
            dash : [ 4, 2 ],
        },

        hover : {
            enabled : false,
            circle : {
                radius : 4,
                stroke : {
                    width : 2,
                    color : '#FFF'
                }
            }
        }

    },

    legend : {
        enabled : true,
        level : 'entry'
    },

    animation : {
        enabled : true,
        duration : 600,
        mode : 'ease'
    },
});


kc.ChartsConfig.add('bar', {

	yAxis : {
		padding : {
			bottom : 30,
			top : 30
		},
		inverted : true,
		min : 0
	},

    plotOptions : {

        bar : {
            width : 25,
            margin: 0
        }

    }
    
});


kc.ChartsConfig.add('column', {

    xAxis: {
        margin : {
            right : 60,
            left : 60
        },

        padding : {
            left : 40,
            right : 40
        }
    },

    yAxis: {
        min : 0,
        padding : {
            top : 0,
            bottom : 0
        }
    },

    plotOptions : {

        column : {
            width : 8,
            margin: 1
        }

    }
    
});


kc.ChartsConfig.add('area', {

    plotOptions : {

        area : {
            
            stroke : {
                width : 1,
                color : '#FFF'
            },

            label : {
                enabled : true,
                radius : 3
            },

            fill : {
                grandientStopOpacity : 0.5
            },

            dot : {
                enabled : true,
                radius : 3
            }    

        }

    }
    
});


kc.ChartsConfig.add('pie', {

    plotOptions : {

        pie: {
            center: {
                x : 200,
                y : 200
            },
            stroke : {
                width : 1,
                color : '#FFF'
            },
            shadow : {
                enabled : false,
                size : 2,
                x : 1,
                y : 1,
                color : "rgba( 0, 0, 0, 0.3 )"
            },
            innerRadius : 40,
            outerRadius : 80,
            incrementRadius : 30
        }

    }
    
});

kc.ChartData = kity.createClass( 'ChartData', {
    base: kc.Data,
    
    format: function () {
        var origin = this.origin,
            queryPath = kity.Utils.queryPath;

        var i, j, k, all = [], data;

        var min = 0;
        var max = 100;

        var totalMap = {}, total, tmp;
        var series = origin.series;
        var _time = '_' + (+new Date);
        var categoriesLength = queryPath('xAxis.categories.length', origin) || queryPath('yAxis.categories.length', origin);
        var isPercentage = queryPath( 'yAxis.percentage', origin ),
            isStacked = queryPath( 'yAxis.stacked', origin );
        var obj = {}, group, groupName, seriesGroup = {};
        var tmpLevel, tmpGroup, groupIndex = 0, sumObj, entry;

        if( series ){

            tmp = series;

            obj = {};
            seriesGroup = {};

            for( i = 0; i < tmp.length; i++ ){
                tmp[i].index = i;
                tmp[i].group = isStacked ? ( tmp[i].group || _time ) : i;
                group = tmp[i].group;
                obj[ group ] = obj[ group ] || [];
                obj[ group ].push( tmp[ i ].data );

                seriesGroup[ group ] = seriesGroup[ group ] || [];
                seriesGroup[ group ].push( tmp[ i ] );
            }

            groupIndex = 0;
            for( groupName in obj ){
                sumObj = stackSum( obj[ groupName ], categoriesLength );
                tmpLevel = sumObj.offset;
                tmpGroup = seriesGroup[ groupName ];

                for( j = 0; j < tmpGroup.length; j++ ){
                    entry = tmpGroup[ j ];
                    
                    entry.indexInGroup = j;
                    entry.groupIndex = groupIndex;

                    entry.offset = tmpLevel[ j ];
                    entry.allOffset = tmpLevel;
                    entry.sum = tmpLevel[ obj[ groupName ].length ];
                    entry.percentage = sumObj.percentage[ j ];
                    entry.percentageOffset = sumObj.percentageOffsetLevel[ j ];
                    entry.allPercentageOffset = sumObj.percentageOffsetLevel;

                }
                groupIndex++;
            }

            origin.yAxis = origin.yAxis || {};
            origin.yAxis.groupCount = groupIndex;

            for(i = 0; i < tmp.length; i++){
                // tmp[i].originData = kity.Utils.copy( tmp[i].data );
                data = isStacked || isPercentage ? tmp[i].sum : tmp[i].data;
                all = all.concat( data );
            }
                
            
            if( !isPercentage ){
                min = all.length > 0 ? Math.min.apply( [], all ) : 0;
                max = all.length > 0 ? Math.max.apply( [], all ) : 100;
            }

            if( isStacked || isPercentage ){
                min = 0;
            }
        }
        

        function stackSum( arr, length ){
            var i, j, k, tmpSum = 0, sum = [], offsetLevel = {}, percentage = [], percentageOffsetLevel = {}, tmpPer = [], start = [];
            for( i = 0; i < length; i++ ){
                start.push( 0 );
                tmpSum = 0;

                for( j = 0; j < arr.length; j++ ){
                    tmpSum += Number(( arr[ j ][ i ] || 0 ));
                    offsetLevel[ j+1 ] = offsetLevel[ j+1 ] || [];
                    offsetLevel[ j+1 ][ i ] = tmpSum;
                }
                sum.push( tmpSum );

                tmpPer = [];
                for( k = 0; k < arr.length; k++ ){
                    percentage[ k ] = percentage[ k ] || [];
                    percentage[ k ][ i ] = arr[ k ][ i ] / tmpSum * 100;


                    percentageOffsetLevel[ k+1 ] = percentageOffsetLevel[ k+1 ] || [];
                    percentageOffsetLevel[ k+1 ][ i ] = offsetLevel[ k+1 ][ i ] / tmpSum * 100;
                }
                
            }

            offsetLevel[ 0 ] = percentageOffsetLevel[ 0 ] = start;

            return {
                    offset : offsetLevel,
                    percentageOffsetLevel : percentageOffsetLevel,
                    percentage : percentage
                };
        }

        var result = {
                chart : origin.chart || 'line',
                xAxis :  {
                    categories : queryPath( 'xAxis.categories', origin ) || [],
                    step : queryPath( 'xAxis.step', origin ) || 1
                },

                yAxis : queryPath( 'yAxis', origin ) || {},

                plotOptions : origin.plotOptions || {},

                series : origin.series || [],
                rangeY : [min, max],
                rangeX : [min, max]
            };

        return result;
    }
} );

kc.PieData = kity.createClass( 'PieData', {
    base: kc.Data,
    
    format: function () {
        var origin = this.origin,
            queryPath = kity.Utils.queryPath;

        var i, j, k, all = [], data;
        var series = origin.series;

        if( series ){

            for( i = 0; i < series.length; i++ ){
                series[ i ].index = i;
                getPercent( series[ i ].data );
            }
            
        }
        
        function getPercent( arr ){
            var i, sum = 0, arr, percent = [], angle = [], offset = [];

            for( i = 0; i < arr.length; i++ ){
                offset.push( sum );
                sum += kity.Utils.isNumber( arr[ i ].value ) ? arr[ i ].value : arr[ i ] ;
            }

            var val, tmp, obj, offsetAngle = 0;
            for( i = 0; i < arr.length; i++ ){
                val = kity.Utils.isNumber( arr[ i ].value ) ? arr[ i ].value : arr[ i ] ;
                obj = arr[ i ] = kity.Utils.isObject( arr[ i ] ) ? arr[ i ] : {};

                obj.percent = tmp = val / sum;
                obj.angle = tmp * 360;
                obj.offsetAngle = offsetAngle;
                obj.index = i;

                offsetAngle += obj.angle;
            }

            return arr;
        }

        var result = {
                chart : origin.chart,
                xAxis :  {
                    categories : queryPath( 'xAxis.categories', origin ) || [],
                    step : queryPath( 'xAxis.step', origin ) || 1
                },

                yAxis : queryPath( 'yAxis', origin ) || {},

                plotOptions : origin.plotOptions || {},

                series : origin.series || []
            };

        return result;
    }
} );

(function(){

var PiePlots = kc.PiePlots = kity.createClass( 'PiePlots', {
    base: kc.ChartElement,

    constructor: function ( config ) {
        this.callBase( config );
        this.chartType = 'pie'; // 这一行争取去掉
        this.config = config || {};
        
        this.pies = this.addElement( 'pies', new kc.ElementList() );
    },

    update: function ( config ) {
        this.config = kity.Utils.extend( this.config, config );
        this.drawPlots( this.config );
    },

    getEntryColor : function( entry ){
         return entry.color || this.config.color[ entry.index ] || this.config.finalColor;
    },

    getLabelColor : function( isCenter ){
        var opt = this.config.plotOptions,
            lpos = opt.pie.labelPosition,
            text = opt.label.text;
        
        return lpos == 'outside' ? text.color : isCenter ? '#FFF' : text.color;
    },

    drawPlots : function ( config ){
        var self = this;
        var list = [], series = config.series, opt = config.plotOptions,
            outer = opt.pie.outerRadius,
            inner = opt.pie.innerRadius,
            increment = opt.pie.incrementRadius
            lpos = opt.pie.labelPosition;

        for( var i = 0 ; i < series.length; i++ ){

            series[ i ].data.map(function( entry, j ){

                list.push({

                    labelText: opt.label.enabled && entry.angle > 10 ? (entry.label ? entry.label : entry.value) : null,
                    labelColor: self.getLabelColor( i == 0 ),
                    labelPosition: lpos ? lpos : i == 0 ? 'inside' : 'none',

                    connectLineWidth: 1,
                    connectLineColor: self.getEntryColor( entry ),

                    innerRadius : i == 0 ? inner : (outer  + ( i - 1 ) * increment),
                    outerRadius : outer + increment * i,
                    startAngle : entry.offsetAngle,
                    pieAngle: entry.angle,

                    strokeWidth : opt.pie.stroke.width,
                    strokeColor : opt.pie.stroke.color,

                    color: self.getEntryColor( entry ),

                    x : opt.pie.center.x,
                    y : opt.pie.center.y

                });

            });

        }

        this.pies.update({
            elementClass : kc.Pie,
            list : list,
            fx : config.animation.enabled,
            animateDuration : config.animation.duration,
            fxEasing : config.animation.mode
        });

        var shadow = config.plotOptions.pie.shadow;
        if( shadow.enabled ){
            var filter = new kity.ProjectionFilter( shadow.size, shadow.x, shadow.y );
            filter.setColor( shadow.color );
            this.getPaper().addResource( filter );

            this.pies.getElementList().forEach(function(pie,i){
                // 判断透明度为0,这里需要修改，用正则表达式
                var color = list[i].color;
                if(!(color.indexOf('rgba(') == 0 && color.indexOf('0)') == color.length-2)){
                    pie.canvas.applyFilter( filter );
                }
            });

        }

    }

} );


})();

(function(){

var BasePlots = kc.BasePlots = kity.createClass( 'BasePlots', {
    base: kc.ChartElement,

    constructor: function ( coordinate, config ) {
        this.callBase( coordinate, config );
        this.coordinate = coordinate;
        this.config = config || {};

        this.plotsElements = this.addElement( 'plotsElements', new kc.ElementList() );

        this.plotsAttrsInit();
    },

    getPlotsElements : function(){
        return this.plotsElements;
    },

    getEntryColor : function( entry, index ){
        var obj = entry.style && entry.style[ index ];
        if( obj && obj.color ){
            return obj.color;
        }
        return entry.color || this.config.color[ entry.index ] || this.config.finalColor;
    },

    update: function ( coordinate, config ) {
        this.coordinate = coordinate || this.coordinate;
        this.config = kity.Utils.extend( this.config, config );

        this.drawPlots( this.coordinate, this.config );
    },

} );


})();

(function(){

function sum( arr ){
    var sum = 0;
    for(var i = 0; i < arr.length; i++){
        sum += arr[i];
    }
    return sum;
}

var StickPlots = kc.StickPlots = kity.createClass( 'StickPlots', {
    base: kc.BasePlots,

    constructor: function ( coordinate, config ) {
        this.callBase( coordinate, config );
    },

    drawPlots: function ( coordinate, config ) {
        var oxy = coordinate,
            opt = config.plotOptions
            ;

        rotateAngle = this.rotateAngle;
        measureCategoryMethod = this.measureCategoryMethod;
        measureValueMethod = this.measureValueMethod;
        dir = this.stickDir;


        var xRuler = oxy.xRuler,
            yRuler = oxy.yRuler;

        var series = config.series,
            i, j, k, m, yPos, point, pointsArr = [], linesArr = [], dir,
            stickData,
            stick;

        var tmp, stickList = [], posCategory, posValues, posValue,
            width = opt[ this.chartType ].width, left = 0, bottom = 0,
            distance = config.chart.mirror? 0 : width + opt[ this.chartType ].margin,
            offset, height, label;

        var isPercentage = config.yAxis.percentage;

        for (i = 0; i < series.length; i++) {

            stick = series[ i ];

            stickData = isPercentage ? series[i].percentage : series[i].data;

            for (j = 0; j < stickData.length; j++) {

                tmp = stickData[ j ];

                posCategory = oxy[ measureCategoryMethod ]( j );

                left = (config.yAxis.groupCount - 1) * distance / 2;

                posValue = oxy.measureValueRange( tmp, this.valueAxis );
                offset = isPercentage ? stick.percentageOffset : stick.offset;
                bottom = offset ? offset[ j ] : 0;

                height = posValue * dir;
                stickParam = {
                    // dir: -1,
                    offset : oxy.measureValueRange( bottom, this.valueAxis ) * dir,
                    color  : this.getEntryColor( stick, j ),
                    width  : width,
                    height : height,
                    rotate : rotateAngle,

                    delay : config.animation.delayInterval*j,

                    bind : {
                        data : tmp,
                        indexInSeries : i,
                        indexInCategories : j
                    }
                    
                };

                if( opt.label.enabled )
                    stickParam.label = this.getStickLabelParam( height, tmp, config );

                stickParam[ this.valueAxis ] = oxy[ measureValueMethod ]( 0 );
                stickParam[ this.categoryAxis ] = posCategory - left + distance * stick.groupIndex;

                stickList.unshift(stickParam);


            }
            
        }

        var anim = config.animation;
        this.getPlotsElements().update({
            elementClass: kc.Bar,
            list: stickList,
            fx: anim.enabled,
            animateDuration : anim.duration,
            fxEasing : anim.mode
        });

        return config;
    }

} );


})();

(function(){

var ColumnPlots = kc.ColumnPlots = kity.createClass( 'ColumnPlots', {
    base: kc.StickPlots,

    constructor: function ( coordinate, config ) {
        this.callBase( coordinate, config );
    },

    plotsAttrsInit : function(){
        this.chartType = 'column';
        this.stickDir = -1;
        this.rotateAngle = 0;
        this.categoryAxis = 'x';
        this.valueAxis = 'y';
        this.measureCategoryMethod = 'measurePointX';
        this.measureValueMethod    = 'measurePointY';
    },

    getStickLabelParam : function( height, text, config ){
        return {
            at: 'bottom',
            color: config.plotOptions.label.text.color, 
            text: text,
            x : 0,
            y : -height - config.plotOptions.label.text.margin
        };
    }

} );


})();

(function(){

var LinearPlots = kc.LinearPlots = kity.createClass( 'LinearPlots', {
    base: kc.BasePlots,

    constructor: function ( coordinate, config ) {
        this.callBase( coordinate, config );

        this.lineDots = this.addElement( 'lineDots', new kc.ElementList() );
    },

    drawPlots: function ( coordinate, config ) {

        var series = config.series,
            opt = config.plotOptions,
            i, pointsArr = [], linesArr = [],
            line;

        var queryPath = kity.Utils.queryPath,
            offset = 0,
            lineColor,
            lineData
            ;
        this.dotArr = [];

        for (i = 0; i < series.length; i++) {

            line = series[ i ];
            line.positions = [];

            this.renderLineByData( line );
            
            pointsArr = this.array2points( line.data, offset );

            lineData = {
                line : line,
                currentData : line.data[ i ],
                currentLabel : config.xAxis.categories[ i ]
            };
            
            linesArr.push({
                    points     : pointsArr,
                    color      : this.getEntryColor( line ),
                    dash       : line.dash || null,
                    width      : this.getLineWidth(),
                    animatedDir: 'y',
                    defaultPos : coordinate.param.height,
                    factor     : +new Date,
                    bind       : lineData
                });

            line.positions = pointsArr;

            this.addLabels( line );

        }

        this.getPlotsElements().update({
            elementClass: kc.Polyline,
            list: linesArr,
            fx: config.animation.enabled
        });
        
        this.addDots();
    },

    renderLineByData : function( line ){
        // to be implemented
    },

    array2points : function( arr, offset ){
        var offset = offset || 0;
        var pointsArr = [], point;
        for (var j = 0; j < arr.length; j++) {
            point = this.coordinate.measurePoint( [j, arr[j]] );
            point[0] += offset;
                            
            pointsArr.push( point );
        }
        return pointsArr;
    },

    addLabels : function( line ){
        var opt = this.config.plotOptions;

        if( opt.label.enabled || opt[ this.chartType ].dot.enabled ){

            var tmpPos, dotParam, radius = 0, m;

            for (m = 0; m < line.positions.length; m++) {
                tmpPos = line.positions[ m ];

                if( opt[ this.chartType ].dot.enabled ){
                    radius = opt[ this.chartType ].dot.radius;
                }

                dotParam = {
                    color: this.getEntryColor( line ),
                    radius: radius,
                    x: tmpPos[0],
                    y: tmpPos[1]
                };

                if( opt.label.enabled ){

                    dotParam.label = {
                            margin: opt.label.text.margin,
                            color:  opt.label.text.color,
                            text: line.data[ m ],
                        };
                }

                this.dotArr.push(dotParam);
            }
            line.dots = this.dotArr;
        }

    },

    addDots : function(){
        var opt = this.config.plotOptions;
        if( opt.label.enabled || opt[ this.chartType ].dot.enabled ){
            var lineDots = this.getElement( 'lineDots' );
            lineDots.update({
                elementClass: kc.CircleDot,
                list: this.dotArr,
                fx: this.config.animation.enabled
            });
        }
    }

} );


})();

(function(){

var AreaPlots = kc.AreaPlots = kity.createClass( 'AreaPlots', {

    base: kc.LinearPlots,

    constructor: function ( coordinate, config ) {
        this.callBase( coordinate, config );
    },

    plotsAttrsInit : function(){
        this.chartType = 'area';
    },

    getLineWidth : function(){
        return this.config.plotOptions.area.stroke.width;
    },

    areas : [],

    renderLineByData : function( line ){
        var offset = line.offsetX || 0;
        var pointsArr, topPart, bottomPart;
        if( this.config.yAxis.stacked ){

            var p = this.config.yAxis.percentage;
            var offsetType = p ? 'percentageOffset' : 'offset';
            var allOffsetType = p ? 'allPercentageOffset' : 'allOffset';

            topPart = this.array2points( line[ offsetType ], offset );
            bottomPart = this.array2points( kity.Utils.copy( line[ allOffsetType ][ line.indexInGroup + 1 ] ), offset ).reverse();

            // pointsArr = arr1.concat( arr2 );

        }else{

            pointsArr = this.array2points( line.data, offset );
            var areaPointArr = kity.Utils.copy( pointsArr );
            var oxy = this.coordinate;
            var x0 = oxy.measurePointX( 0 ),
                y0 = oxy.measurePointY( oxy.yRuler._ref.from );

            var topPart = pointsArr.slice(0),
                bottomPart = [];

            var i = pointsArr.length;
            while( i-- > 0 ){
                bottomPart.push( [ pointsArr[ i ][ 0 ], y0 ] );
            }

        }

        var area = this.drawPolygon( topPart, bottomPart, line );
        this.areas.push( area );
    },

    drawPolygon : function ( topPart, bottomPart, entry ){
        var pointsArr = topPart.concat(bottomPart);
        var area = new kity.Polygon(pointsArr),
            paper = this.container.paper,
            color = this.getEntryColor( entry ),
            fill, opacity;

        var self = this;
        if( kity.Utils.isNumber( opacity = this.config.plotOptions.area.fill.opacity ) ){
            fill = new kity.Color( color ).set( 'a', opacity );
        }else{
            fill = new kity.LinearGradientBrush().pipe( function() {
                var grandient = self.config.plotOptions.area.fill.grandient;
                var g;
                for( var i = 0; i < grandient.length; i++ ){
                    g = grandient[i];
                    this.addStop( g.pos, g.color||color, grandient[i].opacity );
                }
                this.setStartPosition(0, 0);
                this.setEndPosition(0, 1);
                paper.addResource( this );
            })
        }

        area.fill( fill );

        this.canvas.addShape(area);
        return area;

        // new effect
        // var self = this;

        // var begin = topPart.concat(topPart.slice(0).reverse()).slice(0),
        //     finish = topPart.concat(bottomPart).slice(0);

        // var fill = self.config.plotOptions.area.fill.grandient;

        // var area = new kc.Polyline({
        //     points     : begin,
        //     color      : '#ddd',
        //     width      : 0,
        //     factor     : +new Date,
        //     animatedDir: 'y',
        //     close: true,
        //     fill: fill
        // });

        // this.addElement('area', area);
        // area.update();
        // // area.polyline.bringBelow();

        // setTimeout(function(){

        //     area.update({
        //         points     : finish,
        //         color      : '#ddd',
        //         width      : 0,
        //         factor     : +new Date,
        //         animatedDir: 'y',
        //         close: true,
        //         fill: fill
        //     });

        // }, 1000);


    }

} );


})();

(function(){

var BaseChart = kc.BaseChart = kity.createClass( 'BaseChart', {

    mixins : [ kc.ConfigHandler ],

    base: kc.Chart,

    constructor: function ( target, param ) {
        this.callBase( target, param );
        this.config = this.param;

        this.callMixin();

        this.bindAction();
        this.initTooltip();

    },

    _setConfig : function( param, formatter ){

        var config = kity.Utils.deepExtend( this.config, param ),
            base = kc.ChartsConfig.init( this.chartType || '' ),
            data, coordConf;

        this.config = kity.Utils.deepExtend( base, config ),
        this.setData( new formatter( this.config ) );

        data = this.data.format();
        this.config = kity.Utils.deepExtend( this.config, data );

    },

    update : function( param ){
        var DataFormatter = arguments[ 1 ] || kc.ChartData;
        this._setConfig( param, DataFormatter );
        
        coordConf = this.coordinate.setCoordinateConf( this.config );
        this.coordinate.update( coordConf );
        this.getPlots().update( this.coordinate, this.config );

        this.getOption('legend.enabled') && this.addLegend();
    },

    getPlots : function(){
        return this.plots;
    },

    setPlots : function( plots ){
        this.plots = plots;
    },

    getXOffset : function(){
        var oxy = this.coordinate,
            ox = oxy.param.padding.left + oxy.param.margin.left;
        return ox;
    },

    isOutOfXRange : function( x ){
        var ox = this.getXOffset( x ),
            oxy = this.coordinate;
        return x - ox < oxy.param.padding.left || x - ox + oxy.param.padding.left > oxy.xRuler.map_grid[ oxy.xRuler.map_grid.length-1 ];
    },

    getChartElementByShape : function( shape ){
        return shape.container.host;
    },

    getXInfoByPosX : function( x ){
        var ox = this.getXOffset(), oxy = this.coordinate;

        if( oxy.xRuler.map_grid.length == 0 ){
            return {
                index : 0,
                posX : 0
            };      
        }

        var result = oxy.xRuler.leanTo( x - ox , 'map' );
        result.value += oxy.param.padding.left;

        return {
            index : result.index,
            posX : result.value
        };
    },

    bindAction : function(){
        var self = this;
        this.currentIndex = -1;

        this.paper.on( 'mousemove', function( ev ) {
            self.onmousemove && self.onmousemove( ev );
        } );

        this.paper.on('click', function(ev){
            var oxy = self.coordinate;
            if(!oxy) return;

            self.onclick && self.onclick( ev );

        });
    },

    getEntryColor : function( entry ){
         return entry.color || this.config.color[ entry.index ] || this.config.finalColor;
    },

    initTooltip : function(){
        var container = $(this.container);
        if( !~(['absolute', 'relative']).indexOf( container.css('position') ) ){
            container.css('position', 'relative');
        }

        this.setTooltipContainer();

    },

    setTooltipContainer : function( dom ){
        if( dom ){
            this.tooltip = $( dom ).css({
                position : 'absolute',
                left : '-3000px',
            });
        }else{//默认
            this.tooltip = $('<div></div>').appendTo( this.container ).css({
                position : 'absolute',
                // border : '#888 1px solid',
                boxShadow : '0px 1px 5px rgba(0,0,0,0.3)',
                borderRadius : '4px',
                backgroundColor : '#FFF',
                color : '#888',
                padding : '6px 10px',
                left : '-1000px',
                marginLeft : '10px',
                fontSize : '10px',
                lineHeight : '16px'
            });
        }
    },

    updateTooltip : function( text, x, y ){
        this.tooltip.html( text );
        var tw = this.tooltip[0].clientWidth;
        if( x + tw > $( this.container ).width() ){
            x -= tw + 15;
        }

        this.tooltip.clearQueue().animate({
            left : x,
            top : y
        }, 100);

    },

    getTooltip : function(){
        return this.tooltip;
    },

    addLegend : function(){
        var series = this.config.series || [],
            i, j, entry, label, color, tmp, dataEntry;

        this.legend && this.legend.remove();
        this.legend = $('<div class="kitycharts-legend"></div>').css({
            position : 'absolute',
            bottom : '5px',
            right : '30px',
            height : '26px',
            lineHeight : '26px'
        }).appendTo( this.container );

        var labelArr = [], colorArr = [];
        for ( i = 0; i < series.length; i++ ) {
            
            entry = series[ i ];
            
            if( this.config.legend.level == 'data' ){
                for (var i = 0; i < entry.data.length; i++) {
                    dataEntry = entry.data[ i ];
                    labelArr.push( dataEntry.name );
                    colorArr.push( this.getEntryColor( dataEntry ) );
                }
            }else{
                label = entry.name;
                color = this.getEntryColor( entry );

                labelArr.push(label);
                colorArr.push(color);
            }

        }

        var self = this;

        labelArr.forEach(function(label, i){
           tmp = $('<div></div>').css({
                marginRight : '20px',
                display : 'inline-block'
            }).appendTo( self.legend );

            $('<div class="kitycharts-legend-color"></div>').css({
                width : '12px',
                height : '12px',
                backgroundColor : colorArr[i],
                display : 'inline-block',
                marginRight : '5px',
                position: 'relative',
                top: '1px'
            }).appendTo( tmp );

            $('<div class="kitycharts-legend-label">' + label + '</div>').css({
                fontSize : '10px',
                display : 'inline-block'
            }).appendTo( tmp );
        });

    }

} );


})();

(function(){

var StickChart = kc.StickChart = kity.createClass( 'StickChart', {
    base: kc.BaseChart,

    constructor: function ( target, param ) {
        this.callBase( target, param );
        this.setData( new kc.ChartData( param ) );
        this.coordinate = this.addElement( 'oxy', new kc.CategoryCoordinate() );
    },

    isStick : function( ele ){
    	return ele instanceof kc.Bar;
    },

    onmousemove : function( ev ){
    	this.currentStick;
    	this.currentStickParam;

    	var ele = this.getChartElementByShape( ev.targetShape );

    	if( this.isStick( ele ) ){

    		if( this.currentStick != ele ){
				this.onMouseOut( ele );
    		}else{
    			this.onMouseIn( ele );
    		}

    	}else{
			this.onMouseOut( ele );
    	}

    },

    getPosXByIndex : function( index ){
    	return this.coordinate.measurePointX( index );
    },

    getPosYByValue : function( val ){
    	return this.coordinate.measurePointY( val );
    },

    onMouseIn : function( ele ){
    	var color = new kity.Color( ele.param.color );
    	color.set( 'a', 0.7 );

	    ele.update({
			color : color.toRGBA()
		});

		var bind = ele.getBindData();

		this.processHover( bind );
    },

    onMouseOut : function( ele ){
		this.currentStickParam && this.currentStick.update({
			color : this.currentStickParam.color
		});

		if( this.isStick( ele ) ){
			this.currentStick = ele;
			this.currentStickParam = kity.Utils.copy( ele.param );
		}
    },

    processHover : function( bind ){
    	if( this.currentMark == bind.indexInSeries + bind.indexInCategories ) return;
    	this.currentMark = bind.indexInSeries + bind.indexInCategories
    	this.callHover( bind );
    },

    callHover : function( bind ){
    	var onStickHover = this.config.interaction.onStickHover;

        if( typeof onStickHover == 'function' ){
            onStickHover.call( this, bind, this.currentStick );
        }else if( onStickHover !== null ){
        	this.defaultCallHover( bind );
        }
    },

    defaultCallHover : function( bind ){
    	var sum = this.config.series[ bind.indexInSeries ].sum[ bind.indexInCategories ];
    	var html = this.setTooltipContent( bind );
        var p = this.getTooltipPosition( sum );
    	this.updateTooltip( html, p.x, p.y );
    },

    setTooltipContent : function( bind ){
    	var j = bind.indexInSeries, i = bind.indexInCategories

        var func = kity.Utils.queryPath('tooltip.content', this.config);
        if( func ){
            return func( i, j );
        }else{
            var series = this.config.series;
            var categories = this.config.xAxis.categories;
            var html = '<div style="font-weight:bold">' + categories[ i ] + '</div>';
            var valueAxis = this.getPlots().valueAxis == 'x' ? 'xAxis' : 'yAxis';
            var unitText = this.config[ valueAxis ].unit && this.config[ valueAxis ].unit.text || '';
            html += '<div>' + series[ j ].name + ' : ' + series[ j ].data[ i ] + unitText + '</div>';

            if( this.config.yAxis.stacked ){
                html += '<div> Total : ' + series[ j ].sum[ i ] + '</div>';
            }

            return html;
        }

    },

} );


})();

(function(){

var ColumnChart = kc.ColumnChart = kity.createClass( 'ColumnChart', {
    base: kc.StickChart,

    constructor: function ( target, param ) {
        this.chartType = 'column';
        this.callBase( target, param );
        var plots = this.addElement( 'plots', new kc.ColumnPlots() );
        this.setPlots( plots );
    },

    getTooltipPosition : function( val ){

        return {
            x : this.currentStick.param.x,
            y : this.coordinate.measurePointY( val )
        };

    }
} );


})();

(function(){

var LinearChart = kc.LinearChart = kity.createClass( 'LinearChart', {
    base: kc.BaseChart,

    constructor: function ( target, param ) {
        this.callBase( target, param );
        this.hoverDots = this.addElement( 'hoverDots', new kc.ElementList() );
        this.setData( new kc.ChartData( param ) );
        this.coordinate = this.addElement( 'oxy', new kc.CategoryCoordinate() );
    },

    onmousemove : function( ev ){
        var oxy = this.coordinate,
            param = oxy.param,
            oev = ev.originEvent,
            x = oev.offsetX,
            y = oev.offsetY,
            i,
            self = this,
            maxLength = 0,
            lenArr = [],
            tmpL,
            lines = self.config.series;;
        
        if( self.isOutOfXRange( x ) ) return;

        var result = self.getXInfoByPosX( x );

        if( !lines || lines.length == 0 || !lines[0].positions ) return;

        for (i = 0; i < lines.length; i++) {
            tmpL = lines[i].positions.length;
            if( tmpL > maxLength ){
                maxLength = tmpL;
            }
        }

        if( !result || result.index > maxLength ) return;

        self.processHover( result );
    },

    onclick : function( ev ){
        var self = this;
        var oxy = this.coordinate;
        var config = self.config;
        var shape = ev.targetShape;

        if( shape instanceof kity.Circle && self.config.interaction.onCircleClick ){
            
            var index = self.currentIndex;

            var circleEle = self.getChartElementByShape( shape ),
                bind = circleEle.param.bind;
            var info = {
                data : bind.data,
                indexInCategories : index,
                indexInSeries : bind.indexInSeries,
                position : circleEle.getPosition()
            };

            self.callCircleClick( info, circleEle );
        }
    },

    callCircleClick : function( info, circle ){

        var onCircleClick = this.config.interaction.onCircleClick;
        if( typeof onCircleClick == 'function' ){
            onCircleClick( info, circle );
        }else if( onCircleClick !== null ){
            this.defaultCircleClick( info );
        }

    },

    defaultCircleClick : function( info ){
        this.updateTooltip( this.config.xAxis.categories[ info.indexInCategories ] + ' : ' + info.data, info.position.x, info.position.y );
    },

    setCirclePosYByIndex : function( index ){
        var i, pY = 0,
            self = this,
            series = self.config.series;
        
        self.circleArr = [];
        for (i = 0; i < series.length; i++) {
            tmpPos = series[i].positions[ index ];
            if(tmpPos){
                pY = tmpPos[1];
            }else{
                pX = pY = -100;
            }

            self.circleArr.push({
                color: '#FFF',
                radius: 5,
                strokeWidth : 3,
                strokeColor : this.getEntryColor( series[i] ),
                x : self.currentPX,
                y : pY,
                bind : {
                    data : series[ i ].data[ index ],
                    indexInSeries : i,
                    indexInCategories : index
                },
            });
        }


        self.hoverDots.update({
            elementClass : kc.CircleDot,
            list : self.circleArr,
            fx : false
        });

        self.hoverDots.canvas.bringTop();
    },

    setTooltipContent : function( index ){
        var func = kity.Utils.queryPath('tooltip.content', this.config);

        if( func ){
            return func(index);
        }else{
            var series = this.config.series;
            var categories = this.config.xAxis.categories;
            var html = '<div style="font-weight:bold">' + categories[ index ] + '</div>';
            series.forEach(function( entry, i ){
                html += '<div>' + entry.name + ' : ' + entry.data[ index ] + '</div>';
            });

            return html;
        }
    },

    defaultHover : function( circles ){
        var index = circles[ 0 ].bind.indexInCategories;
        var series = this.config.series;
        var posArr = [];
        var posX = 0;
        var tmp;
        for( var i = 0; i < series.length; i++ ){
            tmp = series[i].positions[ index ];
            posX = tmp[ 0 ];
            posArr.push( tmp[ 1 ] );
        }
        var min = Math.min.apply([], posArr);
        var max = Math.max.apply([], posArr);

        this.updateTooltip( this.setTooltipContent( index ), posX, ( min + max ) / 2 );
    },



    callCircleHover : function(){

        var binds = [];

        this.circleArr.forEach(function( dot, i ){
            binds.push( dot );
        });

        var onHover = this.config.interaction.onHover;
        if( typeof onHover == 'function' ){
            onHover( binds );
        }else if( onHover !== null ){
            this.defaultHover( binds );
        }

    },

    processHover : function( xInfo ){

        if( !this.config.interaction.hover.enabled ) return;

    	var self = this;
        var pX = xInfo.posX + this.coordinate.param.margin.left;
        var index = xInfo.index;
        self.currentPX = pX;
        if( index == self.currentIndex ){
            return;
        }
        self.currentIndex = index;
        self.setCirclePosYByIndex( index );
        self.callCircleHover();

    }

} );


})();

(function(){

var AreaChart = kc.AreaChart = kity.createClass( 'AreaChart', {
    base: kc.LinearChart,

    constructor: function ( target, param ) {
    	this.chartType = 'area';
        this.callBase( target, param );
        var plots = this.addElement( 'plots', new kc.AreaPlots() );
        this.setPlots( plots );
    },

} );


})();

(function(exports){

var PieChart = kc.PieChart = kity.createClass( 'PieChart', {
    base : kc.BaseChart,

    constructor: function ( target, param ) {
        this.chartType = 'pie';
        this.callBase( target, param );
        this.config = this.param;
        this.setData( new kc.PieData( param ) );

        var plots = this.addElement( 'plots', new kc.PiePlots() );
        this.setPlots( plots );

        // this.bindAction();
        // this.addLegend();
    },

    update : function( param ){
        this._setConfig( param, kc.PieData );
        
        this.getPlots().update( this.config );
        this.getOption('legend.enabled') && this.addLegend();
    },

    getCenter : function(){
        var center = this.config.plotOptions.pie.center;
        return {
            x : center.x,
            y : center.y
        };
    },

    getSeries : function(){
        return this.config.series;
    },

    bindAction : function(){

    },

} );


})( window );

})(kity, window);