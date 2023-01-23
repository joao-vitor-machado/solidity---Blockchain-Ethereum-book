// SPDX-License-Identifier: MIT
pragma solidity = 0.8.17;

interface IERC20 {

   function name() external view returns (string calldata);

   function symbol() external view returns (string calldata);
   
   function decimals() external view returns (uint8);

   function totalSupply() external view returns (uint256);

   function balanceOf(address _owner) external view returns (uint256 balance);

   function transfer(address _to, uint256 _value) external returns (bool success);

   function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

   function approve(address _spender, uint256 _value) external returns (bool success); 

   function allowance(address _owner, address _spender) external view returns (uint256 remaining);

   event Transfer(
    address indexed _from,
    address indexed _to, 
    uint256 _value
   );

   event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
   );
}

contract TokenERC20 is IERC20{
    
    string public constant name = "sidDev";
    string public constant symbol = "SDV";
    uint8 public constant decimals = 18;
    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowed;

    constructor() {
        _balances[msg.sender] = _totalSupply;
    }

    function totalSupply() public override view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public override view returns (uint256) {
        return _balances[_owner];
    }

    function allowance(address _owner, address _spender) public override view returns (uint) {
        return _allowed[_owner][_spender];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value <= _balances[msg.sender], "Not enough funds");

        require(_to != address(0), "Address is invalid");

        _balances[msg.sender] = _balances[msg.sender] - _value;

        _balances[_to] = _balances[_to] + _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Address is invalid");

        _allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_value <= _balances[_from], "Not enough funds!");

        require(_value <= _allowed[_from][msg.sender], "Not enough allowed funds");

        require(_to != address(0), "Invalid address");

        _balances[_from] = _balances[_from] - _value;
        _balances[_to] = _balances[_to] + _value;

        _allowed[_from][msg.sender] = _allowed[_from][msg.sender] - _value;

        emit Transfer(_from, _to, _value);

        return true;
    }

}