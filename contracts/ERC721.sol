pragma solidity = 0.8.17;

interface IERC721 {
    function balanceOf(address _owner) external view returns (uint256);

    function ownerOf(uint256 _tokenId) external view returns (address);

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable;

    function approve(address _to, uint _tokenId) external payable;

    function setApprovalForAll(address _operator, bool _approved) external;

    function getApproved(uint256 _tokenId) external view returns (address);

    function isApprovedForAll(address _owner, address _operator) external view returns (bool);

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);

    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId); 

    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

}

contract TokenERC721 is IERC721 {
    
    mapping (uint256 => address) private _owners;
    mapping (address => uint256) private _balances;
    mapping (uint256 => address) private _tokenApprovals;
    mapping (address => mapping(address => bool)) private _operatorApprovals;
    uint _id = 1;

    function mint() public payable {
        require(msg.value > 0, "not enough funds to mint a new token");
        _owners[_id] = msg.sender;
        _balances[msg.sender] = _id;
        _id++;
    }

    function balanceOf(
        address _owner
    ) external view override returns (uint256) {
        require(
            _owner != address(0),
            "Address is invalid"
        );

        return _balances[_owner];
    }

    function ownerOf(
        uint256 _tokenId
    ) public view override returns (address) {
        address owner = _owners[_tokenId];

        require(
            owner != address(0),
            "Address ia invalid"
            );

        return owner;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable override {
        require(_from != address(0) && _to != address(0), "addresses must be valid");
        require(_tokenId <= _id, "this token doesn't exist");

        _balances[_from] = 0;
        _balances[_to] = _tokenId;
        _owners[_tokenId] = _to;
    }

    function approve(
        address _to,
        uint _tokenId
    ) external payable override {
        address owner = ownerOf(_tokenId);

        require(
            _to != owner,
            "Owner must be different from destiny"
        );

        require(
            msg.sender == owner || 
                isApprovedForAll(owner, msg.sender),
            "Sender is not owner or token is not approved"
        );

        _tokenApprovals[_tokenId] = _to;
        emit Approval(ownerOf(_tokenId), _to, _tokenId);

    }

    function setApprovalForAll(
        address _operator,
        bool _approved
    ) external override {
        require(
            msg.sender != _operator,
            "Sender must be different from operator"
        );

        _operatorApprovals[msg.sender][_operator] = _approved;

        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(
        uint256 _tokenId
    ) external view override returns (address) {
        require(
            _owners[_tokenId] != address(0),
            "Token is not owned by anyone"
        );

        return _tokenApprovals[_tokenId];
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public view override returns (bool) {
        return _operatorApprovals[_owner][_operator];
    }
}