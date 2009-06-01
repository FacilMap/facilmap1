/*
	This file is part of cdauth’s map.

	OSM Route Manager is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	cdauth’s map is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with cdauth’s map.  If not, see <http://www.gnu.org/licenses/>.

	Obtain the source code from http://svn.cdauth.de/viewvc.cgi/Tools/osm/map/
	or svn://svn.cdauth.de/tools/osm/map/.
*/

/**
 * Provides basic classes to add features of cdauth’s map to any OpenLayers map.
 * Include http://www.openlayers.org/dev/OpenLayers.js for full OpenLayers support.
*/

/**
 * A map with the default values needed for OpenStreetMap and other world maps.
*/

OpenLayers.Map.cdauth = OpenLayers.Class(OpenLayers.Map, {
	initialize : function(div, options)
	{
		OpenLayers.Map.prototype.initialize.apply(this, [ div, OpenLayers.Util.extend({
			controls: [
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.PanZoomBar(),
				new OpenLayers.Control.LayerSwitcher(),
				new OpenLayers.Control.Attribution() ],
			maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
			maxResolution: 156543.0399,
			numZoomLevels: 19,
			units: 'm',
			projection: new OpenLayers.Projection("EPSG:4326"),
			displayProjection: new OpenLayers.Projection("EPSG:4326")
		}, options) ]);
	},

	/**
	 * Adds all available layers from this library to your map.
	*/
	addAllAvailableLayers : function()
	{
		if(OpenLayers.Layer.cdauth.OSM.Mapnik)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.Mapnik("Mapnik"));
		if(OpenLayers.Layer.cdauth.OSM.Osmarender)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.Osmarender("Osmarender"));
		if(OpenLayers.Layer.cdauth.OSM.CycleMap)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.CycleMap("CycleMap"));
		if(OpenLayers.Layer.cdauth.OSM.MinutelyMapnik)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.MinutelyMapnik("Minutely Mapnik"));
		if(OpenLayers.Layer.cdauth.OSM.OpenStreetBrowser)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.OpenStreetBrowser("OpenStreetBrowser"));
		if(OpenLayers.Layer.cdauth.OSM.Wanderkarte)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.Wanderkarte("Reit- und Wanderkarte"));
		if(OpenLayers.Layer.cdauth.OSM.OpenPisteMap)
			this.addLayer(new OpenLayers.Layer.cdauth.OSM.OpenPisteMap("OpenPisteMap"));

		if(OpenLayers.Layer.cdauth.OSM.OPNVKarte)
		{
			var psvMapLow,psvMapHigh;
			this.addLayer(psvMapLow = new OpenLayers.Layer.cdauth.OSM.OPNVKarte.Low("ÖPNV-Karte"));
			this.addLayer(psvMapHigh = new OpenLayers.Layer.cdauth.OSM.OPNVKarte.High("ÖPNV-Karte"));
			this.addOPNVEventHandler(psvMapLow, psvMapHigh);
		}

		if(OpenLayers.Layer.cdauth.Google.Maps)
			this.addLayer(new OpenLayers.Layer.cdauth.Google.Maps("Google Streets"));
		if(OpenLayers.Layer.cdauth.Google.MapsSatellite)
			this.addLayer(new OpenLayers.Layer.cdauth.Google.MapsSatellite("Google Satellite"));
		if(OpenLayers.Layer.cdauth.Google.MapsHybrid)
			this.addLayer(new OpenLayers.Layer.cdauth.Google.MapsHybrid("Google Hybrid"));
		if(OpenLayers.Layer.cdauth.Google.MapsTerrain)
			this.addLayer(new OpenLayers.Layer.cdauth.Google.MapsTerrain("Google Terrain"));
		if(OpenLayers.Layer.cdauth.Google.MapMaker)
			this.addLayer(new OpenLayers.Layer.cdauth.Google.MapMaker("Google MapMaker"));
		if(OpenLayers.Layer.cdauth.Google.MapMakerHybrid)
			this.addLayer(new OpenLayers.Layer.cdauth.Google.MapMakerHybrid("Google MapMaker Hybrid"));

		if(OpenLayers.Layer.cdauth.Yahoo.Maps)
			this.addLayer(new OpenLayers.Layer.cdauth.Yahoo.Maps("Yahoo Street"));
		if(OpenLayers.Layer.cdauth.Yahoo.Satellite)
			this.addLayer(new OpenLayers.Layer.cdauth.Yahoo.Satellite("Yahoo Satellite"));
		if(OpenLayers.Layer.cdauth.Yahoo.Hybrid)
			this.addLayer(new OpenLayers.Layer.cdauth.Yahoo.Hybrid("Yahoo Hybrid"));

		if(OpenLayers.Layer.cdauth.other.OpenAerialMap)
			this.addLayer(new OpenLayers.Layer.cdauth.other.OpenAerialMap("OpenAerialMap"));
		if(OpenLayers.Layer.cdauth.other.Relief)
			this.addLayer(new OpenLayers.Layer.cdauth.other.Relief("Relief"));
	},

	/**
	 * Adds an event handler to the “zoomend” event of the map to ensure that always the right ÖPNV-Karte layer is visible on the map
	 * and its layer switcher. Adds a function updateOPNVLayer() to the map object.
	 * @param OpenLayers.Layer.cdauth.OSM.OPNVKarte.Low layerLow Your low zoom level ÖPNV-Karte layer instance.
	 * @param OpenLayers.Layer.cdauth.OSM.OPNVKarte.High layerHigh Your high zoom level ÖPNV-Karte layer instance.
	*/
	addOPNVEventHandler : function(layerLow, layerHigh)
	{
		this.updateOPNVLayer = function() {
			if(this.getZoom() >= 14)
			{
				layerLow.addOptions({displayInLayerSwitcher: false});
				layerHigh.addOptions({displayInLayerSwitcher: true});
				if(this.baseLayer == layerLow)
					this.setBaseLayer(layerHigh);
			}
			else
			{
				layerLow.addOptions({displayInLayerSwitcher: true});
				layerHigh.addOptions({displayInLayerSwitcher: false});
				if(this.baseLayer == layerHigh)
					this.setBaseLayer(layerLow);
			}
		};
		this.updateOPNVLayer();
		this.events.register("zoomend", this, this.updateOPNVLayer);
	},

	/**
	 * Zoom to the specified query object.
	 * @param Object query Usually decodeQueryString(location.hash.replace(/^#/, ""))
	 * @param OpenLayers.Layer.cdauth.markers.LonLat layerMarkers Optional, layer to add position markers to.
	 * @param OpenLayers.Layer.cdauth.markers.GeoSearch layerGeoSearch Optional, to restore the GeoSearch.
	*/

	zoomToQuery: function(query, layerMarkers, layerGeoSearch)
	{
		var map = this;

		var search_may_zoom = (typeof query.lon == "undefined" && typeof query.lat == "undefined");

		if(!query.lon)
			query.lon = 0;
		if(!query.lat)
			query.lat = 0;
		if(!query.zoom)
			query.zoom = 2;
		this.setCenter(new OpenLayers.LonLat(query.lon, query.lat).transform(this.displayProjection, this.getProjectionObject()), query.zoom);

		if(query.layer)
		{
			var matching_layers = this.getLayersByName(query.layer);
			if(matching_layers.length > 0)
				this.setBaseLayer(matching_layers[0]);
			this.updateOPNVLayer();
		}

		if(layerMarkers)
		{
			layerMarkers.clearMarkers();
			if(query.mlat && query.mlon && typeof query.mlat == "object" && typeof query.mlon == "object")
			{
				for(var i in query.mlat)
				{
					if(typeof query.mlon[i] == "undefined") continue;
					layerMarkers.addLonLatMarker(new OpenLayers.LonLat(query.mlon[i], query.mlat[i]).transform(this.displayProjection, this.getProjectionObject()), (query.mtitle && typeof query.mtitle == "object") ? htmlspecialchars(query.mtitle[i]) : null);
				}
				this.setCenter(new OpenLayers.LonLat(query.lon, query.lat).transform(this.displayProjection, this.getProjectionObject()), query.zoom);
			}
		}

		if(layerGeoSearch && query.search)
			layerGeoSearch.geoSearch(query.search, search_may_zoom ? false : function(){map.setCenter(new OpenLayers.LonLat(query.lon, query.lat).transform(map.displayProjection, map.getProjectionObject()), query.zoom);}, query.smopen);
	},

	/**
	 * Returns a Query object that you can pass to the zoomToQuery() function to restore the current view. Usually you save this to the location
	 * hash part by calling location.hash = "#"+encodeQueryString(map.getQueryObject());
	 * @param OpenLayers.Layer.cdauth.markers.LonLat layerMarkers Optional, to save the positions of the geographical markers.
	 * @param OpenLayers.Layer.cdauth.markers.GeoSearch layerGeoSearch Optional, to save the current GeoSearch.
	 * @return Object
	*/

	getQueryObject: function(layerMarkers, layerGeoSearch)
	{
		if(!this.getCenter())
			return false;

		var lonlat = this.getCenter().clone().transform(this.getProjectionObject(), this.displayProjection);
		var hashObject = {
			lon : lonlat.lon,
			lat : lonlat.lat,
			zoom : this.getZoom(),
			layer : this.baseLayer.name,
			mlon : { },
			mlat : { },
			mtitle : { },
			smopen : { }
		};

		if(layerGeoSearch && layerGeoSearch.lastSearch)
		{
			hashObject.search = layerGeoSearch.lastSearch;

			for(var i=0; i<layerGeoSearch.markers.length; i++)
			{
				var visible = layerGeoSearch.markers[layerGeoSearch.markers.length-1-i].cdauthFeature.popup ? layerGeoSearch.markers[layerGeoSearch.markers.length-1-i].cdauthFeature.popup.visible() : false;
				if(visible != (i == 0))
					hashObject.smopen[i] = visible ? "1" : "0";
			}
		}

		if(layerMarkers)
		{
			for(var i=0; i<layerMarkers.markers.length; i++)
			{
				var lonlat = layerMarkers.markers[i].lonlat.clone().transform(this.getProjectionObject(), this.displayProjection);
				hashObject.mlon[i] = lonlat.lon;
				hashObject.mlat[i] = lonlat.lat;
				if(layerMarkers.markers[i].cdauthTitle)
					hashObject.mtitle[i] = layerMarkers.markers[i].cdauthTitle;
			}
		}

		return hashObject;
	}
});

