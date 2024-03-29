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

// Workaround for http://trac.openlayers.org/ticket/2607

if(fm.olBackup.Control == undefined)
	fm.olBackup.Control = { };

fm.olBackup.Control.activate = ol.Control.prototype.activate;
fm.olBackup.Control.deactivate = ol.Control.prototype.deactivate;

ol.Control.prototype.activate = function() {
	var ret = fm.olBackup.Control.activate.apply(this, arguments);
	if(this.map)
	{
		var classNames = this.displayClass.split(/\s+/);
		for(var i=0; i<classNames.length; i++)
		{
			ol.Element.addClass(
				this.map.viewPortDiv,
				classNames[i] + "Active"
			);
		}
	}
	return ret;
};

ol.Control.prototype.deactivate = function() {
	var ret = fm.olBackup.Control.deactivate.apply(this, arguments);
	if(this.map)
	{
		var classNames = this.displayClass.split(/\s+/);
		for(var i=0; i<classNames.length; i++)
		{
			ol.Element.removeClass(
				this.map.viewPortDiv,
				classNames[i] + "Active"
			);
		}
	}
	return ret;
};

ol.Control.Panel.prototype.redraw = function() {
	this.div.innerHTML = "";
	if (this.active) {
		for (var i=0, len=this.controls.length; i<len; i++) {
			var element = this.controls[i].panel_div;
			if (this.controls[i].active) {
				element.className = this.controls[i].displayClass.replace(/(\s+|$)/g, "ItemActive$1");
			} else {
				element.className = this.controls[i].displayClass.replace(/(\s+|$)/g, "ItemInactive$1");
			}
			this.div.appendChild(element);
		}
	}
};

})(FacilMap, OpenLayers, FacilMap.$);