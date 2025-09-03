import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import NFTCard from "@/components/NFTCard";
import { getMarketContract, getNFTContract } from "@/utils/getNFTContract";

export default function Home () {
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
}