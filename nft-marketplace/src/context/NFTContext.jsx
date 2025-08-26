import React, { Children, createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal form "web3Modal";
import { getMarketContract, getNFTContract } from "@/utils/getNFTContract";

export const NFTContext = createContext();

export const NFTprovider = ({ Children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return ("Please install metamask");

        try {
            const accounts = await window.ethereum.request ({
                method: "eth_accounts"
            })

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }else {
                console.log("No accounts found");  
            }

        } catch (error) {
            console.log("Error checking wallet connection", error);
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) return alert ("Please install MetaMask");

        try {
            setIsLoading(true);

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })
            setCurrentAccount(accounts[0]);
            setIsLoading(false);

        } catch (error) {
            console.log("error connecting wallet", error);
            setIsLoading(false);
        }
    };

    useEffect (() => {
        checkIfWalletIsConnected();

        const handleAccountChange = (accounts) => {
            if (accounts.length > 0) {
                setCurrentAccount (accounts[0]);
            } else {
                setCurrentAccount ("");
            }
        };

        if (window.ethereum) {
            window.ethereum.on ("accountsChanged", handleAccountChange);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener ("accountsChanged", handleAccountChange);
            }
        }
    }, []);
};

return (
    <NFTContext.Provider
        value={{
            currentAccount,
            connectWallet,
            isLoading,
        }}
    >
        {Children}
    </NFTContext.Provider>
);