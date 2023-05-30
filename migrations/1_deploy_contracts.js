const CMTAT_PROXY = artifacts.require("CMTAT_PROXY")
const { deployProxy } = require("@openzeppelin/truffle-upgrades")
const { Address } = require("ethereumjs-util")

module.exports = async function (deployer) {
  const flag = 0
	const ZERO_ADDRESS = Address.zero().toString()
  const proxyContract = await deployProxy(
    CMTAT_PROXY,
		[
			"0x73E3552Cdbe9F4F38A1dDf1262b87Aa208d2225C",
			"Test CMTA Token",
			"TCMTAT",
			"TCMTAT_ISIN",
			"https://cmta.ch",
			ZERO_ADDRESS,
			"TCMTAT_info",
			flag,
		],
		{
			deployer,
			constructorArgs: [ZERO_ADDRESS]
		}
  );
	await CMTAT_PROXY.deployed()
  console.log("Proxy deployed at: ", proxyContract.address)
}
