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

(function(fm, ol, $, undefined){

FacilMap.Control.Search = ol.Class(ol.Control, {
	name : ol.i18n("Search"), // For attribution popup

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
		this.attribution = this.nameFinder.attribution;

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
			// Disable map dragging inside search bar for proper mouse click handling
			var navigationControl = this.map.getControlsByClass("OpenLayers.Control.Navigation")[0];
			if(navigationControl)
			{
				var over = false;
				$(ret).mouseover(function(){
					navigationControl.deactivate();
					t._layerRouting._dragFeature.deactivate();
					t._layerRouting._featureHandler.deactivate();
				}).mouseout(function() {
					navigationControl.activate();
					t._layerRouting._dragFeature.activate();
					t._layerRouting._featureHandler.activate();
				});
			}

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

			t._layerRouting = new fm.Layer.XML.Routing(ol.i18n("Routing"), { displayInLayerSwitcher : false });
			t.map.addLayer(t._layerRouting);
			t._layerRouting.events.register("draggedRoute", this, function(e) {
				if(e.draggedPoint == "from")
					$(".from", t.div).val(t._stateObject.query[0] = fm.Util.round(e.newRouteOptions.from.lat, 5)+","+fm.Util.round(e.newRouteOptions.from.lon, 5));
				else if(e.draggedPoint == "to")
					$(".destinations input", t.div).last().val(t._stateObject.query[t._stateObject.query.length-1] = fm.Util.round(e.newRouteOptions.to.lat, 5)+","+fm.Util.round(e.newRouteOptions.to.lon, 5));
				else {
					var m = e.draggedPoint.match(/^via([0-9]+)$/);
					if(m) {
						var i = 1*m[1];
						if(e.newRouteOptions.via.length < this._stateObject.query.length-2) {
							// Point has been removed
							$(".destinations input", this.div).eq(i).remove();
							this._stateObject.query = this._stateObject.query.slice(0, i+1).concat(this._stateObject.query.slice(i+2));
							this._changeNumberOfDestinationFields(+0, true);
						} else {
							if(e.newRouteOptions.via.length > this._stateObject.query.length-2) {
								// Point has been added
								$(".destinations input", this.div).eq(i).before('<input type="text"/>');
								this._stateObject.query = this._stateObject.query.slice(0, i+1).concat([ null ], this._stateObject.query.slice(i+1));
								this._changeNumberOfDestinationFields(+0, true);
							}

							$(".destinations input", this.div).eq(i).val(t._stateObject.query[i+1] = fm.Util.round(e.newRouteOptions.via[i].lat, 5)+","+fm.Util.round(e.newRouteOptions.via[i].lon, 5));
						}
					}
				}

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
					'<span class="destinations"><input type="text"/></span>' +
					'<a href="javascript:" class="add-destination">'+ol.i18n("Add destination")+'</a>' +
					'<a href="javascript:" class="directions"></a>' +
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
						'<option value="'+FacilMap.Routing.Medium.BIRD+'">'+ol.i18n("Bird")+'</option>' +
					'</select>' +
				'</form>'
			).appendTo(ret);

			/////////////////
			// Event handlers

			var routingVisible = true;
			$(".directions", ret).click($.proxy(function(){
				routingVisible = !routingVisible;
				$(".from", ret).attr("placeholder", routingVisible ? ol.i18n("From") : "");
				$(".directions", ret).html(ol.i18n(routingVisible ? "Hide directions" : "Get directions"));
				$(".destinations,.type,.medium,.add-destination", ret).css("display", routingVisible ? "" : "none");
				$(".submit", ret).val(ol.i18n(routingVisible ? "Get directions" : "Search"));
				$(ret)[routingVisible ? "addClass" : "removeClass"]("routing");
				$(".help", ret).css("display", routingVisible ? "none" : "");

				this._changeNumberOfDestinationFields(+0, true); // To update tabindex

				return false;
			}, this)).click();

			$(".add-destination", ret).click($.proxy(function() {
				this._changeNumberOfDestinationFields(+1, true);
			}, this));

			this._changeNumberOfDestinationFields(1);

			$(".help", ret).click(function(){ fm.Util.popup(ol.i18n("searchHelpText"), ol.i18n("Search help")); });

			$("form", ret).submit(function(){ t.submit(true); return false; });
			$(".clear", ret).click(function() { $(".from,.destinations input", ret).val("");t._changeNumberOfDestinationFields(1); t.submit(true); });
		}

		return ret;
	},

	_changeNumberOfDestinationFields : function(number, relative) {
		var t = this;

		var fields = $(".destinations input", this.div);
		var diff = relative ? number : number-fields.size();
		if(diff < 0)
			fields.slice(diff).remove();
		else {
			var add = [ ];
			for(var i=0; i<diff; i++)
				add.push($('<input type="text"/>'));
			$(".destinations", this.div).append(add);
		}

		fields = $(".destinations input", this.div);
		fields.attr("placeholder", ol.i18n("Via")).last().attr("placeholder", ol.i18n("To"));
		$(".destinations a", this.div).remove();
		if(fields.size() > 1)
			$('<a href="javascript:">×</a>').click(function(){ $(this).prev().add(this).remove(); t._changeNumberOfDestinationFields(+0, true); }).insertAfter(fields);

		$("input:visible,select:visible", this.div).each(function(i) {
			$(this).attr("tabindex", t.tabindex+i);
		});

		$(".from,.destinations input:not(.fmAutoSuggest)", this.div).each(function() {
			new FacilMap.AutoSuggest(this, t.makeSuggestions);
		});
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
	 */
	submit : function(zoom) {
		if(!$(this.div).hasClass("routing"))
			this.search($(".from", this.div).val(), null, null, zoom);
		else {
			var points = [ $(".from", this.div).val() ];
			$(".destinations input", this.div).each(function() {
				points.push($(this).val());
			});
			this.search(points, $(".type", this.div).val(), $(".medium", this.div).val(), zoom);
		}
	},

	/**
	 * Decides what kind of search to start (GPX file, routing, POI search, ...) depending on the
	 * contents of the search fields
	 * @param queries {String|Array} Either one string for a search or multiple search terms to form a route
	 * @param type {FacilMap.Routing.Type}
	 * @param medium {FacilMap.Routing.Medium}
	 * @param zoom {Boolean} Zoom to results?
	 */
	search : function(queries, type, medium, zoom) {
		this.clear();

		if(queries == null)
			queries = [ ];
		else if(!$.isArray(queries))
			queries = [ queries ];

		for(var i=0; i<queries.length; i++)
			queries[i] = (queries[i] || "").replace(/^\s+/, "").replace(/\s+$/, "");

		if(queries.length >= 2) {
			this._stateObject = {
				query : queries,
				type : type,
				medium : medium
			};
			this.events.triggerEvent("stateObjectChanged");
			this.showRoute(queries, type, medium, zoom);
		} else if(queries.length == 1) {
			this._stateObject = {
				query : queries[0]
			};
			this.events.triggerEvent("stateObjectChanged");

			var m = queries[0].match(/^(node|way|relation|trace)\s*#?\s*(\d+)$/i);
			if(m)
			{
				switch(m[1].toLowerCase())
				{
					case "node": queries[0] = "https://www.openstreetmap.org/api/0.6/node/"+m[2]; break;
					case "way": queries[0] = "https://www.openstreetmap.org/api/0.6/way/"+m[2]+"/full"; break;
					case "relation": queries[0] = "https://www.openstreetmap.org/api/0.6/relation/"+m[2]+"/full"; break;
					case "trace": queries[0] = "https://www.openstreetmap.org/trace/"+m[2]+"/data.xml"; break;
				}
			}

			if(queries[0].match(/^(http|https|ftp):\/\//) && !this.nameFinder.isLonLatQuery(queries[0]))
				this.showGPX(queries[0], zoom);
			else
			{
				var poi = this.getPOISearchTerm(queries[0]);
				if(poi.poi != null)
					this.showPOISearchResults(poi.poi, poi.place, zoom);
				else
					this.showSearchResults(poi.place, zoom);
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

	showRoute : function(queries, type, medium, zoom) {
		var t = this;

		t.nameFinder.findMultiple(queries, function(results) {
			t._layerRouting._fmZoom = zoom;
			var options = { type : type, medium : medium };

			var errors = [ ];
			var points = [ ];
			$.each(queries, function(i,it) {
				if(results[it].length == 0)
					errors.push($('<p class="error"/>').text(ol.i18n("No results found for %s.").replace(/%s/, it)));
				else
					points.push(results[it][0].lonlat);
			});

			if(errors.length > 0) {
				$('<div class="results"/>').append(errors).appendTo(this.div);
				return;
			}

			options.from = points.shift();
			options.to = points.pop();
			options.via = points;

			t._layerRouting.setRoute(options);
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
		return $.extend(true, { }, this._stateObject);
	},

	setStateObject : function(obj) {
		this.clear();

		var query = [ ];
		if(obj.query && typeof obj.query == "object") {
			for(var i=0; obj.query[i] !== undefined; i++)
				query.push(obj.query[i]);
		}
		else { // from, to and via are for backwards compatibility
			query = [ obj.from || obj.query || "" ].concat(obj.via || [ ]);
			if(obj.to)
				query.push(obj.to);
		}

		this._changeNumberOfDestinationFields(Math.max(1, query.length-1));

		$(".from", this.div).add($(".destinations input", this.div)).each(function(i) {
			$(this).val(query[i] || "");
		});
		$(".medium", this.div).val(obj.medium || $(".medium option:first").val());
		$(".type", this.div).val(obj.type || $(".type option:first").val());

		if((query.length >= 2) != $(this.div).hasClass("routing"))
			$(".directions", this.div).click();

		this.submit(!!obj.zoom);
	},

	CLASS_NAME : "FacilMap.Control.Search"
});

})(FacilMap, OpenLayers, FacilMap.$);
