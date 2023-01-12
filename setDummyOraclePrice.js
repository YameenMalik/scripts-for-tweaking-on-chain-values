
const { toBigNumberStr,bnToString,bigNumber,  ethers } = require("@firefly-exchange/library");
const { DummyPriceOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange_arbitrum");
const environment = require("./environments.json");
require("dotenv").config();

async function main(price) {
  env = environment[process.env.env];
  market = process.env.market;

  console.log("Env:", process.env.env);
  console.log("Market:", market);

  const providerURL = env["URL"];
  const operatorKey = env["ORACLE_OPERATOR"];
  const priceOracleAddress = env[market]["PriceOracleProxy"];
  const provider = ethers.getDefaultProvider(providerURL);
  const adminWallet = new ethers.Wallet(operatorKey, provider);
  const oracleContract = DummyPriceOracle__factory.connect(
    priceOracleAddress,
    adminWallet
  );

  const priceInNumber = parseInt(price);
  if (!priceInNumber) {
    console.log("Please provide valid price");
    process.exit(1);
  }
  const oldPrice = await oracleContract.latestRoundData();
  console.log("Current Oracle Price is", +oldPrice[1] / 10**8);
  console.log("Setting Oracle Price to -> ", priceInNumber, ".....");

  let i = 1;
  while (true) {
    console.log("Try #", i++);
    try {
      await (
        await oracleContract.setPrice(toBigNumberStr(priceInNumber))
      ).wait();
      break;
    } catch (e) {
      console.log(e);
      continue;
    }
  }
  const updatedPrice = await oracleContract.latestRoundData();
  console.log("Oracle Price Updated to ->", +updatedPrice[1]/ 10**8);
}

main(process.argv[2]);