## Start Geth Node
Install or build from https://github.com/ethereum/go-ethereum

```sh
geth --datadir ./data --dev --dev.period 12 --http --http.port 8545 --http.api eth,web3,net --http.corsdomain "http://localhost:5173" 
```

## Connect to the node
```sh
geth attach http://localhost:8545
```
