// Set the start date: June 1, 2024
const startDate = new Date("2024-06-01");
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Configure Gantt chart
gantt.config.date_format = "%Y-%m-%d"; // Ensure date format is recognized
gantt.config.scale_unit = "week"; // Set the main scale to weeks
gantt.config.date_scale = "Week #%W"; // Display week numbers
gantt.config.subscales = [
    { unit: "month", step: 1, date: "%F %Y" } // Add a subscale for months
];
// Enable adding new tasks
gantt.config.show_add_button = true; // Show the "+" button for adding tasks

// Toolbar for adding tasks and subtasks
const toolbar = document.createElement("div");
toolbar.style.margin = "10px";
toolbar.innerHTML = `
    <button onclick="addTask()">+ New Task</button>
    <button onclick="addSubTask()">+ New Subtask</button>
`;
document.body.insertBefore(toolbar, document.getElementById("gantt_here"));

// Function to add a new task
function addTask() {
    const id = gantt.uid(); // Generate unique ID
    gantt.addTask({
        id: id,
        text: "New Task",
        start_date: formatDate(new Date()), // Default start date is today
        duration: 5,
        progress: 0,
        done: false
    });
    gantt.showTask(id); // Scroll to the new task
    saveToLocalStorage(); // Save changes
}

// Function to add a new subtask
function addSubTask() {
    const selectedTask = gantt.getSelectedId(); // Get the selected task ID
    if (!selectedTask) {
        alert("Please select a task to add a subtask.");
        return;
    }

    const id = gantt.uid(); // Generate unique ID
    gantt.addTask({
        id: id,
        text: "New Subtask",
        start_date: formatDate(new Date()), // Default start date is today
        duration: 3,
        progress: 0,
        done: false,
        parent: selectedTask // Link to the selected task as its parent
    });
    gantt.showTask(id); // Scroll to the new subtask
    saveToLocalStorage(); // Save changes
}

// Customize Gantt grid columns
gantt.config.columns = [
    { name: "checkbox", label: "", width: 40, template: function (task) {
        return `<input type="checkbox" ${task.done ? "checked" : ""} onclick="toggleTaskStatus(${task.id})">`;
    }},
    { name: "text", label: "Task name", width: 365, tree: true }, // Adjust width for task names
    { name: "start_date", label: "Start time", align: "center", width: 100 },
    { name: "duration", label: "Duration", align: "center", width: 80 },
    { name: "progress", label: "Progress", align: "center", width: 80, template: function(task) {
        return Math.round(task.progress * 100) + "%";
    }}
];

// Initialize Gantt chart
gantt.init("gantt_here");

// Load saved data on page load
if (localStorage.getItem("ganttData")) {
    const savedData = JSON.parse(localStorage.getItem("ganttData"));
    gantt.parse(savedData);
} else {
    // Add initial project tasks
    gantt.parse({
    data: [
        { id: 1, text: "Basic Design (ออกแบบพื้นฐาน)", start_date: formatDate(startDate), duration: 30, progress: 0.5, done: false },
        { id: 2, text: "Basic Part Order (สั่งซื้อ)", start_date: formatDate(new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)), duration: 20, progress: 0.2, done: false, parent: 1 },
        { id: 3, text: "Basic Assembly (ประกอบพื้นฐาน)", start_date: formatDate(new Date(startDate.getTime() + 50 * 24 * 60 * 60 * 1000)), duration: 30, progress: 0.1, done: false },
        { id: 4, text: "Coding (เขียนโปรแกรมเบื้องต้น)", start_date: formatDate(new Date(startDate.getTime() + 80 * 24 * 60 * 60 * 1000)), duration: 40, progress: 0.0, done: false },
        { id: 5, text: "First Test (ทดสอบครั้งแรก)", start_date: formatDate(new Date(startDate.getTime() + 120 * 24 * 60 * 60 * 1000)), duration: 20, progress: 0.0, done: false },
        { id: 6, text: "Identify Missing Hardware (ค้นหาชิ้นส่วนที่ขาด)", start_date: formatDate(new Date(startDate.getTime() + 140 * 24 * 60 * 60 * 1000)), duration: 10, progress: 0.0, done: false },
        { id: 7, text: "Secondary Assembly (การประกอบเพิ่มเติม)", start_date: formatDate(new Date(startDate.getTime() + 150 * 24 * 60 * 60 * 1000)), duration: 30, progress: 0.0, done: false },
        { id: 8, text: "Advanced Coding (ปรับปรุงโปรแกรม)", start_date: formatDate(new Date(startDate.getTime() + 180 * 24 * 60 * 60 * 1000)), duration: 40, progress: 0.0, done: false },
        { id: 9, text: "Test and Debug (ทดสอบและแก้ไขข้อผิดพลาด)", start_date: formatDate(new Date(startDate.getTime() + 220 * 24 * 60 * 60 * 1000)), duration: 30, progress: 0.0, done: false },
        { id: 10, text: "Redesign and Iteration (ปรับปรุงและวนรอบ)", start_date: formatDate(new Date(startDate.getTime() + 250 * 24 * 60 * 60 * 1000)), duration: 50, progress: 0.0, done: false }
    ],
    links: [
        { id: 1, source: 1, target: 2, type: "0" },
        { id: 2, source: 2, target: 3, type: "0" },
        { id: 3, source: 3, target: 4, type: "0" },
        { id: 4, source: 4, target: 5, type: "0" },
        { id: 5, source: 5, target: 6, type: "0" },
        { id: 6, source: 6, target: 7, type: "0" },
        { id: 7, source: 7, target: 8, type: "0" },
        { id: 8, source: 8, target: 9, type: "0" },
        { id: 9, source: 9, target: 10, type: "0" }
    ]
});
}

// Save Gantt data to localStorage
document.getElementById("saveBtn").addEventListener("click", function () {
    const data = gantt.serialize(); // Get the Gantt chart data
    localStorage.setItem("ganttData", JSON.stringify(data)); // Save data to localStorage
    alert("Data saved successfully!");
});

// Load Gantt data from localStorage
document.getElementById("loadBtn").addEventListener("click", function () {
    const savedData = localStorage.getItem("ganttData");
    if (savedData) {
        gantt.clearAll(); // Clear existing Gantt chart data
        gantt.parse(JSON.parse(savedData)); // Load data from localStorage
        alert("Data loaded successfully!");
    } else {
        alert("No data found!");
    }
});

// Toggle task status (done/undone)
function toggleTaskStatus(taskId) {
    const task = gantt.getTask(taskId);
    task.done = !task.done;
    gantt.updateTask(taskId); // Refresh task display
}

// Save changes dynamically when tasks are added or edited
gantt.attachEvent("onAfterTaskAdd", function (id, task) {
    saveToLocalStorage();
});

gantt.attachEvent("onAfterTaskUpdate", function (id, task) {
    saveToLocalStorage();
});

gantt.attachEvent("onAfterTaskDelete", function (id) {
    saveToLocalStorage();
});

// Save changes dynamically when links are added or deleted
gantt.attachEvent("onAfterLinkAdd", function (id, link) {
    saveToLocalStorage();
});

gantt.attachEvent("onAfterLinkDelete", function (id) {
    saveToLocalStorage();
});

// Function to save all changes to localStorage
function saveToLocalStorage() {
    const data = gantt.serialize(); // Serialize Gantt data
    localStorage.setItem("ganttData", JSON.stringify(data)); // Save to localStorage
}
