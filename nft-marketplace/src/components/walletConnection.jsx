import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function walletConnection () {
    const [connected, setConnected] = useState(true);
    const [account, setAccount] = useState("");

    useEffect (() => {
        checkConnection ();
        window.ethereum.on ("accountsChanged", handleAccountChange);

        return () => {
            window.ethereum.removeListener ("accountsChanged", handleAccountChange);
        };
    },[]);

    async function checkConnection() {
        if (window.ethereum) {
            const accounts  = await window.ethereum.request ({
                 method: "eth_accounts",
            });

            if (accounts.length) {
                setConnected(true);
                setAccount(account[0]);
            }

        }

        
    }

    function handleAccountChange (accounts) {
        if (accounts.length === 0) {
            setConnected(false);
            setAccount('');
        } else {
            setConnected(true);
            setAccount(accounts[0]);
        }
    }

    async function connectWallet() {
        if (window.ethereum) {
            try {
                await window.ethereum.request ({
                    method:"eth_requestAccounts",
                })
            } catch (error) {
                console.error("failed to connect wallet: ", error);
            }
        } else {
            alert ("Please install metamask to use this app");
        }
    }

    return (
        <div>
            {connected ? (
                <div>
                    <p>
                        connected: {account.substring(0.6)}...{account.substring(account,length-4)}
                    </p>
                </div>
            ) : (
                <button onClick={connectWallet}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    connect wallet
                </button>
            )}
        </div>
    )
}