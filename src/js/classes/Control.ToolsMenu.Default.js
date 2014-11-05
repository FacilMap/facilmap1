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
 * A {@link FacilMap.Control.ToolsMenu} filled with some tools already.
*/

FacilMap.Control.ToolsMenu.Default = ol.Class(fm.Control.ToolsMenu, {
	_mapMoveHandlers : null,
	_layerMarkers : null,
	
	initialize : function() {
		fm.Control.ToolsMenu.prototype.initialize.apply(this, arguments);

		this._mapMoveHandlers = [ ];

		this.addLayerSwitcher(ol.i18n("Layers"));

		var otherMaps = this.addSubMenu(ol.i18n("Other maps"));
		this._mapMoveHandlers.push($.proxy(function() { otherMaps.empty(); this._addOtherMapsLinks(otherMaps); }, this));

		this._layerMarkers = new fm.Layer.Markers.LonLat(ol.i18n("Markers"), { shortName : "m", saveInPermalink : true });
		this.addItem(ol.i18n("Add marker"), $.proxy(function() {
			this.map.expectClick($.proxy(function(pos) {
				this._layerMarkers.addLonLatMarker(pos);
			}, this), ol.i18n("CreateMarkerHelp"));
		}, this));
	},

	setMap : function() {
		var ret = fm.Control.ToolsMenu.prototype.setMap.apply(this, arguments);

		var onMove = $.proxy(function() {
			$.each(this._mapMoveHandlers, $.proxy(function(i,it){ it.apply(this, arguments); }, this));
		}, this);

		this.map.events.register("move", this, onMove);
		onMove();

		this.map.addLayer(this._layerMarkers);

		return ret;
	},

	_addOtherMapsLinks : function(submenu) {
		var lonlat = fm.Util.fromMapProjection(this.map.getCenter(), this.map);

		if(lonlat == null)
			lonlat = new ol.LonLat(0, 0);

		var lon = fm.Util.round(lonlat.lon, 5);
		var lat = fm.Util.round(lonlat.lat, 5);
		var zoom = this.map.getZoom();

		submenu.addItem(ol.i18n("OpenStreetMap"), "https://www.openstreetmap.org/?lat="+lat+"&lon="+lon+"&zoom="+zoom);
		submenu.addItem(ol.i18n("Google Maps"), "https://maps.google.com/?ll="+lat+","+lon+"&z="+zoom);
		submenu.addItem(ol.i18n("Bing Maps"), "https://www.bing.com/maps/?cp="+lat+"~"+lon+"&lvl="+zoom);
		submenu.addItem(ol.i18n("OSM Links"), "http://osmtools.de/osmlinks/?lat="+lat+"&lon="+lon+"&zoom="+zoom);
	},

	CLASS_NAME: "Control.ToolsMenu.Default"
});

})(FacilMap, OpenLayers, FacilMap.$);