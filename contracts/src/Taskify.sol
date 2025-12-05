// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Taskify is ReentrancyGuard, Ownable {
    // ------- Configurable parameters -------
    uint256 public minAmount; // minimum allowed amount for a task (in wei)

    constructor(uint256 _minAmount)Ownable(msg.sender) {
        require(_minAmount > 0, "minAmount must be > 0");
        minAmount = _minAmount;
    }

    // ------- Events -------
    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        string title,
        string category,
        uint256 amount,
        uint256 deadline
    );

    event TaskAccepted(
        uint256 indexed taskId,
        address indexed worker
    );

    // ------- Task struct & storage -------
    enum TaskState { Open, Assigned, Completed, Cancelled }

    struct Task {
        uint256 id;
        address payable creator;
        address payable worker;  // assigned freelancer
        string title;
        string description;
        string category;
        uint256 amount;     // amount locked in escrow (wei)
        uint256 deadline;   // unix timestamp
        TaskState state;
        uint256 createdAt;
    }

    // tasks by id
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    // keep list of creator -> task ids
    mapping(address => uint256[]) public tasksByCreator;
    
    // keep list of worker -> task ids
    mapping(address => uint256[]) public tasksByWorker;

    // ------- Modifiers -------
    modifier nonEmptyString(string memory s) {
        _nonEmptyString(s);
        _;
    }

    function _nonEmptyString(string memory s) pure internal {
        require(bytes(s).length > 0, "string must be non-empty");
    }

    // ------- Admin functions -------
    function setMinAmount(uint256 _minAmount) external onlyOwner {
        require(_minAmount > 0, "minAmount must be > 0");
        minAmount = _minAmount;
    }

    // ------- createTask implementation -------
    /// @notice Create a new task and lock funds in escrow (msg.value must equal amount)
    /// @param _title short title of the task (non-empty)
    /// @param _description longer description (non-empty)
    /// @param _category category name (non-empty)
    /// @param _deadline unix timestamp (must be in the future)
    /// @dev msg.value must equal `_amount` supplied here, ensuring escrow deposit.
    function createTask(
        string calldata _title,
        string calldata _description,
        string calldata _category,
        uint256 _deadline
    )
        external
        payable
        nonEmptyString(_title)
        nonEmptyString(_description)
        nonEmptyString(_category)
        returns (uint256)
    {
        // ---- Checks ----
        require(msg.value >= minAmount, "sent value below minAmount");
        require(msg.value > 0, "amount must be > 0");
        require(_deadline > block.timestamp, "deadline must be in the future");

        // ---- Effects ----
        taskCount += 1;
        uint256 newTaskId = taskCount;

        Task memory t = Task({
            id: newTaskId,
            creator: payable(msg.sender),
            worker: payable(address(0)),  // no worker assigned yet
            title: _title,
            description: _description,
            category: _category,
            amount: msg.value,
            deadline: _deadline,
            state: TaskState.Open,
            createdAt: block.timestamp
        });

        tasks[newTaskId] = t;
        tasksByCreator[msg.sender].push(newTaskId);

        // ---- Emit event ----
        emit TaskCreated(newTaskId, msg.sender, _title, _category, msg.value, _deadline);

        return newTaskId;
    }

    // ------- acceptTask implementation -------
    /// @notice Accept an open task and register as the assigned worker
    /// @param _taskId the ID of the task to accept
    /// @dev Only callable when task is in Open state and before deadline
    function acceptTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];

        // ---- Checks ----
        require(task.id != 0, "task does not exist");
        require(task.state == TaskState.Open, "task is not open");
        require(block.timestamp < task.deadline, "task deadline has passed");
        require(msg.sender != task.creator, "creator cannot accept own task");

        // ---- Effects ----
        task.worker = payable(msg.sender);
        task.state = TaskState.Assigned;
        tasksByWorker[msg.sender].push(_taskId);

        // ---- Emit event ----
        emit TaskAccepted(_taskId, msg.sender);
    }
}
