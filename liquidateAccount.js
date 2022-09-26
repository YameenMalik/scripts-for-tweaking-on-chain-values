const { Perpetual__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr, Trader } = require("@firefly-exchange/library");
const { FireflyClient, Networks } = require("@firefly-exchange/firefly-client");

//TODO can be fetched from dapi
const contracts = {
    "BTC": {
        "perpetual": "0xaE0B1a34E7fd6d2cCD5571F5F677B894bD434145",
        "liquidation": "0x0f993B8206E4301bC92BB2F6fE351Bca0471153F"
    },
    "ETH": {
        "perpetual": "0xcfD5fDC5BfCeFd26F7Ab1876913D7DA34b8cBE9f",
        "liquidation": "0xcBbB9c952aAe8A686B6D2D81A067d6019C83eE98"
    }
}


const providerURL = "https://bobabase.boba.network";
const provider = new ethers.providers.JsonRpcProvider(providerURL);

async function main(market, liquidatePvtKey, liquidatorPvtKey, leverage, quantity){
    const pairName = market + "-PERP";


    const client = new FireflyClient(true, Networks.TESTNET, liquidatePvtKey);
    client.init()

    const liquidatorWallet = new ethers.Wallet(liquidatorPvtKey, provider);
    const contract = Perpetual__factory.connect(contracts[market].perpetual, liquidatorWallet);

    const position = await client.getUserPosition({symbol:pairName});

    
    if(!position.ok){
        console.error(`Could not find user ${client.getPublicAddress()} position info on DAPI`);
        process.exit(1);
    }

    const params = await Trader.setupLiquidationTrade(
        {
            // complete order quantity
            quantity: toBigNumberStr(quantity),
            // is buy should always be same as maker order is buy.
            isBuy: position.data.side == "BUY",
            // isBuy: true,
            // use default leverage as one
            leverage: toBigNumberStr(leverage),
            allOrNothing: false
        },
        liquidatorWallet.address,
        await client.getPublicAddress(),
        contracts[market].liquidation
    );

    await  ( await contract
            .connect(liquidatorWallet)
            .trade(
                params.accounts, 
                [params.data]
                )
            ).wait()
}


if(require.main === module){
    if(process.argv.length != 7){
      console.error(`Provide market, account address to be liquidated, liquidator's private key, leverage and quantity
      \ne.g. "yarn liquidate <MARKET> <liquidate pvt key> <liquidator pvt key> <leverage> <quantity>"
      \ne.g  "yarn liquidate BTC key1 key2 4 10
      `);
      process.exit(1);  
    };

    if(process.argv[2] != "BTC" && process.argv[2] != "ETH"){
        console.error("Only BTC/ETH markets are supported")
        process.exit(1)
      }

    main(process.argv[2], process.argv[3], process.argv[4], process.argv[5], process.argv[6]);
}