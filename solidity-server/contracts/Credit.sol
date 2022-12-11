pragma solidity >=0.4.22 <0.9.0;

// each credit contract is created uniquely for each user
contract Credit {
    address public borrower;
    address public lender;
    uint256 public amount;
    uint256 public interest;
    uint256 public dateCreated;
    uint256 public repaymentDate;

    // when repaid this contract will be terminated
    bool repaid = false;

    constructor() public {}

    function initializeCredit(
        address _borrower,
        address _lender,
        uint256 _amount,
        uint256 _interest,
        uint256 _dateCreated,
        uint256 _repaymentDate
    ) public {
        borrower = _borrower;
        lender = _lender;
        amount = _amount;
        interest = _interest;
        dateCreated = _dateCreated;
        repaymentDate = _repaymentDate;
    }

    function getBorrower() public view returns (address) {
        return borrower;
    }

    function getLender() public view returns (address) {
        return lender;
    }

    function getAmount() public view returns (uint256) {
        return amount;
    }
}
