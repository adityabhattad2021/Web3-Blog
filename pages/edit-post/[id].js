import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import reactMarkdown from "react-markdown";
import { css } from "@emotion/css";
import dynamic from "next/dynamic";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";

import { contractAddress } from "../../config";
import Blog from '../../artifacts/contracts/Blog.sol/Blog.json';

const SimpleMDE = dynamic(
    () => import('react-simplemde-editor'),
    {ssr:false}
)



const ipfsURI = 'https://w3s.link/ipfs/';
const ipfsEnd = '/post.json';
const ipfsImgEnd = '/cover-image/png';


export default function EditPost() {

    const [post, setPost] = useState(null);
    const [editing, setEditing] = useState(null);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        fetchPost()
    },[id])

    async function fetchPost() {
        if (!id) return;
    }
    



    return (
        <div>
            Testing...
        </div>
    )
}





