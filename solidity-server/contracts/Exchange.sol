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
        address payable user1 = 0xC6CB3865420875B759c1168cB12a12D1a994fcb5;
        address payable user2 = 0x87acE434aa3e78E8E511F81aFbbB23bb8b3CB842;
        address payable user3 = 0xecefDab55cB0A51072385659339DDA31e4D68A33;
        address payable user4 = 0x5Caf92ACD39FfF3965a3E1Dd3E7791895205aa00;

        createUser(100, user1);
        createUser(50, user2);
        createUser(75, user3);
        createUser(100, user4);

        createRequestCredit(user1, 1, 1, block.timestamp + 10000);
        createRequestCredit(user2, 2, 2, block.timestamp + 20000);
        createRequestCredit(user3, 13, 2, block.timestamp + 20000);
        createRequestCredit(user4, 5, 2, block.timestamp + 20000);
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

    event LendRequestCreated(
        address borrower,
        uint256 amount,
        uint256 interest,
        uint256 dateCreated
    );

    function removeFromCreditArr(uint256 index) internal {
        require(index < creditArray.length);
        creditArray[index] = creditArray[creditArray.length - 1];
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

    // function createCredit(
    //     address borrower,
    //     address lender,
    //     uint256 amount,
    //     uint256 interest,
    //     uint256 repaymentDate
    // ) public {
    //     User memory borrowerUser = userMapping[borrower];
    //     User memory lenderUser = userMapping[lender];

    //     require(borrowerUser.hasCredit == false);
    //     require(lenderUser.balance >= amount);

    //     uint256 currentDate = block.timestamp;

    //     Credit credit = new Credit();
    //     credit.initializeCredit(
    //         borrower,
    //         lender,
    //         amount,
    //         interest,
    //         currentDate,
    //         repaymentDate
    //     );
    //     creditArray.push(credit);

    //     emit CreditCreated(borrower, lender, amount, interest, currentDate);

    //     transfer(borrower, lender, amount);
    // }

    function setLenderForCredit(
        address payable lenderAddress,
        address borrowerAddress
    ) public {
        bool found = false;
        for (uint256 i = 0; i < userArray.length; i++) {
            if (userArray[i]._address == lenderAddress) {
                found = true;
                break;
            }
        }
        if (!found) {
            createUser(100, lenderAddress);
        }

        for (uint256 i = 0; i < creditArray.length; i++) {
            Credit credit = creditArray[i];
            if (credit.getBorrower() == borrowerAddress) {
                credit.setLender(lenderAddress);
                emit CreditCreated(
                    borrowerAddress,
                    lenderAddress,
                    credit.getAmount(),
                    credit.getInterest(),
                    credit.getDateCreated()
                );
                break;
            }
        }
    }

    function createRequestCredit(
        address borrower,
        uint256 amount,
        uint256 interest,
        uint256 repaymentDate
    ) public {
        User memory borrowerUser = userMapping[borrower];

        require(borrowerUser.hasCredit == false);

        uint256 currentDate = block.timestamp;

        Credit credit = new Credit();
        credit.initializeCredit(
            borrower,
            address(0),
            amount,
            interest,
            currentDate,
            repaymentDate
        );
        creditArray.push(credit);

        emit LendRequestCreated(borrower, amount, interest, currentDate);
    }

    // needs to repay in full, no installments
    // havent implemented interest functionality yet. just repaying in full
    function repay(address borrower, address lender) public {
        User memory borrowerUser = userMapping[borrower];

        require(borrowerUser.hasCredit == true);

        Credit credit;
        bool foundInCreditArray = false;
        uint256 index = 0;
        Credit tempCredit;
        // uint arraySize = sizeof(creditArray) / sizeof(creditArray[0]);

        for (uint256 i = 0; i < creditArray.length; i++) {
            tempCredit = creditArray[i];
            if (
                tempCredit.getBorrower() == borrower &&
                tempCredit.getLender() == lender
            ) {
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

    function getCreditArray() public view returns (Credit[] memory) {
        return creditArray;
    }

    function getUsers() public view returns (User[] memory) {
        return userArray;
    }
}
