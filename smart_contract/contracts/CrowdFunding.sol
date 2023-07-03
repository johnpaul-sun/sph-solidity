// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CrowdFunding {
    address payable public owner;

    struct User {
        uint totalCampaigns;
        mapping(uint => uint) campaignIds;
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

    // Modifiers
    modifier validCampaignArguments(
        string memory _fullname,
        string memory _title,
        string memory _story,
        uint _goalAmount,
        uint _deadline
    ) {
        require(_deadline > block.timestamp, "Date should be future date");
        require(_goalAmount > 0, "Goal amount should be more than 0");
        require(bytes(_fullname).length > 0, "Full name cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_story).length > 0, "Story cannot be empty");
        _;
    }

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
    )
        public
        validCampaignArguments(
            _fullname,
            _title,
            _story,
            _goalAmount,
            _deadline
        )
    {
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
        users[msg.sender].campaignIds[userTotalCampaigns] = newCampaign.id;
        users[msg.sender].totalCampaigns++;

        totalCampaigns++;
        emit CampaignCreated(msg.sender, newCampaign.title);
    }

    function getUserCampaigns() public view returns (Campaign[] memory) {
        uint userTotalCampaigns = users[msg.sender].totalCampaigns;
        Campaign[] memory allCampaigns = new Campaign[](userTotalCampaigns);

        for (uint i = 0; i < userTotalCampaigns; i++) {
            Campaign memory campaign = campaigns[
                users[msg.sender].campaignIds[i]
            ];
            allCampaigns[i] = campaign;
        }

        return allCampaigns;
    }
}
