const { ethers } = require('hardhat')
const { expect } = require('chai')
const { ZERO_ADDRESS } = require('../../../utils.js')

describe('Deploy TP with Factory', function () {
  let admin, cmtatImplementation, cmtatFactory, cmtatImplementationAddress

  before(async function () {
    [admin] = await ethers.getSigners()

    cmtatImplementation = await ethers.getContractFactory('CMTAT_BASE')
    cmtatFactory = await ethers.getContractFactory('CMTAT_FACTORY')
  })

  beforeEach(async function () {
    cmtatImplementationAddress = await cmtatImplementation.deploy()
  })

  context('FactoryDeployment', function () {
    it('testCannotDeployIfImplementationIsZero', async function () {
      await expect(
        cmtatFactory.deploy(ZERO_ADDRESS, admin, { from: admin })
      ).to.be.revertedWithCustomError(
        cmtatFactory,
        'CMTAT_Factory_AddressZeroNotAllowedForLogicContract'
      )
    })

    it('testCannotDeployIfFactoryAdminIsZero', async function () {
      await expect(
        cmtatFactory.deploy(cmtatImplementationAddress, ZERO_ADDRESS, { from: admin })
      ).to.be.revertedWithCustomError(
        cmtatFactory,
        'CMTAT_Factory_AddressZeroNotAllowedForFactoryAdmin'
      )
    })

    it('testDeployIfArgumentsAreOK', async function () {
      await expect(
        cmtatFactory.deploy(cmtatImplementationAddress, admin, { from: admin })
      ).to.be.ok
    })
  })
}
)
