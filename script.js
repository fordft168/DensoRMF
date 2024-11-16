// Replace with the raw URL of your data.json file on GitHub
const githubDataUrl = "https://raw.githubusercontent.com/your-username/your-repo/main/data.json";

// Fetch data from GitHub and initialize the Gantt chart
fetch(githubDataUrl)
    .then(response => response.json())
    .then(data => {
        gantt.parse(data); // Load data into Gantt chart
    })
    .catch(error => {
        console.error("Error loading data:", error);
    });

// Gantt chart configuration
gantt.config.date_format = "%Y-%m-%d"; // Format for dates
gantt.config.scale_unit = "week"; // Display weeks
gantt.config.date_scale = "Week #%W"; // Show week numbers
gantt.config.subscales = [
    { unit: "month", step: 1, date: "%F %Y" }
];

// Custom columns for tasks
gantt.config.columns = [
    { name: "checkbox", label: "", width: 40, template: function (task) {
        return `<input type="checkbox" ${task.done ? "checked" : ""} onclick="toggleTaskStatus(${task.id})">`;
    }},
    { name: "text", label: "Task name", width: 300, tree: true },
    { name: "start_date", label: "Start time", align: "center", width: 100 },
    { name: "duration", label: "Duration", align: "center", width: 80 },
    { name: "progress", label: "Progress", align: "center", width: 80, template: function(task) {
        return Math.round(task.progress * 100) + "%";
    }}
];

// Initialize Gantt chart
gantt.init("gantt_here");

// Add a new task
function addTask() {
    const id = gantt.uid(); // Generate unique ID
    gantt.addTask({
        id: id,
        text: "New Task",
        start_date: "2024-06-01", // Default start date
        duration: 5,
        progress: 0,
        done: false
    });
}

// Add a new subtask
function addSubTask() {
    const selectedTask = gantt.getSelectedId(); // Get selected task ID
    if (!selectedTask) {
        alert("Please select a task to add a subtask.");
        return;
    }
    const id = gantt.uid(); // Generate unique ID
    gantt.addTask({
        id: id,
        text: "New Subtask",
        start_date: "2024-06-01", // Default start date
        duration: 5,
        progress: 0,
        done: false,
        parent: selectedTask
    });
}

// Mock save to GitHub (replace with backend integration for real saving)
document.getElementById("saveBtn").addEventListener("click", function () {
    const data = gantt.serialize();
    console.log("Saving to GitHub is not implemented. Data to save:", JSON.stringify(data));
    alert("Saving to GitHub requires backend integration.");
});

// Toggle task status
function toggleTaskStatus(taskId) {
    const task = gantt.getTask(taskId);
    task.done = !task.done;
    gantt.updateTask(taskId);
}
