import { css } from "@emotion/css";
import { useContext } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import { AccountContext } from "../context";

/* import contract address and contract owner address */
import { contractAddress, ownerAddress } from "../config";

import Blog from "../artifacts/contracts/Blog.sol/Blog.json";

export default function PostPage(props) {
	const { posts } = props;
	const account = useContext(AccountContext);

	const router = useRouter();
	async function navigate() {
		router.push("/create-post");
	}

	console.log(posts);

	return (
		<div>
			<div className={postList}>
				{posts &&
					posts.map((post) => (
						<Link href={`/post/${post[2]}`} key={index}>
							<div className={linkStyle}>
								<p className={postTitle}>{post[1]}</p>
								<div className={arrowContainer}>
									<img
										src="/right-arrow.svg"
										alt="right-arrow"
										className={smallArrow}
									/>
								</div>
							</div>
						</Link>
					))}
			</div>
			<div className={container}>
				{account.address === ownerAddress && (
					<button className={buttonStyle} onClick={navigate}>
						Create The First Post
						<img
							src="/right-arrow.svg"
							alt="right-arrow"
							className={arrow}
						/>
					</button>
				)}
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	const provider = new ethers.providers.JsonRpcProvider();
	console.log(provider);
	const signer = provider.getSigner();
	const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
	// console.log(contract);
	const posts = await contract.fetchPosts();
	// console.log(posts);
	return {
		props: {
			posts: JSON.parse(JSON.stringify(posts)),
		},
	};
}

const arrowContainer = css`
	display: flex;
	flex: 1;
	justify-content: flex-end;
	padding-right: 20px;
`;

const postTitle = css`
	font-size: 30px;
	font-weight: bold;
	cursor: pointer;
	margin: 0;
	padding: 20px;
`;

const linkStyle = css`
	border: 1px solid #ddd;
	margin-top: 20px;
	border-radius: 8px;
	display: flex;
`;

const postList = css`
	width: 700px;
	margin: 0 auto;
	padding-top: 50px;
`;

const container = css`
	display: flex;
	justify-content: center;
`;

const buttonStyle = css`
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 100px;
	background-color: #fafafa;
	outline: none;
	border: none;
	font-size: 44px;
	padding: 20px 40px;
	border-radius: 15px;
	cursor: pointer;
	box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

const arrow = css`
	width: 35px;
	margin-left: 30px;
`;

const smallArrow = css`
	width: 25px;
`;
