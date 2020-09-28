/**
 * @title UpgradeExample
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Example upgrade.
*/
pragma solidity 0.5.12;

import "../WOMToken.sol";

contract UpgradeExample is WOMToken {

    bool public newBool;
    bool public initializedV1;

    function init(bool _newBool) public {
        require(!initializedV1, "UpgradeExample: already initialized");
        newBool = _newBool;
        initializedV1 = true;
    }
}