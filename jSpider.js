// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ jSpider - Javascript Spider Charts Library                         │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2013 Arthur Féral                                      │ \\
// │ Copyright © 2013 SportinTown (http://www.sportintown.com)          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT license.                                    │ \\
// └────────────────────────────────────────────────────────────────────┘ \\

(function (window) {

	jSpider = function(params){
		this.initialize(params);
	}

	var jsp = jSpider.prototype;

// static public properties:
	// jSpider.path = 'img/tiles/';
	
// public properties:
	jsp._readonly;
	jsp._containerID;
	jsp._container;

	jsp._labels;
	jsp._labelsId = new Array();
	jsp._values = new Array();

	jsp._buttons = new Array();
	jsp._radiusButton;
	jsp._buttonDefault = {
		r: 5,
		fill: "rgb(0, 151, 255)",
		stroke: "#FFFFFF",
		opacity: 0.8
	};
	jsp._buttonFocus = {
		r: 10,
		fill: "rgb(0, 151, 255)",
		stroke: "#FFFFFF",
		opacity: 1
	}
	jsp._editionPolygone;
	jsp._coords = [];

	
	jsp._min;
	jsp._max;
	jsp._w;
	jsp._h;
	jsp._x;
	jsp._y;
	jsp._r;
	
	jsp._stepColor;
	jsp._surface;

// constructor:
	jsp.initialize = function (params) {
		this._container    = typeof params.container == "string" ? $('#'+params.container) : params.container;
		this._dom          = this._container[0];
		this._labels       = params.labels;
		this._min          = 0;
		this._stepColor    = params.colors;
		this._max          = params.max || params.colors.length;
		this._w            = this._container.width();
		this._h            = this._container.height();
		this._radiusButton = params.radiusButton != undefined ? params.radius : 5;
		this._margin       = params.margin;
		this._x            = this._container.width() / 2;
		this._y            = this._container.height() / 2;
		this._r            = this._w / 4;
		this._surface      = new Raphael(this._dom, this._w, this._h);
		this._values       = params.values ||new Array();
		if(params.values == undefined){
			for(var i = 0 ; i < this._labels.length ; i++){
				this._values.push(2);
			}
		}
		this._labelsId     = params.labelsID ||new Array();
		if(params.labelsID == undefined){
			for(var i = 0 ; i < this._labels.length ; i++){
				this._labelsId.push(i);
			}
		}
		
		this.drawBG();
	}

// public methods:
	jsp.generatePolygone = function(params){
		var l = this._labels.length;
		var chaine = "";
		for(var i=0;i<l;i++){
			if(i==0){chaine = chaine + "M"}else{chaine=chaine+"L"};
			chaine += params.coords[i].x+" "+params.coords[i].y;
		}
		chaine = chaine + "z";
		return this._surface.path(chaine).attr(params.opt);
	};
	jsp.generateText = function(){
		var offset = (Math.min(this._h,this._w)/2-this._r)/2;
		var l = this._labels.length;
		for(var i=0;i<l;i++){
			var teta = 2*Math.PI*i/this._labels.length;
			teta+=Math.PI/2;
			var t = this._surface.text(this._x + (this._r + offset) * Math.cos(teta), this._y + (this._r + offset) * Math.sin(teta), this._labels[i]).attr({fill: "#fff", "font-size":14, "font-family": "Arial"});
		}
	};
	jsp.clear = function () {
    	this._surface.clear();
		this.drawBG();
	};
	jsp.valuesToCoords = function(values){
		var coords = [];
		var l = values.length;
		for(var i = 0 ; i < l ; i++){
			coords.push({
				x: this._x + (this._r * values[i]) * Math.cos(Math.PI/2+2*Math.PI*i/l),
				y: this._y + (this._r * values[i]) * Math.sin(Math.PI/2+2*Math.PI*i/l)
			});
		}
		return coords;
	};
	jsp.drawBG = function(){
		var l = this._labels.length;
		var l2 = this._stepColor.length;
		for(var i = 0 ; i < l2 ; i++){
			var a = [];
			for(var j = 0 ; j < l ; j++){
				a.push((l2-i) / l2);
			}
			var coords = this.valuesToCoords(a);
			this.generatePolygone({
				coords: coords,
				opt: {
					fill: this._stepColor[i],
					stroke: "none"
				}
			});
			this.generateText();
		}
	};
	jsp.update = function(){
		this._editionPolygone.remove();
		this._editionPolygone = this.generatePolygone({
			coords: this.valuesToCoords(this._values),
			opt: {
				fill: "#0055FF",
				opacity: 0.6,
				stroke: "#FFFFFF",
				"stroke-opacity": 1,
				"stroke-width": 1
			}
		}).insertBefore(this._buttons[0]);
	};
	jsp.destroy = function(){
		this._surface.remove();
	};
	jsp.startEdition = function(){
		this.clear();
		var that = this;
		var l = this._labels.length;
		for(var i = 0 ; i < l ; i++){
			this._coords[i] = this._values[i] / (this._max - this._min);
		}
		this._editionPolygone = this.generatePolygone({
			coords: this.valuesToCoords(this._coords),
			opt: {
				fill: "#0055FF",
				opacity: 0.6,
				stroke: "#FFFFFF",
				"stroke-opacity": 1,
				"stroke-width": 1
			}
		});
		
		for(var i = 0 ; i < l ; i++){
			var x = this._x + (2/(this._max-this._min)) * this._r * Math.cos(Math.PI/2+2*Math.PI*i/l);
			var y = this._y + (2/(this._max-this._min)) * this._r * Math.sin(Math.PI/2+2*Math.PI*i/l);
			var p = this._surface.circle(x, y, this._radiusButton).attr(this._buttonDefault);
			p.drag(function(dx, dy, x, y, e){//move
				var x = e.pageX - $(that._dom).offset().left;
				var y = e.pageY - $(that._dom).offset().top;
				var r = ((that._y-y)*(-that._r*Math.sin(Math.PI/2+2*Math.PI*this.n/l))-(that._x-x)*(that._r*Math.cos(Math.PI/2+2*Math.PI*this.n/l)))/((that._r)^2);
				if (r<0){r=0;}
				if (r>that._r){r=that._r;}

				this.attr({
					cx: that._x + (Math.cos(Math.PI/2+2*Math.PI*this.n/l))*r,
					cy: that._y + (Math.sin(Math.PI/2+2*Math.PI*this.n/l))*r
					});

				that._values[this.n] = r/that._r*(that._max-that._min);
				that._coords[this.n] = that._values[this.n] / (that._max - that._min);

				that._editionPolygone.remove();
				that._editionPolygone = that.generatePolygone({
					coords: that.valuesToCoords(that._coords),
					opt: {
						fill: "#0055FF",
						opacity: 0.6,
						stroke: "#FFFFFF",
						"stroke-opacity": 1,
						"stroke-width": 1
					}
				}).insertBefore(that._buttons[0]);
				console.log(that.toJson());
			}, function(x, y, e){ //start
				this.animate({r: 10, opacity: 1}, 300, '>');
			}, function(e){ //end
				this.animate({r: 5, opacity: 0.8}, 300, '>');
			});
			this._buttons[i] = p;
			this._buttons[i].n = i;
		}
	};
	jsp.read = function(values){
		this.clear();
		var vals = values != undefined && values.length == this._labels.length ? values : this._values;
		var l = vals.length;
		for(var i = 0 ; i < l ; i++){
			vals[i] /= this._max - this._min;
		}
		var coords = this.valuesToCoords(vals);
		this.generatePolygone({
			coords: coords,
			opt: {
		    	fill: "#0055FF",
		    	opacity: 0.6,
		    	stroke: "#FFFFFF",
		    	"stroke-opacity": 1,
		    	"stroke-width": 1
		    }
		});
	};
	jsp.toJson = function(){
		var res = [];
		for(var i = 0 ; i < this._values.length ; i++){
			res.push({
				labelID: this._labelsId[i],
				label: this._labels[i],
				value: this._values[i]
			});
		}
		return res; 
	}
	window.jSpider = jSpider;

}(window));
