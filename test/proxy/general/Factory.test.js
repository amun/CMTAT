const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('Proxy - Factory', function () {
  let admin, attacker, cmtatImplementation, cmtatFactory, deployedCMTAT, deployedFactory, CMTATData

  beforeEach(async function () {
    [admin, attacker] = await ethers.getSigners()

    cmtatImplementation = await ethers.getContractFactory('CMTAT_BASE')
    cmtatFactory = await ethers.getContractFactory('CMTAT_FACTORY')

    deployedCMTAT = await cmtatImplementation.deploy()
    deployedFactory = await cmtatFactory.deploy(
      deployedCMTAT,
      admin,
      { from: admin }
    )

    CMTATData = [
      admin,
      'CMTA Token',
      'CMTAT',
      18,
      'CMTAT_ISIN',
      'https://cmta.ch',
      'CMTAT_info',
      5
    ]
  })

  context('Deploy CMTAT from Factory', function () {
    it('testCannotBeDeployedByAttacker', async function () {
      expect(
        deployedFactory.connect(attacker).deployCMTAT(
          ethers.encodeBytes32String('test'),
          admin.address,
          CMTATData
        )
      ).to.be.revertedWith('AccessControl')
    })

    it('testCannotDeployCMTATWithFactoryWithSaltAlreadyUsed', async function () {
      const salt = ethers.encodeBytes32String('test')

      await deployedFactory.connect(admin).deployCMTAT(
        salt,
        admin,
        CMTATData
      )

      await expect(
        deployedFactory.connect(admin).deployCMTAT(
          salt,
          admin.address,
          CMTATData
        )
      ).to.be.revertedWithCustomError(
        cmtatFactory,
        'CMTAT_Factory_SaltAlreadyUsed'
      )
    })

    it('testCanDeployCMTATsWithFactory', async function () {
      const salt0 = ethers.encodeBytes32String('test0')
      const salt1 = ethers.encodeBytes32String('test1')

      let computedCMTATAddress = await deployedFactory.connect(admin).computeProxyAddress(
        salt0,
        admin.address,
        CMTATData
      )
      await deployedFactory.connect(admin).deployCMTAT(
        salt0,
        admin,
        CMTATData
      )

      const proxy0 = await deployedFactory.connect(admin).cmtats(0)
      expect(proxy0).to.be.equal(computedCMTATAddress)

      computedCMTATAddress = await deployedFactory.connect(admin).computeProxyAddress(
        salt1,
        admin,
        CMTATData
      )
      await deployedFactory.connect(admin).deployCMTAT(
        salt1,
        admin,
        CMTATData
      )

      const proxy1 = await deployedFactory.connect(admin).cmtats(1)
      expect(proxy1).to.be.equal(computedCMTATAddress)
    })

    it('testEmitCMTATDeployedEvent', async function () {
      await expect(
        await deployedFactory.connect(admin).deployCMTAT(
          ethers.encodeBytes32String('test'),
          admin,
          CMTATData
        )
      ).to.emit(
        await deployedFactory.connect(admin), 'CMTATdeployed'
      ).withArgs(
        await deployedFactory.connect(admin).cmtats(0), 0
      )
    })
  })
})
