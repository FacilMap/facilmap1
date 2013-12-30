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
 * OpenLinkMap from http://olm.openstreetmap.de/.
 *
 * Displays clickable circles over POIs on the map that open popups with information about opening hours,
 * addresses, telephone numbers and websites.
 *
 * POIs are identified by an ID and a type string in OpenLinkMap.
 */
FacilMap.Layer.Markers.OpenLinkMap = ol.Class(fm.Layer.Markers, {
	api : "http://openlinkmap.org/api",
	apiProjection : new ol.Projection("EPSG:4326"),
	zoomableInLayerSwitcher : false,
	markerIcon : new ol.Icon(fm.apiUrl+"/img/circle.png", new ol.Size(32,32), new ol.Pixel(-16, -16)),
	markerIconHighlight : new ol.Icon(fm.apiUrl+"/img/circle_red.png", new ol.Size(32,32), new ol.Pixel(-16, -16)),
	minZoomLevel : 13,
	attribution : ol.i18n("attribution-poi"),

	lastBBOX : null,
	olmMarkers : { },
	lastZoom : null,

	afterAdd : function() {
		var ret = fm.Layer.Markers.prototype.afterAdd.apply(this, arguments);

		this.map.events.register("moveend", this, this.loadMarkers);
		this.events.register("visibilitychanged", this, this.loadMarkers);
		this.loadMarkers();

		return ret;
	},

	/**
	 * Receives the markers for the current map view and adds them to the map.
	 */
	loadMarkers : function() {
		if(!this.getVisibility() || this.map == null)
			return;

		if(this.map.getZoom() != this.lastZoom)
		{
			this.clearMarkers();
			this.olmMarkers = { };
			this.lastZoom = this.map.getZoom();
		}

		if(this.map.getZoom() < this.minZoomLevel)
			return;

		var extent = this.map.getExtent();
		if(extent == null)
			return;

		var bbox = extent.transform(this.map.getProjectionObject(), this.apiProjection).toBBOX();
		if(bbox == this.lastBBOX)
			return;
		this.lastBBOX = bbox;

		var layer = this;

		ol.Request.GET({
			url : this.api + "/list.php",
			params : {
				"bbox" : bbox
			},
			success : function(request) {
				if(request.responseText)
				{
					var objects = request.responseText.split(/\r?\n/);
					for(var i=0; i<objects.length; i++)
					{
						var line = objects[i].split(/\|/);
						if(line.length >= 4)
							layer.addOLMMarker(new ol.LonLat(1*line[0], 1*line[1]), line[2], line[3]);
					}
				}
			},
			failure : function() {
			}
		});
	},

	/**
	 * Is called by the {#loadMarkers} function and adds a single marker to the map.
	 * @param lonlat {OpenLayers.LonLat} The position in EPSG 4326
	 * @param id {String} The ID of the POI
	 * @param type {String} The type of the POI
	 */
	addOLMMarker: function(lonlat, id, type)
	{
		if(this.olmMarkers[type] == undefined)
			this.olmMarkers[type] = { };
		if(this.olmMarkers[type][id] != undefined)
			return;

		var layer = this;

		this.olmMarkers[type][id] = this.createMarker(lonlat, function(callback){ layer.getPopupContent(id, type, callback); }, false, this.markerIcon.clone(), true, this.markerIconHighlight.clone());
	},

	/**
	 * Downloads the information for a specific POI to be displayed in the popup and passes it on to
	 * a callback function.
	 * @param id {String} The ID of the POI to load the information for
	 * @param type {String} The type of the POI to load the information for
	 * @param callback {Function} A function that receives the HTML code with the information as first parameter
	 */
	getPopupContent : function(id, type, callback) {
		var layer = this;
		ol.Request.GET({
			url : this.api + "/details.php",
			params : {
				type : type,
				id : id,
				format : "text",
				lang : ol.Lang.getCode(),
				offset : (new Date()).getTimezoneOffset()/60
			},
			success : function(request) {
				if(request.responseText)
					callback(request.responseText);
			}
		});
	},

	CLASS_NAME : "FacilMap.Layer.Markers.OpenLinkMap"
});

})(FacilMap, OpenLayers, FacilMap.$);