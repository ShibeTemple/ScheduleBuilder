let textboxCount = 0;
let uniqueObjectsMaster = [];
let textboxNames = [];


function addTextbox() {
    textboxCount++;
    // Textbox Container
    let container = document.getElementById("textboxContainer");

    // Individual Textbox Container
    let instance = document.createElement("div");
    instance.id = "container" + textboxCount;
    instance.className = "container";

    // Textbox
    let textbox = document.createElement("textarea");
    textbox.id = "textbox" + textboxCount;
    textbox.placeholder = "Input course list here, seperated by line.\n\nEx: \nCOGS 1\nCOGS 2\nCOGS 3";

    // Textbox name
    let namebox = document.createElement("input");
    namebox.id = "namebox" + textboxCount;
    namebox.type = "text";
    namebox.placeholder = "Program " + textboxCount + " Name";
    namebox.value = "Program " + textboxCount;

    let columnUnique = document.createElement("div");
    columnUnique.id = "columnUnique" + textboxCount;

    // add a new empty array to the master array for this new textbox
    uniqueObjectsMaster.push([]);
    textboxNames.push(namebox.value);

    instance.appendChild(namebox);
    instance.appendChild(textbox);
    instance.appendChild(columnUnique);

    container.appendChild(instance);
}

function compareTextboxes() {
    let output = document.getElementById("output");
    let shared = {};
    let unique = {};

    for (let i = 1; i <= textboxCount; i++) {
        let textbox = document.getElementById("textbox" + i);
        let namebox = document.getElementById("namebox" + i);
        let columnUnique = document.getElementById("columnUnique" + i);

        // if the sortCheckbox is checked, sort the lines in the textbox alphabetically
        let sortCheckbox = document.getElementById("sortCheckbox");
        if (sortCheckbox.checked) {
            let lines = textbox.value.split("\n");
            lines.sort();
            textbox.value = lines.join("\n");
        }

        let lines = textbox.value.split("\n");
        let textboxName = namebox.value;
        textboxNames[i - 1] = textboxName;

        for (let j = 0; j < lines.length; j++) {
            let line = lines[j].trim(); // trim whitespace
            if (line === "") { // skip empty lines
                continue;
            }

            if (!unique.hasOwnProperty(line)) {
                unique[line] = [i];
            } else if (unique[line].indexOf(i) === -1) {
                unique[line].push(i);
            }

        }

        // reset columnUnique for each textbox
        columnUnique.innerHTML = "<b>Unique Classes:</b><br>";

    }

    for (let key in unique) {
        if (unique[key].length > 1) {
            shared[key] = unique[key];
            delete unique[key];
        }
    }

    // list all shared objects
    let sharedOutput = "<b>Shared Classes:</b><br>";
    for (let key in shared) {
        sharedOutput += key + " - [" + shared[key].join(", ") + "]";

        // update sharedOutput to contain the object and all the textbox names it is present in
        let textboxNamesString = "";
        for (let i = 0; i < shared[key].length; i++) {
            textboxNamesString += textboxNames[shared[key][i] - 1] + ", ";
        }
        // remove the last comma
        textboxNamesString = textboxNamesString.substring(0, textboxNamesString.length - 2);
        sharedOutput += " " + textboxNamesString + "<br>";




    }

    // list all unique objects
    let uniqueOutput = "<b>Unique Classes:</b><br>";
    for (let key in unique) {
        // update the unique list at the bottom of the page
        uniqueOutput += key + " - [" + unique[key][0] + "] " + textboxNames[unique[key][0] - 1] + "<br>";

        // update the unique column for each textbox
        let columnUnique = document.getElementById("columnUnique" + unique[key][0]);
        columnUnique.innerHTML += key + "<br>";
    }

    output.innerHTML = sharedOutput + "<br>" + uniqueOutput;
}







document.addEventListener("input", compareTextboxes);
addTextbox();
addTextbox();
