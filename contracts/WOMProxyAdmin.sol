/**
 * @title WOMProxyAdmin
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Proxy admin contract.
*/
pragma solidity >=0.6.0;

import '@openzeppelin/contracts/proxy/ProxyAdmin.sol';


contract WOMProxyAdmin is ProxyAdmin {
    constructor() public ProxyAdmin() {
    }
}