import {ethers} from "ethers";
import {
    nftAddress,
    nftMarketAddress,
    nftABI,
    marketplaceABI,
} from "../constants";

export function getProviderOrSigner (needSigner = false) {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.provider.Web3Provider(window.ethereum);

        if (needSigner) {
            return provider.getSigner;
        }

        return provider;
    }

    throw new Error ("Please install MetaMask to interact with us.")
}

export function getNFTContract (needSigner = false) {
    const providerOrSigner = getProviderOrSigner(needSigner);
    return new ethers.Contract (nftAddress, nftABI, providerOrSigner);
}

export function getMarketContract (needSigner = false) {
    const providerOrSigner = getProviderOrSigner(needSigner);
    return new ethers.Contract(nftAddress, nftABI, providerOrSigner);
}