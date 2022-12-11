const Exchange = artifacts.require("./Exchange.sol");
const Credit = artifacts.require("./Credit.sol");

module.exports = function(deployer) {
  deployer.deploy(Exchange);
  deployer.deploy(Credit);
};
