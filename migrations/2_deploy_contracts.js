var Guess = artifacts.require("guessnumber");

module.exports = function(deployer) {
    deployer.deploy(Guess);
};