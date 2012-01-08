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
 * Necessary improvement to the translate function: Fall back to default language if translated string is not
 * available (see http://trac.openlayers.org/ticket/2308).
*/

OpenLayers.i18n = OpenLayers.Lang.translate = function(key, context) {
	var message = ol.Lang[ol.Lang.getCode()][key];
	if(!message)
	{
		if(ol.Lang[ol.Lang.defaultCode][key])
			message = ol.Lang[ol.Lang.defaultCode][key];
		else
			message = key;
	}
	if(context)
		message = ol.String.format(message, context);
	return message;
};

})(FacilMap, OpenLayers, FacilMap.$);