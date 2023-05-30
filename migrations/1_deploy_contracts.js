const CMTAT_PROXY = artifacts.require("CMTAT_PROXY")
const { deployProxy } = require("@openzeppelin/truffle-upgrades")
const { Address } = require("ethereumjs-util")

module.exports = async function () {
  const flag = 5
  const proxyContract = await deployProxy(
    CMTAT_PROXY,
    [Address.zero()],
		{
			initializer: "initialize",
			constructorArgs: [
				"0x73E3552Cdbe9F4F38A1dDf1262b87Aa208d2225C",
				"Test CMTA Token",
				"TCMTAT",
				"TCMTAT_ISIN",
				"https://cmta.ch",
				Address.zero(),
				"TCMTAT_info",
				flag,
			]
		}
  );
  await proxyContract.deployed()
  console.log("Proxy deployed at: ", proxyContract.address)
}