OpenLayers.Control.cdauth = { };
/**
 * Provides an add-marker click control to the map. Clicking on any point on the map will create a marker there with the coordinates and Permalinks.
 * Use the following code to add the control to the map.
 * var click = new OpenLayers.Control.cdauth.MarkerClick();
 * map.addControl(click);
 * click.activate();
*/
OpenLayers.Control.cdauth.MarkerClick = OpenLayers.Class(OpenLayers.Control, {
	layerMarkers : false,
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0,
		'stopSingle': false,
		'stopDouble': false
	},

	/**
	 * @param OpenLayers.Layer.Markers layerMarkers The Layer that the markers should be added to. May be OpenLayers.Layer.cdauth.markers.LonLat.
	*/
	initialize: function(layerMarkers, options) {
		this.layerMarkers = layerMarkers;
		this.handlerOptions = OpenLayers.Util.extend(
			{}, this.defaultHandlerOptions
		);
		OpenLayers.Control.prototype.initialize.apply(
			this, arguments
		);
		this.handler = new OpenLayers.Handler.Click(
			this, {
				'click': this.trigger
			}, this.handlerOptions
		);
	},

	trigger: function(e) {
		var lonlat = this.layerMarkers.map.getLonLatFromViewPortPx(e.xy);
		this.layerMarkers.addLonLatMarker(lonlat);
	}
});

