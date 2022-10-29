const { network, ethers } = require("hardhat");
const fs = require("fs");

module.exports = async function ({ getNamedAccounts, deployments }) {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	log(`---------deployer is ${deployer}---------`);

	const name = "Sample Blog";
	const args = [name];
	log("-----------------------Deploying Blog-----------------------");
	const blog = await deploy("Blog", {
		from: deployer,
		args: args,
		log: true,
		waitConfirmations: network.config.blockConfirmations || 1,
	});
    log("-----------------------Deployed Successfully----------------");
    log(blog.address)

	log("---------------------Writing ABI------------------------");
	fs.writeFileSync(
        "./config.js",`
    export const contractAddress = "${blog.address}";
    export const ownerAddress = "${blog.receipt.from}";
    `);
	log("--------------------------------------------------------");
};

module.exports.tags = ["all"];
