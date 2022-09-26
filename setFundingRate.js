const { Perpetual__factory, Guardian__factory, PriceOracle__factory, FundingOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr, toBigNumber, bigNumber, bnStrToBaseNumber } = require("@firefly-exchange/library");

// BTC_TEST-PERP
// const perpetualAddress = "0xaF15794C60e924a5054774992438220156cE9007"

// BTC
// const perpetualAddress = "0x4D9F94950eBbe7426d329DE07bDA6F33aA87a644";

// ETH
// const perpetualAddress = "0x29158A1730E5d4BdcfCc692e24929d0EC9997C0e";

// DOT
// const perpetualAddress = "0x056Dbd755d334E5A5Ff1AE7376c1185577d773aA"

const providerURL = "https://l2-dev.firefly.exchange";
const operatorKey = "590f42e7ecb5f98e2cd1c8b1d832804e5ec98e560dc51c47a53d5e366f9ff0cc";
const provider = new ethers.providers.JsonRpcProvider(providerURL);
const operatorWallet = new ethers.Wallet(operatorKey, provider);


async function getLocalIndex(){
    const perpetualAddress = "0xaF15794C60e924a5054774992438220156cE9007"
    const contract = Perpetual__factory.connect(perpetualAddress, operatorWallet);
    const index = await contract.getAccountIndex("0xF7c22148ACCB42EADb871579886a7aF5Fc0839Cc");
    console.log('local index:', +index[0], bnStrToBaseNumber(new bigNumber(index[1].toHexString())));
    const global = await contract._GLOBAL_INDEX_();
    console.log('global index:', +global[0], bnStrToBaseNumber(new bigNumber(global[1].toHexString())));
}



async function main(rate){

    const contract = Perpetual__factory.connect(perpetualAddress, operatorWallet);
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

// getLocalIndex();