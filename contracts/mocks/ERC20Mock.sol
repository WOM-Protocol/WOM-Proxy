/**
 * @title ERC20Mcok
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Basic ERC20 token.
*/

pragma solidity >=0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";


contract ERC20Mock is ERC20UpgradeSafe {

    function mint(uint256 value) 
        public
    {
        _mint(msg.sender, value);
    }
}
