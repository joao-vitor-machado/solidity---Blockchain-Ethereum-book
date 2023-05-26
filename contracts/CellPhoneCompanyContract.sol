// SPDX-License-Identifier: MIT
pragma solidity = 0.8.17;

contract CellPhoneCompanyContract {
    
    struct Customer {
        string customerName;
        uint customerBalance;
    }

    struct Product {
        string productName;
        uint productPoints;
        uint amountExchanged;
    }

    address private _contractOwner;
    Product[] public products;

    constructor() payable {
        _contractOwner = msg.sender;

        Product memory product0 = 
            Product({
                productName: "Watch",
                productPoints: 1,
                amountExchanged: 0
            });

        Product memory product1 = 
            Product({
                productName: "CellPhone",
                productPoints: 5,
                amountExchanged: 0
            });

        Product memory product2 = 
            Product({
                productName: "Computer",
                productPoints: 10,
                amountExchanged: 0
            });

        products.push(product0);
        products.push(product1);
        products.push(product2);

    }

     mapping(address => Customer) private _enrolledCustomers;

     event ProductExchanged(
        address indexed _customer,
        uint _productIndex,
        uint256 _dateAndTime
     );

     modifier contractOwnerOnly() {
        require(msg.sender == _contractOwner);
        _;
     }

     function getContractBalance() public view returns(uint256){
        return address(this).balance;
     }

     function getProduct(uint256 index) public view returns(Product memory) {

        return products[index];

     }

     function exchangeCustomerPointsByProduct(
        uint _productIndex
     ) public {

        require(_productIndex <= products.length-1,
        "Product index is not valid");

        Customer storage customer = _enrolledCustomers[msg.sender];

        require(isCustomerValid(customer),
        "Customer not enrolled");

        Product storage product = products[_productIndex];

        require(customer.customerBalance >= product.productPoints,
        "Customer balance lower than the required amount of points");

        customer.customerBalance -= product.productPoints;
        product.amountExchanged += 1;

        assert(customer.customerBalance >= 0);

        emit ProductExchanged(msg.sender, _productIndex, block.timestamp);

     }

     function payMonthlyBill(uint _totalDueInWei) public payable {
            
            require(
                msg.value == _totalDueInWei,
                "Total payment value is invalid"
            );

            Customer storage _customer = _enrolledCustomers[msg.sender];

            require(
                isCustomerValid(_customer),
                "customer not enrolled"
            );

            _customer.customerBalance += 1;

        }

     function enrollCustomer(string memory _customerName) public {
        require(isCustomerNameValid(_customerName), "Name must be informed");

        require(!isCustomerValid(getEnrolledCustomerByAdress(msg.sender)), "This address has already been registered as a customer");

        Customer memory customer;
        customer.customerName = _customerName;
        customer.customerBalance = 0;

        assert(isCustomerValid(customer));

        _enrolledCustomers[msg.sender] = customer;
     }

     function getEnrolledCustomerByAdress(address _customerAdress) public view returns(Customer memory) {
        return _enrolledCustomers[_customerAdress];
     }

     function isCustomerValid(Customer memory _customer) private pure returns(bool) {
        return isCustomerBalanceValid(_customer.customerBalance) && isCustomerNameValid(_customer.customerName);
     }

     function isCustomerNameValid(string memory _customerName) private pure returns(bool) {
        bytes memory tempString = bytes(_customerName);

        return tempString.length > 0;
     }

     function isCustomerBalanceValid(uint _customerBalance) private pure returns(bool) {
        return _customerBalance >= 0;
     }
}