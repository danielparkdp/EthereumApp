pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Azuki is ERC721, ERC721Enumerable, Ownable {


    constructor() ERC721("Azuki", "ZUKI") {
    }

    function mint(uint numberOfTokens) public payable {
        uint256 ts = totalSupply();

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, ts + i);
        }
    }
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
