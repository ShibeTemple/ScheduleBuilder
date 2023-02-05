console.log("!!!! Hello from scheduler.js!");
//

function removeWildcards(courses, prerequisites) {
    const wildcardCourses = [];
    const prereqMap = new Map();
  
    // Loop through each prerequisite (2D array)
    for (const prereq of prerequisites) {
      for (const course of prereq) {
        // If the course is not in the map, add it with a value of 1
        if (!prereqMap.has(course)) {
          prereqMap.set(course, 0);
        }
        prereqMap.set(course, prereqMap.get(course) + 1);
      }
    }
    // Loop through each course
    for (let i = 0; i < courses.length; i++) {
      // If the course is not in the map, remove it from the courses array and add it to the wildcardCourses array
      if (!prereqMap.has(courses[i])) {
        wildcardCourses.push(courses[i]);
        courses.splice(i, 1);
        i--;
      }
    }
    return wildcardCourses;
}

/*function findOrder(courses, prerequisites) {
    let graph = new Map();
    let indegree = new Map();
    let queue = [];

    // Create graph and indegree map
    for (let course of courses) {
        graph.set(course, []);
        indegree.set(course, 0);
    }

    // Add edges and update indegree map
    for (let [course, prereq] of prerequisites) {
        graph.get(prereq).push(course);
        indegree.set(course, indegree.get(course) + 1);
    }

    // Add courses with indegree of 0 to queue
    for (let [course, count] of indegree) {
        if (count === 0) {
            queue.push(course);
        }
    }

    // BFS
    let order = [];
    while (queue.length) {
        let prereq = queue.shift();
        order.push(prereq);

        // Remove edges and update indegree map
        if (graph.has(prereq)) {
            // Loop through each course that has prereq as a prerequisite
            for (let course of graph.get(prereq)) {
                // Remove edge
                indegree.set(course, indegree.get(course) - 1);
                // Add course to queue if indegree is 0
                if (indegree.get(course) === 0) {
                    queue.push(course);
                }
            }
        }
    }

    // Check if there is a cycle
    if (order.length !== courses.length) {
        return [];
    }
    return order;
}*/

function topologicalSort(courses, prerequisites) {
    const inDegree = {};
    const graph = {};
    
    // Create the graph representation
    courses.forEach(course => {
      inDegree[course] = 0;
      graph[course] = [];
    });
    
    prerequisites.forEach(([course, prereq]) => {
      inDegree[course]++;
      graph[prereq].push(course);
    });
    
    // Find all the vertices with no incoming edges
    const queue = courses.filter(course => inDegree[course] === 0);
    
    // Perform topological sort
    const topOrder = [];
    while (queue.length) {
      const node = queue.shift();
      topOrder.push(node);
      
      graph[node].forEach(neighbor => {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      });
    }
    
    // Return the topological order, or null if there is a cycle
    return topOrder.length === courses.length ? topOrder : null;
}

function visualizeGraph(courses, prerequisites) {
    const graph = {};
    
    // Create the graph representation
    courses.forEach(course => {
      graph[course] = [];
    });
    
    prerequisites.forEach(([course, prereq]) => {
      graph[prereq].push(course);
    });
    
    // Log the graph representation
    console.log("Graph Representation:");
    Object.entries(graph).forEach(([course, neighbors]) => {
      console.log(`${course} -> ${neighbors.join(', ')}`);
    });
}
  
  

//

// add a table to the document in the div with the ID schedules, with r rows and c columns. 
// scheduleCount is the number of schedules to create and insert
// add a title above the table with the name of the schedule
function createSchedule(r, c, scheduleCount) {
    let schedules = document.getElementById("schedules");

    for (let i = 0; i < scheduleCount; i++) {
        let table = document.createElement("table");
        table.id = "schedule" + i;
        table.className = "schedule";
        let title = document.createElement("h2");
        title.innerHTML = "Schedule " + i;
        schedules.appendChild(title);
        schedules.appendChild(table);
        
        for (let i = 0; i < r; i++) {
            let row = document.createElement("tr");
            row.id = "row" + i;
            table.appendChild(row);
            for (let j = 0; j < c; j++) {
                let cell = document.createElement("td");
                cell.id = "cell" + i + j;
                cell.className = "cell";
                // set the innerHTML of the cell to the cell's coordinates
                cell.innerHTML = "cell " + i + ":" + j;
                row.appendChild(cell);
            }
        }

    }

}




