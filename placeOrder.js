/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/**
 * Client initialization code example
 */

/* eslint-disable no-console */
const { Networks, FireflyClient, MARKET_SYMBOLS, ORDER_SIDE, ORDER_TYPE} = require("@firefly-exchange/firefly-client");



async function main() {
  // const dummyAccountKey = "4ef06568055d528efdeb3a2e0c1a4b1a0f1fdf4f9e388f11f0a248228298c2b7";

  // const dummyAccountKey = "f1b3322f39bb4530ebfefc13e7402a579dc2cf8242efa5abc059c7bffc616066";

  const dummyAccountKey = "f1b3322f39bb4530ebfefc13e7402a579dc2cf8242efa5abc059c7bffc616066";

  // using predefined network
  const client = new FireflyClient(true, Networks.TESTNET, dummyAccountKey); //passing isTermAccepted = true for compliance and authorizarion
  console.log("Public address: ", client.getPublicAddress());
  await client.init(true)

  client.addMarket(MARKET_SYMBOLS.BTC);

  // will create a signed order to sell 0.1 DOT at MARKET price
  const signedOrder = await client.createSignedOrder({
    symbol: MARKET_SYMBOLS.BTC, // asset to be traded
    price: 20500, // 0 implies market order
    quantity: 0.1, // the amount of asset to trade
    side: ORDER_SIDE.SELL, // buy or sell
    orderType: ORDER_TYPE.LIMIT,
    leverage:10,
  });


  console.log(signedOrder);
    console.log(await client.placeSignedOrder(signedOrder));

  // const onboardingSigner = new OnboardingSigner(new Web3(Networks.DEV.url), Networks.DEV.chainId);

  // console.log('domain hash:', onboardingSigner.getDomainHash())
  // console.log('msg hash:', onboardingSigner.getHash({
  //   "action":OnboardingMessageString.ONBOARDING,
  //   "onlySignOn": "b"
  // }))

}

main().then().catch(console.warn);
