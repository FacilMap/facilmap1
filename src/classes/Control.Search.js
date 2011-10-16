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

fm.Control.Search = ol.Class(ol.Control, {
	nameFinder : null,
	tabindex : 1,

	_layerMarkers : null,
	_layerRouting : null,
	_layerXML : null,

	_stateObject : { },

	/**
	 * @param nameFinder {FacilMap.NameFinder}
	 * @param options
	 */
	initialize : function(options) {
		this.nameFinder = new FacilMap.NameFinder.Nominatim();

		this.makeSuggestions = $.proxy(this.makeSuggestions, this);

		ol.Control.prototype.initialize.apply(this, arguments);

		this.events.addEventType("stateObjectChanged");
	},

	draw : function() {
		var t = this;
		var create = (this.div == null);

		var ret = ol.Control.prototype.draw.apply(this, arguments);

		if(create)
		{
			/* Seems to work without this now, and this breaks route dragging behaviour
			// Disable map dragging inside search bar for proper mouse click handling
			var navigationControl = this.map.getControlsByClass("OpenLayers.Control.Navigation")[0];
			if(navigationControl)
			{
				$(ret).mouseover(function(){
					navigationControl.deactivate();
				}).mouseout(function() {
					navigationControl.activate();
				});
			}*/

			/////////////////
			// Control layers

			var zoomFunc = function(){
				if(this._fmZoom)
				{
					var extent = this.getDataExtent();
					if(extent)
						this.map.zoomToExtent(extent);
					this._fmZoom = false;
				}
			};

			t._layerMarkers = new fm.Layer.Markers.SearchResults("[results]", { displayInLayerSwitcher : false });
			t.map.addLayer(t._layerMarkers);

			t._layerXML = new fm.Layer.XML("[xml]", null, { displayInLayerSwitcher : false });
			t.map.addLayer(t._layerXML);
			t._layerXML.events.register("allloadend", t._layerXML, zoomFunc);

			t._layerRouting = new fm.Layer.XML.Routing("[routing]", { displayInLayerSwitcher : false });
			t.map.addLayer(t._layerRouting);
			t._layerRouting.events.register("draggedRoute", this, function(e) {
				if(e.draggedPoint == "from")
					$(".from", t.div).val(t._stateObject.from = fm.Util.round(e.newRouteOptions.from.lat, 5)+","+fm.Util.round(e.newRouteOptions.from.lon, 5));
				else if(e.draggedPoint == "to")
					$(".to", t.div).val(t._stateObject.to = fm.Util.round(e.newRouteOptions.to.lat, 5)+","+fm.Util.round(e.newRouteOptions.to.lon, 5));
				else if(e.draggedPoint == "via")
					t._stateObject.via = $.map(e.newRouteOptions.via, function(it){ return fm.Util.round(it.lat, 5)+","+fm.Util.round(it.lon, 5); });
				t.events.triggerEvent("stateObjectChanged");
			});
			t._layerRouting.events.register("allloadend", t._layerRouting, zoomFunc);
			t._layerRouting.events.register("allloadend", t, function() {
				$(".route-info", t.div).remove();
				t._layerRouting.getRouteInfoHtml().addClass("route-info").insertAfter($("form", t.div));
			});

			///////////////
			// Forms fields

			$(
				'<form>' +
					'<input type="text" class="from" />' +
					'<img src="'+fm.apiUrl+'/img/help.png" alt="?" class="help" />' +
					'<input type="text" class="to" />' +
					'<a href="#" class="directions"></a>' +
					'<input type="submit" value="" class="submit" />' +
					'<input type="button" value="'+ol.i18n("Clear")+'" class="clear" />' +
					'<select class="type">' +
						'<option value="'+FacilMap.Routing.Type.FASTEST+'">'+ol.i18n("Fastest")+'</option>' +
						'<option value="'+FacilMap.Routing.Type.SHORTEST+'">'+ol.i18n("Shortest")+'</option>' +
					'</select>' +
					'<select class="medium">' +
						'<option value="'+FacilMap.Routing.Medium.CAR+'">'+ol.i18n("Car")+'</option>' +
						'<option value="'+FacilMap.Routing.Medium.BICYCLE+'">'+ol.i18n("Bicycle")+'</option>' +
						'<option value="'+FacilMap.Routing.Medium.FOOT+'">'+ol.i18n("Foot")+'</option>' +
					'</select>' +
				'</form>'
			).appendTo(ret);

			/////////////////
			// Event handlers

			new FacilMap.AutoSuggest($(".from", ret)[0], this.makeSuggestions);
			new FacilMap.AutoSuggest($(".to", ret)[0], this.makeSuggestions);

			var routingVisible = true;
			$(".directions", ret).click(function(){
				routingVisible = !routingVisible;
				$(".from", ret).attr("placeholder", routingVisible ? ol.i18n("From") : "");
				$(".directions", ret).html(ol.i18n(routingVisible ? "Hide directions" : "Get directions"));
				$(".to,.type,.medium", ret).css("display", routingVisible ? "" : "none").attr("placeholder", routingVisible ? ol.i18n("To") : "");
				$(".submit", ret).val(ol.i18n(routingVisible ? "Get directions" : "Search"));
				$(ret)[routingVisible ? "addClass" : "removeClass"]("routing");
				$(".help", ret).css("display", routingVisible ? "none" : "");

				$.each(routingVisible ? [ ".from", ".to", ".submit", ".clear", ".type", ".medium", ".directions" ] : [ ".from", ".search", ".clear", ".directions" ], function(i, it) {
					$(it, ret).attr("tabindex", t.tabindex+i);
				});

				return false;
			}).click();

			$(".help", ret).click(function(){ fm.Util.popup(ol.i18n("searchHelpText"), ol.i18n("Search help")); });

			$("form", ret).submit(function(){ t.submit(true); return false; });
			$(".clear", ret).click(function() { $(".from,.to", ret).val(""); t.submit(true); });
		}

		return ret;
	},

	/**
	 * A suggestion function to use for {@link FacilMap.AutoSuggest} that takes care of POI searches
	 * (search queries containing “near” terms)
	 * @param query {String}
	 * @param callback {Function}
	 */
	makeSuggestions : function(query, callback) {
		var t = this;
		var poi = this.getPOISearchTerm(query);

		this.nameFinder.makeSuggestions(poi.place, function(suggestions) {
			$.each(suggestions, function(i, it){
				it.value = t.convertBackPOI($.extend(poi, { place : it.value }));
			});
			callback(suggestions);
		});
	},

	/**
	 * Splits up the search term for POI searches like “supermarkets near London, England”.
	 * @param query {String} The search query to split up
	 * @return {Object} poi: “supermarket” (or null if no “near” is contained in the search query
	 *                  place: “London, England”
	 */
	getPOISearchTerm : function(query) {
		var m = query.match(/^(.*?)( near (.*?))?$/i);
		if(m[3])
			return { poi : m[1], place : m[3] };
		else
			return { place : m[1] };
	},

	/**
	 * Reverse function for {@link #getPOISearchTerm}.
	 * @param poi {Object} An object as returned by {@link #getPOISearchTerm}
	 * @return {String} The search query string representing that object
	 */
	convertBackPOI : function(poi) {
		var ret = poi.place;
		if(poi.poi)
			ret = poi.poi + " near " + ret;
		return ret;
	},

	/**
	 * Calls the {@link #search} function with the values of the form fields.
	 * @param zoom {Boolean} Zoom to results?
	 * @param via {Array<OpenLayers.LonLat>} Possible via points for the route
	 */
	submit : function(zoom, via) {
		if(!$(this.div).hasClass("routing"))
			this.search($(".from", this.div).val(), null, null, null, null, zoom);
		else
			this.search($(".from", this.div).val(), $(".to", this.div).val(), $(".type", this.div).val(), $(".medium", this.div).val(), via, zoom);
	},

	/**
	 * Decides what kind of search to start (GPX file, routing, POI search, ...) depending on the
	 * contents of the search fields
	 * @param query1 {String} The content of the “from” field
	 * @param query2 {String} The content of the “to” field
	 * @param type {FacilMap.Routing.Type}
	 * @param medium {FacilMap.Routing.Medium}
	 * @param via {Array<OpenLayers.LonLat>} Possible via points for the route
	 * @param zoom {Boolean} Zoom to results?
	 */
	search : function(query1, query2, type, medium, via, zoom) {
		this.clear();

		query1 = (query1 || "").replace(/^\s+/, "").replace(/\s+$/, "");
		query2 = (query2 || "").replace(/^\s+/, "").replace(/\s+$/, "");

		if(query1)
		{
			if(query2)
			{
				this._stateObject = {
					from : query1,
					to : query2,
					type : type,
					medium : medium,
					via : via ? $.map(via, function(it){ return fm.Util.round(it.lat, 5)+","+fm.Util.round(it.lon, 5); }) : null
				};
				this.events.triggerEvent("stateObjectChanged");
				this.showRoute(query1, query2, type, medium, via, zoom);
			}
			else
			{
				this._stateObject = {
					query : query1
				};
				this.events.triggerEvent("stateObjectChanged");

				var m = query1.match(/^(node|way|relation|trace)\s*#?\s*(\d+)$/i);
				if(m)
				{
					switch(m[1].toLowerCase())
					{
						case "node": query1 = "http://www.openstreetmap.org/api/0.6/node/"+m[2]; break;
						case "way": query1 = "http://www.openstreetmap.org/api/0.6/way/"+m[2]+"/full"; break;
						case "relation": query1 = "http://www.openstreetmap.org/api/0.6/relation/"+m[2]+"/full"; break;
						case "trace": query1 = "http://www.openstreetmap.org/trace/"+m[2]+"/data"; break;
					}
				}

				if(query1.match(/^(http|https|ftp):\/\//) && !this.nameFinder.isLonLatQuery(query1))
					this.showGPX(query1, zoom);
				else
				{
					var poi = this.getPOISearchTerm(query1);
					if(poi.poi != null)
						this.showPOISearchResults(poi.poi, poi.place, zoom);
					else
						this.showSearchResults(poi.place, zoom);
				}
			}
		}
	},

	clear : function() {
		$(".results,.route-info", this.div).remove();

		this._layerMarkers.clearMarkers();
		this._layerXML.setUrl();
		this._layerRouting.setRoute(null);

		this._stateObject = { };
		this.events.triggerEvent("stateObjectChanged");
	},

	showPOISearchResults : function(poi, place, zoom) {
		var t = this;

		this.nameFinder.findNear(poi, place, function(results) {
			t._layerMarkers.showResults(results);

			t._makeResultList(null, results, ol.i18n("Found the following places:"), function(result) {
				t.map.setCenter(fm.Util.toMapProjection(result.lonlat, t.map), result.getZoom(t.map));
				$.each(results, function(i, it) { it.marker.fmFeature.popup.hide(); });
				result.marker.fmFeature.popup.show();
			}).appendTo(t.div);

			if(zoom && results.length > 0)
				t.map.zoomToExtent(t._layerMarkers.getDataExtent());
		});
	},

	showSearchResults : function(query, zoom) {
		var t = this;
		var handleResults = function(results) {
			var showResult = function(result, doNotZoom, doNotSetValue) {
				t._layerMarkers.showResults([ result ]);

				if(!doNotZoom)
					t.map.setCenter(fm.Util.toMapProjection(result.lonlat, t.map), result.getZoom(t.map));

				if(!doNotSetValue)
				{
					$(".from", t.div).val(t._stateObject.query = result.name);
					t.events.triggerEvent("stateObjectChanged");
				}
			};

			t._makeResultList(null, results, ol.i18n("Did you mean?"), showResult).appendTo(t.div);

			if(results.length > 0)
				showResult(results[0], !zoom, true);
		};

		this.nameFinder.find(query, handleResults);
	},

	showGPX : function(url, zoom) {
		var t = this;

		t._layerXML._fmZoom = zoom;
		t._layerXML.setUrl(url);
	},

	showRoute : function(query1, query2, type, medium, via, zoom) {
		var t = this;

		t.nameFinder.findMultiple([ query1, query2 ], function(results) {
			t._layerRouting._fmZoom = zoom;
			var options = { type : type, medium : medium, via : via };

			if(results[query1].length > 0 && results[query2].length > 0)
			{
				options.from = results[query1][0].lonlat;
				options.to = results[query2][0].lonlat;
				t._layerRouting.setRoute(options);
			}
			if(results[query1].length == 0 || results[query2].length > 0)
			{
				t._makeResultList(query1, results[query1], ol.i18n("Did you mean?"), function(result) {
					options.from = result.lonlat;
					t._layerRouting._fmZoom = true;
					t._layerRouting.setRoute(options);
					$(".from", t.div).val(t._stateObject.from = result.name);
					t.events.triggerEvent("stateObjectChanged");
				}).appendTo(t.div);
			}
			if(results[query2].length == 0 || results[query1].length > 0)
			{
				t._makeResultList(query2, results[query2], ol.i18n("Did you mean?"), function(result) {
					options.to = result.lonlat;
					t._layerRouting._fmZoom = true;
					t._layerRouting.setRoute(options);
					$(".to", t.div).val(t._stateObject.to = result.name);
					t.events.triggerEvent("stateObjectChanged");
				}).appendTo(t.div);
			}
		});
	},

	_makeResultList : function(query, results, heading, onclick) {
		var div = $('<div class="results"></div>');
		if(!results || results.length == 0)
		{
			var error = $('<p class="error"></p>').appendTo(div);
			if(query)
				error.text(ol.i18n("No results found for %s.").replace(/%s/, query));
			else
				error.text(ol.i18n("No results found."));
		}
		else if(results.length > 1)
		{
			$('<h2></h2>').text(heading).appendTo(div);
			var list = $("<ul></ul>").appendTo(div);
			$.each(results, function(i, it) {
				var li = $("<li></li>").appendTo(list);
				$('<a href="#"></a>').text(it.name).click(function() {
					onclick(it);
					return false;
				}).appendTo(li);
				li.append(" ("+fm.Util.htmlspecialchars(it.info || ol.i18n("unknown"))+")");
			});
		}
		return div;
	},

	getStateObject : function() {
		return this._stateObject;
	},

	setStateObject : function(obj) {
		this.clear();

		$(".from", this.div).val(obj.from || obj.query || "");
		$(".to", this.div).val(obj.to || "");
		$(".medium", this.div).val(obj.medium || null);
		$(".type", this.div).val(obj.type || null);

		if(!!obj.from != $(this.div).hasClass("routing"))
			$(".directions", this.div).click();

		var via = null;
		if(obj.via)
		{
			via = $.map(obj.via, function(it) {
				var m;
				if(m = it.match(/^(\d+(\.\d+)?)\s*,\s*(\d+(\.\d+)?)$/))
					return new OpenLayers.LonLat(1*m[3], 1*m[1]);
				else
					return null;
			});
		}

		this.submit(false, via);
	},

	CLASS_NAME : "FacilMap.Control.Search"
});

})(FacilMap, OpenLayers, FacilMap.$);