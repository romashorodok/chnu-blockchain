
.PHONY: build
build:
	solc --bin --abi --optimize --overwrite -o build SimpleStorage.sol

