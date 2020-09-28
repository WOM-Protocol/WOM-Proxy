pragma solidity 0.5.12;

import "./helpers/Ownable.sol";
import "./helpers/StandardToken.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

interface tokenRecipient { 
    function receiveApproval(address _from, uint256 _value, bytes calldata _extraData) external;
}

contract WOMToken is StandardToken, Ownable, Initializable {

    string public name = "WOM Token";
    string public symbol = "WOM";
    uint public decimals = 18;
    // there is no problem in using * here instead of .mul()
    uint256 public initialSupply = 1000000000 * (10 ** uint256(decimals));

    // initialize instead of contructor, to ensure data inside of proxy.
    function initialize() public initializer {
        name = "WOM Token";
        symbol = "WOM";
        decimals = 18;
        initialSupply = 1000000000 * (10 ** uint256(decimals));
        totalSupply = initialSupply;
        balances[msg.sender] = initialSupply; // Send all tokens to owner
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    // this function allows one step transfer to contract
    function approveAndCall(address _spender, uint256 _value, bytes calldata _extraData)
        external
        returns (bool success) 
    {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, _extraData);
            return true;
        }
    }

    function batchTransfer(address[] memory _to, uint256[] memory _value) 
        public
    {
        require(_to.length <= 256, 'WOMToken: batch is greater than limit');
        require(_to.length == _value.length, 'WOMToken: batch length not equal');
        for (uint256 i = 0; i < _to.length; i++) {
            transfer(_to[i], _value[i]);
        }
    }


    // the below function allows admin to transfer out any 
    // mistakenly sent ERC20 Tokens to `address(this)` 
    // (the address of this smart contract)
    function transferAnyERC20Token(address _tokenAddr, address _toAddr, uint _tokenAmount) public onlyOwner {
      ERC20(_tokenAddr).transfer(_toAddr, _tokenAmount);
    }
}