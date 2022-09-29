const { Perpetual__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr, Trader } = require("@firefly-exchange/library");
const { FireflyClient, Networks } = require("@firefly-exchange/firefly-client");
const environment = require("./environments.json");

require('dotenv').config();
env = environment[process.env.env]
market = process.env.market;

console.log("Env:", process.env.env);
console.log("Market:", market);


const providerURL = env["URL"];
const liquidationContractAddress = env[market]["Liquidation"]
const perpetualContractAddress = env[market]["Perpetual"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);

const network = env == "TESTNET" ? Networks.TESTNET : Networks.DEV

async function main(liquidatePvtKey, liquidatorPvtKey, leverage, quantity){

    const client = new FireflyClient(true, network, liquidatePvtKey);
    client.init()

    const liquidatorWallet = new ethers.Wallet(liquidatorPvtKey, provider);
    const contract = Perpetual__factory.connect(perpetualContractAddress, liquidatorWallet);

    const position = await client.getUserPosition({symbol:pairName});
    
    if(!position.ok){
        console.error(`Could not find user ${client.getPublicAddress()} position info on DAPI`);
        process.exit(1);
    }

    const params = await Trader.setupLiquidationTrade(
        {
            // complete order quantity
            quantity: toBigNumberStr(quantity),
            // is buy should always be same as maker order is buy.
            isBuy: position.data.side == "BUY",
            // isBuy: true,
            // use default leverage as one
            leverage: toBigNumberStr(leverage),
            allOrNothing: false
        },
        liquidatorWallet.address,
        await client.getPublicAddress(),
        liquidationContractAddress
    );

    await  ( await contract
            .connect(liquidatorWallet)
            .trade(
                params.accounts, 
                [params.data]
                )
            ).wait()
}


if(require.main === module){
    if(process.argv.length != 6){
      console.error(`Provide account address to be liquidated, liquidator's private key, leverage and quantity
      \ne.g. "yarn liquidate <liquidate pvt key> <liquidator pvt key> <leverage> <quantity>"
      \ne.g  "yarn liquidate key1 key2 4 10
      `);
      process.exit(1);  
    };
    main(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
}