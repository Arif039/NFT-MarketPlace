import Link from "next/link";
import walletConnection from "./WalletConnection";

export default function Header () {
    return (
        <nav className="border-b p-6">
            <p className="text-4xl font-bold">NFT Marketplace</p>

            <div className="flex mt-4">
                <Link href = "/">
                    <a className="mr-6 text-pink-600">Home</a>
                </Link>

                <Link href = "/create-nft">
                    <a className="mr-6 text-pink-600">Sell NFT</a>
                </Link>

                <Link href = "/my-nfts">
                    <a className="mr-6 text-pink-600">My NFTs</a>
                </Link>

                <Link href = "/creator-dashboard">
                    <a className="mr-6 text-pink-600">Dashboard</a>
                </Link>

                <div className="ml-auto"> <walletConnection/> </div>
            </div>

        </nav>
    )
}