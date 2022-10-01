const { PriceOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr, BigNumber } = require("@firefly-exchange/library");
const environment = require("./environments.json");
require('dotenv').config();
env = environment[process.env.env]
market = process.env.market;

console.log("Env:", process.env.env);
console.log("Market:", market);


const providerURL = env["URL"];
const adminKey = env["DEPLOYER"]
const priceOracleAddress = env[market]["PriceOracle"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const adminWallet = new ethers.Wallet(adminKey, provider);

async function main(){
    const contract = PriceOracle__factory.connect(priceOracleAddress, adminWallet);
    await contract.setMaxPriceUpdateDiff(toBigNumberStr(100000));
}

main();