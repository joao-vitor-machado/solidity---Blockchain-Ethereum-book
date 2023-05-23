const assert = require('assert');
const Web3 = require('web3');
const {abiJson, bytecode} = require('../scripts/compileERC20Token');
const chai = require('chai');
const { should, expect } = require('chai');

const web3 = new Web3('HTTP://127.0.0.1:8545');

let accounts;
let contractOwner;
let tokenOwner;
let tokenSpender;
let TokenERC20Contract;

console.log("------------------------------------------");
console.log("Tests for ERC20 generic Token");
console.log("------------------------------------------");

beforeEach(async() => {
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
        const wasTransfered = await TokenERC20Contract.methods
        .transfer(tokenSpender, 10)
        .send({from: contractOwner, gas: 1000000});

        console.log(
            "Receiver final balance: \n" + 
            await TokenERC20Contract.methods
            .balanceOf(tokenSpender)
            .call({from: contractOwner, gas: 1000000})
        )

        assert.equal(wasTransfered.status, true);

    })
})

describe("Balance Of", async ()=> {
    it("Should return the balance of 1000", async () => {
            const balanceOf = await TokenERC20Contract.methods
            .balanceOf(contractOwner)
            .call({from: contractOwner, gas: 1000000});
            
    console.log(balanceOf);
    assert.equal(Number(balanceOf), 10000)
    });
})

describe("Allowance", async () => {
    it("Should return a boolean that represents if a certain account is allowed or not to use funds from another wallet", async () => {
        const allowance = await TokenERC20Contract.methods
        .allowance(tokenOwner, tokenSpender)
        .call({from: contractOwner, gas: 1000000});

        console.log(allowance);
        expect(Number(allowance)).to.be.a('Number');
    })
})

describe("Approve", async() => {
    it("Should allow a wallet to spend 10 token from another wallet", async() => {
        const approve = await TokenERC20Contract.methods
        .approve(tokenSpender, 10)
        .send({from: contractOwner, gas: 1000000})

        console.log("The amount that the token spender can spend from the contract owner tokens: " +
        await TokenERC20Contract.methods
        .allowance(contractOwner, tokenSpender)
        .call({from: contractOwner, gas: 1000000})
        )

        assert.equal(approve.status, true);
    })
})

describe("Transfer from", async() => {
    it("Should return true after transfering a given amount from one wallet to another. It will depend on the amount allowed to be spent of the wallet from where the tokens are coming from", async() => {

        await TokenERC20Contract.methods
        .approve(tokenSpender, 10)
        .send({from: contractOwner, gas: 1000000});

        const transferFrom = await TokenERC20Contract.methods
        .transferFrom(contractOwner, tokenOwner, 10)
        .send({from: tokenSpender, gas: 1000000});

        

        console.log(transferFrom.status);
        assert.equal(transferFrom.status, true)
    })
})
