# scripts-for-tweaking-on-chain-values

Install packages using `yarn`

- Create a `.env` file by replicating `.env.example`

- For all the scripts, first set the `env` (TESTNET or DEV) and `market` (BTC-PERP/ETH-PERP (tBTC for DEV environment)) in `.env` file and then run scripts. 

- All scripts target the market provided in .env file on the environment specified.

- Oracle Price: Run `yarn setPrice <price>`

- Funding Rate:     
    - To update funding rate using off-chain operator run `yarn setFR <new funding race>`
    - To move funding rate to off-chain `yarn moveFR` // already done, no need to do it

- Liquidation: `yarn liquidate <account to be liquidated pvt key> <liquidator pvt key> <leverage> <quantity>` e.g. `yarn liquidate key1 key2 4 10`

- Tarding
    - To enable/disable trading using operator run `yarn setTrading <on/off> e.g. yarn setTrading on`

- Margin Bank Withdrawal
    - To enable/disable margin bank withdrawal using operator run `yarn setBankWithdraw <on/off> e.g. yarn setBankWithdraw on`
    
- Final Settlement
    - To enable final settlement using priceOracleLowerBound and priceOracleUpperBound run `yarn enableFS <priceOracleLowerBound> <priceOracleUpperBound> e.g. yarn enableFS 400 600`
    - To perform final settlement using owner's pvt key run `yarn performFinalSettlement <owner pvt Key> e.g. yarn performFinalSettlement pvtKey1`
    
