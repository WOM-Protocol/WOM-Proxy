const { constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers')
const { ZERO_ADDRESS } = constants
const { encodeCall } = require('@openzeppelin/upgrades');

const WOMToken = artifacts.require("WOMToken")
const WOMTokenProxy = artifacts.require("WOMTokenProxy")
const WOMProxyAdmin = artifacts.require("WOMProxyAdmin")
const UpgradeExample = artifacts.require("UpgradeExample")

async function assertRevert(promise){
    try {
      await promise;
      assert.fail('Expected revert not received');
    } catch (error) {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }
}

module.exports = {
    expectEvent,
    expectRevert,
    ZERO_ADDRESS,
    encodeCall,
    assertRevert,
    WOMToken,
    WOMTokenProxy,
    WOMProxyAdmin,
    UpgradeExample
    // getAdmin,
    // getImplementation
}