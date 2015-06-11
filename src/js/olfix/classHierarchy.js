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

// Save parent classes in class objects, needed for FacilMap.Util.makeClassName()

// Because of the way OpenLayers.Class works, we cannot use Object.constructor to
// get the class hierarchy, as it is always pointing to Object (because the prototype
// property is not extended but overridden with an Object, so it overrides the constructor
// property). The alternative would be to use __proto__ or Object.getPrototypeOf(),
// but those are not supported in old browsers)

fm.olBackup.Class = ol.Class;
ol.Class = function() {
	var ret = fm.olBackup.Class.apply(this, arguments);
	ret.prototype.fmParentClasses = [ ];
	for(var i=0; i<arguments.length; i++)
		ret.prototype.fmParentClasses.push(arguments[i]);
	return ret;
};
ol.Class.isPrototype = fm.olBackup.Class.isPrototype;

})(FacilMap, OpenLayers, FacilMap.$);