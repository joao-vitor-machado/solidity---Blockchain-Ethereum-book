const Web3 = require('web3');
const {abiJson, bytecode} = require('../scripts/compileCellPhoneContract.js');

const web3 = new Web3('HTTP://127.0.0.1:8545');

console.log("------------------------------------------");
console.log("Tests for Phone Company use case");
console.log("------------------------------------------");

before(async() => {
    accounts = await web3.eth.getAccounts();
    account_1 = accounts[2];
    account_2 = accounts[3];
    account_3 = accounts[4];

    cellPhoneContract = 
        await new web3.eth.Contract(abiJson)
            .deploy({data: "0x"+bytecode})
            .send({from: account_1, gas: 5000000, value: 5000000});
});

describe('Get contract balance', async() => {
    it('Should return a number which is the contract balance in eth', async() => {

        let balance = await cellPhoneContract.methods
            .getContractBalance()
            .call()

        console.log(balance);

    })
})

describe('Get product', async() => {
    it('Should return a the first product', async() => {

        let product = await cellPhoneContract.methods
            .getProduct(0)
            .call()

        console.log(product);

    })
})

describe('Enroll customer', async() => {
    it('Should enroll the customer to be used in next tests', async() => {

        await cellPhoneContract.methods
            .enrollCustomer("João")
            .send({from: account_2, gas:300000000})

            await cellPhoneContract.methods
            .enrollCustomer("Sid")
            .send({from: account_3, gas:300000000})


    })
})

describe('Pay monthly bill', async() => {
    it('Should pay an amount of wei for tokens', async() => {

        for(let i=0; i<=30; i++){
            await cellPhoneContract.methods
            .payMonthlyBill(300000)
            .send({from: account_2, gas: 300000, value: 300000});
        }

        let customer = await cellPhoneContract.methods
            .getEnrolledCustomerByAdress(account_2)
            .call();

        console.log(customer.customerBalance);

    })
})


describe('Exchange product', async() => {
    it('Should increase to 1 the amount exchanged of the product', async() => {

        await cellPhoneContract.methods
            .exchangeCustomerPointsByProduct(0)
            .send({from: account_2, gas: 300000000});

            let product = await cellPhoneContract.methods
            .getProduct(0)
            .call()

        console.log(product.amountExchanged);

    })
})