// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";

//ReentrancyGuard is used to prevent double spending problem.
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    //track itemId
    Counters.Counter private _itemIds;

    //tracking item is sold or not.
    Counters.Counter private _itemsSold;

    //declare owner who will receive the listing fee.
    address payable owner;

    //declare charge for listing
    uint256 ListingPrice = 0.025 ether;

    constructor () {
        owner = payable (msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable  seller;
        address payable owner;
        uint256 price;
        bool sold;
    }   

    mapping (uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated (
        uint256 indexed itemId, 
        address indexed nftContract, 
        uint256 indexed tokenId, 
        address seller, 
        address owner , 
        uint256 price , 
        bool sold
    );

    function getListingPrice () public view returns (uint256) {
        return ListingPrice;
    }
    
    //this createMarketItem function will be received by ethereum/cryptocurrency. 
    //nonReentrant is a builtin modifier by openzeeplin.
    function createMarketItem (address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant{

        require(price > 0, "price must be at least 1 wei");
        require(msg.value == ListingPrice, "price must be equal to ListingPrice");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        //create MarketItem
        idToMarketItem[itemId] = MarketItem (
            itemId,
            nftContract,
            tokenId,
            payable (msg.sender),
            payable (address(0)),
            price,
            false
        );

        //now this item need to transfer to our Marketplace contract for faster selling.
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated (itemId , nftContract ,tokenId, msg.sender, address(0) , price  ,false );
    }

    //function for selling item
    function createMarketSale (address nftContract, uint256 itemId) public payable nonReentrant {
        //get item price
        uint256 price = idToMarketItem[itemId].price;

        //get tokenId.
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        //check, is buyer paying the right price.
        require(msg.value == price, "Please pay the right amount");

        //amount transfer to seller
        idToMarketItem[itemId].seller.transfer(msg.value);

        //transfer NFT to buyer
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        //update ownership
        idToMarketItem[itemId].owner = payable (msg.sender);

        //mark the item is sold
        idToMarketItem[itemId].sold = true;

        //track the number of sold item
        _itemsSold.increment();

        //pay the listing fee to Marketplace owner
        payable(owner).transfer(ListingPrice);
    }

    //function to fetch MarketItem
    function fetchMarketItem() public view returns (MarketItem [] memory ) {
        uint256 itemCount = _itemIds.current(); //total item ever listed.

        //unsoldItemCount is computed by subtracting
        uint256 unsoldItemCount =  _itemIds.current() - _itemsSold.current();

        //Used to keep track of the position in the result array where we'll store the next unsold item.
        uint256 currentIndex = 0;

        //A temporary array in memory to store unsold items.
        //new array Size is exactly equal to the number of unsold items.
        MarketItem [] memory items = new MarketItem[] (unsoldItemCount);


        //Go through each item that has been created.
        for (uint i = 0; i < itemCount; i++) {
           
           //unsold item have no owner yet .So owner == address(0) means it is still listed here.
            if (idToMarketItem[i + 1].owner == address(0)) {
                 //MarketItem Ids start from 1, so we offset i by 1.
                uint256 currentId = i + 1;

                //storage is used here to reference the stored item directly (more gas-efficient than copying)
                MarketItem storage currentItem = idToMarketItem[currentId];

                //Add this unsold item to our memory array.
                items[currentIndex] = currentItem;

                //Move to the next position for the next unsold item.
                currentIndex += 1;
            }
            
            
        }

        return items;
    }

    
    //function to fetch my NFT , The NFT I am owning.
    function fetchMyNFT () public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current(); //total item ever listed.

        //Counter to store how many NFTs belong to the current user.
        uint256 itemCount = 0;

        //Used to insert items into the final array.
        uint256 currentIndex = 0;

        //Loop over each NFT in the marketplace.
        for (uint256 i = 0; i < totalItemCount; i++) {

            //if the owner of the NFT is the user calling the function (msg.sender), increment itemCount. 
            if (idToMarketItem[i + 1].owner == msg.sender) {

                //Because your item IDs start from 1, not 0.
                itemCount += 1;
            }
        }

        //Creates a temporary memory array, sized to the number of NFTs that belong to the user.
        MarketItem[] memory items = new MarketItem[](itemCount);

        //Loops again through all items.
        for (uint256 i = 0; i < totalItemCount; i++) {
            //If the current item belongs to the user
            if (idToMarketItem[i + 1].owner == msg.sender) {
                //Get its ID
                uint256 currentId = i + 1;
                
                //Get its data from storage
                MarketItem storage currentItem = idToMarketItem[currentId];

                //Put it into the next available slot in the items array
                items[currentIndex] = currentItem;

                //Increment the currentIndex
                currentIndex += 1;
            }
        }

        //The function returns the array of MarketItem structs that belong to the user.
        return items;
    }

   //We want to see/show the items we have created
    function fetchItemCreated () public view returns (MarketItem[] memory) {
        //total item ever listed
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        //Loop through all items (i from 0 to total count)
        for (uint256 i = 0; i < totalItemCount; i++) {
            //Check if the seller of each item is equal to the caller (msg.sender)
            if (idToMarketItem[i + 1].seller == msg.sender) {
                //If yes, increment itemCount
                itemCount = i + 1;
            }
        }

        //Creates a temporary memory array, sized to the number of NFTs that belong to the seller.
        MarketItem[] memory items = new MarketItem[] (itemCount); 

        //We loop again through the total items.
        //For each item created by the seller
        for (uint256 i = 0; i < totalItemCount; i++) {
            //If the current item belongs to the seller
            if (idToMarketItem[i + 1].seller == msg.sender) {
                //get the Id
                uint256 currentId = i + 1;
                //Load the item from storage.
                MarketItem storage currentItem = idToMarketItem[currentId];
                //Put it into the next available slot in the items array
                items[currentIndex] = currentItem;
                //Increment currentIndex to move to the next slot.
                currentIndex += 1;
            }
        }

        return items;
    }
    
}

// nft marketplace address:  0x1018cae29c36d60f58b337ee3f2aa3a3cef9d9b6
