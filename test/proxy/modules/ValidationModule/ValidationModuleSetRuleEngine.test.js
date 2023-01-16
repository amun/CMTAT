const CMTAT = artifacts.require('CMTAT')
const { deployProxy } = require('@openzeppelin/truffle-upgrades')
const ValidationModuleSetRuleEngineCommon = require('../../../common/ValidationModule/ValidationModuleSetRuleEngineCommon')
const { ZERO_ADDRESS } = require('../../../utils')
contract(
  'Proxy - ValidationModule - setRuleEngine',
  function ([_, admin, address1, fakeRuleEngine]) {
    beforeEach(async function () {
      this.cmtat = await deployProxy(CMTAT, [true, admin, 'CMTA Token', 'CMTAT', 'CMTAT_ISIN', 'https://cmta.ch', ZERO_ADDRESS], {
        initializer: 'initialize',
        constructorArgs: [_, true, admin, 'CMTA Token', 'CMTAT', 'CMTAT_ISIN', 'https://cmta.ch', ZERO_ADDRESS]
      })
    })
    ValidationModuleSetRuleEngineCommon(admin, address1, fakeRuleEngine)
  }
)
