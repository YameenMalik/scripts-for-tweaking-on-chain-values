const { Guardian__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers } = require("@firefly-exchange/library");

const environment = require("./environments.json");
require('dotenv').config();
env = environment[process.env.env]
market = process.env.market;

console.log("Env:", process.env.env);
console.log("Market:", market);


const providerURL = env["URL"];
const guardian = env["DEPLOYER"]
const oracleContractAddress = env[market]["PriceOracle"]
const guardianContractAddress = env[market]["Guardian"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const guardianWallet = new ethers.Wallet(guardian, provider);

async function main(market,moveTo){
    const destination = moveTo == 1 ? "off" : "on"
    console.log("Setting Oracle Status:", destination)
    const contract = Guardian__factory.connect(guardianContractAddress, guardianWallet);
    await ( await contract.setMarketOracleStatus(oracleContractAddress, market, moveTo)).wait()
}


if(require.main === module){
    if(process.argv.length != 4){
      console.error(`provide off/on e.g. yarn setOracle off or yarn setOracle on`);
      process.exit(1);  
    };   
    main(process.argv[2],Number(process.argv[3] == "off"));
}