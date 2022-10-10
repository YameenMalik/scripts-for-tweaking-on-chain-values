# scripts-for-tweaking-on-chain-values

Install packages using `yarn`

- Create a `.env` file by replicating `.env.example`

- For all the scripts, first set the `env` (TESTNET or DEV) and `market` (BTC-PERP/ETH-PERP (tBTC for DEV environment)) in `.env` file and then run scripts. 

- All scripts target the market provided in .env file on the environment specified.

- Oracle Price: Run `yarn setPrice <price>`

- Funding Rate:     
    - To update funding rate using off-chain operator run `yarn setFR <new funding race>`
    - To move funding rate to off-chain `yarn moveFR` // already done, no need to do it

- Liquidation: `yarn liquidate <account to be liquidated public address> <liquidator pvt key> <leverage> <quantity>` e.g. `yarn liquidate addrr pvtKey 4 10`

- Tarding
    - To enable/disable trading using operator run `yarn setTrading <on/off> e.g. yarn setTrading on`

- Margin Bank Withdrawal
    - To enable/disable margin bank withdrawal using operator run `yarn setBankWithdraw <on/off> e.g. yarn setBankWithdraw on`
    
- Final Settlement
    - To delist perpetual using priceOracleLowerBound and priceOracleUpperBound run `yarn delistPerpetual <priceOracleLowerBound> <priceOracleUpperBound> e.g. yarn delistPerpetual 400 600`
    - To close positon after delisting run `yarn closePosition <owner pvt Key> e.g. yarn closePosition pvtKey`
    
