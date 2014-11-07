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
 * Displays alerts and help texts for the currently enabled controls on the map.
*/

FacilMap.Control.Alerts = ol.Class(ol.Control, {

	setMap : function(map) {
		ol.Control.prototype.setMap.apply(this, arguments);

		map.events.register("alert", this, function(messageObj) {
			this.showAlert(messageObj);
		});
	},

	/**
	 * @param messageObj {Object} Contains properties message (String), class (String: one of info, error, success, warning), closeable (Boolean),
	 *                            actions (Array of Objects with properties label (String), click (Function), url (String))
	 */
	showAlert : function(messageObj) {
		var message = $("<p/>").addClass(messageObj["class"] || "info").appendTo(this.div);
		message.text(messageObj.message);

		if(messageObj.actions) {
			$.each(messageObj.actions, function(i,it) {
				var link = $("<a/>").attr("href", it.url || "javascript:").text(it.label);
				if(it.click)
					link.click(it.click);
				message.append(" ").append(link);
			});
		}

		if(messageObj.closeable !== false) {
			$('<a href="javascript:" class="close-button">×</a>').click(function() {
				message.remove();
			}).appendTo(message);
		}

		messageObj.close = function() {
			message.remove();
		}
	},

	CLASS_NAME: "FacilMap.Control.Alerts"
});

})(FacilMap, OpenLayers, FacilMap.$);