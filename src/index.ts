import { ethers } from 'ethers';

import fs from "fs";

const provider = new ethers.JsonRpcProvider("http://localhost:8545")

const contract = "build/SimpleStorage"
const abi = JSON.parse(fs.readFileSync(`${contract}.abi`, "utf8"));
const bytecode = "0x" + fs.readFileSync(`${contract}.bin`, "utf8");

async function main() {
  const signer = await provider.getSigner()

  const balance = await provider.getBalance(await signer.getAddress())
  console.log("balance", balance)

  console.log("abi", abi)
  console.log("bytecode", bytecode)

  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  const contract = await factory.deploy();
  console.log(`Contract deployed at address: ${await contract.getAddress()}`);
  const deployResult = await contract.waitForDeployment()
  console.log("Deploy result", deployResult)

  const data = await contract.getDeployedCode();
  console.log('Stored data:', data);
}
// main()

async function getContractsFromBlockRange(startBlock: number, endBlock: number) {
  for (let i = startBlock; i <= endBlock; i++) {
    const block = await provider.getBlock(i, true)
    if (block)
      block.transactions.forEach(async txHash => {
        const tx = await block.getTransaction(txHash)
        if (tx.to == null) {
          const receipt = await provider.getTransactionReceipt(tx.hash);
          if (receipt && receipt.contractAddress) {
            console.log(`New contract deployed at address:`, receipt.contractAddress);
          }
        }
      })
  }
}

getContractsFromBlockRange(0, 100000);

// Events in Solidity are a type of logging mechanism that allows contracts to log certain data to the blockchain.
// These events are indexed and can be used by off-chain applications to listen for changes in the blockchain state.
// The indexed data is hashed and included in a Bloom Filter, which is a data structure that allows for efficient filtering.
//
// Events hased with SHA-3 (keccak)
// https://docs.soliditylang.org/en/v0.8.4/abi-spec.html#events
//
// By this, approach third party off-chain client can query the on-chain
