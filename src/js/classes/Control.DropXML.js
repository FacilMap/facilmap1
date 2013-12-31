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
 * Enables the dropping of GPX or other XML files on the map. Will display them, loading them
 * directly from the user's hard drive, using the HTML5 FileReader API.
 */
FacilMap.Control.DropXML = ol.Class(ol.Control, {
	autoActivate : true,

	initialize : function() {
		this.onDragOver = ol.Function.bind(this.onDragOver, this);
		this.onDragEnd = ol.Function.bind(this.onDragEnd, this);
		this.onDrop = ol.Function.bind(this.onDrop, this);

		ol.Control.prototype.initialize.apply(this, arguments);
	},

	activate : function() {
		if(!ol.Control.prototype.activate.apply(this, arguments))
			return false;

		if(!window.FileReader || !this.map || !this.map.div)
			return false;

		$(this.map.div).on({
			drop: this.onDrop,
			dragover: this.onDragOver,
			dragend: this.onDragEnd
		});
		return true;
	},

	deactivate : function() {
		if(!ol.Control.prototype.deactivate.apply(this, arguments))
			return false;

		$(this.map.div).off({
			drop: this.onDrop,
			dragover: this.onDragOver,
			dragend: this.onDragEnd
		});
		return true;
	},

	onDragOver : function(e) {
		e.preventDefault();
	},

	onDragEnd : function(e) {
		e.preventDefault();
	},

	onDrop : function(e) {
		e.preventDefault();

		var files = e && e.originalEvent && e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files;

		if(!files)
			return;

		var extent = null;
		var i = 0;
		var readnext = ol.Function.bind(function() {
			var reader = new FileReader();
			reader.onload = ol.Function.bind(function(e) {
				var layer = this.showXml(files[i].name, e.target.result);

				var e = layer && layer.getDataExtent();
				if(e) {
					if(extent)
						extent.extend(e);
					else
						extent = e;
				}

				if(++i < files.length)
					readnext();
				else if(extent)
					this.map.zoomToExtent(extent);
			}, this);
			reader.readAsText(files[i]);
		}, this);
		readnext();
	},

	showXml : function(name, xml) {
		xml = new ol.Format.XML().read(xml);
		if(xml)
			xml = xml.documentElement;

		var layer = new fm.Layer.XML(name, null, { removableInLayerSwitcher: true });
		this.map.addLayer(layer);
		layer._loadXml(xml);
		return layer;
	},

	CLASS_NAME : "FacilMap.Control.DropXML"
});

})(FacilMap, OpenLayers, FacilMap.$);