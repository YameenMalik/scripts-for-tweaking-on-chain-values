const { Guardian__factory, Perpetual__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers,toBigNumberStr } = require("@firefly-exchange/library");

const environment = require("./environments.json");
require('dotenv').config();
env = environment[process.env.env]
market = process.env.market;

console.log("Env:", process.env.env);
console.log("Market:", market);


const providerURL = env["URL"];
const owner = env["DEPLOYER"]
const perpetualContractAddress = env[market]["Perpetual"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const ownerWallet = new ethers.Wallet(owner, provider);

async function main(priceLowerBound,priceUpperBound){
    console.log("Delisting Perpetual")
    const contract = Perpetual__factory.connect(perpetualContractAddress, ownerWallet);
    await ( await contract.delistPerpetual(toBigNumberStr(priceLowerBound),toBigNumberStr(priceUpperBound))).wait();
}


if(require.main === module){
    if(process.argv.length != 4){
      console.error(`provide oraclePriceLowerBound and oraclePriceUpperBound e.g. yarn delistPerpetual <oraclePricelowerBound> <oraclePriceUpperBound>`);
      process.exit(1);  
    };   
    main(process.argv[2],process.argv[3]);
}