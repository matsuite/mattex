console.log('\x1b[31m%s\x1b[0m', 'powered by mattex.');
console.log('© 2022');
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}
var ctx;
var f;
class ColorDetails {
	/**
	 * Represents two colors - stroke and fill.
	 * @constructor
	 * @param {string} colStroke - Hex color of outline/line.
	 * @param {string} colFill - Hex color of the inside/fill.
	 */
	constructor(colStroke, colFill) {
		this.stroke = colStroke;
		this.fill = colFill;
	}
}
class Properties {
	/**
	 * Represents properties of the object.
	 * @constructor
	 * @param {number} stokeWidth - The width of the line (or stroke) of an object.
	 */
	constructor(strokeWidth=1) {
		this.sw = strokeWidth;
	}
	/**
	 * Set the properties of the canvas rendering context to the properties in this object.
	 * @function
	 * @param {Object} img - The Image class of to set properties of.
	 */
	setCtxProp(img) {
		ctx.lineWidth = this.sw*img.u;
	}
}
class Image {
	/**
	 * Represents a frame/image of the presentation.
	 * @constructor
	 * @param {string} id - The ID of the canvas element.
	 * @param {number} width - The width of the frame.
	 * @param {number} height - The height of the frame.
     * @param {number} unit - Set a custom unit size here, instead of automatically.
	 * @prop {number} this.w - Refer to width. 
	 * @prop {number} this.h - Refer to height.  
	 * @prop {number} this.img - The element of the ID.  
	 * @prop {number} this.u - Refer to unit.
	 * @prop {number} this.centerX - The X center (from left to right) of the canvas.
	 * @prop {number} this.centerY - The Y center (from top to bottom) of the canvas.
	 * @prop {number} this.limg - div element of the list of images generated from URLs. Defaults to being invisible.
	 */
	constructor(id, width, height, unit=null) {
		this.w = width;
		this.h = height;
		this.img = document.getElementById(id);
		this.img.setAttribute("width", width);
		this.img.setAttribute("height", height);
		this.u = unit==null ? Math.ceil((width*height)/10**(((width*height).toString().length)-1.95)) : unit
		this.centerX = Math.floor(width / 2);
		this.centerY = Math.floor(height / 2);
		this.limg = document.createElement("div");
		this.limg.style.display="none";
		document.body.appendChild(this.limg);
	}
	/**
	 * Override the entire image with a background color. Do this first to set a background color.
	 * @function
	 * @param {Object} colorProperties - The color properties of the background (only really needs fill color).
	 */
	bg(colorProperties) {
		ctx.fillStyle = colorProperties.fill;
		ctx.strokeStyle = colorProperties.stroke;
		ctx.fillRect(0,0,this.w,this.h);
	}
	/**
	 * Clears the screen to white. If you want a different color, use bg
	 * @function
	 */
	clear() {
		ctx.fillStyle = "#ffffff";
		ctx.strokeStyle = "#ffffff";
		ctx.fillRect(0,0,this.w,this.h);		
	}
	/**
	 * Get the canvas rendering context globally.
	 * @function
	 * @returns {Object} The canvas rendering context.
	 */
	getCtx() {
		return ctx;
	}
	/**
	 * Draw a circle on the canvas.
	 * @function
	 * @param {number} x - The X position of the circle.
	 * @param {number} y - The Y position of the circle.
	 * @param {number} rad - The radius of the circle.
	 * @param {Object} colorProperties - The ColorDetails of the circle.
	 * @param {Object} properties - The Properties of the circle.
	 * @param {number} u - Set a custom unit size here.
	 */
	circle(x,y, rad, colorProperties, properties, u=this.u) {
		const ctx = this.img.getContext('2d');
		const radius = u*rad;
		
		ctx.beginPath();
		ctx.arc(x*u,y*u, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = colorProperties.fill;
		ctx.fill();
		ctx.strokeStyle = colorProperties.stroke;
		ctx.lineWidth = properties.sw*u;
		ctx.stroke();
	}
	/**
	 * Draw a graph of a function on the canvas.
	 * @function
	 * @param {number} xp - The X position of the graph.
	 * @param {number} yp - The Y position of the graph.
	 * @param {number} w - The width of the graph.
	 * @param {number} h - The height of the graph.
	 * @param {number} rad - The radius of the graph.
	 * @param {Object} col - The ColorDetails of the graph.
	 * @param {Object} prop - The Properties of the graph.
	 * @param {number} scale - The scale of the graph.
	 * @param {number} u - Set a custom unit size here.
	 */
	graph(xp,yp,w,h,func,col,prop,scale,u=this.u) {
		w /= 2;
		var xx, yy, dx=4, x0=u*w, y0=u*h;
		var iMax = Math.round((x0)/dx);
 		var iMin = Math.round(-x0/dx);
		ctx.beginPath();
 		prop.setCtxProp(this);
 		ctx.strokeStyle = col;
		for (var i=iMin;i<=iMax;i++) {
		  	xx = dx*i; yy = scale*func(xx/scale);
		 	if (i==iMin) ctx.moveTo(x0+xx+(xp*u),y0-yy+(yp*u));
		  	else         ctx.lineTo(x0+xx+(xp*u),y0-yy+(yp*u));
		}
		ctx.stroke();
	} 
	/**
	 * Draw a line on the canvas.
	 * @function
	 * @param {number} x1 - The first X position of the graph.
	 * @param {number} y1 - The first Y position of the graph.
	 * @param {number} x2 - The second X position of the graph.
	 * @param {number} y2 - The second Y position of the graph.
	 * @param {Object} col - The ColorDetails of the graph.
	 * @param {Object} prop - The Properties of the graph.
	 * @param {number} u - Set a custom unit size here.
	 */
	line(x1,y1,x2,y2,col,prop, u=this.u) {
		prop.setCtxProp(this);
 		ctx.strokeStyle = col;
		ctx.beginPath();
		ctx.moveTo(x1*u,y1*u);
		ctx.lineTo(x2*u,y2*u);
		ctx.stroke();
	}
	/**
	 * Draw a rectangle on the canvas.
	 * @function
	 * @param {number} x - The X position of the rectangle.
	 * @param {number} y - The Y position of the rectangle.
	 * @param {number} w - The width of the rectangle.
	 * @param {number} h - The height of the rectangle.
	 * @param {Object} colorProperties - The ColorDetails of the graph.
	 * @param {Object} prop - The Properties of the graph.
	 * @param {number} u - Set a custom unit size here.
	 */
	rect(x,y,w,h,colorProperties,prop, u=this.u) {
		ctx.fillStyle = colorProperties.fill;
		ctx.strokeStyle = colorProperties.stroke;
		prop.setCtxProp(this);
		ctx.beginPath();
		ctx.rect(x*u,y*u,w*u,h*u);
		ctx.fill();
        ctx.stroke();
        ctx.closePath();
	}
}
/**
 * Draw a graph of a function on the canvas.
 * @function
 * @param {Object[]} pluginlist - The list of plugin details to depend on. 
 */
function m_package(pluginlist) {
	var res = {};
	var hadError = false;
	var errors = [];
	var dependencies = [];
	var optionalDependencies = [];
	var names = [];
	pluginlist.forEach((e) => {
		console.log("Adding: "+e.name+"\n"+e.description);
		Object.assign(res, e.funcs);
		if(e.requires.length != 0) {
			dependencies.push([e.name, (e.requires)]);
			optionalDependencies.push([e.name, (e.optionalRequires), e.optFuncs]);
		}
		names.push(e.name);
	})
	dependencies.forEach((e) => {
		e[1].forEach((f) => {
			if(!(names.includes(f))) {
				hadError = true;
				errors.push(`Plugin ${e[0]} is asking for ${f}, but ${f} is not found here.\nList of found plugins:\n${names.toString()}.\nList of dependencies:\n${dependencies.toString()}.`);
			}	
		});
	});
	optionalDependencies.forEach((e) => {
		e[1].forEach((f) => {
			if(!(names.includes(f))) {
				console.log(`[WARN] Plugin ${e[0]} is asking for ${f}, but ${f} is not found here.\nList of found plugins:\n${names.toString()}.\nList of dependencies:\n${dependencies.toString()}.`);
			} else {
				Object.assign(res, e[2]);
			}
		});
	});
	if(hadError) {console.log(errors.join("\n"));}else{Object.setPrototypeOf(Image.prototype, res);console.log("Added all plugins successfully");}
}
class Presentation {
	/**
	 * Represents a presentation to extend.
	 * @constructor
	 * @param {Object} img - The Image class to make the presentation with.
	 */
	constructor(img) {
		this.img = img;
		this.run();
	}
	/**
	 * Runs the scene.
	 * @function
	 */
	run() {
		// run scenes!
	}
}
/**
 * Set the global context of mattex.
 * @function
 * @param {Object} img - The Image class.
 */
function setGCTX(img) {
	ctx = img.img.getContext('2d');
}
const sleep = s => new Promise(res => setTimeout(res, s*1000));
const click_sleep = (element, listenerName="click") => new Promise((resolve, reject) => {var listener = event => {document.querySelector(element).removeEventListener(listenerName, listener);resolve(event);};document.querySelector(element).addEventListener(listenerName, listener); });
