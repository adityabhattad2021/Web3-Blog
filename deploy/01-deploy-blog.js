const { network, ethers } = require("hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log(`---------deployer is ${deployer}---------`);

    const name = "Sample Blog";
    const args = [name]
    log("-----------------------Deploying Blog-----------------------")
    const blog = await deploy("Blog", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });
    log("-----------------------Deployed Successfully----------------");

}

module.exports.tags = ["all"];