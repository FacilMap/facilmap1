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
 * Like OpenLayers.Control.Attribution. Instead of writing hundreds of attributions on the map, shows a link that opens
 * a popup to show the attributions.
*/

FacilMap.Control.Attribution = ol.Class(ol.Control, {
	draw : function() {
		var div = ol.Control.prototype.draw.apply(this, arguments);
		var l = this;

		var link = $("<a href=\"#\"></a>").text(ol.i18n("License"));
		link.click(function() {
			var attr = $("<ul></ul>");
			$.each(l.getAttributions(), function(i, it){
				attr.append("<li>"+it+"</li>");
			});
			fm.Util.popup(attr[0], ol.i18n("License"));
			return false;
		});

		$(div).append(link);

		return div;
	},

	getAttributions : function() {
		var ret = [ ];

		$.each([ ].concat(this.map.layers).concat(this.map.controls), function(i, it) {
			if(it.attribution)
				ret.push((it.name ? it.name+": " : "")+it.attribution);
		});
		
		return ret;
	},

	CLASS_NAME : "FacilMap.Control.Attribution"
});

})(FacilMap, OpenLayers, FacilMap.$);