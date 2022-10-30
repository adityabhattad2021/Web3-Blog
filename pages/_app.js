import '../styles/globals.css'
import { Web3Modal } from '@web3modal/react'
import { chains, providers } from "@web3modal/ethereum";




const config = {
  projectId:process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  theme: "dark",
  accentColor: "teal",
  ethereum: {
    appName: 'web3Modal',
    chains: [
      chains.localhost,chains.goerli
    ],
    providers: [
      providers.walletConnectProvider({projectId:process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID})
    ],
    autoConnect: true
  }
};


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Web3Modal config={config} />
    </>
  )
}

export default MyApp
