require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.17",
	networks: {
		hardhat: {
			chainId: 1337,
			blockConfirmations:1,
		},
		localhost: {
			chainId: 1337,
			blockConfirmations:1,
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		notDeployer: {
			default: 1,
		},
	},
};