OpenLayers.Layer.cdauth = {
	OSM : { },
	Google : { },
	Yahoo : { },
	markers : { },
	other : { }
};

if(OpenLayers.Layer.OSM)
{
	/**
	 * Mapnik rendering from openstreetmap.org.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.Mapnik = OpenLayers.Class(OpenLayers.Layer.OSM.Mapnik);

	/**
	 * Osmarender rendering from openstreetmap.org.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.Osmarender = OpenLayers.Class(OpenLayers.Layer.OSM.Osmarender);

	/**
	 * CycleMap rendering from openstreetmap.org.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.CycleMap = OpenLayers.Class(OpenLayers.Layer.OSM.CycleMap);

	/**
	 * Minutely Mapnik rendering of OpenStreetMap data by CloudMade. See http://matt.sandbox.cloudmade.com/.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.MinutelyMapnik = OpenLayers.Class(OpenLayers.Layer.OSM, {
		initialize: function(name, options) {
			OpenLayers.Layer.OSM.prototype.initialize.apply(
				this,
				[
					name,
					[
						"http://a.matt.sandbox.cloudmade.com/123/3/256/",
						"http://b.matt.sandbox.cloudmade.com/123/3/256/",
						"http://c.matt.sandbox.cloudmade.com/123/3/256/"
					],
					OpenLayers.Util.extend({
						numZoomLevels: 19,
						attribution: "Rendering by <a href=\"http://www.cloudmade.com/\">CloudMade</a>. Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>"
					}, options)
				]
			);
		}
	});

	/**
	 * OpenStreetBrowser rendering of OpenStreetMap data. See http://openstreetbrowser.org/.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.OpenStreetBrowser = new OpenLayers.Class(OpenLayers.Layer.OSM, {
		initialize: function(name, options) {
			OpenLayers.Layer.OSM.prototype.initialize.apply(this, [ name, "http://openstreetbrowser.org/tiles/base/", OpenLayers.Util.extend({numZoomLevels: 19}, options) ]);
		}
	});

	/**
	 * OpenPisteMap rendering of OpenStreetMap data. See http://openpistemap.org/.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.OpenPisteMap = new OpenLayers.Class(OpenLayers.Layer.OSM, {
		initialize: function(name, options) {
			OpenLayers.Layer.OSM.prototype.initialize.apply(this, [ name, "http://openpistemap.org/tiles/contours/", OpenLayers.Util.extend({numZoomLevels: 18}, options) ]);
		}
	});

	if(OpenLayers.Layer.WMS)
	{
		OpenLayers.Layer.cdauth.OSM.OPNVKarte = { };

		/**
		 * OpenStreetMap data rendering by ÖPNV-Karte (PSV map) for low zoom levels (< 14). Add both the low and the high zoom level layers to your map
		 * and run OpenLayers.Map.cdauth.addOPNVEventHandler() for the right layer to be visible.
		 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
		*/
		OpenLayers.Layer.cdauth.OSM.OPNVKarte.Low = new OpenLayers.Class(OpenLayers.Layer.OSM, {
			initialize: function(name, options) {
				OpenLayers.Layer.OSM.prototype.initialize.apply(this, [ name, "http://xn--pnvkarte-m4a.de/tiles/", OpenLayers.Util.extend({numZoomLevels: 19, displayInLayerSwitcher: false}, options) ]);
			}
		});

		/**
		 * OpenStreetMap data rendering by ÖPNV-Karte (PSV map) for high zoom levels (>= 14). Add both the low and the high zoom level layers to your map
		 * and run OpenLayers.Map.cdauth.addOPNVEventHandler() for the right layer to be visible.
		 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js for this to work.
		*/
		OpenLayers.Layer.cdauth.OSM.OPNVKarte.High = new OpenLayers.Class(OpenLayers.Layer.WMS, {
			initialize: function(name, options) {
				OpenLayers.Layer.WMS.prototype.initialize.apply(this, [ name, "http://xn--pnvkarte-m4a.de/cgi-bin/mapnikserv.py?", {map: '/opt/mapnik/test.xml', mode: 'view', format: 'image/png256'}, OpenLayers.Util.extend({numZoomLevels: 19, singleTile: true, projection: OSMProjection, displayInLayerSwitcher: false}, options) ]);
			}
		});
	}
}

