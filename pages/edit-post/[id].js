import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import reactMarkdown from "react-markdown";
import { css } from "@emotion/css";
import dynamic from "next/dynamic";
import { Contract, ethers } from "ethers";
import { Web3Storage } from "web3.storage";

import { contractAddress } from "../../config";
import Blog from "../../artifacts/contracts/Blog.sol/Blog.json";
import ReactMarkdown from "react-markdown";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
});

const ipfsURI = "https://w3s.link/ipfs/";
const ipfsEnd = "/post.json";
const ipfsImgEnd = "/cover-image/png";

export default function EditPost() {
	const [post, setPost] = useState(null);
	const [editing, setEditing] = useState(null);

	const router = useRouter();
	const { id } = router.query;

	const storage = new Web3Storage({
		token: process.env.NEXT_PUBLIC_WEB3_STORAGE,
	});

	useEffect(() => {
		fetchPost();
	}, [id]);

	async function fetchPost() {
		if (!id) return;
		let provider;
		if (process.env.NEXT_PUBLIC_ENVIRONMENT === "local") {
			provider = new ethers.providers.JsonRpcProvider();
		} else if (process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet") {
			provider = new ethers.providers.JsonRpcProvider(
				process.env.NEXT_PUBLIC_POLYGON_RPC_URL
			);
		}

		const contract = new Contract(contractAddress, Blog.abi, provider);

		const val = await contract.fetchPost(id);
		const postId = val[0].toNumber();

		const ipfsURL = `${ipfsURI}${id}${ipfsEnd}`;
		const response = await fetch(ipfsURL);
		const data = await response.json();

		if (data.coverImage) {
			let coverImage = `${ipfsURI}${data.coverImage}${ipfsImgEnd}`;
			data.coverImage = coverImage;
		}

		data.id = postId;
		setPost(data);
	}

	async function savePostToIPFS() {
		try {
			const blob = new Blob([JSON.stringify(post)], {
				type: "application/json",
			});
			const fileToUpload = new File([blob], "post.json");
			const cid = await storage.put([fileToUpload]);

			return cid;
		} catch (err) {
			console.log(err);
		}
	}

	async function updatePost() {
		const hash = savePostToIPFS();
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(contractAddress, Blog.abi, signer);
		await contract.updatePost(post.id, post.title, hash, true);
		router.push("/");
	}

	if (!post) return null;

	return (
		<div className={container}>
			{editing && (
				<div>
					<input
						onChange={(e) =>
							setPost({ ...post, title: e.target.value })
						}
						name="title"
						placeholder="Give it a title"
						value={post.title}
						className={titleStyle}
					/>
					<SimpleMDE
						className={mdEditor}
						placeholder="Write Something here..."
						value={post.content}
						onChange={(value) =>
							setPost({ ...post, content: value })
						}
					/>
					<button className={button} onClick={updatePost}>
						Update Post
					</button>
				</div>
			)}
			{!editing && (
				<div>
					{post.coverImage && (
						<img
							src={post.coverImage}
							className={coverImagestyle}
						/>
					)}
					<h1>{post.title}</h1>
					<div className={contentContainer}>
						<ReactMarkdown>{post.content}</ReactMarkdown>
					</div>
				</div>
			)}
			<button
				onClick={() => {
					setEditing(!editing);
				}}
			>
				{editing ? "View Post" : "Edit Post"}
			</button>
		</div>
	);
}
