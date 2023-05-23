const assert = require('assert');
const Web3 = require('web3');
const {abiJson, bytecode} = require('../scripts/compile.js');

const web3 = new Web3('HTTP://127.0.0.1:8545');

let accounts;
let account_1;
let account_2;
let studentsContract;

console.log("------------------------------------------");
console.log("Tests for Students contract use case");
console.log("------------------------------------------");

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    account_1 = accounts[0];
    account_2 = accounts[1];

    studentsContract = 
        await new web3.eth.Contract(abiJson)
            .deploy({data: "0x"+bytecode})
            .send({from: account_1, gas: 1000000});
});

describe('Students Contract', async() => {
    it('Should return valid student', async() => {
        
        let name = 'João vitor';
        let age = 20;

        await studentsContract.methods
            .enrollStudent(name, age)
            .send({from: account_1, gas: 1000000})

        let student = await studentsContract.methods
            .getEnrolledStudentByAddress(account_1)
            .call();

        console.log(student)

    })
})
