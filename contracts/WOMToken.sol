/**
 * @title WOMToken
 * @author WOM Protocol <info@womprotocol.io>
 * @dev Basic ERC20 token compatible with upgradability proxy contracts.
*/

pragma solidity >=0.6.0;

import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";


contract WOMToken is ERC20UpgradeSafe, OwnableUpgradeSafe {

    uint256 public constant BATCH_LIMIT = 255;

    /**
    * @dev Version 1 initialization function required for setting owner.
    */
    function initialize()
        public
        initializer
    {
        __Ownable_init_unchained();
        __ERC20_init_unchained("WOM Token", "WOM");
        _mint(msg.sender, 1000000000 * (10 ** uint256(decimals())));
    }

    /**
    * @dev Batch call transfer funds by calling public transfer function.
    * @param recipients Receiving address of the funds
    * @param amounts Amount of funds to transfer.
    */
    function batchTransfer(address[] memory recipients, uint256[] memory amounts) 
        public
    {
        require(recipients.length == amounts.length, 'WOMToken: batch length not equal');
        require(recipients.length <= BATCH_LIMIT, 'WOMToken: batch is greater than limit');
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }

    /**
    * @dev Called by owner for transferring any tokens controlled by this contract.
    * @param token Interface instance of token.
    * @param recipient Receiving address of the funds.
    * @param amount Amount of funds to transfer.
    */
    function transferFallBackToken(IERC20 token, address recipient, uint256 amount) 
        public 
        onlyOwner
    {
        token.transfer(recipient, amount);
    }
}