/**
 * @title WOMProxy
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Proxies WOMToken calls and enables WOMToken upgradability.
*/
pragma solidity 0.5.12;

import '@openzeppelin/upgrades/contracts/upgradeability/AdminUpgradeabilityProxy.sol';


contract WOMTokenProxy is AdminUpgradeabilityProxy {
    constructor(address implementation, address proxyOwnerAddr, bytes memory data) public AdminUpgradeabilityProxy(implementation, proxyOwnerAddr, data) {
    }
}