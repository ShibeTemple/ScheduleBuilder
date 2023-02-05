// COGS 118A, 118B, 118C, and 118D.
// 	COGS 107A,107B,107C
// COGS 118A,118B,118C,118D,160,180,181,182,185,188,189 BIPN 146 CSE 101,102,105,
function addDepartment(text) {
    console.log("%c" + text, "color:blue");

    let numCourses = 0;

    let newLineCheckbox = document.getElementById("newLineCheckbox");

    // NOTE: for debugging/analytics only
    // make a numCommas int and set it to the number of commas in the input text
    let numCommas = (text.match(/,/g) || []).length;


    // make text all one line
    text = text.replace(/\n/g, ' ');

    // remove any () from the text and the content within them
    text = text.replace(/\([^)]*\)/g, '');

    // make all uppercase
    text = text.toUpperCase();

    let department = "";
    let newText = "";
    let courses = text.split(/[\s,]+/); // split the text by spaces or commas
    for (let i = 0; i < courses.length; i++) {
        let course = courses[i];
        console.log("course: " + course);


        // if the course is not alphanumeric, skip it
        // along with some other cases, like and or TO and non alphanumeric characters
        if (course === "" || course === "and" || course === "or" || course === "TO" || !course.match(/[a-zA-Z0-9]+/)) {
            console.log("skipping empty course / and");
            continue;
        }
        if (isNaN(course[0])) { // check if the first character of the course is a letter, indicating it's a department
            console.log("Is a department");

            // remove any whitespaces from course
            course = course.replace(/\s/g, '');
            // keep only the first part of the course that contains letters
            let match = course.match(/[a-zA-Z]+/);

            department = match; // update the current department

            // if there was a course attached to the course after the department name, add it to the new text
            if (course.length > match[0].length) {

                // if newLineCheckbox is checked, add a newline
                if (newLineCheckbox.checked) {
                    newText += department + " " + course.slice(match[0].length) + "\n";
                } else {
                    newText += department + " " + course.slice(match[0].length) + ", ";
                }

                numCourses++;
            }
            //newText += course + " ";
        } else {
            // if the last course, and the checkbox is checked, add "and" to the course
            let andCheckbox = document.getElementById("andCheckbox");
            if (i === courses.length - 1 && andCheckbox.checked) {
                newText += "and " + department + " " + course;
            } else {
                newText += department + " " + course // add the department to the course
            }

            // add newline if newLineCheckbox is checked
            if (newLineCheckbox.checked) {
                newText += "\n";
            } else {
                // add a comma if not the last course.
                if (i !== courses.length - 1) {
                    newText += ", ";
                }
            }

            numCourses++;

            // update the number of courses displayed in the numCourses 
            let numCoursesSpan = document.getElementById("numCourses");
            numCoursesSpan.innerHTML = numCourses + ", commas: " + numCommas + ". difference: " + (numCourses - numCommas);



        }
    }
    return newText;
}

// write javascript code that changes a given text by adding the department name to each course listed instead of just the leading one. There can be multiple departments per input, and it should continue with the last seen department name. The department name will always be all text with no numbers. The code should be able to determine the name of the department given just input text and update the department if it changes within the same text input.  



function expandCourseDump() {
    //let text = "COGS 118A, 118B, 118C, and 118D.";
    let courseDumpTextbox = document.getElementById("courseDumpTextbox");
    let text = courseDumpTextbox.value;
    //let newText = text.replace(/([A-Za-z]+\s)(\d+[A-Za-z])(,\s)/g, "$1$2, $1");
    let newText = addDepartment(text);
    //console.log(newText);
    courseDumpTextbox.value = newText;
}


