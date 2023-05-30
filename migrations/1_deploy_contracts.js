const CMTAT_PROXY = artifacts.require("CMTAT_PROXY")
const { deployProxy } = require("@openzeppelin/truffle-upgrades")
const { ZERO_ADDRESS } = require("ethereumjs-util")

module.exports = async function (deployer) {
  const flag = 5
	console.log(
		{
			deployer: deployer,
			initializer: "initialize",
			constructorArgs: [
				"0x73E3552Cdbe9F4F38A1dDf1262b87Aa208d2225C",
				"Test CMTA Token",
				"TCMTAT",
				"TCMTAT_ISIN",
				"https://cmta.ch",
				ZERO_ADDRESS,
				"TCMTAT_info",
				flag,
			]
		}
	)
  const proxyContract = await deployProxy(
    CMTAT_PROXY,
    [ZERO_ADDRESS],
		{
			deployer: deployer,
			initializer: "initialize",
			constructorArgs: [
				"0x73E3552Cdbe9F4F38A1dDf1262b87Aa208d2225C",
				"Test CMTA Token",
				"TCMTAT",
				"TCMTAT_ISIN",
				"https://cmta.ch",
				ZERO_ADDRESS,
				"TCMTAT_info",
				flag,
			]
		}
  );
  await proxyContract.deployed()
  console.log("Proxy deployed at: ", proxyContract.address)
}
