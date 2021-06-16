pragma solidity >=0.4.17;

contract Campaign{
    struct Request{
        string description;
        uint value;
        address payable recipient;
        bool complete;
        mapping(address=>bool) approvals;
        uint approvalCount;
        uint approvalETH;
    }
    
    address public manager;
    string descriptionCampain;
    string campaignName;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    mapping(address=>uint) contributors;

    uint public approversCount;
    uint public totalETH;
    uint numRequests;
    mapping (uint => Request) requests;
    uint[] public requestsArray;
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum, address campaignCreator,string memory name, string memory descriptionCamp) public {
        manager = campaignCreator;
        minimumContribution = minimum;
        descriptionCampain = descriptionCamp;
        campaignName = name;
    }
    
    function contribute() public payable{
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;

        if(contributors[msg.sender] > 0){
            contributors[msg.sender]+=msg.value;
        } else{
        contributors[msg.sender] = msg.value;
        approversCount++;

        }
        totalETH+=msg.value;
        for(uint i = 0; i < numRequests; i++) {
            if(requests[i].approvals[msg.sender]){
                requests[i].approvalETH +=msg.value;
            }
                }

    }
    
    function createRequest (string memory description, uint value,
            address payable recipient) public restricted{
                requestsArray.push(numRequests);
                Request storage r = requests[numRequests++];
                r.description = description;
                r.value = value;
                r.recipient = recipient;
                r.complete = false;
                r.approvalCount = 0;
                r.approvalETH = 0;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
        request.approvalETH += contributors[msg.sender];

        if(!request.complete && request.approvalETH > (totalETH/2) && request.value <= address(this).balance){
                request.recipient.transfer(request.value);
                request.complete = true;
            }
    }
    
    function finalizeRequest(uint index) public {
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalETH > (totalETH/2));
        
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address,string memory,string memory){
       return(
            minimumContribution,
            address(this).balance,
            numRequests,
            approversCount,
            manager,
            campaignName,
            descriptionCampain
       );
    }

    function getRequestCount() public view returns(uint){
        return numRequests;
    }

    function getRequest(uint index, address addr) public view returns(string memory, uint, address payable, bool, uint,bool,bool, bool){
       Request storage request = requests[index];
       string memory description = request.description;
        bool canApprove = approvers[addr];
        bool canComplete = false;
         if(!request.complete && request.approvalETH > (totalETH/2) && request.value <= address(this).balance){
            canComplete=true;
        }
        bool isApproved = false;
        if(request.approvals[addr]){
            isApproved = true;
        }



       return(
            description,
            request.value,
            request.recipient,
            request.complete,
            request.approvalCount,
            canApprove,
            canComplete,
            isApproved
       );
    }

    function getRequest2(uint index, address addr) public view returns(uint, uint,uint,uint){
       Request storage request = requests[index];
        bool isApproved = false;
        if(request.approvals[addr]){
            isApproved = true;
        }
       return(
            request.approvalETH,
            totalETH,
            address(this).balance,
            request.value 
       );
    }
}

contract CampaignFactory{
    Campaign[] deployedCampaigns;
     uint numCampaigns;
    mapping (uint => CampaignInfo) campaign;

    struct CampaignInfo{
        Campaign addr;
        string description;
        string name;
        uint minimum;
    }

    function createCampaign(uint minimum,string memory name, string memory descriptionCampain) public{
            Campaign newCampaign = new Campaign(minimum, msg.sender,name, descriptionCampain);
            deployedCampaigns.push(newCampaign);
            CampaignInfo storage r = campaign[numCampaigns++];
                r.description = descriptionCampain;
                r.name = name;
                r.minimum = minimum;
                r.addr = newCampaign;
             }

     function getAllCampaigns() public view returns(CampaignInfo[] memory){
         CampaignInfo[] memory memoryArray = new CampaignInfo[](numCampaigns);
        for(uint i = 0; i < numCampaigns; i++) {
            memoryArray[i] = campaign[i];
        }
        return memoryArray;
    }
  
    function getDeployedCampaigns() public view returns (Campaign[] memory){
        return deployedCampaigns;
    }
}
