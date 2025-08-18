// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    //we will use counter utility to track our token
    //counter utility will track the token by token Id.

    //structure of Counter
    using Counters for Counters.Counter; //instance
    Counters.Counter private _tokenIds;   //variable 

    //When we will deploy NFT Marketplace we will have needed this NFT contract Address.
    address contractAddress;

    //when we will deploy NFT Marketplace we have to use this address/initialize
    constructor (address marketplaceAddress) ERC721 ("creativeNFT", "CNF") {
        contractAddress = marketplaceAddress; 
        //contractAddress will be define as marketplaceaddress. 
        //we are just communicating with 2 contracts here.
    }

     //mint new Token. we are creating NFT through it.
        function createToken (string memory tokenURI) public returns (uint) {
            _tokenIds.increment(); // Increment the token ID counter

            //get the new tokenID
            uint256 newItemId = _tokenIds.current();

            //mint
            _mint (msg.sender, newItemId);

            _setTokenURI (newItemId, tokenURI);

            //approval for, can markrtplace transfer the token?
            setApprovalForAll(contractAddress, true);

            return newItemId;
        }
   
}

// nft address: 0xabd84f319f50d4354665764cdd95f614ac4590aa