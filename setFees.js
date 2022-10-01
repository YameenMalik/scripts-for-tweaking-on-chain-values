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
const admin = env["DEPLOYER"]
const perpetualContractAddress = env[market]["Perpetual"]
const provider = new ethers.providers.JsonRpcProvider(providerURL);
const adminWallet = new ethers.Wallet(admin, provider);

async function main(){

    const contract = Perpetual__factory.connect(perpetualContractAddress, adminWallet);
    const curTakerFee = await (contract._DEFAULT_TAKER_FEE_());
    const curMakerFee = await (contract._DEFAULT_MAKER_FEE_());

    console.log("Current Taker Fee: ", +curTakerFee, +curTakerFee/1e18);
    console.log("Current Maker Fee: ", +curMakerFee, +curMakerFee/1e18);

}

main()