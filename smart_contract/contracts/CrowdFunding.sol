// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CrowdFunding {
    address payable public owner;

    struct User {
        uint totalCampaigns;
        mapping(uint => Campaign) campaigns;
    }

    struct Campaign {
        uint id;
        address creator;
        string fullname;
        string title;
        string story;
        uint goalAmount;
        uint currentAmount;
        uint deadline;
    }

    mapping(address => User) public users;
    mapping(uint => Campaign) public campaigns;
    uint public totalCampaigns;

    // Events
    event CampaignCreated(address indexed sender, string title);

    constructor() payable {
        owner = payable(msg.sender);
        totalCampaigns = 0;
    }

    function createCampaign(
        string memory _fullname,
        string memory _title,
        string memory _story,
        uint _goalAmount,
        uint _deadline
    ) public {
        require(_deadline > block.timestamp, "Date should be future date");
        require(_goalAmount > 0, "Goal amount should be more than 0");
        require(bytes(_fullname).length > 0, "Full name cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_story).length > 0, "Story cannot be empty");

        Campaign memory newCampaign = Campaign({
            id: totalCampaigns,
            creator: msg.sender,
            fullname: _fullname,
            title: _title,
            story: _story,
            goalAmount: _goalAmount,
            currentAmount: 0,
            deadline: _deadline
        });

        campaigns[totalCampaigns] = newCampaign;

        uint userTotalCampaigns = users[msg.sender].totalCampaigns;
        users[msg.sender].campaigns[userTotalCampaigns] = newCampaign;
        users[msg.sender].totalCampaigns++;

        totalCampaigns++;
        emit CampaignCreated(msg.sender, newCampaign.title);
    }
}
