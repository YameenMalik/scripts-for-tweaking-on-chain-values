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
    console.log("Close Positions On:", ownerPvtKey);
    const owner = ownerPvtKey;
    const ownerWallet = new ethers.Wallet(owner, provider);
    contract = Perpetual__factory.connect(perpetualContractAddress, ownerWallet); 
    const address = await ownerWallet.getAddress();
    await ( await contract.closePosition(ownerWallet.address )).wait();
}


if(require.main === module){
    if(process.argv.length != 3){
      console.error(`provide ownerPvtKey e.g. yarn closePosition <ownerPvtKey>`);
      process.exit(1);  
    };   
    main(process.argv[2]);
}