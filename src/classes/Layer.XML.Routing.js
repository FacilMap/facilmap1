/*
	This file is part of FacilMap.

	FacilMap is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	FacilMap is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with FacilMap.  If not, see <http://www.gnu.org/licenses/>.

	Obtain the source code from http://gitorious.org/facilmap.
*/

(function(fm, ol, $){

/**
 * Shows a calculated route on the map. Add this layer to a map and set the different paramters using the set* functions. As soon as all
 * parameters are set, the route will be displayed. The parameters can be updated then and the route will be recalculated.

 * @event draggedRoute The route was changed using drag and drop.
*/
fm.Layer.XML.Routing = ol.Class(fm.Layer.XML, {
	HOVER_MAX_DISTANCE : 10,

	fromIcon : new ol.Icon(fm.apiUrl+"/img/route-start.png", new ol.Size(20,34), new ol.Pixel(-10, -34)),
	toIcon : new ol.Icon(fm.apiUrl+"/img/route-stop.png", new ol.Size(20,34), new ol.Pixel(-10, -34)),
	viaIcon : new ol.Icon(fm.apiUrl+"/img/yellow.png", new ol.Size(20,34), new ol.Pixel(-10, -34)),

	colour : "blue",

	provider : null,
	_currentRoute : null,

	_fromMarker : null,
	_toMarker : null,
	_viaMarkers : null,

	markers : null,
	markersDrawn : false,

	_dragFeature : null,
	_featureHandler : null,
	_temporaryViaMarker : null,

	initialize : function(name, options) {
		var t = this;

		fm.Layer.XML.prototype.initialize.apply(this, [ name, undefined, options ]);

		if(!this.provider)
			this.provider = new fm.Routing.MapQuest();
		this.attribution = this.provider.attribution;

		this._viaMarkers = [ ];
		this.markers = [ ];

		this.events.addEventType("draggedRoute");

		// Feature for dragging from, to and via markers
		this._dragFeature = new ol.Control.DragFeature(this, {
			dragCallbacks : {
				move : function(pixel) {
					// this.feature is the marker
					var newPx = new ol.Pixel(this.feature.icon.px.x + (pixel.x - this.lastPixel.x), this.feature.icon.px.y - (this.lastPixel.y - pixel.y));
					this.lastPixel = pixel;
					this.feature.draw(newPx);
				}
			},
			onComplete : function(marker, pixel) {
				var lonlat = this.map.getLonLatFromPixel(this.feature.icon.px).transform(this.map.getProjectionObject(), new ol.Projection("EPSG:4326"));
				var newRouteOptions = $.extend({ }, t._currentRoute);
				var which;
				if(marker == t._fromMarker)
				{
					$.extend(newRouteOptions, { from: lonlat });
					which = "from";
				}
				else if(marker == t._toMarker)
				{
					$.extend(newRouteOptions, { to : lonlat });
					which = "to";
				}
				else
				{
					var via = [ ].concat(t._currentRoute.via);
					for(var i=0; i<t._viaMarkers.length; i++)
					{
						if(marker == t._viaMarkers[i])
						{
							via[i] = lonlat;
							break;
						}
					}
					$.extend(newRouteOptions, { via : via });
					which = "via";
				}
				t.setRoute(newRouteOptions);
				t.events.triggerEvent("draggedRoute", { newRouteOptions : newRouteOptions, draggedPoint : which });
			}
		});

		// Dragging of route
		this._featureHandler = ol.Util.extend(new ol.Handler({ map : null }), {
			lastPoint : null,
			lastXY : null,
			mousemove : function(evt) {
				var point = t.getPointFromMousePosition(evt.xy);
				if(point != null && !t._dragFeature.handlers.drag.active)
				{
					if(t._temporaryViaMarker == null)
					{
						t._temporaryViaMarker = new ol.Marker(new ol.LonLat(0, 0), t.viaIcon.clone());
						t._temporaryViaMarker.layer = t;
						t.addMarker(t._temporaryViaMarker);
						t.map.cursorRoutingBkp = (t.map.viewPortDiv.style.cursor || "");
					}
					t._temporaryViaMarker.lonlat = point.lonlat;
					t.drawMarker(t._temporaryViaMarker);
					this.lastPoint = point;
					this.lastXY = evt.xy;
					t.map.viewPortDiv.style.cursor = "pointer";
				}
				else if(t._temporaryViaMarker != null)
				{
					t.removeMarker(t._temporaryViaMarker);
					t._temporaryViaMarker.destroy();
					t._temporaryViaMarker = null;
					this.lastPoint = null;
					t.map.viewPortDiv.style.cursor = t.map.cursorRoutingBkp;
				}
			},
			mousedown : function(evt) {
				if(this.lastPoint != null)
				{
					t.map.viewPortDiv.style.cursor = t.map.cursorRoutingBkp;

					var newIndex = t._currentRoute.via.length;
					while(newIndex > 0)
					{
						var thisPoint = t.getPointFromLonLat(fm.Util.toMapProjection(t._currentRoute.via[newIndex-1], t.map));
						if(thisPoint == null || thisPoint.index > this.lastPoint.index)
						{
							t._currentRoute.via[newIndex] = t._currentRoute.via[newIndex-1];
							t._viaMarkers[newIndex] = t._viaMarkers[newIndex-1];
							newIndex--;
						}
						else
							break;
					}
					t._temporaryViaMarker.draw(new ol.Pixel(this.lastXY.x, this.lastXY.y+2));
					t._currentRoute.via[newIndex] = this.lastPoint.lonlat;
					t._viaMarkers[newIndex] = t._temporaryViaMarker;
					t._temporaryViaMarker = null;
					this.lastPoint = null;

					t._dragFeature.handlers.feature.mousemove({ type : "mousemove", target : t._viaMarkers[newIndex].icon.imageDiv.firstChild });
					t._dragFeature.handlers.drag.mousedown(evt);

					ol.Event.stop(evt);
					return false;
				}
			},
			dblclick : function(evt) {
				var feature = t.getFeatureFromEvent(evt);
				if(feature == null)
					return true;

				for(var i=0; i<t._viaMarkers.length; i++)
				{
					if(t._viaMarkers[i] == feature)
					{
						t.removeMarker(t._viaMarkers[i]);
						var newRouteOptions = $.extend({ }, t._currentRoute);
						newRouteOptions.via.splice(i, 1);
						t.setRoute(newRouteOptions);
						t.events.triggerEvent("draggedRoute", { newRouteOptions : newRouteOptions });
						return false;
					}
				}

				return true;
			}
		});
	},

	setMap : function(map) {
		fm.Layer.XML.prototype.setMap.apply(this, arguments);

		map.addControl(this._dragFeature);
		this._dragFeature.activate();

		this._featureHandler.setMap(map);
		this._featureHandler.activate();
	},

	getFeatureFromEvent : function(evt) {
		// We don't want to drag the actual features, but the markers instead
		var markers = [ this._fromMarker, this._toMarker ].concat(this._viaMarkers);
		for(var i=0; i<markers.length; i++)
		{
			if(markers[i] != null && markers[i].icon && markers[i].icon.imageDiv && (evt.target || evt.srcElement) == markers[i].icon.imageDiv.firstChild)
				return markers[i];
		}
		return null;
	},

	getPointFromMousePosition : function(xy) {
		if(this.map == null)
			return null;
		var lonlat = this.map.getLonLatFromPixel(xy);
		return this.getPointFromLonLat(lonlat);
	},

	getPointFromLonLat : function(lonlat) {
		if(!this.features)
			return null;
		var smallestDistance = null;
		var smallestDistancePoint = null;
		var index = 0; // Index is used to find out the position of the point in the ordered list of points
		var maxDistance = this.HOVER_MAX_DISTANCE * this.map.getResolution();

		for(var j=0; j<this.features.length; j++)
		{
			if(!this.features[j] || !this.features[j].geometry || !this.features[j].geometry.components)
				continue;

			var points = this.features[j].geometry.components;
			var p1,p2,d,u,px;
			for(var i=0; i<points.length-1; i++,index++)
			{
				p1 = points[i];
				p2 = points[i+1];
				d = { x : p2.x-p1.x, y : p2.y-p1.y };
				if(d.x == 0 && d.y == 0)
					continue;
				u = ((lonlat.lon-p1.x)*d.x + (lonlat.lat-p1.y)*d.y) / (d.x*d.x + d.y*d.y); // See http://local.wasp.uwa.edu.au/~pbourke/geometry/pointline/
				if(u < 0 || u > 1)
					continue;

				px = { x : p1.x+u*d.x, y : p1.y+u*d.y };

				var distanceX = Math.abs(px.x-lonlat.lon);
				var distanceY = Math.abs(px.y-lonlat.lat);
				if(distanceX > maxDistance || distanceY > maxDistance)
					continue;
				var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
				if(distance > maxDistance)
					continue;
				if(smallestDistance == null || distance < smallestDistance)
				{
					smallestDistancePoint = [ index+u, px ];
					smallestDistance = distance;
				}
			}
		}

		if(smallestDistancePoint != null)
			return { index : smallestDistancePoint[0], lonlat : new ol.LonLat(smallestDistancePoint[1].x, smallestDistancePoint[1].y) };
		else
			return null;
	},

	setRoute : function(options) {
		this.setUrl();

		if(this._fromMarker != null)
		{
			this.removeMarker(this._fromMarker);
			this._fromMarker = null;
		}

		if(this._toMarker != null)
		{
			this.removeMarker(this._toMarker);
			this._toMarker = null;
		}

		for(var i=0; i<this._viaMarkers.length; i++)
		{
			this.removeMarker(this._viaMarkers[i]);
			this._viaMarkers[i].destroy();
		}
		this._viaMarkers = [ ];

		this._currentRoute = null;

		if(options)
		{
			this.provider.getRoute(options, $.proxy(function(route) {
				if(route.from != null)
				{
					this._fromMarker = new ol.Marker(route.from.clone().transform(new ol.Projection("EPSG:4326"), this.map.getProjectionObject()), this.fromIcon.clone())
					this._fromMarker.layer = this; // Required for the drag control
					this.addMarker(this._fromMarker);
				}

				if(route.to != null)
				{
					this._toMarker = new ol.Marker(route.to.clone().transform(new ol.Projection("EPSG:4326"), this.map.getProjectionObject()), this.toIcon.clone())
					this._toMarker.layer = this; // Required for the drag control
					this.addMarker(this._toMarker);
				}

				if(route.via)
				{
					for(var i=0; i<route.via.length; i++)
					{
						this._viaMarkers[i] = new ol.Marker(fm.Util.toMapProjection(route.via[i], this.map), this.viaIcon.clone())
						this._viaMarkers[i].layer = this; // Required for the drag control
						this.addMarker(this._viaMarkers[i]);
					}
				}

				this.requestSuccess({ responseXML : route.gpx });
				this._currentRoute = route;
				this.events.triggerEvent("allloadend");
			}, this));
		}
	},

	getRouteInfoHtml : function() {
		var t = this;
		var route = this._currentRoute;

		var ret = $('<ul></ul>');

		if(route.distance != null)
			ret.append('<li>'+ol.i18n("Distance")+': '+fm.Util.round(route.distance, 1)+"\u2009"+'<abbr title="'+ol.i18n("kilometers")+'">km</abbr></li>');

		if(route.duration != null)
		{
			var minutes = Math.round(route.duration*60)%60;
			if(minutes < 10)
				minutes = "0"+minutes;
			ret.append('<li>'+ol.i18n("Duration")+': '+Math.floor(route.duration)+':'+minutes+"\u2009"+'<abbr title="'+ol.i18n("hours")+'">h</abbr></li>');
		}

		if(route.info)
			ret.append('<li><a href="'+fm.Util.htmlspecialchars(route.info)+'">'+ol.i18n("Detailed driving instructions")+'</a></li>');

		if(route.getElevationProfile)
		{
			var link = $('<a href="#">'+ol.i18n("Elevation profile")+'</a>');
			link.click(function(){
				var size = new ol.Size(Math.round(window.innerWidth/2), Math.round(window.innerHeight/2));
				fm.Util.popup("<div><img src=\""+fm.Util.htmlspecialchars(route.getElevationProfile(size))+"\" alt=\"\" style=\"width:"+size.w+"px; height:"+size.h+"px;\" /></div>", ol.i18n("Elevation profile"));
				return false;
			});
			$('<li />').append(link).appendTo(ret);
		}

		if(route.optimiseRoute && route.via.length >= 2)
		{
			var link = $('<a href="#">'+ol.i18n("Optimise route points")+'</a></li>');
			link.click(function() {
				route.optimiseRoute(function(newRoute) {
					t.setRoute(newRoute);
				});
				return false;
			});
			$('<li />').append(link).appendTo(ret);
		}

		return ret;
	},

	drawMarker : function(marker) {
		var px = this.map.getPixelFromLonLat(marker.lonlat);
		if(px == null)
			marker.display(false);
		else
		{
			if(!marker.isDrawn())
			{
				var markerImg = marker.draw(px);
				this.div.appendChild(markerImg);
			}
			else if(marker.icon)
				marker.icon.moveTo(px);
		}
	},
	addMarker : ol.Layer.Markers.prototype.addMarker,
	removeMarker : ol.Layer.Markers.prototype.removeMarker,
	clearMarkers : ol.Layer.Markers.prototype.clearMarkers,
	moveTo : function(bounds, zoomChanged, dragging) {
		fm.Layer.XML.prototype.moveTo.apply(this, arguments);
		if(zoomChanged || !this.markersDrawn || !dragging)
		{
			for(var i=0, len=this.markers.length; i<len; i++)
				this.drawMarker(this.markers[i]);
            this.markersDrawn = true;
		}
	},

	CLASS_NAME : "FacilMap.Layer.XML.Routing"
});

})(FacilMap, OpenLayers, FacilMap.$);