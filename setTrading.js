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
const perpetualContractAddress = env[market]["Perpetual"]
const guardianContractAddress = env[market]["Guardian"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const guardianWallet = new ethers.Wallet(guardian, provider);

async function main(moveTo){
    const destination = moveTo == 1 ? "off-chain" : "on-chain"
    console.log("Setting Trading Status:", destination)
    const contract = Guardian__factory.connect(guardianContractAddress, guardianWallet);
    await ( await contract.setTradingStatus(perpetualContractAddress, moveTo)).wait()
}


if(require.main === module){
    if(process.argv.length != 3){
      console.error(`provide off/on e.g. yarn setTrading off or yarn setTrading on`);
      process.exit(1);  
    };   
    main(Number(process.argv[2] == "off"));
}