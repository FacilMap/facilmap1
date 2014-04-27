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
 * Adds a Tools menu button to the map where you can add different controls.
*/

FacilMap.Control.ToolsMenu = ol.Class(fm.Control, {
	caption : ol.i18n("Tools"),
	_content : null,
	_contentClone : null,
	_layerChangeHandlers : null,

	initialize : function() {
		fm.Control.prototype.initialize.apply(this, arguments);

		this._content = $("<ul></ul>");
		this._layerChangeHandlers = [ ];
	},

	setMap : function(map) {
		var ret = fm.Control.prototype.setMap.apply(this, arguments);

		var func = $.proxy(function() {
			$.each(this._layerChangeHandlers, $.proxy(function(i,it){ it.apply(this, arguments); }, this));
		}, this);

		this.map.events.on({
            "addlayer": func,
            "changelayer": func,
            "removelayer": func,
            "changebaselayer": func,
            scope: this
        });

		func();

		return ret;
	},

	draw : function() {
		var ret = fm.Control.prototype.draw.apply(this, arguments);

		var button = $("<button />").append(this.caption).appendTo(ret).button({
			icons : {
				primary : "ui-icon-wrench",
				secondary : "ui-icon-triangle-1-s"
			}
		});

		this._contentClone = this._content.clone().css({display: "inline-block"}).appendTo("body").position({
			my: "right top",
			at: "right bottom",
			of: button
		}).menu();
		this._contentClone.bind("menuselect", function(event, ui) {
			var onclick = $(ui.item).data("fmOnClick");
			if(onclick) {
				onclick.apply(this, arguments);
				hide();
			}
		});
		
		var show = $.proxy(function() {
			this._contentClone.show().position({
				my: "right top",
				at: "right bottom",
				of: button
			});
			setTimeout($.proxy(function() {
				this.map.events.register("click", null, hide);
			}, this), 0);
		}, this);
		
		var hide = $.proxy(function() {
			this.map.events.unregister("click", null, hide);
			this._contentClone.hide();
			button.one("click", show);
		}, this);
		
		hide();

		return ret;
	},

	redraw : function() {
		if(this._redrawTimeout == undefined)
			this._redrawTimeout = setTimeout($.proxy(this._redraw, this), 0);
	},

	_redraw : function() {
		this._contentClone.empty().append(this._content.contents().clone(true, true));
		this._contentClone.menu("refresh");
		this._redrawTimeout = null;
	},

	/**
	 * Removes all items from the menu.
	 */
	empty : function() {
		this._content.empty();
		this.redraw();
	},

	_addItem : function(caption, onclick, after) {
		var t = this;

		var link = $("<a href=\"javascript:\"></a>").append(caption);
		var ret = $("<li></li>").append(link, after).appendTo(this._content);

		if(typeof onclick == "function")
			ret.data("fmOnClick", onclick);
		else if(typeof onclick == "string")
			link.attr("href", onclick);

		// Hack radio button checking. If a checked radio button is added and another checked radio
		// button with the same name has been added before, the new button is not checked, despite the
		// fact that they are not added to the document DOM tree.
		var radio = $("input[type=radio][checked]", ret)[0];
		if(radio)
			radio.checked = true;

		this.redraw();

		return ret;
	},

	/**
	 * Adds an entry to the menu.
	 * @param caption {String} The HTML caption of the menu item
	 * @param href {String|Function} The href of the item or an onclick function
	 */
	addItem : function(caption, href) {
		this._addItem(caption, href);
	},

	/**
	 * Adds a sub menu to the menu. Returns a new instance of this class where you can add further
	 * menu items.
	 * @param caption {String} The HTML text of the menu item
	 * @return {FacilMap.Control.ToolsMenu}
	 */
	addSubMenu : function(caption) {
		var list = $("<ul></ul>");
		this._addItem(caption, null, list);

		return $.extend({ }, this, {
			_content : list,
			redraw : $.proxy(this.redraw, this)
		});
	},

	/**
	 * Adds a menu item to the menu that enables the specified control.
	 * @param caption {String} The HTML text of the menu item
	 * @param control {OpenLayers.Control} The control
	 */
	addControl : function(caption, control) {
		this._addItem(caption);
	},

	/**
	 * Adds a layer switcher sub menu to the tools menu
	 * @param caption {String} The HTML text of the menu item
	 */
	addLayerSwitcher : function(caption) {
		var submenu = this.addSubMenu(caption);

		var refresh = $.proxy(function() {
			submenu.empty();

			var categories = { };
			$.each(this.map.layers, function(i,it) {
				if(it.category && !categories[it.category])
					categories[it.category] = submenu.addSubMenu(it.category);
			});
			$.each(this.map.layers, function(i,it) {
				if(it.isBaseLayer && it.displayInLayerSwitcher)
					(it.category ? categories[it.category] : submenu)._addItem("<input type=\"radio\" name=\"baselayer\""+(it.getVisibility() ? " checked=\"checked\"" : "")+" /> "+it.name, function(){ it.map.setBaseLayer(it); });
			});
			$.each(this.map.layers, function(i,it) {
				if(!it.isBaseLayer && it.displayInLayerSwitcher)
				{
					var menu = (it.category ? categories[it.category] : submenu);
					var item = "<input type=\"checkbox\""+(it.getVisibility() ? " checked=\"checked\"" : "")+(it.inRange ? "" : " disabled=\"disabled\"")+" /> "+it.name;
					var onclick = function(){ it.setVisibility(!it.getVisibility()); };
					if(it.zoomableInLayerSwitcher || it.removableInLayerSwitcher)
					{
						var sub = menu.addSubMenu(item, onclick);
						if(it.zoomableInLayerSwitcher)
							sub._addItem(ol.i18n("Zoom"), function(){ var extent = it.getDataExtent(); if(extent) it.map.zoomToExtent(extent); });
						if(it.removableInLayerSwitcher)
							sub._addItem(ol.i18n("Remove"), function(){ it.map.removeLayer(it); it.destroy(); });
					}
					else
						menu._addItem(item, onclick);
				}
			});
		}, this);

		this._layerChangeHandlers.push(refresh);

		if(this.map)
			refresh();
	},

	CLASS_NAME : "FacilMap.Control.ToolsMenu"
});

})(FacilMap, OpenLayers, FacilMap.$);