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
        string indexed hash
    );
    event PostUpdated(
        uint indexed id,
        string indexed title,
        string indexed hash,
        bool published
    );

    constructor(string memory _name) {
        console.log("Deploying blog with name: ", _name);
        name = _name;
    }

    function updateBlogName(string memory _name) public {
        name=_name;
    }

    function fetchPost(string memory hash) public view returns(Post memory){
        return hashToPost[hash];
    }

    
}