// loop through courses array and add each course to a table cell, one column at a time.
function fillSchedule(courses, wildcardCourses, rows, columns) {
    let courseIndex = 0;
    let tableIndex = 0;
    const tableCellCount = rows * columns;

    let numCourses = courses.length + wildcardCourses.length;
    
    
    
    
    console.log("numCourses: " + numCourses);
    for (let i = 0; i < numCourses; i++) {
        console.log("[" + i + "] tableIndex: " + tableIndex + " courseIndex: " + courseIndex)

        let currentRow = courseIndex % rows;
        let currentColumn = Math.floor(courseIndex / rows);

        let table = document.getElementById("schedule" + tableIndex);
        let cell = table.rows[currentRow].cells[currentColumn];

        // create div to hold course name
        cell.innerHTML = "";
        let courseDiv = document.createElement("div");
        courseDiv.className = "courseDiv";

        if (i < courses.length) {
            courseDiv.innerHTML = courses[i];
            cell.className = "sequenced";
        }
        else {
            //console.log("WILDCARD")
            courseDiv.innerHTML = wildcardCourses[i - courses.length];
            cell.className = "wildcard";
        }

        cell.appendChild(courseDiv);

        // add two buttons in each cell that either increase or decrease weight. their symbols would be + and -
        // create a div to hold the buttons
        let buttonDiv = document.createElement("div");
        buttonDiv.className = "buttonDiv";

        let downButton = document.createElement("button");
        downButton.innerHTML = "-";
        downButton.className = "downButton";

        let upButton = document.createElement("button");
        upButton.innerHTML = "+";
        upButton.className = "upButton";


        // add weight value display
        let weightDiv = document.createElement("div");
        weightDiv.id = "weightDiv";
        weightDiv.className = "weightDiv";
        weightDiv.innerHTML = "0";
        cell.prepend(weightDiv);

        // make sure the buttons are always joined together
        /*upButton.style.float = "left";
        downButton.style.float = "right";*/
        
        buttonDiv.append(downButton);
        buttonDiv.append(upButton);

        cell.prepend(buttonDiv);

        courseIndex++;

        // increment tableIndex if the current course index is greater than the number of courses per schedule
        if (courseIndex >= tableCellCount) {
            console.log("incrementing tableIndex");
            courseIndex = 0;
            tableIndex++;
        }

        
    }

    /*
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {

            // if the current course index is greater than the number of courses per schedule, move to the next schedule
            if (courseIndex >= tableCellCount) {
                courseIndex = 0;
                tableIndex++;
            }
            console.log("tableIndex: " + tableIndex + " courseIndex: " + courseIndex)

            // grab current table
            let table = document.getElementById("schedule" + tableIndex);
            // grab current cell in table
            let cell = table.rows[j].cells[i];
            //let cell = document.getElementById("cell" + j + i);
            // check if there are still elements left in the courses array
            if (courseIndex < courses.length) {
                console.log("Adding course [" + courseIndex + "] " + courses[courseIndex] + " to cell " + j + ":" + i);
                cell.innerHTML = courses[courseIndex];
            }
            // if there are no more elements in the courses array, add a wildcard course
            else if (wildcardCourses.length > (courseIndex - courses.length)) {
                console.log("Adding WILDCARD course [" + (courseIndex - courses.length) + "] " + wildcardCourses[courseIndex - courses.length] + " to cell " + j + ":" + i);
                cell.innerHTML = wildcardCourses[courseIndex - courses.length];
            }
            courseIndex++;
        }
    }*/
}

