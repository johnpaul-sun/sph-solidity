// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CrowdFunding {
    address payable public owner;

    struct User {
        uint totalCampaigns;
        uint totalDonations;
        mapping(uint => uint) campaignIds;
        mapping(uint => uint) donationTransactionIds;
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
        uint totalDonations;
    }

    struct DonationTransaction {
        uint id;
        uint campaignId;
        address donor;
        uint amount;
        uint timestamp;
    }

    // State variables
    mapping(address => User) public users;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => DonationTransaction) public donationTransactions;
    uint public totalCampaigns;
    uint public totalDonations;

    // Events
    event CampaignCreated(address indexed sender, string title);
    event CampaignEdited(address indexed sender, string title);
    event DonationSent(address indexed sender, string title, uint amount);

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
            deadline: _deadline,
            totalDonations: 0
        });

        campaigns[totalCampaigns] = newCampaign;

        uint userTotalCampaigns = users[msg.sender].totalCampaigns;
        users[msg.sender].campaignIds[userTotalCampaigns] = newCampaign.id;
        users[msg.sender].totalCampaigns++;

        totalCampaigns++;
        emit CampaignCreated(msg.sender, newCampaign.title);
    }

    function getUserCampaigns(
        uint _pageSize,
        uint _pageNumber
    ) public view returns (Campaign[] memory, uint, uint, uint, uint) {
        require(_pageSize > 0, "Page size cannot be 0");
        require(_pageNumber > 0, "Page number cannot be 0");

        User storage user = users[msg.sender];
        uint totalPages = (user.totalCampaigns + _pageSize - 1) / _pageSize;
        uint startIndex = totalPages > 0 ? _pageSize * (_pageNumber - 1) : 0;
        uint endIndex = _pageSize + startIndex > user.totalCampaigns
            ? user.totalCampaigns
            : _pageSize + startIndex;

        Campaign[] memory allCampaigns = new Campaign[](endIndex - startIndex);

        for (uint i = 0; i < allCampaigns.length; i++) {
            Campaign memory campaign = campaigns[
                user.campaignIds[startIndex + i]
            ];
            allCampaigns[i] = campaign;
        }

        uint nextPage = (_pageNumber < totalPages)
            ? (_pageNumber + 1)
            : totalPages;
        uint previousPage = (_pageNumber > 1) ? (_pageNumber - 1) : 1;
        previousPage = (totalPages > 0) ? previousPage : 0;

        return (
            allCampaigns,
            user.totalCampaigns,
            totalPages,
            nextPage,
            previousPage
        );
    }

    function editCampaign(
        uint _campaignId,
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
        Campaign storage campaign = campaigns[_campaignId];
        require(
            _campaignId >= 0 && _campaignId < totalCampaigns,
            "Invalid campaign ID"
        );
        require(
            campaign.creator == msg.sender,
            "You are not the campaign creator!"
        );

        campaign.fullname = _fullname;
        campaign.title = _title;
        campaign.story = _story;
        campaign.goalAmount = _goalAmount;
        campaign.deadline = _deadline;

        emit CampaignEdited(msg.sender, campaign.title);
    }

    function sendDonation(uint _campaignId) public payable {
        require(
            _campaignId >= 0 && _campaignId < totalCampaigns,
            "Invalid campaign ID"
        );
        Campaign storage campaign = campaigns[_campaignId];
        require(
            block.timestamp <= campaign.deadline,
            "Campaign is already over"
        );
        require(msg.value > 0, "Donation amount should be more than 0");

        User storage sender = users[msg.sender];
        uint totalUserDonations = sender.totalDonations;

        DonationTransaction memory transaction = DonationTransaction({
            id: totalDonations,
            campaignId: campaign.id,
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });

        donationTransactions[totalDonations] = transaction;
        sender.donationTransactionIds[totalUserDonations] = transaction.id;

        campaign.currentAmount += msg.value;
        totalDonations++;
        sender.totalDonations++;
        campaign.totalDonations++;

        emit DonationSent(msg.sender, campaign.title, campaign.currentAmount);
    }

    function getCampaign(
        uint _campaignId
    ) public view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    function getCampaignDonations(
        uint _campaignId
    )
        public
        view
        returns (
            DonationTransaction[] memory allDonations,
            uint totalCampaignDonations
        )
    {
        Campaign memory campaign = campaigns[_campaignId];
        totalCampaignDonations = campaign.totalDonations;
        allDonations = new DonationTransaction[](totalCampaignDonations);
        uint donationCount = 0;

        for (uint i = 0; i < totalDonations; i++) {
            if (donationTransactions[i].campaignId == campaign.id) {
                allDonations[donationCount] = donationTransactions[i];
                donationCount++;
            }
        }
    }

    struct DonationData {
        address donator;
        string campaignTitle;
        uint donationAmount;
    }

    function getDonatorsByWalletAddress(
        address _walletAddress
    ) public view returns (DonationData[] memory) {
        uint256 donatorCount = 0;

        for (uint256 i = 0; i < totalCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            if (campaign.creator == _walletAddress) {
                for (uint256 j = 0; j < totalDonations; j++) {
                    DonationTransaction storage donation = donationTransactions[
                        j
                    ];
                    if (donation.campaignId == campaign.id) {
                        donatorCount++;
                    }
                }
            }
        }

        DonationData[] memory donations = new DonationData[](donatorCount);

        uint256 index = 0;

        for (uint256 i = 0; i < totalCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            if (campaign.creator == _walletAddress) {
                for (uint256 j = 0; j < totalDonations; j++) {
                    DonationTransaction storage donation = donationTransactions[
                        j
                    ];
                    if (donation.campaignId == campaign.id) {
                        DonationData memory donatorData;
                        donatorData.donator = donation.donor;
                        donatorData.campaignTitle = campaign.title;
                        donatorData.donationAmount = donation.amount;
                        donations[index] = donatorData;
                        index++;
                    }
                }
            }
        }

        return donations;
    }
}
