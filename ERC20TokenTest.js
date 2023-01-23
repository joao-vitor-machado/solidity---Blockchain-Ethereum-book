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

    expect(Number(totalSupply)).to.be.a('Number');
    })
})