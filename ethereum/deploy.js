const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json')

const provider = new HDWalletProvider(
    'direct review like trumpet empty glow view whale drama slam trend minor',
    'https://rinkeby.infura.io/v3/51a899b685344f3ea44cce9096eb32a6'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy contract from account : ', accounts[0]);
    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '8000000' })

    console.log('Contract deployed at address :', result.options.address);
};

deploy();

