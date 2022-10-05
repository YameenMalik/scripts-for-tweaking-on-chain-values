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


async function main(ownerPvtKey){  
    console.log("Perform Final Settlement on:", ownerPvtKey);
    const owner = ownerPvtKey;
    const ownerWallet = new ethers.Wallet(owner, provider);
    contract = Perpetual__factory.connect(perpetualContractAddress, ownerWallet); 
    const address = await ownerWallet.getAddress();
    await ( await contract.withdrawFinalSettlement(ownerWallet.address )).wait();
}


if(require.main === module){
    if(process.argv.length != 3){
      console.error(`provide ownerPvtKey e.g. yarn performFinalSettlementStatus <ownerPvtKey>`);
      process.exit(1);  
    };   
    main(process.argv[2]);
}