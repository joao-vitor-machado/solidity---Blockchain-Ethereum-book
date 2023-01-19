const assert = require('assert');
const Web3 = require('web3');
const {abiJson, bytecode} = require('./scripts/compileCellPhoneContract');

const web3 = new Web3('HTTP://127.0.0.1:7545');

let accounts;
let account_1;
let account_2;
let cellPhoneContract;

before(async() => {
    accounts = await web3.eth.getAccounts();
    account_1 = accounts[0];
    account_2 = accounts[1];


    cellPhoneContract = 
        await new web3.eth.Contract(abiJson)
            .deploy({data: "0x"+bytecode})
            .send({from: account_1, gas: 1000000});
});

describe('Cell Phone Contract Customer enrollement', async() => {
    it('Should enroll a customer', async() => {
        
        let customerName = 'João vitor';
        await cellPhoneContract.methods
            .enrollCustomer(customerName)
            .send({from: account_1, gas: 1000000})

    })
})

describe('Retrieve customer', async() => {
    it('Should return a customer named João Vitor', async() => {

        var customer = await cellPhoneContract.methods
            .getEnrolledCustomerByAdress(account_1)
            .call();

        console.log(customer);

    })
})
