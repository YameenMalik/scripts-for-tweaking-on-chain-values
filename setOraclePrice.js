const { PriceOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr, BigNumber } = require("@firefly-exchange/library");
const environment = require("./environments.json");
require('dotenv').config();
env = environment[process.env.env]
market = process.env.market;

console.log("Env:", process.env.env);
console.log("Market:", market);


const providerURL = env["URL"];
const operatorKey = env["ORACLE_OPERATOR"]
const priceOracleAddress = env[market]["PriceOracle"]

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const operatorWallet = new ethers.Wallet(operatorKey, provider);

async function main(price){
    const contract = PriceOracle__factory.connect(priceOracleAddress, operatorWallet);

    const data = await contract.getPrice(market);

    console.log("Market:", market)
    
    console.log(`Current price: (${BigNumber(data[0].toHexString()).shiftedBy(-18).toFixed(6)},${BigNumber(data[0].toHexString()).toFixed(0)}) set at timestamp: ${+data[1]}`);

    console.log(`Setting Price: ${price}, - ${toBigNumberStr(price)}`);


    let i = 1;
    while(true){
      console.log("Try #", i++)
      try{
        await (await contract.setPrice(
          market, 
          toBigNumberStr(price), 
          Math.ceil(Date.now()/1000),
          // { gasLimit: 1_000_000 }
          )                    
          ).wait();
        break;
      } catch(e){
        console.log(e);
        continue;        
      }
    }
}

if(require.main === module){
    if(process.argv.length != 3){
      console.error(`Provide price to be set e.g. "yarn setPrice <price>" e.g yarn setPrice 20000`);
      process.exit(1);  
    };   
    main(Number(process.argv[2]));
}
