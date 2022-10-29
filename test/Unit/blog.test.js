const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");

describe("Blog Unit Tests", function () {
	let blog, deployer;

	beforeEach(async function () {
		deployer = (await getNamedAccounts()).deployer;
		await deployments.fixture(["all"]);
		blog = await ethers.getContract("Blog", deployer);
	});

	describe("Constructor", function () {
		it("Sets the blog name correctly", async function () {
			const name = await blog.name();
			assert(
				name.toString(),
				"Sample Blog",
				"The name was not set correctly"
			);
		});
		it("Sets the blog owner correclty", async function () {
			const blogOwner = await blog.owner();
			assert(deployer, blogOwner);
		});
	});

	describe("Update Blog Name", function () {
		it("Updates blog name correctly", async function () {
			const newName = "New Sample Blog";
			const transectionResponse = await blog.updateBlogName(newName);
			await transectionResponse.wait(1);

			const blogName = await blog.name();

			assert(newName, blogName);
		});
	});

	describe("Posts", function () {
		let title, body, postCreationTx, postCreationTxRecipt;

		beforeEach(async function () {
			title = "Sample Post title";
			body = "Sample Post Body";

			postCreationTx = await blog.createPost(title, body);
			postCreationTxRecipt = await postCreationTx.wait(1);
		});

		it("Creates post correclty", async function () {
			assert(postCreationTxRecipt.events[0].event, "PostCreated");
		});
		it("Fetches post correctly", async function () {
			const postTitle = (await blog.fetchPost("Sample Post Body")).title;
			const postBody = (await blog.fetchPost("Sample Post Body")).content;
			assert(title, postTitle);
			assert(body, postBody);
		});
		it("Updates Post correctly", async function () {
			const postUpdateTx = await blog.updatePost(
				0,
				"New Title",
				"New Body",
				true
			);
			const postUpdateTxRecipt = await postCreationTx.wait(1);
			assert(postUpdateTxRecipt.events[0].event, "PostUpdated")
		});
		it("Fetches all posts correclty", async function () {

			const newTitle = "Sample Post title";
			const newBody = "Sample Post Body";

			const newPostCreationTx = await blog.createPost(title, body);
			const newPostCreationTxRecipt = await postCreationTx.wait(1);

			allPostsArray = await blog.fetchPosts();
			
			assert(allPostsArray.length, 2);
		})
	});
});
