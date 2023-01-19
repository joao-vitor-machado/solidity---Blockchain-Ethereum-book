const path = require('path');
const fs = require('fs');
const solc = require('solc');
const contractName = "CellPhoneCompanyContract.sol";
const chalk = require('chalk');

const contractPath = path.resolve(__dirname, '../contracts', contractName);

const source = fs.readFileSync(contractPath, 'utf8');

const compilerInput = {
    language: 'Solidity',
    sources: {
      'CellPhoneCompanyContract.sol': {
        content: source
      }
    },
    settings: {
        optimizer: {
          enabled: true
        },
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  const inputString = JSON.stringify(compilerInput);
  const output = JSON.parse(solc.compile(inputString));

  

  const contractEVM = output.contracts[contractName]['CellPhoneCompanyContract']['evm'];

  const bytecode = contractEVM['bytecode']['object'];
  const gasEstimateTotal = contractEVM['gasEstimates']['creation']['totalCost'];
  const gasEstimateExecution = contractEVM['gasEstimates']['creation']['executionCost'];
  const abiJson = output.contracts[contractName]['CellPhoneCompanyContract']['abi'];


  module.exports = { abiJson, bytecode };