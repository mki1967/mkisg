{
echo '{';
echo -n '"tokens":' ;
./ls-json.bash tokens ;
echo ',' 
echo -n '"stages":' ;
./ls-json.bash stages ;
echo '}'
} > index.json
