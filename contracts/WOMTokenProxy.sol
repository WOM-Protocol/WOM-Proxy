/**
 * @title WOMProxy
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Proxies WOMToken calls and enables WOMToken upgradability.
*/
pragma solidity >=0.6.0;

import '@openzeppelin/contracts/proxy/TransparentUpgradeableProxy.sol';


contract WOMTokenProxy is TransparentUpgradeableProxy {
    constructor(address implementation, address proxyOwnerAddr, bytes memory data) public TransparentUpgradeableProxy(implementation, proxyOwnerAddr, data) {
    }
}