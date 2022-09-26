
const { PriceOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr } = require("@firefly-exchange/library");

const providerURL = "https://bobabase.boba.network";
const priceOracleAddress = "0xC562151B7Be0aB0B63A8eD662909E28f3869Cab0"
const deployerKey = "590f42e7ecb5f98e2cd1c8b1d832804e5ec98e560dc51c47a53d5e366f9ff0cc";
const provider = new ethers.providers.JsonRpcProvider(providerURL);
const deployerWallet = new ethers.Wallet(deployerKey, provider);


async function setMaxAllowedOraclePriceDiff(){
    const contract = PriceOracle__factory.connect(priceOracleAddress, deployerWallet);
    await ( await contract.setMaxPriceUpdateDiff(toBigNumberStr(1000))).wait()
    console.log(+ await contract.getMaxPriceUpdateDiff());
}

setMaxAllowedOraclePriceDiff();