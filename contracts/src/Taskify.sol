// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Taskify is ReentrancyGuard, Ownable {
    uint256 public minAmount;
    
    // Config: Platform Fee in Basis Points (100 = 1%)
    uint256 public platformFeeBps; 
    
    // Mapping: User Reputation Score
    mapping(address => uint256) public reputation;

    constructor(uint256 _minAmount, uint256 _feeBps) Ownable(msg.sender) {
        require(_minAmount > 0, "minAmount must be > 0");
        minAmount = _minAmount;
        platformFeeBps = _feeBps;
    }

    event TaskCreated(uint256 indexed taskId, address indexed creator, string title, string category, uint256 amount, uint256 deadline);
    event TaskAccepted(uint256 indexed taskId, address indexed worker);
    event WorkSubmitted(uint256 indexed taskId, address indexed worker, string submissionUrl);
    event TaskCompleted(uint256 indexed taskId, address indexed worker, uint256 amountPaid);
    event TaskDisputed(uint256 indexed taskId, address indexed initiator);
    event TaskResolved(uint256 indexed taskId, address indexed winner, uint256 amount);
    event TaskCancelled(uint256 indexed taskId, address indexed creator, uint256 refundedAmount);
    event ReputationIncreased(address indexed user, uint256 newScore);
    event PlatformFeeChanged(uint256 newFeeBps);

    enum TaskState { Open, Assigned, Submitted, Completed, Cancelled, Disputed, Resolved }

    struct Task {
        uint256 id;
        address payable creator;
        address payable worker;
        string title;
        string description;
        string category;
        uint256 amount;
        uint256 deadline;
        TaskState state;
        uint256 createdAt;
        string submissionUrl;
        uint256 submittedAt;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    mapping(address => uint256[]) public tasksByCreator;
    mapping(address => uint256[]) public tasksByWorker;

    modifier nonEmptyString(string memory s) {
        _nonEmptyString(s);
        _;
    }

    function _nonEmptyString(string memory s) pure internal {
        require(bytes(s).length > 0, "string must be non-empty");
    }

    // ------- Admin Functions -------
    function setMinAmount(uint256 _minAmount) external onlyOwner {
        require(_minAmount > 0, "minAmount must be > 0");
        minAmount = _minAmount;
    }

    function setPlatformFee(uint256 _feeBps) external onlyOwner {
        require(_feeBps <= 1000, "fee cannot exceed 10%"); // Safety cap
        platformFeeBps = _feeBps;
        emit PlatformFeeChanged(_feeBps);
    }

    // ------- Core Functions -------
    function createTask(
        string calldata _title,
        string calldata _description,
        string calldata _category,
        uint256 _deadline
    ) external payable nonEmptyString(_title) nonEmptyString(_description) nonEmptyString(_category) returns (uint256) {
        require(msg.value >= minAmount, "sent value below minAmount");
        require(msg.value > 0, "amount must be > 0");
        require(_deadline > block.timestamp, "deadline must be in the future");

        taskCount += 1;
        uint256 newTaskId = taskCount;

        Task memory t = Task({
            id: newTaskId,
            creator: payable(msg.sender),
            worker: payable(address(0)),
            title: _title,
            description: _description,
            category: _category,
            amount: msg.value,
            deadline: _deadline,
            state: TaskState.Open,
            createdAt: block.timestamp,
            submissionUrl: "",
            submittedAt: 0
        });

        tasks[newTaskId] = t;
        tasksByCreator[msg.sender].push(newTaskId);

        emit TaskCreated(newTaskId, msg.sender, _title, _category, msg.value, _deadline);
        return newTaskId;
    }

    function acceptTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "task does not exist");
        require(task.state == TaskState.Open, "task is not open");
        require(block.timestamp < task.deadline, "task deadline has passed");
        require(msg.sender != task.creator, "creator cannot accept own task");

        task.worker = payable(msg.sender);
        task.state = TaskState.Assigned;
        tasksByWorker[msg.sender].push(_taskId);

        emit TaskAccepted(_taskId, msg.sender);
    }

    function submitWork(uint256 _taskId, string calldata _submissionUrl) external nonEmptyString(_submissionUrl) {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "task does not exist");
        require(task.state == TaskState.Assigned, "task is not assigned");
        require(msg.sender == task.worker, "only assigned worker can submit");

        task.submissionUrl = _submissionUrl;
        task.submittedAt = block.timestamp;
        task.state = TaskState.Submitted;

        emit WorkSubmitted(_taskId, msg.sender, _submissionUrl);
    }

    function approveWork(uint256 _taskId) external nonReentrant {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "task does not exist");
        require(msg.sender == task.creator, "only creator can approve");
        require(task.state == TaskState.Submitted, "work not submitted yet");

        task.state = TaskState.Completed;

        // Increase Worker Reputation
        reputation[task.worker] += 1;
        emit ReputationIncreased(task.worker, reputation[task.worker]);

        // Calculate Fee
        uint256 fee = (task.amount * platformFeeBps) / 10000;
        uint256 payout = task.amount - fee;

        // Pay Worker
        (bool success, ) = task.worker.call{value: payout}("");
        require(success, "transfer to worker failed");

        // Pay Fee to Owner (Platform)
        if (fee > 0) {
            (bool feeSuccess, ) = payable(owner()).call{value: fee}("");
            require(feeSuccess, "transfer of fee failed");
        }

        emit TaskCompleted(_taskId, task.worker, payout);
    }

    function cancelTask(uint256 _taskId) external nonReentrant {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "task does not exist");
        require(msg.sender == task.creator, "only creator can cancel");
        require(task.state == TaskState.Open, "task must be open to cancel");
        
        task.state = TaskState.Cancelled;
        
        uint256 refund = task.amount;
        (bool success, ) = task.creator.call{value: refund}("");
        require(success, "refund failed");
        
        emit TaskCancelled(_taskId, msg.sender, refund);
    }

    function raiseDispute(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.id != 0, "task does not exist");
        require(msg.sender == task.creator || msg.sender == task.worker, "only parties involved can dispute");
        require(task.state == TaskState.Assigned || task.state == TaskState.Submitted, "cannot dispute in current state");

        task.state = TaskState.Disputed;
        emit TaskDisputed(_taskId, msg.sender);
    }

    function resolveDispute(uint256 _taskId, address payable _winner) external onlyOwner nonReentrant {
        Task storage task = tasks[_taskId];
        require(task.state == TaskState.Disputed, "task not disputed");
        require(_winner == task.creator || _winner == task.worker, "winner must be creator or worker");

        task.state = TaskState.Resolved;
        
        // In this simple version, we pay out the full amount to the winner without fee deduction
        uint256 payout = task.amount;
        (bool success, ) = _winner.call{value: payout}("");
        require(success, "transfer failed");

        emit TaskResolved(_taskId, _winner, payout);
    }
}