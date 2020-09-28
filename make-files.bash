# USE THIS SCRIPT BEFORE COMMITING

# prepare minified script file with `terser`.
# (Install `terser` with: `npm install terser -g` )
# (See: `https://github.com/terser/terser` )

terser js/*.js > terser/minified.js

{ echo -n 'dataIndex = ' ; cat assets/mki3d/index.json; } > dataIndex.js # used to compute number of stages in index.html

# prepare files to be cached by service-worker
./make-files-tocache.bash
