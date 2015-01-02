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

FacilMap.Layer.XML.Routing = ol.Class(fm.Layer.XML, {
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

		this._dragFeature = new fm.Control.DragLine(this, this.viaIcon.clone(), {
			onComplete : function(feature) {
				var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y).transform(this.map.getProjectionObject(), new ol.Projection("EPSG:4326"));
				var newRouteOptions = $.extend({ }, t._currentRoute);
				var which = null;
				if(feature == t._fromMarker) {
					$.extend(newRouteOptions, { from: lonlat });
					which = "from";
				}
				else if(feature == t._toMarker) {
					$.extend(newRouteOptions, { to : lonlat });
					which = "to";
				}
				else {
					var via = [ ].concat(t._currentRoute.via);
					for(var i=0; i<t._viaMarkers.length; i++) {
						if(feature == t._viaMarkers[i]) {
							via[i] = lonlat;
							which = "via"+i;
							break;
						}
					}
					$.extend(newRouteOptions, { via : via });
				}

				if(which == null) {
					if(feature.fmStartLonLat) { // New via marker
						var index = fm.Util.lonLatIndexOnLine(feature.fmStartLonLat, feature.fmLine.geometry);
						if(index != null) {
							var newIndex = newRouteOptions.via.length;
							for(var i=0; i<newIndex; i++) {
								if(index < fm.Util.lonLatIndexOnLine(fm.Util.toMapProjection(newRouteOptions.via[i], this.map), feature.fmLine.geometry))
									newIndex = i;
							}

							which = "via"+newIndex;
							newRouteOptions.via = t._currentRoute.via.slice(0, newIndex).concat([ lonlat ], t._currentRoute.via.slice(newIndex));
						}
						else
							console.warn("Index = null", feature.fmStartLonLat);

						t.removeFeatures([ feature ]);
						feature.destroy();
					}
				}

				if(which != null) {
					t.setRoute(newRouteOptions);
					this.outFeature(feature); // setRoute destroys the marker, DragFeature expects out
					t.events.triggerEvent("draggedRoute", { newRouteOptions : newRouteOptions, draggedPoint : which });
				}
			},
			onDblClick : function(feature) {
				for(var i=0; i<t._viaMarkers.length; i++) {
					if(t._viaMarkers[i] === feature) {
						this._simulateOverFeature(null);
						t.removeFeatures([ t._viaMarkers[i] ]);
						t._viaMarkers[i].destroy();

						var newRouteOptions = $.extend({ }, t._currentRoute);
						newRouteOptions.via.splice(i, 1);
						t.setRoute(newRouteOptions);
						t.events.triggerEvent("draggedRoute", { draggedPoint: "via"+i, newRouteOptions : newRouteOptions });
						return false;
					}
				}
			}
		});
	},

	setMap : function(map) {
		fm.Layer.XML.prototype.setMap.apply(this, arguments);

		map.addControl(this._dragFeature);
		this._dragFeature.activate();
	},

	setRoute : function(options) {
		this.setUrl();

		if(this._fromMarker != null)
		{
			this.removeFeatures([ this._fromMarker ]);
			this._fromMarker = null;
		}

		if(this._toMarker != null)
		{
			this.removeFeatures([ this._toMarker ]);
			this._toMarker = null;
		}

		for(var i=0; i<this._viaMarkers.length; i++)
		{
			this.removeFeatures([ this._viaMarkers[i] ]);
			this._viaMarkers[i].destroy();
		}
		this._viaMarkers = [ ];

		this._currentRoute = null;

		if(options)
		{
			this.provider.getRoute(options, $.proxy(function(route) {
				if(route.from != null)
				{
					this._fromMarker = fm.Util.createIconVector(route.from.clone().transform(new ol.Projection("EPSG:4326"), this.map.getProjectionObject()), this.fromIcon);
					this.addFeatures([ this._fromMarker ]);
				}

				if(route.to != null)
				{
					this._toMarker = fm.Util.createIconVector(route.to.clone().transform(new ol.Projection("EPSG:4326"), this.map.getProjectionObject()), this.toIcon);
					this.addFeatures([ this._toMarker ]);
				}

				if(route.via)
				{
					for(var i=0; i<route.via.length; i++)
					{
						this._viaMarkers[i] = fm.Util.createIconVector(fm.Util.toMapProjection(route.via[i], this.map), this.viaIcon);
						this.addFeatures([ this._viaMarkers[i] ]);
					}
				}

				this._loadXml(route.gpx.documentElement);
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