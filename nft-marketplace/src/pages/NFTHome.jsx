import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import NFTCard from "@/components/NFTCard";
import { getMarketContract, getNFTContract } from "@/utils/getNFTContract";

export default function NFTHome () {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState("Not-loaded");

    useEffect (() => {
        loadNFTs ();
    },[]);

    async function loadNFTs() {
        try {
            const marketContract = getMarketContract ();
            const tokenContract = getNFTContract ();
            const data = await marketContract.fetchMarketItems ();

            const items = await Promise.all (data.map (async i=> {
                const tokenUri = await tokenContract.tokenURI (i.tokenId);
                const meta = await axios.get (tokenUri);
                let price = ethers.utils.formatUnits (i.price.toString(), "ether");

                let item = {
                    tokenId: i.tokenId.toNumber (),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.data.image,
                    name: meta.data.name,
                    description: meta.data.description
                }
                return item;
            }));

            setNfts(items);
            setLoadingState("loaded");
        } catch (error) {
            console.error("error loading NFTs: ", error);
            setLoadingState("error");   
        }
    }

    async function buyNft(nft) {
        try {
            const marketContract = getMarketContract (true);
            const price = nft.price;

            const transaction = await marketContract.createMarketSale(nft.tokenId, {
                value: price,
            });

            await transaction.wait();
            loadNFTs();

        } catch (error) {
            console.error("Error buyinf NFT ", error);    
        }
    }

    if (loadingState === "loading") {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl">
                    Loading NFTs...
                </p>
            </div>
        )
    }

    if (loadingState === 'loaded' && !nfts.length) {
        return (
            <div className="flex flex-col justify-center items-center h-64">
                <h1 className="text-3xl font-bold mb-4s">
                    No items in marketplace
                </h1>
                <p>
                    Be the first to mint
                </p>
                
            </div>
        )
    }
}