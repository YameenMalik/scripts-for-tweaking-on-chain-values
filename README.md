# scripts-for-tweaking-on-chain-values

Install packages using `yarn`

For all the scripts, first set the `env` (TESTNET or DEV) and `market` (BTC-PERP/ETH-PERP) in `.env` file and then run scripts. All scripts target the market provided in .env file on the environment specified.

- Oracle Price: Run `yarn setPrice <price>`

- Funding Rate:     
    - To update funding rate using off-chain operator run `yarn setFR <new funding race>`
    - To move funding rate to off-chain `yarn moveFR` // already done, no need to do it

- Liquidation: `yarn liquidate <account to be liquidated pvt key> <liquidator pvt key> <leverage> <quantity>` e.g. `yarn liquidate key1 key2 4 10`
