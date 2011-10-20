#!/bin/bash
cd "$(dirname "$0")"

list_js_files() {
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
	echo "document.write(\"<script type=\\\"text/javascript\\\" src=\\\"$fname\\\"></script>\");" >> "$out_dir/facilmap_debug.js"
	(
		echo "////////// $fname ///////////"
		cat "$fname"
		echo
		echo
	) >> "$out_dir/facilmap_src.js"
done

find src/css -name "*.css" | while read fname; do
	(
		echo "/********* $fname **********/"
		cat "$fname"
		echo
		echo
	) >> "$out_dir/facilmap_src.css"
done

rsync -a src/resources/ "$out_dir/"

if [ -f yuicompressor-*.jar ]; then
	java -jar yuicompressor-*.jar "$out_dir/facilmap_src.js" > "$out_dir/facilmap.js"
	java -jar yuicompressor-*.jar "$out_dir/facilmap_src.css" > "$out_dir/facilmap.css"
else
	ln -s facilmap_src.js "$out_dir/facilmap.js"
	ln -s facilmap_src.css "$out_dir/facilmap.css"
fi
