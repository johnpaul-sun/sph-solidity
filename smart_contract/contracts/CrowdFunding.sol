// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract CrowdFunding {
    address payable public owner;

    struct User {
        uint256 totalCampaigns;
        uint256 totalDonations;
        mapping(uint256 => uint256) campaignIds;
        mapping(uint256 => uint256) donationTransactionIds;
    }

    struct Campaign {
        uint256 id;
        address creator;
        string fullname;
        string title;
        string story;
        string imageUrl;
        uint256 goalAmount;
        uint256 currentAmount;
        uint256 deadline;
        uint256 totalDonations;
        bool fundsReturned;
        bool fundsCredited;
    }

    struct DonationTransaction {
        uint256 id;
        uint256 campaignId;
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct DonationData {
        uint256 id;
        address userAddress;
        string campaignTitle;
        uint256 donationAmount;
        string status;
        bool fundsReturned;
    }

    struct PaginationData {
        uint256 totalPages;
        uint256 nextPage;
        uint256 previousPage;
        uint256 startIndex;
        uint256 endIndex;
    }

    struct ResultIndexData {
        bool isLastPage;
        uint256 nextIndex;
    }

    // State variables
    mapping(address => User) public users;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => DonationTransaction) public donationTransactions;
    uint256 public totalCampaigns;
    uint256 public totalDonations;

    // Events
    event CampaignCreated(address indexed sender, string title);
    event CampaignEdited(address indexed sender, string title);
    event DonationSent(address indexed sender, string title, uint256 amount);
    event Refunded();

    // Modifiers
    modifier validCampaignArguments(
        string memory _fullname,
        string memory _title,
        string memory _story,
        string memory _imageUrl,
        uint256 _goalAmount
    ) {
        require(_goalAmount > 0, "Goal amount should be more than 0");
        require(bytes(_fullname).length > 0, "Full name cannot be empty");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_story).length > 0, "Story cannot be empty");
        require(
            bytes(_imageUrl).length > 0,
            "Campaign image url cannot be empty"
        );
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
            uint256 i = 0;
            i <= fullstringBytes.length - substringBytes.length;
            i++
        ) {
            bool found = true;
            for (uint256 j = 0; j < substringBytes.length; j++) {
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
        string memory _imageUrl,
        uint256 _goalAmount,
        uint256 _deadline
    )
        public
        validCampaignArguments(
            _fullname,
            _title,
            _story,
            _imageUrl,
            _goalAmount
        )
    {
        Campaign memory newCampaign = Campaign({
            id: totalCampaigns,
            creator: msg.sender,
            fullname: _fullname,
            title: _title,
            story: _story,
            imageUrl: _imageUrl,
            goalAmount: _goalAmount,
            currentAmount: 0,
            deadline: _deadline,
            totalDonations: 0,
            fundsReturned: false,
            fundsCredited: false
        });

        campaigns[totalCampaigns] = newCampaign;

        uint256 userTotalCampaigns = users[msg.sender].totalCampaigns;
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
        uint256 totalUserCampaigns = user.totalCampaigns;

        uint256 totalAvailablePages = (totalUserCampaigns + _pageSize - 1) /
            _pageSize;

        if (totalUserCampaigns > 0) {
            require(
                _pageNumber > 0 && _pageNumber <= totalAvailablePages,
                "Invalid page number"
            );
        }

        uint256 startingIndex = totalUserCampaigns -
            (_pageNumber - 1) *
            _pageSize;
        uint256 endIndex = startingIndex > _pageSize
            ? startingIndex - _pageSize
            : 0;

        uint256 resultSize = startingIndex - endIndex;

        allCampaigns = new Campaign[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            Campaign memory campaign = campaigns[
                user.campaignIds[startingIndex - i - 1]
            ];
            allCampaigns[i] = campaign;
        }

        userTotalCampaigns = totalUserCampaigns;
        totalPages = totalAvailablePages;
        nextPage = _pageNumber < totalAvailablePages ? _pageNumber + 1 : 0;
        previousPage = _pageNumber > 1 ? _pageNumber - 1 : 0;
    }

    function editCampaign(
        uint256 _campaignId,
        string memory _fullname,
        string memory _title,
        string memory _story,
        string memory _imageUrl,
        uint256 _goalAmount,
        uint256 _deadline
    )
        public
        validCampaignArguments(
            _fullname,
            _title,
            _story,
            _imageUrl,
            _goalAmount
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
        campaign.imageUrl = _imageUrl;
        campaign.goalAmount = _goalAmount;
        campaign.deadline = _deadline;

        emit CampaignEdited(msg.sender, campaign.title);
    }

    function sendDonation(uint256 _campaignId) public payable {
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
        uint256 totalUserDonations = sender.totalDonations;

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

        if (
            campaign.currentAmount >= campaign.goalAmount &&
            !campaign.fundsCredited
        ) {
            checkGoalAndSendFunds(_campaignId);
        }

        emit DonationSent(msg.sender, campaign.title, campaign.currentAmount);
    }

    function getCampaign(
        uint256 _campaignId
    ) public view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    function getCampaignDonations(
        uint256 _campaignId
    )
        public
        view
        returns (
            DonationTransaction[] memory allDonations,
            uint256 totalCampaignDonations
        )
    {
        Campaign memory campaign = campaigns[_campaignId];
        totalCampaignDonations = campaign.totalDonations;
        allDonations = new DonationTransaction[](totalCampaignDonations);
        uint256 donationCount = 0;

        for (uint256 i = 0; i < totalDonations; i++) {
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
                            donatorData.id = campaign.id;
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
        uint256 _pageSize,
        uint256 _pageNumber
    )
        public
        view
        returns (
            DonationData[] memory userDonations,
            PaginationData memory pagination
        )
    {
        uint256 count = 0;
        User storage user = users[_userAddress];

        pagination = _paginate(user.totalDonations, _pageSize, _pageNumber);
        userDonations = new DonationData[](
            pagination.endIndex - pagination.startIndex
        );

        for (uint256 i = pagination.startIndex; i < pagination.endIndex; i++) {
            DonationTransaction memory transaction = donationTransactions[
                user.donationTransactionIds[i]
            ];
            Campaign memory campaign = campaigns[transaction.campaignId];

            bool isGoalMet = campaign.currentAmount >= campaign.goalAmount;
            bool isExpired = block.timestamp >= campaign.deadline &&
                !campaign.fundsReturned;

            string memory status = "pending";
            if (isGoalMet) {
                status = "achieved";
            } else if (isExpired) {
                status = "expired";
            }

            DonationData memory donationData = DonationData({
                id: campaign.id,
                userAddress: campaign.creator,
                campaignTitle: campaign.title,
                donationAmount: transaction.amount,
                status: status,
                fundsReturned: campaign.fundsReturned
            });

            userDonations[count] = donationData;
            count++;
        }
    }

    function getRecentCampaigns(
        uint256 _size
    )
        public
        view
        returns (
            Campaign[] memory recentCampaigns,
            uint256 totalFetchedCampaigns,
            uint256 totalAllCampaigns
        )
    {
        uint256 startIndex = _size < totalCampaigns
            ? (totalCampaigns - _size)
            : 0;
        uint256 arraySize = _size < totalCampaigns ? _size : totalCampaigns;

        Campaign[] memory tempCampaigns = new Campaign[](arraySize);
        uint256 count = 0;

        for (uint256 i = 0; i < arraySize; i++) {
            Campaign storage campaign = campaigns[startIndex + i];
            if (
                block.timestamp <= campaign.deadline &&
                campaign.currentAmount < campaign.goalAmount &&
                !campaign.fundsCredited
            ) {
                tempCampaigns[count] = campaign;
                count++;
            }
        }

        recentCampaigns = new Campaign[](count);
        for (uint256 i = 0; i < count; i++) {
            recentCampaigns[i] = tempCampaigns[i];
        }

        totalFetchedCampaigns = count;
        totalAllCampaigns = totalCampaigns;
    }

    function searchByTitle(
        string memory searchTerm,
        uint256 pageSize,
        uint256 startIndex
    )
        public
        view
        returns (
            Campaign[] memory matchingCampaigns,
            ResultIndexData memory searchIndexData
        )
    {
        require(pageSize > 0, "Page size cannot be 0");
        uint256 matchingCount = 0;

        if (totalCampaigns == 0) {
            searchIndexData.isLastPage = true;
            searchIndexData.nextIndex = 0;
        }

        if (totalCampaigns == 0) {
            searchIndexData.isLastPage = true;
            searchIndexData.nextIndex = 0;
        }

        // Count the number of campaigns that contain the search term
        for (
            uint i = startIndex;
            i < totalCampaigns && matchingCount < pageSize;
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
        uint256 index = 0;

        // Add the matching campaigns to the new array
        for (
            uint256 i = startIndex;
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

    function getAllCampaigns(
        uint256 _size,
        uint256 _startIndex
    )
        public
        view
        returns (
            Campaign[] memory allCampaigns,
            ResultIndexData memory indexData
        )
    {
        require(_size > 0, "Size cannot be 0");
        require(_startIndex <= totalCampaigns, "Invalid start index");

        indexData.isLastPage = _startIndex == 0
            ? (_size >= totalCampaigns ? true : false)
            : (_size >= _startIndex ? true : false);

        _size = _startIndex == 0
            ? (_size > totalCampaigns ? totalCampaigns : _size)
            : (_size >= _startIndex ? _startIndex : _size);
        indexData.nextIndex = _startIndex == 0
            ? (totalCampaigns - _size)
            : (_startIndex - _size);

        Campaign[] memory tempCampaigns = new Campaign[](_size);

        uint256 index = 0;
        uint256 startIndex = indexData.nextIndex;

        for (uint256 i = startIndex; i < startIndex + _size; i++) {
            Campaign storage campaign = campaigns[i];
            if (
                block.timestamp <= campaign.deadline &&
                campaign.currentAmount < campaign.goalAmount &&
                !campaign.fundsCredited
            ) {
                tempCampaigns[index] = campaign;
                index++;
            }
        }

        allCampaigns = new Campaign[](index);
        for (uint256 i = 0; i < index; i++) {
            allCampaigns[i] = tempCampaigns[i];
        }
    }

    function returnDonationsIfExpired(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];

        // Update this function to just return the amount on current connected user, add address in the parameter.

        for (uint256 i = 0; i < totalDonations; i++) {
            DonationTransaction storage donation = donationTransactions[i];
            if (donation.campaignId == _campaignId) {
                address payable donorAddress = payable(donation.donor);
                donorAddress.transfer(donation.amount);
                campaign.currentAmount -= donation.amount;
            }
        }

        campaign.fundsReturned = true;
    }

    function checkGoalAndSendFunds(uint256 _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            _campaignId >= 0 && _campaignId < totalCampaigns,
            "Invalid campaign ID"
        );

        address payable campaignCreator = payable(campaign.creator);
        campaignCreator.transfer(campaign.currentAmount);
        campaign.fundsCredited = true;
    }
}