if(OpenLayers.Layer.OpenTiles)
{
	/**
	 * OSM Reit- und Wanderkarte rendering of OSM foot- and bridle ways. See http://osmc.broadbox.de/.
	 * Include http://www.openstreetmap.org/openlayers/OpenStreetMap.js  and http://opentiles.com/nop/opentiles.js for this to work.
	*/
	OpenLayers.Layer.cdauth.OSM.Wanderkarte = new OpenLayers.Class(OpenLayers.Layer.OpenTiles, {
		initialize: function(name, options) {
			OpenLayers.Layer.OpenTiles.prototype.initialize.apply(this, [ name, "http://opentiles.com/nop/get.php?", OpenLayers.Util.extend({numZoomLevels: 16, layername:'trails', attribution: "Rendering by <a href=\"http://opentiles.com/nop/\">OSMC Reit- und Wanderkarte</a>. Data by <a href=\"http://openstreetmap.org/\">OpenStreetMap</a>" }, options) ]);
		}
	});
}

if(OpenLayers.Layer.Google)
{
	/**
	 * Google Streets (http://maps.google.com/)
	 * Get a Google map key from http://code.google.com/apis/maps/signup.html and include
	 * http://maps.google.com/maps?file=api&v=2&key=[Your key] for this to work.
	*/
	OpenLayers.Layer.cdauth.Google.Maps = new OpenLayers.Class(OpenLayers.Layer.Google, {
		initialize: function(name, options) {
			OpenLayers.Layer.Google.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({sphericalMercator: true}, options) ]);
		}
	});

	/**
	 * Google Satellite (http://maps.google.com/)
	 * Get a Google map key from http://code.google.com/apis/maps/signup.html and include
	 * http://maps.google.com/maps?file=api&v=2&key=[Your key] for this to work.
	*/
	OpenLayers.Layer.cdauth.Google.MapsSatellite = new OpenLayers.Class(OpenLayers.Layer.cdauth.Google.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Google.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: G_SATELLITE_MAP, numZoomLevels: 22}, options) ]);
		}
	});

	/**
	 * Google Hybrid (Streets and Satellite) (http://maps.google.com/)
	 * Get a Google map key from http://code.google.com/apis/maps/signup.html and include
	 * http://maps.google.com/maps?file=api&v=2&key=[Your key] for this to work.
	*/
	OpenLayers.Layer.cdauth.Google.MapsHybrid = new OpenLayers.Class(OpenLayers.Layer.cdauth.Google.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Google.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: G_HYBRID_MAP}, options) ]);
		}
	});

	/**
	 * Google Terrain (http://maps.google.com/)
	 * Get a Google map key from http://code.google.com/apis/maps/signup.html and include
	 * http://maps.google.com/maps?file=api&v=2&key=[Your key] for this to work.
	*/
	OpenLayers.Layer.cdauth.Google.MapsTerrain = new OpenLayers.Class(OpenLayers.Layer.cdauth.Google.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Google.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: G_PHYSICAL_MAP}, options) ]);
		}
	});

	/**
	 * Google MapMaker streets (http://www.google.com/mapmaker)
	 * Get a Google map key from http://code.google.com/apis/maps/signup.html and include
	 * http://maps.google.com/maps?file=api&v=2&key=[Your key] for this to work.
	*/
	OpenLayers.Layer.cdauth.Google.MapMaker = new OpenLayers.Class(OpenLayers.Layer.cdauth.Google.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Google.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: G_MAPMAKER_NORMAL_MAP}, options) ]);
		}
	});

	/**
	 * Google MapMaker hybrid (streets and satellite) (http://www.google.com/mapmaker)
	 * Get a Google map key from http://code.google.com/apis/maps/signup.html and include
	 * http://maps.google.com/maps?file=api&v=2&key=[Your key] for this to work.
	*/
	OpenLayers.Layer.cdauth.Google.MapMakerHybrid = new OpenLayers.Class(OpenLayers.Layer.cdauth.Google.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Google.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: G_MAPMAKER_HYBRID_MAP}, options) ]);
		}
	});
}

