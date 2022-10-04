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
//const deployerWallet = new ethers.Wallet(owner, provider);



async function main(priceLowerBound,priceUpperBound,ownerPvtKey){
    /* only run this section if final settlement is not enabled already */
    // const contract = Perpetual__factory.connect(perpetualContractAddress, deployerWallet); 
    // await ( await contract.enableFinalSettlement(toBigNumberStr(priceLowerBound),toBigNumberStr(priceUpperBound))).wait();
     
    console.log("Perform Final Settlement on:", ownerPvtKey);
    const owner = ownerPvtKey;
    const ownerWallet = new ethers.Wallet(owner, provider);
    contract = Perpetual__factory.connect(perpetualContractAddress, ownerWallet); 
    const address = await ownerWallet.getAddress();
    await ( await contract.withdrawFinalSettlement(ownerWallet.address )).wait();
}


if(require.main === module){
    if(process.argv.length != 5){
      console.error(`provide oraclePriceLowerBound,oraclePriceUpperBound and ownerPvtKey e.g. yarn performFinalSettlementStatus <oraclePricelowerBound> <oraclePriceUpperBound> <ownerPvtKey>`);
      process.exit(1);  
    };   
    main(process.argv[2],process.argv[3],process.argv[4]);
}