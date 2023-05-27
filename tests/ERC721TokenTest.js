const assert = require('assert');
const Web3 = require('web3');
const {
    abiJson,
    bytecode
} = require('../scripts/compileERC721Token');
const chai = require('chai');
const {
    should,
    expect
} = require('chai');

const web3 = new Web3('HTTP://127.0.0.1:8545');

let accounts;
let contractOwner;
let tokenOwner;
let tokenSpender;
let TokenERC721Contract;

console.log("------------------------------------------");
console.log("Tests for ERC721 generic Token");
console.log("------------------------------------------");

before(async () => {
    accounts = await web3.eth.getAccounts();
    contractOwner = accounts[0];
    tokenOwner = accounts[1];
    tokenSpender = accounts[2];
    tokenNewOwner = accounts[3];

    TokenERC721Contract =
        await new web3.eth.Contract(abiJson)
        .deploy({
            data: "0x" + bytecode
        })
        .send({
            from: contractOwner,
            gas: 1000000
        });
});

describe("mint", async () => {
    it("Should mint a new token", async () => {
        await TokenERC721Contract.methods
            .mint()
            .send({from: tokenOwner, gas: 300000, value: 30000});

        console.log("New token minted");
    })
})

describe("Balance of", async () => {
    it("Should return a number which is the token Id", async () => {
        const totalSupply = await TokenERC721Contract.methods
            .balanceOf(tokenOwner)
            .call();

        console.log(totalSupply);
        expect(Number(totalSupply)).to.be.a('Number');
    })
})

describe("Owner of", async () => {
    it("Should return the token owner address", async () => {
        const tokenOwnerAddress = await TokenERC721Contract.methods
            .ownerOf(1)
            .call();

        console.log(tokenOwnerAddress);
        expect(tokenOwnerAddress).to.be.equal(tokenOwner);
    })
})

describe("Transfer from", async () => {
    it("Should should change the ownership of the token", async () => {
        await TokenERC721Contract.methods
            .transferFrom(tokenOwner, tokenNewOwner, 1)
            .send({from: tokenOwner, gas: 300000});

        let tokenBalanceOfSecondOwner = await TokenERC721Contract.methods
            .ownerOf(1)
            .call()

        console.log("token transfered");
        expect(tokenBalanceOfSecondOwner).to.be.equal(tokenNewOwner);
    })
})

describe("Approve", async () => {
    it("Should allow an address to do something with the given token", async () => {
        await TokenERC721Contract.methods
            .approve(tokenSpender, 1)
            .send({from: tokenNewOwner, gas: 300000, value: 300000});

        let approvalAddressForToken = await TokenERC721Contract.methods
            .getApproved(1)
            .call();

        console.log("Token 1 approved for " + tokenSpender);
        expect(tokenSpender).to.be.equal(approvalAddressForToken);
    })
})