// calculate the necessary number of schedules to create based on the number of courses and rows/columns available for each schedule
function calcNumSchedules(courses, rows, columns) {
    let schedules = 1;
    let coursesPerSchedule = rows * columns;
    if (courses.length > coursesPerSchedule) {
        schedules = Math.ceil(courses.length / coursesPerSchedule);
    }
    return schedules;
}



//let courses = ["Math", "Algebra", "Physics", "Biology"];
//let prerequisites = [["Math", "Algebra"], ["Algebra", "Biology"]];

/*
let courses = ["Programming", "Data Structures", "Algorithms", "Web Development", "Database Systems"];
let prerequisites = [
["Data Structures", "Algorithms"],
["Algorithms", "Programming"],
["Web Development", "Programming"],
["Database Systems", "Data Structures"]
];*/

/*
let courses = ["History", "Geography", "Political Science", "Economics"];
let prerequisites = [
["History", "Political Science"],
["Geography", "Political Science"],
["Political Science", "Economics"]
];

let courses = ["English", "Literature", "Writing", "Grammar"];
let prerequisites = [
["Literature", "English"],
["Writing", "Literature"],
["Grammar", "Writing"]
];
*/
let courses = [
    "Obamaology",
    "Mathematics",
    "Calculus",
    "Linear Algebra",
    "Differential Equations",
    "Statistics",
    "Probability",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Science",
    "Software Engineering",
    "Data Science",
    "Web Development",
    "Database Systems",
    "Information Security",
    "Human-Computer Interaction",
    "Operating Systems",
    "Computer Networks",
    "Theory of Computation",
    "Programming Languages",
    "Algorithms and Data Structures",
    "Computer Graphics",
    "Parallel and Distributed Computing",
    "Mobile Application Development",
    "Natural Language Processing",
    "History 2",
    "History 4",
    "History 44",
    "History 1",
    "History 3",
    "Geology",
    "Geology in Space",
    "Geology in Africa"
    ];
    
let prerequisites = [
    ["Calculus", "Mathematics"],
    ["Linear Algebra", "Mathematics"],
    ["Differential Equations", "Calculus"],
    ["Statistics", "Probability"],
    ["Machine Learning", "Statistics"],
    ["Artificial Intelligence", "Machine Learning"],
    ["Software Engineering", "Computer Science"],
    ["Data Science", "Statistics"],
    ["Web Development", "Computer Science"],
    ["Database Systems", "Computer Science"],
    ["Information Security", "Computer Science"],
    ["Human-Computer Interaction", "Computer Science"],
    ["Operating Systems", "Computer Science"],
    ["Computer Networks", "Computer Science"],
    ["Theory of Computation", "Computer Science"],
    ["Programming Languages", "Computer Science"],
    ["Algorithms and Data Structures", "Computer Science"],
    ["Computer Graphics", "Computer Science"],
    ["Parallel and Distributed Computing", "Computer Science"],
    ["Mobile Application Development", "Computer Science"],
    ["Natural Language Processing", "Computer Science"],
    ["History 2", "History 1"],
    ["History 44", "History 4"],
    ["History 4", "History 3"],
    ["Obamaology", "Probability"],
    ["History 3", "History 2"]
    ];

console.log("courses:", courses);
console.log("prerequisites:", prerequisites);
console.log("wildcardCourses:");

wildcardCourses = removeWildcards(courses, prerequisites);

console.log("courses:", courses);
console.log("prerequisites:", prerequisites);
console.log("wildcardCourses:", wildcardCourses);

visualizeGraph(courses, prerequisites);

let sortedCourses = topologicalSort(courses, prerequisites);

console.log(sortedCourses);


let numSchedules = calcNumSchedules(sortedCourses.concat(wildcardCourses), 3, 4);

console.log("numSchedules:", numSchedules);

createSchedule(3, 4, numSchedules);
fillSchedule(sortedCourses, wildcardCourses, 3, 4);






