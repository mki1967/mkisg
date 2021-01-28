# USE THIS SCRIPT BEFORE COMMITING

# prepare minified script file with `terser`.
# (Install `terser` with: `npm install terser -g` )
# (See: `https://github.com/terser/terser` )

terser $(find ./js/ -name "*.js" | sort) > terser/minified.js


# prepare files to be cached by service-worker
./make-files-tocache.bash

{ echo -n 'dataIndex = ' ; cat assets/mki3d/index.json; } > dataIndex.js # used to compute number of stages in index.html
