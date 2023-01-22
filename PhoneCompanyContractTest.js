const assert = require('assert');
const Web3 = require('web3');
const {abiJson, bytecode} = require('./scripts/compileCellPhoneContract');
const chai = require('chai');
const { should } = require('chai');

const web3 = new Web3('HTTP://127.0.0.1:7545');

let accounts;
let contractOwner;
let conrtactClient;
let cellPhoneContract;

before(async() => {
    accounts = await web3.eth.getAccounts();
    contractOwner = accounts[0];
    conrtactClient = accounts[1];


    cellPhoneContract = 
        await new web3.eth.Contract(abiJson)
            .deploy({data: "0x"+bytecode})
            .send({from: contractOwner, gas: 1000000});
});

describe('Customer enrollement', async() => {
    it('Should enroll a customer', async() => {
        
        let customerName = 'João vitor';
        await cellPhoneContract.methods
            .enrollCustomer(customerName)
            .send({from: conrtactClient, gas: 1000000})

    })
})

describe('Retrieve customer', async() => {
    it('Should return a customer named João Vitor', async() => {

        var customer = await cellPhoneContract.methods
            .getEnrolledCustomerByAdress(conrtactClient)
            .call();

        const {customerName, customerBalance} = customer;

        chai.assert.equal(JSON.stringify(
            {
                customerName: customerName,
                customerBalance: customerBalance
            }
        ), JSON.stringify(
            {
                customerName: 'João vitor',
                customerBalance: '0'
            }
        ))

    })
})

describe('Pay monthly bill', async() => {
    it('Should increase customer balance by one', async() => {
        var customerPreviously = await cellPhoneContract.methods
        .getEnrolledCustomerByAdress(conrtactClient)
        .call();

        const customerPreviousBalance = customerPreviously['customerBalance'];
        
        await cellPhoneContract.methods
        .payMonthlyBill(1000000)
        .send({from: conrtactClient, gas:1000000, value: 1000000});

        var customerNow = await cellPhoneContract.methods
        .getEnrolledCustomerByAdress(conrtactClient)
        .call();

        const customerCurrentBalance = customerNow['customerBalance'];

        chai.expect(Number(customerCurrentBalance)).to.equal(Number(customerPreviousBalance+1));


    })
})

// describe('transfer to account', async() => {
//     it('should transfer from contract wallet to the owner of the contract wallet ONLY', async() =>{
//         await cellPhoneContract.methods
//         .transferToAccount(conrtactClient, 100)
//         .send({from: contractOwner, gas: 1000000})

//         try{
//             await cellPhoneContract.methods
//         .transferToAccount(conrtactClient, 100)
//         .send({from: conrtactClient, gas: 1000000})
//         }catch(except) {
//             chai.should().exist(except);
//         }
//     })
// })

// describe('Exchange customer points by products', async() => {
//     it('should increase the number of exchanged product of a certain asset', async() => {
//         var product = await cellPhoneContract.methods
//         .getProduct(0)
//         .call();

//         const previousBalance = product['amaountExchanged'];

//         await cellPhoneContract.methods
//         .
//     })
// })
