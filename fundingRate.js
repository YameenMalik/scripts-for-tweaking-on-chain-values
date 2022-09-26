const { Perpetual__factory, Guardian__factory, FundingOracle__factory } = require("@firefly-exchange/library/dist/src/contracts/exchange");
const { ethers, toBigNumberStr } = require("@firefly-exchange/library");


// const providerURL = "https://l2-dev.firefly.exchange";
const providerURL = "https://bobabase.boba.network"

const operatorKey = "590f42e7ecb5f98e2cd1c8b1d832804e5ec98e560dc51c47a53d5e366f9ff0cc";
const provider = new ethers.providers.JsonRpcProvider(providerURL);
const operatorWallet = new ethers.Wallet(operatorKey, provider);

// DEV
// const guardian = "0xfC1A61C3B7656e726caD3e277D1c15E54c663507";

// TESTNET
const guardian = "0x87cf84c9De6a852C47C7d4Fe6F0bDFFb0DEF0795"

async function allowOffChainFundingRate(){
    // DEV ----------------------------------
    
    // BTC
    // const fundingOracle = "0x4120B56151401AF4af4737657dD0cFd9281d5ac2";

    // ETH
    // const fundingOracle = "0x50c0e1C83817C9E9b7137266BDE5242FaDb1C397";

    // TESTNET ----------------------------------
    
    // BTC
    // const fundingOracle = "0xE859C19B1DbBe68f539f44A1309184ACE3D1f73f";

    // ETH
    const fundingOracle = "0x8407538dBe5869ae091A90Ddb86a7647ceb8AfAF";

    const contract = Guardian__factory.connect(guardian, operatorWallet);
    await ( await contract.setFundingRateStatus(fundingOracle, 1)).wait()
}

async function setZero(){

    // DEV ----------------------------------
    // BTC
    // const perpetualAddress = "0x6a8A01E80778f14Cd3b63dCB0596346311D5D827";

    // ETH
    // const perpetualAddress = "0xEc0f9DA42CDBA7Fe680e77892fe025d0f31aa654";

    // TESTNET ----------------------------------

    // BTC
    // const perpetualAddress = "0xaE0B1a34E7fd6d2cCD5571F5F677B894bD434145";

    // ETH
    const perpetualAddress = "0xcfD5fDC5BfCeFd26F7Ab1876913D7DA34b8cBE9f";



    const contract = Perpetual__factory.connect(perpetualAddress, operatorWallet);
    await (await contract.setOffChainFundingRate(
        toBigNumberStr(0))                    
        ).wait();

}

async function getFR(){

    // DEV ----------------------------------

    // BTC
    // const fundingOracle = "0x4120B56151401AF4af4737657dD0cFd9281d5ac2";

    // ETH
    // const fundingOracle = "0x50c0e1C83817C9E9b7137266BDE5242FaDb1C397";

    // TESTNET ----------------------------------
    
    // BTC
    // const fundingOracle = "0xE859C19B1DbBe68f539f44A1309184ACE3D1f73f";

    // ETH
    // const fundingOracle = "0x8407538dBe5869ae091A90Ddb86a7647ceb8AfAF";

    const contract = FundingOracle__factory.connect(fundingOracle, operatorWallet);
    console.log('current rate:', +await contract.currentFundingRate());

}

// allowOffChainFundingRate()

// setZero();

getFR();

