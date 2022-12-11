pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./Credit.sol";

contract Exchange {
    struct User {
        address payable _address;
        uint256 balance;
        bool hasCredit;
    }

    // maps address of a user to the other addresses they owe money
    // mapping(address => address[]) owesMoneyTo;
    mapping(address => User) userMapping;
    User[] userArray;
    Credit[] creditArray;

    constructor() public {
        address payable user1 = 0x146cfF2D2Ea61CeC81066cd3c40A9565CC70c3dA;
        address payable user2 = 0xC54F7Bf6B56c46C53d624e1269a293AF0aEe57dd;
        address payable user3 = 0x5d8D2f6fc8FDdF68e8961e027B2f3412cc21D751;

        createUser(100, user1);
        createUser(50, user2);
        createUser(75, user3);

        createCredit(user1, user2, 20, 1, block.timestamp + 10000);
        createCredit(user2, user3, 15, 2, block.timestamp + 20000);
    }

    event UserCreated(address _address, uint256 balance, bool hasCredit);

    event LogTransfer(address borrower, address lender, uint256 amt);

    event CreditCreated(
        address borrower,
        address lender,
        uint256 amount,
        uint256 interest,
        uint256 dateCreated
    );

    function removeFromCreditArr(uint index) internal {
        require(index < creditArray.length);
        creditArray[index] = creditArray[creditArray.length-1];
        creditArray.pop();
    }

    function createUser(uint256 _balance, address payable _address) public {
        User memory tempUser = User(_address, _balance, false);
        userMapping[_address] = tempUser;
        userArray.push(tempUser);
        emit UserCreated(_address, _balance, false);
    }

    function createUser(uint256 _balance) public {
        address payable sender = payable(msg.sender);
        User memory tempUser = User(sender, _balance, false);
        userMapping[msg.sender] = tempUser;
        userArray.push(tempUser);
        emit UserCreated(msg.sender, _balance, false);
    }

    function createCredit(
        address borrower,
        address lender,
        uint256 amount,
        uint256 interest,
        uint256 repaymentDate
    ) public {
        User memory borrowerUser = userMapping[borrower];
        User memory lenderUser = userMapping[lender];

        require(borrowerUser.hasCredit == false);
        require(lenderUser.balance >= amount);

        uint256 currentDate = block.timestamp;

        Credit credit = new Credit();
        credit.initializeCredit(
            borrower,
            lender,
            amount,
            interest,
            currentDate,
            repaymentDate
        );
        creditArray.push(credit);

        emit CreditCreated(borrower, lender, amount, interest, currentDate);

        transfer(borrower, lender, amount);
    }

    // needs to repay in full, no installments
    // havent implemented interest functionality yet. just repaying in full
    function repay(address borrower, address lender) public {
        User memory borrowerUser = userMapping[borrower];

        require(borrowerUser.hasCredit == true);

        Credit credit;
        bool foundInCreditArray = false;
        uint index = 0;
        Credit tempCredit;
        // uint arraySize = sizeof(creditArray) / sizeof(creditArray[0]);

        for (uint i=0; i < creditArray.length; i++) {
            tempCredit = creditArray[i];
            if (tempCredit.getBorrower() == borrower && tempCredit.getLender() == lender) {
                credit = creditArray[i];
                foundInCreditArray = true;
                index = i;
                break;
            }
        }

        require(foundInCreditArray == true);
        require(borrowerUser.balance >= credit.getAmount());

        transfer(borrower, lender, credit.getAmount());
        removeFromCreditArr(index);
    }

    // transfer funds
    function transfer(
        address _sender,
        address _receiver,
        uint256 amt
    ) private {
        User memory sender = userMapping[_sender];
        User memory receiver = userMapping[_receiver];

        receiver.balance -= amt;

        sender.balance += amt;
        sender.hasCredit = true;

        userMapping[_sender] = sender;
        userMapping[_receiver] = receiver;

        emit LogTransfer(_sender, _receiver, amt);
    }

    function getCreditArray() public view returns(Credit[] memory) {
        return creditArray;
    }

    function getUsers() public view returns (User[] memory) {
        return userArray;
    }
}