if(OpenLayers.Layer.Yahoo)
{
	/**
	 * Yahoo Streets (http://maps.yahoo.com/)
	 * Include http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=cdauths-map for this to work.
	*/
	OpenLayers.Layer.cdauth.Yahoo.Maps = new OpenLayers.Class(OpenLayers.Layer.Yahoo, {
		initialize: function(name, options) {
			OpenLayers.Layer.Yahoo.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({sphericalMercator: true}, options) ]);
		}
	});

	/**
	 * Yahoo Satellite (http://maps.yahoo.com/)
	 * Include http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=cdauths-map for this to work.
	*/
	OpenLayers.Layer.cdauth.Yahoo.Satellite = new OpenLayers.Class(OpenLayers.Layer.cdauth.Yahoo.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Yahoo.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: YAHOO_MAP_SAT}, options) ]);
		}
	});

	/**
	 * Yahoo Hybrid (Streets and Satellite)
	 * Include http://api.maps.yahoo.com/ajaxymap?v=3.0&appid=cdauths-map for this to work.
	*/
	OpenLayers.Layer.cdauth.Yahoo.Hybrid = new OpenLayers.Class(OpenLayers.Layer.cdauth.Yahoo.Maps, {
		initialize: function(name, options) {
			OpenLayers.Layer.cdauth.Yahoo.Maps.prototype.initialize.apply(this, [ name, OpenLayers.Util.extend({type: YAHOO_MAP_HYB}, options) ]);
		}
	});
}

if(OpenLayers.Layer.XYZ)
{
	/**
	 * OpenAerialMap (http://openaerialmap.org/). You may have to use the current unstable version of OpenLayers for this to be supported.
	*/
	OpenLayers.Layer.cdauth.other.OpenAerialMap = new OpenLayers.Class(OpenLayers.Layer.XYZ, {
		initialize: function(name, options) {
			OpenLayers.Layer.XYZ.prototype.initialize.apply(this, [ name, "http://tile.openaerialmap.org/tiles/1.0.0/openaerialmap-900913/${z}/${x}/${y}.png", OpenLayers.Util.extend({sphericalMercator: true}, options) ]);
		}
	});
}

