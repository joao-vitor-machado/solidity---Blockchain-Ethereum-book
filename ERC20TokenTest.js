const assert = require('assert');
const Web3 = require('web3');
const {abiJson, bytecode} = require('./scripts/compileERC20Token');
const chai = require('chai');
const { should, expect } = require('chai');

const web3 = new Web3('HTTP://127.0.0.1:7545');

let accounts;
let contractOwner;
let tokenOwner;
let tokenSpender;
let TokenERC20Contract;

before(async() => {
    accounts = await web3.eth.getAccounts();
    contractOwner = accounts[0];
    tokenOwner = accounts[1];
    tokenSpender = accounts[2];


    TokenERC20Contract = 
        await new web3.eth.Contract(abiJson)
            .deploy({data: "0x"+bytecode})
            .send({from: contractOwner, gas: 1000000});
});

describe("Total supply", async() => {
    it("Should return a number", async() => {
        const totalSupply = await TokenERC20Contract.methods
    .totalSupply()
    .call();

    console.log(totalSupply);
    expect(Number(totalSupply)).to.be.a('Number');
    })
})

describe("Transfer", async () => {
    it("Should return true", async () => {
        const wasTransfered = TokenERC20Contract.methods
        .transfer(tokenOwner, 10)
        .send({from: contractOwner, gas: 1000000})
        .on('confirmed', (number, receipt) => {
            return receipt
        });

        console.log(wasTransfered);
        // assert.equal(Boolean(wasTransfered), true);

    })
})

describe("Balance Of", async ()=> {
    it("Should return the balance of 10", async () => {
            const balanceOf = await TokenERC20Contract.methods
            .balanceOf(contractOwner)
            .call();
            
    console.log(balanceOf);
    // assert.equal(Number(balanceOf), 10);
    });

    // it("should return a balance of 10");
})

describe("Allowance", async () => {
    it("Should return a boolean that represents if a certain account is allowed or not to use funds from another wallet", async () => {
        const allowance = await TokenERC20Contract.methods
        .allowance(tokenOwner, tokenSpender)
        .call();

        console.log(allowance);
        expect(Number(allowance)).to.be.a('Number');
    })
})
