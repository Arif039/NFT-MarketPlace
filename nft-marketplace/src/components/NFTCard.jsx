import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";

export default function NFTCard ({nft, buyNFT}) {
    return (
        <div className="border shadow rounded-xl overflow-hidden">
            <Image 
                src={nft.image}
                alt={nft.name}
                width={350}
                height={350}
                layout="responsive" 
            />

            <div className="p-4">
                <p style={{height: "64px"}} className="text-2xl font-semibold"> 
                    {nft.name} 

                </p>

                <div style={{height: "70px", overflow: "hidden"}}>
                    <p className="text-gray-400">
                        {nft.description}
                    </p>
                </div>
            </div>

            <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                    {ethers.utils.formatUnits(nft.price, ether)} ETH
                </p>

                {
                    buyNFT && (
                        <button className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                        onClick={() => buyNFT(nft)}
                        >
                            Buy
                        </button>
                    )
                }
            </div>
        </div>
    )
}