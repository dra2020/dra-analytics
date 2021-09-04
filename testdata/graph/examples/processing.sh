# To apply mods to a graph (from dra-cli):

./cli.js modcontiguity -f <json file> <csv file> > <new json file>
./cli.js modcontiguity -f contiguity_unmodified.json contiguity_mods.csv > contiguity.json
./cli.js modcontiguity -f block_contiguity_unmodified.json block_contiguity_mods.csv > block_contiguity.json

# To deploy graphs (from dra-cli):

./deploy.js -d -f ../dra-data/data/AK/2010_VD/contiguity.json ../dra-data/data/AK/2010_VD/block_contiguity.json

./newdata.js -d -p county splits -b -s AK


# To test a map at the CLI (from here):

utils/main.js connected -g testdata/examples/AK/block_contiguity.json -p testdata/examples/AK/02_AK_SLDL_2018.csv -v
utils/main.js embedded -g testdata/examples/AK/block_contiguity.json -p testdata/examples/AK/02_AK_SLDL_2018.csv -v
