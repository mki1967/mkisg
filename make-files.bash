# USE THIS SCRIPT BEFORE COMMITING

# prepare minified script file with `terser`.
# (Install `terser` with: `npm install terser -g` )
# (See: `https://github.com/terser/terser` )

terser js/*.js > terser/minified.js

# prepare files to be cached by service-worker
./make-files-tocache.bash
