#!/bin/bash
cd "$(dirname "$0")"

list_js_files() {
	find "src/js/openlayers" -type f -name "*.js" | sort_js_files
	find "src/js/jquery" -type f -name "*.js" | sort_js_files
	echo "src/js/base.js"
	echo "src/js/classes/Util.js"
	find "src/js/olfix" -type f -name "*.js" | sort_js_files
	find "src/js/i18n" -type f -name "*.js" | sort_js_files
	find "src/js/classes" -type f -name "*.js" | grep -vx src/js/classes/Util.js | sort_js_files
}

sort_js_files() {
	sed -e 's/\.js$//' | sort | sed -e 's/$/.js/'
}

js_files="$(list_js_files)"

rev="$(date -u "+%FT%TZ")"
out_dir="builds/$rev"
mkdir -p "$out_dir"
rm -f builds/latest
ln -s "$rev" builds/latest

echo "$js_files" | while read fname; do
	content="////////// $fname ///////////

$(cat "$fname")


"
	echo "$content" >> "$out_dir/facilmap_ol_src.js"
	if ! echo "$fname" | grep -qF openlayers; then
		echo "$content" >> "$out_dir/facilmap_src.js"
	fi
done

find src/css -name "*.css" | while read fname; do
	content="/********* $fname **********/

$(cat "$fname")


"
	echo "$content" >> "$out_dir/facilmap_ol_src.css"
	if ! echo "$fname" | grep -qF openlayers; then
		echo "$content" >> "$out_dir/facilmap_src.css"
	fi
done

rsync -a src/resources/ "$out_dir/"

if [ -f yuicompressor-*.jar ]; then
	java -jar yuicompressor-*.jar "$out_dir/facilmap_src.js" > "$out_dir/facilmap.js"
	java -jar yuicompressor-*.jar "$out_dir/facilmap_ol_src.js" > "$out_dir/facilmap_ol.js"
	java -jar yuicompressor-*.jar "$out_dir/facilmap_src.css" > "$out_dir/facilmap.css"
	java -jar yuicompressor-*.jar "$out_dir/facilmap_ol_src.css" > "$out_dir/facilmap_ol.css"
fi
