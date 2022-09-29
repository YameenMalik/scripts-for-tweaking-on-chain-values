const { Perpetual__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr } = require("@firefly-exchange/library");

const environment = require("./environments.json");

require('dotenv').config();
env = environment[process.env.env]
market = process.env.market;

console.log("Env:", process.env.env);
console.log("Market:", market);


const providerURL = env["URL"];
const operatorKey = env["DEPLOYER"]
const perpetualContractAddress = env[market]["Perpetual"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const operatorWallet = new ethers.Wallet(operatorKey, provider);

async function main(rate){

    const contract = Perpetual__factory.connect(perpetualContractAddress, operatorWallet);
    console.log("Setting funding rate to:", (rate * 100), `%cent (${toBigNumberStr(rate)})`);

    await (await contract.setOffChainFundingRate(
        toBigNumberStr(rate))                    
        ).wait();

}


if(require.main === module){
    if(process.argv.length != 3){
      console.error(`Provide funding rate(in percentage) to be set e.g. "yarn setFR <rate>"`);
      process.exit(1);  
    };

    main(Number(process.argv[2]));
}

// async function getLocalIndex(){
//     const perpetualAddress = "0xaF15794C60e924a5054774992438220156cE9007"
//     const contract = Perpetual__factory.connect(perpetualAddress, operatorWallet);
//     const index = await contract.getAccountIndex("0xF7c22148ACCB42EADb871579886a7aF5Fc0839Cc");
//     console.log('local index:', +index[0], bnStrToBaseNumber(new bigNumber(index[1].toHexString())));
//     const global = await contract._GLOBAL_INDEX_();
//     console.log('global index:', +global[0], bnStrToBaseNumber(new bigNumber(global[1].toHexString())));
// }

// getLocalIndex();