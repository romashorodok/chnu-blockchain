// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    mapping(string => uint256) public votesReceived;

    string[] public candidateList;

    constructor(string[] memory _candidates) {
        candidateList = _candidates;
    }

    function vote(string memory candidate) public {
        bool isValidCandidate = false;
        for (uint i = 0; i < candidateList.length; i++) {
            // solc strings are dynamically sized by that it must be hashed with sha-3
            if (keccak256(abi.encodePacked(candidateList[i])) == keccak256(abi.encodePacked(candidate))) {
                isValidCandidate = true;
                break;
            }
        }
        require(isValidCandidate, "Candidate not valid");

        votesReceived[candidate]++;
    }

    function getVotes(string memory candidate) public view returns (uint256) {
        return votesReceived[candidate];
    }

    function getCandidates() public view returns (string[] memory) {
        return candidateList;
    }
}
