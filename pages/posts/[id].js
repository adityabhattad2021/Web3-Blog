import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { css } from "@emotion/css";
import Link from "next/link";
import { contractAddress, ownerAddress } from "../../config";
import Blog from "../../artifacts/contracts/Blog.sol/Blog.json";
import { useAccount } from "@web3modal/react";

const ipfsURI = "https://w3s.link/ipfs/";
const ipfsEnd = "/post.json";
const ipfsImgEnd = "/cover-img.png";

export default function Post({ post }) {
	const { account } = useAccount();
	const router = useRouter();
	const { id } = router.query;

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{post && (
				<div className={container}>
					{account.address === ownerAddress && (
						<div className={editPost}>
							<Link href={`/edit-post/${id}`}>
								<p>Edit Post</p>
							</Link>
						</div>
					)}
					{post.coverImage && (
						<img
							src={post.coverImage}
							alt="Cover Image"
							className={coverImageStyle}
						/>
					)}
					<h1>{post.title}</h1>
					<div className={contentContainer}>
						<ReactMarkdown>{post.content}</ReactMarkdown>
					</div>
				</div>
			)}
		</div>
	);
}

export async function getStaticPaths() {
	// We will get all the posts here, and then we will generate the paths
	let provider;
	if (process.env.NEXT_PUBLIC_ENVIRONMENT === "local") {
		provider = new ethers.providers.JsonRpcProvider();
	} else if (process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet") {
		provider = new ethers.providers.JsonRpcProvider(
			process.env.NEXT_PUBLIC_POLYGON_RPC_URL
		);
	}

	const contract = new ethers.Contract(contractAddress, Blog.abi, provider);
	const data = await contract.fetchPosts();

	const paths = data.map((d) => ({ params: { id: d[2] } }));

	return {
		paths,
		fallback: true,
	};
}

export async function getStaticProps({ params }) {
	// We will get the post here, and then we will return it as props to the component

	const { id } = params;
	const ipfsURL = `${ipfsURI}${id}${ipfsEnd}`;
	let data;
	try {
		const response = await fetch(ipfsURL);
		data = await response.json();

		if (data.coverImage) {
			let coverImage = `${ipfsURI}${data.coverImage}${ipfsImgEnd}`;
			data.coverImage = coverImage;
		}
	} catch (err) {
		console.log(err);
	}
	// console.log(data);
	return {
		props: {
			post: data,
		},
	};
}

const editPost = css`
	margin: 20px 0px;
`;

const coverImageStyle = css`
	width: 900px;
`;

const container = css`
	width: 90%;
	padding:5%;

`;

const contentContainer = css`
	margin-top: 60px;
	padding: 0px 40px;
	border-left: 1px solid #e7e7e7;
	border-right: 1px solid #e7e7e7;
	& img {
		max-width: 900px;
	}
`;
