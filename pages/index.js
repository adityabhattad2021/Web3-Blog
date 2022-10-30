
import { Web3Button, useAccount } from "@web3modal/react";
import Link from "next/link";
import { css } from "@emotion/css";
import { ownerAddress } from "../config";
import "easymde/dist/easymde.min.css";

import { useRouter } from "next/router";


import { AccountContext } from "../context";
import { PostPage } from "../components";


export default function Home() {
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
					<PostPage />
				</div>
			</AccountContext.Provider>
		</div>
	);
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


