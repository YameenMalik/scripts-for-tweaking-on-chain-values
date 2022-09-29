const { Perpetual__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr, Trader } = require("@firefly-exchange/library");
const environment = require("./environments.json");

require('dotenv').config();
envName = process.env.env;
env = environment[envName]
market = process.env.market;

console.log("Env:", envName);
console.log("Market:", market);


const providerURL = env["URL"];
const liquidationContractAddress = env[market]["Liquidation"]
const perpetualContractAddress = env[market]["Perpetual"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);

async function main(liquidatorAddress, liquidatorPvtKey, leverage, quantity, positionSide){

    const liquidatorWallet = new ethers.Wallet(liquidatorPvtKey, provider);
    const contract = Perpetual__factory.connect(perpetualContractAddress, liquidatorWallet);

    const params = await Trader.setupLiquidationTrade(
        {
            // complete order quantity
            quantity: toBigNumberStr(quantity),
            // is buy should always be same as maker order is buy.
            isBuy: positionSide == "long",
            // use default leverage as one
            leverage: toBigNumberStr(leverage),
            allOrNothing: false
        },
        liquidatorWallet.address,
        liquidatorAddress,
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
    if(process.argv.length != 7){
      console.error(`Provide account address to be liquidated, liquidator's private key, leverage and quantity
      \ne.g. "yarn liquidate <liquidate address> <liquidator pvt key> <leverage> <quantity> <position side>"
      \ne.g  "yarn liquidate address key2 4 10 long
      `);
      process.exit(1);  
    };
    main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
}