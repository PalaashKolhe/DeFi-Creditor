pragma solidity >=0.4.22 <0.9.0;

contract Lending {
    struct User {
        address _address;
        uint256 balance;
        uint256 amtLent;
        uint256 amtBorrowed;
        bool hasCredit;
    }

    // maps address of a user to the other addresses they owe money
    mapping (address => address[]) owesMoneyTo;
    User[] userArray;

    constructor() public {}

    function createUser(uint256 _balance, address _address) public {
        userArray.push(User(_address, _balance, 0, 0, false));
    }

    function createUser(uint256 _balance) public {
        userArray.push(User(msg.sender, _balance, 0, 0, false));
    }


}
