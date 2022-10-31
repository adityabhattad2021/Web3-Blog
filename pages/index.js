import { ethers } from "ethers";
import { Web3Button, useAccount } from "@web3modal/react";
import Link from "next/link";
import { css } from "@emotion/css";
import { contractAddress, ownerAddress } from "../config";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/router";
import { AccountContext } from "../context";
import { PostPage } from "../components";

import Blog from '../artifacts/contracts/Blog.sol/Blog.json'


export default function Home({posts}) {
	const { account } = useAccount();

	const router = useRouter();

	return (
		<div >
			<nav className={nav}>
				<div className={header}>
					<Link href="/">
						<img
							src="./logo.svg"
							alt="Web3 Blog Logo"
							style={{ width: "50px" }}
						/>
					</Link>
					<Link href="/">
						<div className={titleContainer}>
							<h2 className={title}>Decentralized Blog</h2>
							<p className={description}>WEB3</p>
						</div>
					</Link>
					{!account.isConnected && (
						<div className={buttonContainer}>
							<Web3Button />
						</div>
					)}
					{account.isConnected && (
						<p className={accountInfo}>{account.address}</p>
					)}
				</div>
				<div className={linkContainer}>
					<Link href="/" className={link}>
						Home
					</Link>
					{account.address === ownerAddress && (
						<Link href="/create-post" className={link}>
							Create Post
						</Link>
					)}
				</div>
			</nav>
			<AccountContext.Provider value={account}>
				<div className={container}>
					<PostPage posts={posts} />
				</div>
			</AccountContext.Provider>
		</div>
	);
}


export async function getServerSideProps() {
	/* here we check to see the current environment variable */
/* and render a provider based on the environment we're in */
let provider
if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
  provider = new ethers.providers.JsonRpcProvider()
} else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
	provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/3NvmRXgHgtFF3g_ZopWMQ1OPRXpeGxTW')
	// console.log("woaskdjads");
}

const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
const data = await contract.fetchPosts()
// console.log(data);
return {
  props: {
	posts: JSON.parse(JSON.stringify(data))
  }
}
}




const accountInfo = css`
	width: 100%;
	display: flex;
	flex: 1;
	justify-content: flex-end;
	font-size: 12px;
`;

const container = css`
	padding: 40px;
`;

const linkContainer = css`
	padding: 30px 60px;
	background-color: #fafafa;
`;

const nav = css`
	background-color: #white;
`;

const header = css`
	display: flex;
	border-botton: 1px solid rgba(0, 0, 0, 0.075);
	padding: 20px 30px;
`;

const description = css`
	margin: 0;
	color: #999999;
`;

const titleContainer = css`
	display: flex;
	flex-direction: column;
	padding-left: 15px;
`;

const title = css`
	margin-left: 30px;
	font-weight: 500;
	margin: 0;
`;

const buttonContainer = css`
	width: 100%;
	display: flex;
	flex: 1;
	justify-content: flex-end;
`;


const link = css`
	margin: 0px 40px 0px 0px;
	font-size: 18px;
`;


