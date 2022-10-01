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
const fundingOracleContractAddress = env[market]["FundingOracle"]
const guardianContractAddress = env[market]["Guardian"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const guardianWallet = new ethers.Wallet(guardian, provider);

async function main(){
    console.log("Moving funding rate off-chain")
    const contract = Guardian__factory.connect(guardianContractAddress, guardianWallet);
    await ( await contract.setFundingRateStatus(fundingOracleContractAddress, 1)).wait()
}

main();