if(OpenLayers.Layer.OpenTiles)
{
	/**
	 * Reit- und Wanderkarte relief rendering.
	 * Include http://opentiles.com/nop/opentiles.js for this to work.
	*/
	OpenLayers.Layer.cdauth.other.Relief = new OpenLayers.Class(OpenLayers.Layer.OpenTiles, {
		initialize: function(name, options) {
			OpenLayers.Layer.OpenTiles.prototype.initialize.apply(this, [ name, "http://opentiles.com/nop/get.php?", OpenLayers.Util.extend({numZoomLevels: 16, isBaseLayer:true, layername:'relief', attribution: "Rendering by <a href=\"http://opentiles.com/nop/\">OSMC Reit- und Wanderkarte</a>. DEM by <a href='http://srtm.csi.cgiar.org'>CIAT</a>" }, options) ]);
		}
	});
}

/**
 * A Markers layer for adding LonLat markers. These markers display their coordinates and list various Permalinks to other map services.
 * @event markerAdded
 * @event markerRemoved
*/

OpenLayers.Layer.cdauth.markers.LonLat = new OpenLayers.Class(OpenLayers.Layer.Markers, {
	defaultIcon : false,
	EVENT_TYPES : [ "markerAdded", "markerRemoved" ],

	/**
	 * @param OpenLayers.Icon defaultIcon The icon to be used for the markers added by addLonLatMarker()
	*/
	initialize : function(name, defaultIcon, options) {
		this.defaultIcon = defaultIcon;
		this.EVENT_TYPES = OpenLayers.Layer.cdauth.markers.LonLat.prototype.EVENT_TYPES.concat(OpenLayers.Layer.Markers.prototype.EVENT_TYPES);
		OpenLayers.Layer.Markers.prototype.initialize.apply(this, [ name, options ]);
	},
	addLonLatMarker : function(lonlat, title)
	{
		var layer = this;

		var lonlat_readable = lonlat.clone().transform(this.map.getProjectionObject(), this.map.displayProjection);
		var this_icon = this.defaultIcon.clone();
		var marker = new OpenLayers.Marker(lonlat, this_icon);
		if(title)
			marker.cdauthTitle = title;
		this.addMarker(marker);
		var framecloud = new OpenLayers.Popup.FramedCloud("lonlat", lonlat, null, ".", this_icon, true, function(evt){if(title) delete marker.cdauthTitle; layerMarkers.removeMarker(marker); framecloud.destroy(); layer.events.triggerEvent("markerRemoved"); OpenLayers.Event.stop(evt); });
		marker.cdauthPopup = framecloud;
		this.map.addPopup(framecloud);
		this.map.events.register("zoomend", this, this.resetPopupContent);
		this.resetPopupContent();
		this.events.triggerEvent("markerAdded");
	},

	/**
	 * Is executed automatically on a zoom level change, recreates the Permalinks of the markers.
	*/
	resetPopupContent : function()
	{
		for(var i=0; i<this.markers.length; i++)
			this.markers[i].cdauthPopup.setContentHTML((this.markers[i].cdauthTitle ? "<h6 class=\"marker-heading\">"+htmlspecialchars(this.markers[i].cdauthTitle)+"</h6>" : "")+makePermalinks(this.markers[i].lonlat.clone().transform(this.map.getProjectionObject(), this.map.displayProjection), this.map.getZoom()));
	}
});

/**
 * A markers layer to display the search results of the OpenStreetMap NameFinder.
 * @event lastSearchChange The value of lastSearch has changed.
 * @event searchBegin
 * @event searchSuccess
 * @event searchFailure
 * @event markersChanged A marker has been opened or closed.
*/

