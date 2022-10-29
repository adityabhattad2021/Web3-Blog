// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Blog is Ownable{
    string public name;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
        uint id;
        string title;
        string content;
        bool published;
    }

    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    event PostCreated(
        uint indexed id,
        string indexed title,
        string indexed blogHash
    );
    event PostUpdated(
        uint indexed id,
        string indexed title,
        string indexed blogHash,
        bool published
    );

    constructor(string memory _name) {
        // console.log("Deploying blog with name: ", _name);
        name = _name;
    }

    function updateBlogName(string memory _name) public {
        name=_name;
    }

    function fetchPost(string memory blogHash) public view returns(Post memory){
        return hashToPost[blogHash];
    }

    function createPost(string memory title,string memory blogHash) public onlyOwner {
        _postIds.increment();
        uint postId = _postIds.current();
        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.published = true;
        post.content = blogHash;
        hashToPost[blogHash] = post;

        emit PostCreated(postId,title,blogHash);
    }

    function updatePost (uint postId,string memory title,string memory blogHash,bool published) public onlyOwner {
        Post storage post = idToPost[postId];
        post.title = title;
        post.published = published;
        post.content = blogHash;

        idToPost[postId]=post;
        hashToPost[blogHash]=post;

        emit PostUpdated(post.id,title,blogHash,published);
    }

    function fetchPosts() public view returns(Post[] memory ){

        uint itemCount = _postIds.current();

        Post[] memory posts = new Post[] (itemCount);

        for(uint i = 0;i<itemCount;){
            uint currentPostCounter = i+1;
            Post storage currentPostObj = idToPost[currentPostCounter];
            posts[i]= currentPostObj;
            unchecked {
                i++;
            }
        }

        return posts;
    }
}
