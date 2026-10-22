"use client";
import React, { FC, useMemo } from "react";
import {
    ConnectionProvider as RawConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import {
    WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
// // Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// --- Type workaround -----------------------------------------------
// The installed @solana/wallet-adapter-react package's type for
// ConnectionProvider is incompatible with React 18's stricter JSX
// types (the "children" property mismatch on ReactPortal). Casting
// it to a permissive component signature lets it be used in JSX.
type ConnectionProviderProps = {
    endpoint: string;
    children?: React.ReactNode;
};
type ConnectionProviderComponent = (
    props: ConnectionProviderProps
) => React.ReactElement;
const ConnectionProvider =
    RawConnectionProvider as unknown as ConnectionProviderComponent;
// -------------------------------------------------------------------

interface Props {
    children?: React.ReactNode
}
export const SolanaWallet: FC<Props> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