OpenLayers.Layer.cdauth.markers.GeoSearch = new OpenLayers.Class(OpenLayers.Layer.Markers, {
	lastSearch : false,
	nameFinderURL : false,
	defaultIcon : false,
	highlighIcon : false,
	EVENT_TYPES : [ "lastSearchChange", "searchBegin", "searchSuccess", "searchFailure", "markersChanged" ],

	/**
	 * @param String nameFinderURL http://gazetteer.openstreetmap.org/namefinder/search.xml (search=%s will be appended). To work around the same origin policy, pass a wrapper that lives on your webspace.
	 * @param OpenLayers.Icon defaultIcon The default icon to use for the search result markers.
	 * @param OpenLayers.Icon highlightIcon The marker icon to use for the first search result.
	*/
	initialize: function(name, nameFinderURL, defaultIcon, highlightIcon, options) {
		this.nameFinderURL = nameFinderURL;
		this.defaultIcon = defaultIcon;
		this.highlightIcon = highlightIcon;
		this.EVENT_TYPES = OpenLayers.Layer.cdauth.markers.GeoSearch.prototype.EVENT_TYPES.concat(OpenLayers.Layer.Markers.prototype.EVENT_TYPES);
		OpenLayers.Layer.Markers.prototype.initialize.apply(this, [ name, options ]);
	},

	/**
	 * Use the NameFinder to search in OpenStreetMap data and add the search results as markers to this layer.
	 * @param String query The search string.
	 * @param Function zoomback This function will be run after adding the result markers. It can be used to zoom back, as OpenLayers moves the map to make added markers visible. If this is set, the alert box indicating that no results have been found will not be shown.
	 * @param Array markersvisible Contains a boolean value (or a string representing a boolean) for each search result to indicate if a popup should be opened.
	*/
	geoSearch: function(query, zoomback, markersvisible)
	{
		layer = this;

		for(var i=0; i<this.markers.length; i++)
		{
			if(this.markers[i].cdauthFeature.popup)
				this.markers[i].cdauthFeature.popup.destroy();
		}
		this.clearMarkers();
		this.lastSearch = false;
		this.events.triggerEvent("lastSearchChange");

		if(!query)
			return;

		this.events.triggerEvent("searchBegin");

		OpenLayers.loadURL(this.nameFinderURL, { "find": query }, null, function(request) {
			if(request.responseXML)
			{
				var searchresults = request.responseXML.getElementsByTagName("searchresults");
				if(searchresults.length > 0)
				{
					var named = searchresults[0].childNodes;
					var markers = [ ];
					var zoom;
					var last_lonlat;
					var first = true;
					for(var i=0; i<named.length; i++)
					{
						if(named[i].nodeType != 1) continue;

						zoom = named[i].getAttribute("zoom");

						var lonlat = new OpenLayers.LonLat(named[i].getAttribute("lon"), named[i].getAttribute("lat")).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
						last_lonlat = lonlat;
						var this_icon = (first ? layer.highlightIcon : layer.defaultIcon).clone();
						if(first) first = false;

						var feature = new OpenLayers.Feature(this, lonlat);
						feature.popupClass = OpenLayers.Popup.FramedCloud;
						// FIXME: global variable map is still used
						feature.data.popupContentHTML = "<h6 class=\"result-heading\"><strong>"+htmlspecialchars(named[i].getAttribute("name"))+"</strong> ("+htmlspecialchars(named[i].getAttribute("info") ? named[i].getAttribute("info") : "unknown")+"), <a href=\"javascript:map.setCenter(new OpenLayers.LonLat("+named[i].getAttribute("lon")+", "+named[i].getAttribute("lat")+").transform(map.displayProjection, map.getProjectionObject()), "+named[i].getAttribute("zoom")+");\">[Zoom]</a></h6>"+makePermalinks(new OpenLayers.LonLat(named[i].getAttribute("lon"), named[i].getAttribute("lat")), named[i].getAttribute("zoom"));
						feature.data.autoSize = true;
						feature.data.icon = this_icon;
						var marker = feature.createMarker();
						var markerClick = function (evt) {
							if (this.popup == null) {
								this.popup = this.createPopup(true);
								OpenLayers.Event.observe(this.popup.closeDiv, "click", OpenLayers.Function.bindAsEventListener(function(e)
								{
									this.popup.hide();
									OpenLayers.Event.stop(e);
									layer.events.triggerEvent("markersChanged");
								}, this));

								layer.map.addPopup(this.popup);
								this.popup.show();
							} else {
								this.popup.toggle();
							}
							OpenLayers.Event.stop(evt);
							layer.events.triggerEvent("markersChanged");
						};
						marker.events.register("mousedown", feature, markerClick);
						marker.cdauthFeature = feature;
						markers.push(marker);
					}
					for(var i=markers.length-1; i>=0; i--)
					{
						if((markersvisible && typeof markersvisible[i] != "undefined" && markersvisible[i] != "0") || ((!markersvisible || typeof markersvisible[i] == "undefined") && i==0))
							markers[i].events.triggerEvent("mousedown");
						layer.addMarker(markers[i]);
					}

					if(zoomback)
						zoomback();
					else
					{
						if(markers.length == 0)
							alert("No results.");
						else if(markers.length == 1)
							layer.map.setCenter(last_lonlat, zoom);
						else
							layer.map.zoomToExtent(layer.getDataExtent());
					}

					layer.lastSearch = query;
					layer.events.triggerEvent("lastSearchChange");

					layer.events.triggerEvent("searchSuccess");

					return;
				}
			}
			this.events.triggerEvent("searchFailure");
			alert("Search failed.");
		}, function() {
			this.events.triggerEvent("searchFailure");
			alert("Search failed.");
		});
	}
});

