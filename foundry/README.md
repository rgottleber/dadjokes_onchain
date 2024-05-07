## Foundry

Deployed at [0x97F38014F2C4A71dA80E4ba10cA8241443270D7C](https://sepolia.etherscan.io/address/0x97F38014F2C4A71dA80E4ba10cA8241443270D7C#code) on sepolia

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/DadJokes.s.sol --rpc-url https://rpc.sepolia.org --broadcast --account <YOUR_KEY_ACCOUNT> --sender <YOUR_ADDRESS> --verify --etherscan-api-key <YOUR_ETHERSCAN_API_KEY> -vvvv
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
