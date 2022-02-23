//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "hardhat/console.sol";


contract StakeNFT is IERC721Receiver, Ownable {
    IERC721 private _collection;
    mapping(uint256 => address) private _owners;
    mapping(uint256 => address[]) private _accessApprovals;


    constructor(IERC721 collection) {

        _collection = collection;
    }

    function onERC721Received( address operator, address from, uint256 tokenId, bytes calldata data ) public override returns (bytes4) {
        require(address(_collection) == _msgSender());
        _stakeNft(tokenId, from);
        return this.onERC721Received.selector;
    }

    function _stakeNft(uint256 tokenId, address owner) internal {
        _owners[tokenId] = owner;
    }

    function unstakeNft(uint256 tokenId) public {
        require(_msgSender() == _owners[tokenId]);
        _owners[tokenId] = address(0);
        delete _accessApprovals[tokenId];
        _collection.safeTransferFrom(address(this),_msgSender(),tokenId);
    }

    function ownerOf(uint256 tokenId) public view returns (address){
        return _owners[tokenId];
    }

    function grantAccess(uint256 tokenId, address accessor) public {
        require(_msgSender() == _owners[tokenId]);
        require(!canAccess(tokenId, accessor), "Provided address already has access.");
        _accessApprovals[tokenId].push(accessor);
    }

    function revokeAccess(uint256 tokenId, address accessor) public {
        require(_msgSender() == _owners[tokenId]);
        for (uint i=0; i<_accessApprovals[tokenId].length; i++) {
            if (_accessApprovals[tokenId][i] == accessor){
                _accessApprovals[tokenId][i] = _accessApprovals[tokenId][_accessApprovals[tokenId].length-1];
                _accessApprovals[tokenId].pop();
                break;
            }
        }
    }

    function getAccess(uint256 tokenId) public view returns (address[] memory){
        //TODO: FIND A GOOD WAY TO DELETE ACCESS/GET ACCESSORS
        return _accessApprovals[tokenId];
    }

    function canAccess(uint256 tokenId, address accessor) public view returns (bool) {
        for (uint i=0; i<_accessApprovals[tokenId].length; i++) {
            if (_accessApprovals[tokenId][i] == accessor){
                return true;
            }
        }
        return accessor == _owners[tokenId];
    }

    function allowAccess(uint256 tokenId) public view returns (bool){
        return canAccess(tokenId, _msgSender());
    }

}
//Multiple designs possible. Can make as staking, or new ERC721 type.
//Need to require it is from right contract