/**
 * Decodes a URL query string (the part after the ?).
 * @param String str
 * @return Object
*/

function decodeQueryString(str)
{
	var obj = { };
	var str_split = str.split(/[;&]/);
	for(var i=0; i<str_split.length; i++)
	{
		var equal_sign = str_split[i].indexOf("=");
		if(equal_sign < 1) continue;

		var key = str_split[i].substr(0, equal_sign);
		var arr_match = key.match(/(\[[^\]]*\])+$/);
		if(arr_match)
		{
			var arr_indexes = arr_match[0].substring(1, arr_match[0].length-1).split("][");
			arr_indexes.unshift(key.substr(0, key.length-arr_match[0].length));
			var cur_el = obj;
			for(var j=0; j<arr_indexes.length; j++)
			{
				var cur_key = decodeURIComponent(arr_indexes[j]);
				if(cur_key.length == 0)
				{
					cur_key = 0;
					while(typeof cur_el[cur_key] != "undefined")
						cur_key++;
				}
				if(j == arr_indexes.length-1)
					cur_el[cur_key] = decodeURIComponent(str_split[i].substr(equal_sign+1));
				else
				{
					if(!cur_el[cur_key] || typeof cur_el[cur_key] != "object")
						cur_el[cur_key] = { };
					cur_el = cur_el[cur_key];
				}
			}
		}
		else
			obj[decodeURIComponent(key)] = decodeURIComponent(str_split[i].substr(equal_sign+1));
	}
	return obj;
}

/**
 * Encodes an Object to a URL query string.
 * @param Object obj
*/

function encodeQueryString(obj, prefix, arr)
{
	if(!prefix)
		arr = [ ];
	for(var i in obj)
	{
		var key = encodeURIComponent(i);
		if(prefix)
			key = prefix+"["+key+"]";
		if(typeof obj[i] == "object")
			encodeQueryString(obj[i], key, arr);
		else
			arr.push(key+"="+encodeURIComponent(obj[i]));
	}
	return arr.join(";");
}

/**
 * Replaces <, > and " in the string with their HTML entities.
*/

function htmlspecialchars(str)
{
	if(!str) return "";
	return str.replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
}

/**
 * Returns HTML code with Permalinks to various Map services at the specified position with the specified zoom level.
 * @param OpenLayers.LonLat lonlat
 * @param Number zoom
 * @return String
*/

function makePermalinks(lonlat, zoom)
{
	return "<dl><dt>Longitude</dt><dd>"+Math.round(lonlat.lon*100000000)/100000000+"</dd>"
		+ "<dt>Latitude</dt><dd>"+Math.round(lonlat.lat*100000000)/100000000+"</dd></dl>"
		+ "<ul><li><a href=\"http://www.openstreetmap.org/?lat="+lonlat.lat+"&amp;lon="+lonlat.lon+"&amp;zoom="+zoom+"\">OpenStreetMap Permalink</a></li>"
		+ "<li><a href=\"http://data.giub.uni-bonn.de/openrouteservice/index.php?end="+lonlat.lon+","+lonlat.lat+"&amp;lat="+lonlat.lat+"&amp;lon="+lonlat.lon+"&amp;zoom="+zoom+"\">Get directions (OpenRouteService)</a></li>"
		+ "<li><a href=\"http://www.openstreetmap.org/?mlat="+lonlat.lat+"&amp;mlon="+lonlat.lon+"&amp;zoom="+zoom+"\">OpenStreetMap Marker</a></li>"
		+ "<li><a href=\"http://maps.google.com/?q="+lonlat.lat+","+lonlat.lon+"\">Google Maps Marker</a></li>"
		+ "<li><a href=\"http://maps.yahoo.com/broadband/#lat="+lonlat.lat+"&amp;lon="+lonlat.lon+"&amp;zoom="+zoom+"\">Yahoo Maps Permalink</a></li>"
		+ "<li><a href=\"http://osmtools.de/osmlinks/?lat="+lonlat.lat+"&amp;lon="+lonlat.lon+"&amp;zoom="+zoom+"\">OpenStreetMap Links</a></li>"
		+ "<li><a href=\"http://stable.toolserver.org/geohack/geohack.php?params="+lonlat.lat+"_N_"+lonlat.lon+"_E\">Wikimedia GeoHack</a></li></ul>";
}