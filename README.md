# WOM-PROXY

**Secure Token Upgradability.** Build on a solid foundation of community-vetted code, utilizing [open-zeppelin industry standards](https://github.com/OpenZeppelin/openzeppelin-contracts). 

 * [WOMProxyAdmin.sol](contracts/WOMProxyAdmin.sol) is build using OpenZeppelin [ProxyAdmin.sol](https://github.com/OpenZeppelin/openzeppelin-sdk/blob/master/packages/lib/contracts/upgradeability/ProxyAdmin.sol) contract.  This is a contract that acts as the `Proxy Admin` of the deployed [WomTokenProxy.sol](contracts/WomTokenProxy.sol) contract.  By doing this you are able to execute non-transactional view functions to obtain the `implementation()` and `admin()` which is not available without deploying the [WOMProxyAdmin.sol](contracts/WOMProxyAdmin.sol) contract.
 * [WomTokenProxy.sol](contracts/WomTokenProxy.sol) is a proxy contract that utilizes OpenZeppelin [TransparentUpgradeableProxy.sol](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/TransparentUpgradeableProxy.sol). 


## Overview

Code base has been tested 100% to ensure no unforeseen bugs, and will help the internal team understand how proxy contracts operate.  [UpgradeExample.sol](contracts/upgrade/UpgradeExample.sol) shows an example for when you upgrade your contracts, and this can be seen within the [WOMProxy.test.js](test/WOMProxy.test.js) as well.

## Running
Install packages
`npm i`

Spin up ganache-cli
`npx ganache-cli`

New terminal window run truffle test
`npx truffle test`

If you wish to run coverage
`npx truffle run coverage`

## Audit
### Included
 * [WOMToken.sol](contracts/WOMToken.sol)

### Excluded
The majority of the codebase is excluded as this relies upon [OpenZeppelin contracts](https://github.com/OpenZeppelin/openzeppelin-contracts) that have already been audited.
 * [ERC20Mock.sol](contracts/mocks/ERC20Mock.sol)
 * [Migrations.sol](contracts/Migrations.sol)
 * [WOMProxyAdmin.sol](contracts/WOMProxyAdmin.sol)
 * [WOMTokenProxy.sol](contracts/WOMTokenProxy.sol)


## Security

Please report any security issues you find to info@womprotocol.io, and good luck ¯\_(ツ)_/¯.