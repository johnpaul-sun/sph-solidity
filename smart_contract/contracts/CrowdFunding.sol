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

    struct DonationData {
        address userAddress;
        string campaignTitle;
        uint donationAmount;
    }

    struct PaginationData {
        uint256 totalPages;
        uint256 nextPage;
        uint256 previousPage;
        uint256 startIndex;
        uint256 endIndex;
    }

    struct SearchIndexData {
        bool isLastPage;
        uint nextIndex;
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

    function _toLowerCase(
        string memory str
    ) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory lowercaseBytes = new bytes(strBytes.length);

        for (uint256 i = 0; i < strBytes.length; i++) {
            lowercaseBytes[i] = _lowercase(strBytes[i]);
        }

        return string(lowercaseBytes);
    }

    function _lowercase(bytes1 b) private pure returns (bytes1) {
        if (uint8(b) >= 65 && uint8(b) <= 90) {
            return bytes1(uint8(b) + 32);
        }
        return b;
    }

    function _contains(
        string memory fullString,
        string memory substring
    ) private pure returns (bool) {
        bytes memory fullstringBytes = bytes(fullString);
        bytes memory substringBytes = bytes(substring);

        if (fullstringBytes.length < substringBytes.length) {
            return false;
        }

        for (
            uint i = 0;
            i <= fullstringBytes.length - substringBytes.length;
            i++
        ) {
            bool found = true;
            for (uint j = 0; j < substringBytes.length; j++) {
                if (fullstringBytes[i + j] != substringBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                return true;
            }
        }

        return false;
    }

    function _paginate(
        uint256 totalItems,
        uint256 pageSize,
        uint256 pageNumber
    ) internal pure returns (PaginationData memory) {
        require(pageSize > 0, "Page size cannot be 0");
        require(pageNumber > 0, "Page number cannot be 0");

        PaginationData memory pagination;
        pagination.totalPages = (totalItems + pageSize - 1) / pageSize;
        pagination.startIndex = pagination.totalPages > 0
            ? pageSize * (pageNumber - 1)
            : 0;
        pagination.endIndex = pageSize + pagination.startIndex > totalItems
            ? totalItems
            : pageSize + pagination.startIndex;
        pagination.nextPage = (pageNumber < pagination.totalPages)
            ? (pageNumber + 1)
            : pagination.totalPages;
        pagination.previousPage = (pageNumber > 1) ? (pageNumber - 1) : 1;
        pagination.previousPage = (pagination.totalPages > 0)
            ? pagination.previousPage
            : 0;

        return pagination;
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
        uint256 _pageSize,
        uint256 _pageNumber
    )
        public
        view
        returns (
            Campaign[] memory allCampaigns,
            uint256 userTotalCampaigns,
            uint256 totalPages,
            uint256 nextPage,
            uint256 previousPage
        )
    {
        User storage user = users[msg.sender];
        PaginationData memory pagination = _paginate(
            user.totalCampaigns,
            _pageSize,
            _pageNumber
        );

        allCampaigns = new Campaign[](
            pagination.endIndex - pagination.startIndex
        );

        for (uint256 i = 0; i < allCampaigns.length; i++) {
            Campaign memory campaign = campaigns[
                user.campaignIds[pagination.startIndex + i]
            ];
            allCampaigns[i] = campaign;
        }

        userTotalCampaigns = user.totalCampaigns;
        totalPages = pagination.totalPages;
        nextPage = pagination.nextPage;
        previousPage = pagination.previousPage;
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

    function getDonatorsByWalletAddress(
        address _walletAddress,
        uint256 _pageSize,
        uint256 _pageNumber
    )
        public
        view
        returns (
            DonationData[] memory donations,
            uint256 donatorCount,
            uint256 totalPages,
            uint256 nextPage,
            uint256 previousPage
        )
    {
        donatorCount = 0;
        PaginationData memory pagination;

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

        pagination = _paginate(donatorCount, _pageSize, _pageNumber);
        donations = new DonationData[](
            pagination.endIndex - pagination.startIndex
        );
        uint256 index = 0;

        for (uint256 i = 0; i < totalCampaigns; i++) {
            Campaign storage campaign = campaigns[i];
            if (campaign.creator == _walletAddress) {
                for (uint256 j = 0; j < totalDonations; j++) {
                    DonationTransaction storage donation = donationTransactions[
                        j
                    ];
                    if (donation.campaignId == campaign.id) {
                        if (
                            index >= pagination.startIndex &&
                            index < pagination.endIndex
                        ) {
                            DonationData memory donatorData;
                            donatorData.userAddress = donation.donor;
                            donatorData.campaignTitle = campaign.title;
                            donatorData.donationAmount = donation.amount;
                            donations[
                                index - pagination.startIndex
                            ] = donatorData;
                        }
                        index++;
                    }
                }
            }
        }

        totalPages = pagination.totalPages;
        nextPage = pagination.nextPage;
        previousPage = pagination.previousPage;
    }

    function getUserDonations(
        address _userAddress,
        uint _pageSize,
        uint _pageNumber
    )
        public
        view
        returns (
            DonationData[] memory userDonations,
            PaginationData memory pagination
        )
    {
        uint count = 0;
        User storage user = users[_userAddress];

        pagination = _paginate(user.totalDonations, _pageSize, _pageNumber);
        userDonations = new DonationData[](
            pagination.endIndex - pagination.startIndex
        );

        for (uint i = pagination.startIndex; i < pagination.endIndex; i++) {
            DonationTransaction memory transaction = donationTransactions[
                user.donationTransactionIds[i]
            ];
            Campaign memory campaign = campaigns[transaction.campaignId];
            DonationData memory donationData = DonationData({
                userAddress: campaign.creator,
                campaignTitle: campaign.title,
                donationAmount: transaction.amount
            });

            userDonations[count] = donationData;
            count++;
        }
    }

    function getRecentCampaigns(
        uint _size
    )
        public
        view
        returns (
            Campaign[] memory recentCampaigns,
            uint totalFetchedCampaigns,
            uint totalAllCampaigns
        )
    {
        uint startIndex = _size < totalCampaigns ? (totalCampaigns - _size) : 0;
        uint arraySize = _size < totalCampaigns ? _size : totalCampaigns;
        recentCampaigns = new Campaign[](arraySize);

        for (uint i = 0; i < arraySize; i++) {
            recentCampaigns[i] = campaigns[startIndex + i];
        }

        totalFetchedCampaigns = totalCampaigns > 0 ? arraySize : 0;
        totalAllCampaigns = totalCampaigns;
    }

    function searchByTitle(
        string memory searchTerm,
        uint pageSize,
        uint startIndex
    )
        public
        view
        returns (
            Campaign[] memory matchingCampaigns,
            SearchIndexData memory searchIndexData
        )
    {
        require(pageSize > 0, "Page size cannot be 0");
        uint matchingCount = 0;

        // Count the number of campaigns that contain the search term
        for (
            uint i = startIndex;
            i < totalCampaigns && matchingCount != pageSize;
            i++
        ) {
            if (
                _contains(
                    _toLowerCase(campaigns[i].title),
                    _toLowerCase(searchTerm)
                )
            ) {
                matchingCount++;
            }

            if (matchingCount == pageSize) {
                searchIndexData.nextIndex = i + 1;
            }

            if (i + 1 == totalCampaigns) {
                searchIndexData.isLastPage = true;
                searchIndexData.nextIndex = 0;
            }
        }

        matchingCampaigns = new Campaign[](matchingCount);
        uint index = 0;

        // Add the matching campaigns to the new array
        for (
            uint i = startIndex;
            i < totalCampaigns && index < matchingCount;
            i++
        ) {
            if (
                _contains(
                    _toLowerCase(campaigns[i].title),
                    _toLowerCase(searchTerm)
                )
            ) {
                matchingCampaigns[index] = campaigns[i];
                index++;
            }
        }
    }
}
