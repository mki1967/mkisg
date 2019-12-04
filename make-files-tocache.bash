# refresh mki3d/index.json
pushd assets/mki3d/
./make-json-index.bash
popd

# make files-to-cache.json
./list-files-to-cache.bash | ./to-json-array.bash  > files-to-cache.json

