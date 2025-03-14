
.PHONY: build
build:
	solc --bin --abi --optimize --overwrite -o build Voting.sol

