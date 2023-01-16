
const CMTAT = artifacts.require('CMTAT')
const EnforcementModuleCommon = require('../../common/EnforcementModuleCommon')
const { ZERO_ADDRESS } = require('../../utils')

contract(
  'Standard - EnforcementModule',
  function ([_, admin, address1, address2]) {
    beforeEach(async function () {
      this.cmtat = await CMTAT.new(_, false, admin, 'CMTA Token', 'CMTAT', 'CMTAT_ISIN', 'https://cmta.ch', ZERO_ADDRESS, { from: admin })
    })

    EnforcementModuleCommon(admin, address1, address2)
  })
