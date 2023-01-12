const { MarginBank__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange_arbitrum");
const { ethers } = require("@firefly-exchange/library");

const environment = require("./environments.json");

require('dotenv').config();
envName = process.env.env;
env = environment[envName]

console.log("Env:", envName);

const providerURL = env["URL"];
const provider = new ethers.providers.JsonRpcProvider(providerURL);

async function main(address){

    const contract = MarginBank__factory.connect(env["BTC-PERP"].MarginBank,provider );

    const balance = +await contract.getAccountBankBalance(address);

    console.log("Balance: ", balance, balance/1e18);

}


if(require.main === module){
    if(process.argv.length != 3){
      console.error(`Provide account address to get bank balance of
      \ne.g. "yarn bankBal <address>"
      \ne.g  "yarn bankBal 0x183c4535c33bA7e17B0B18Ef759811065b8D8a0a
      `);
      process.exit(1);  
    };
    main(process.argv[2]);
}