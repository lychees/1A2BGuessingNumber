var Guess = artifacts.require("BinaryPve");
var Guess3 = artifacts.require("GuessGame3");

module.exports = function (deployer) {
    deployer.deploy(Guess);
    deployer.deploy(Guess3);
};