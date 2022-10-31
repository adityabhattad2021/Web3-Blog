import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { css } from "@emotion/css";
import { ethers } from "ethers";
// import { create } from 'ipfs-http-client/dist/src'
import { Web3Storage, getFilesFromPath } from "web3.storage";

import { contractAddress, ownerAddress } from "../config";
import Blog from "../artifacts/contracts/Blog.sol/Blog.json";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
	ssr: false,
});

const initialState = { title: "", content: "" };

const token =process.env.NEXT_PUBLIC_WEB3_STORAGE
	;

export default function CreatePost() {
	const router = useRouter();
	const [post, setPost] = useState(initialState);
	const [image, setImage] = useState(null);
	const [loaded, setLoaded] = useState(false);

	const fileRef = useRef(null);

	const storage = new Web3Storage({ token });
	const { title, content } = post;

	useEffect(() => {
		setTimeout(() => {
			setLoaded(true);
		}, 500);
	}, []);

	function onChange(e) {
		setPost(() => ({ ...post, [e.target.name]: e.target.value }));
	}

	async function savePostToIPFS() {
		try {
			console.log(post);
			const blob = new Blob([JSON.stringify(post)], { type: 'application/json' })
			const fileToUpload=new File([blob],'post.json')
			const cid = await storage.put([fileToUpload])
			console.log(cid);
			return cid;
		} catch (error) {
			console.log(error);
		}
	}

	async function savePost(hash) {
		if (typeof window.ethereum !== "undefined") {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				contractAddress,
				Blog.abi,
				signer
			);

			try {
				const val = await contract.createPost(post.title, hash);
				console.log("Val: ", val);
			} catch (error) {
				console.log("Error: ", error);
			}
		}
	}

	async function createNewPost() {
		if (!title || !content) return;

		const hash = savePostToIPFS();
		await savePost(hash);
		router.push("/");
	}

	async function handleFileChange(e) {
		const uploadedFile = e.target.files[0];
		const blob = uploadedFile.slice(0, uploadedFile.size, 'image/png');
		const forIPFS = new File([blob],'cover-img.png',{type:'image/png'})
		console.log(forIPFS);
		if (!forIPFS) {
			console.log("No uploaded file found");
			return;
		}

		const cid = await storage.put([forIPFS])	

		console.log(cid);

		setPost((state) => ({ ...state, coverImage: cid }));
	}

	function triggerOnChange() {
		fileRef.current.click();
	}

	return (
		<div className={container}>
			{image && (
				<img
					className={coverImageStyle}
					src={URL.createObjectURL(image)}
				/>
			)}
			<input
				onChange={onChange}
				name="title"
				placeholder="Give it a title..."
				value={post.title}
				className={titleStyle}
			/>
			<SimpleMDE
				className={mdEditor}
				placeholder="Write something here..."
				value={post.content}
				onChange={(value) => setPost({ ...post, content: value })}
			/>
			{loaded && (
				<>
					<button
						className={button}
						type="button"
						onClick={createNewPost}
					>
						Publish
					</button>
					<button
						onClick={triggerOnChange} className={button}
					>
						Add Cover Image
					</button>
				</>
			)}
			<input
				id="selectImage"
				className={hiddenInput}
				type="file"
				onChange={handleFileChange}
				ref={fileRef}
			/>
		</div>
	);
}

const hiddenInput = css`
	display: none;
`;

const coverImageStyle = css`
	max-width: 800px;
`;

const mdEditor = css`
	margin-top: 40px;
`;

const titleStyle = css`
	margin-top: 40px;
	border: none;
	outline: none;
	background-color: inherit;
	font-size: 44px;
	font-weight: 600;
	&::placeholder {
		color: #999999;
	}
`;

const container = css`
	width: 800px;
	margin: 0 auto;
`;

const button = css`
	background-color: #fafafa;
	outline: none;
	border: none;
	border-radius: 15px;
	cursor: pointer;
	margin-right: 10px;
	font-size: 18px;
	padding: 16px 70px;
	box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;
