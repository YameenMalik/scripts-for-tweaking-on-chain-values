const { PriceOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr } = require("@firefly-exchange/library");

// address of oracle contract for DEV environment
const providerURL = "https://bobabase.boba.network";
const priceOracleAddress = "0xC562151B7Be0aB0B63A8eD662909E28f3869Cab0" 
const operatorKey = "406ac5dfc6d5ff3300073e0c8ef98491e6f6aacf4d6f38139c15065576afc5d9";

const provider = new ethers.providers.JsonRpcProvider(providerURL);
const operatorWallet = new ethers.Wallet(operatorKey, provider);

async function main(market, price){
    const contract = PriceOracle__factory.connect(priceOracleAddress, operatorWallet);
    market = market + "-PERP"

    const data = await contract.getPrice(market);

    console.log("Market:", market)
    
    console.log(`Current price: (${+data[0]},${+data[0]/1e18}) set at timestamp: ${+data[1]}`);

    console.log(`Setting Price: ${price}`);


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
    if(process.argv.length != 4){
      console.error(`Provide price to be set e.g. "yarn setPrice <MARKET> <price>" e.g yarn setPrice BTC 20000`);
      process.exit(1);  
    };

    if(process.argv[2] != "BTC" && process.argv[2] != "ETH"){
      console.error("Only BTC/ETH markets are supported")
      process.exit(1)
    }
    main(process.argv[2], Number(process.argv[3]) );
}
