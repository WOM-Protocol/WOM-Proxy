/**
 * @title WOMProxyAdmin
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Proxy admin contract.
*/
pragma solidity 0.5.12;

import '@openzeppelin/upgrades/contracts/upgradeability/ProxyAdmin.sol';


contract WOMProxyAdmin is ProxyAdmin {
    constructor() public ProxyAdmin() {
    }
}