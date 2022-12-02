pragma solidity >=0.4.22 <0.9.0;

// each credit contract is created uniquely for each user
contract Credit {
    address borrower;
    address lender;
    uint256 amount;
    uint256 interest;
    uint dateCreated;
    uint repaymentDate;

    // when repaid this contract will be terminated
    bool repaid = false;

    constructor(
        address _borrower,
        address _lender,
        uint256 _amount,
        uint256 _interest,
        uint _dateCreated,
        uint _repaymentDate 
    ) public {
        borrower = _borrower;
        lender = _lender;
        amount = _amount;
        interest = _interest;
        dateCreated = _dateCreated;
        repaymentDate = _repaymentDate;
    }
}
