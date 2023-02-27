# boa-space-subgraph
The BOASpace Subgraph getting NFT transfer information with the Graph Node. The source files are based on the repository [https://github.com/graphprotocol/example-subgraph](https://github.com/graphprotocol/example-subgraph)

# How to run
You should run a graph node locally to deploy this subgraph.
```shell
# make a copy of the repository
git clone https://github.com/bosagora/boa-space-subgraph.git
cd boa-space-subgraph

# package install
yarn install

# compile contracts
yarn build-contract

# build subgraph
yarn codegen
yarn build

# deploy subgraph
yarn create-local
yarn deploy-local
```