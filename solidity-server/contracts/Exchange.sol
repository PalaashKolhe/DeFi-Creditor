pragma solidity >=0.4.22 <0.9.0;

import "./Credit.sol";

contract Exchange {
    struct User {
        address _address;
        uint256 balance;
        bool hasCredit;
    }

    // maps address of a user to the other addresses they owe money
    // mapping(address => address[]) owesMoneyTo;
    mapping(address => User) userMapping;
    Credit[] creditArray;

    constructor() public {}

    event UserCreated(address _address, uint256 balance, bool hasCredit);

    event LogTransfer(address borrower, address lender, uint256 amt);

    event CreditCreated(
        address borrower,
        address lender,
        uint256 amount,
        uint256 interest,
        uint256 dateCreated
    );

    event CreditNotFound

    function createUser(uint256 _balance, address _address) public {
        userMapping[_address] = User(_address, _balance, false);
        emit UserCreated(_address, _balance, false);
    }

    function createUser(uint256 _balance) public {
        userMapping[msg.sender] = User(msg.sender, _balance, false);
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

        Credit credit = new Credit(
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

        Credit curr;
        bool foundInCreditArray = false;
        // uint arraySize = sizeof(creditArray) / sizeof(creditArray[0]);

        for (uint i=0; i < creditArray.length; i++) {
            if (creditArray[i].borrower == borrower && creditArray[i].lender == lender) {
                curr = creditArray[i];
                foundInCreditArray = true;
                break;
            }
        }

        require(foundInCreditArray == true);







        // give every lender their money back. iterate through credit array
        // uint bArraySize = sizeof(borrowerCredits) / sizeof(borrowerCredits[0]);
        // uint ctr = 0;
        // while (amount > 0 && ctr < bArraySize) {
        //     Credit cur = borrowerCredits[ctr];

        //     if (cur.cred)
            
        //     ctr++;
        // }


    }

    // transfer funds
    function transfer(
        address _borrower,
        address _lender,
        uint256 amt
    ) private {
        User memory borrower = userMapping[_borrower];
        User memory lender = userMapping[_lender];

        lender.balance -= amt;

        borrower.balance += amt;
        borrower.hasCredit = true;

        userMapping[_borrower] = borrower;
        userMapping[_lender] = lender;

        // keep track of who borrower owes money to
        owesMoneyTo[_borrower].push(_lender);

        emit LogTransfer(_borrower, _lender, amt);
    }
}
