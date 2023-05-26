let page = document.getElementById("buttonDiv");

function handleButtonClick(event) {
    let status = event.target.dataset.status == "true";
    status = !status;
    render(this, status);
    chrome.storage.sync.set({ status });
}


function render(button, status) { 
    if (status) { 
        button.style.backgroundColor = "green";
        button.dataset.status = "true";
        button.innerHTML = "ON"
    } else { 
        button.style.backgroundColor = "red";
        button.dataset.status = "false";
        button.innerHTML = "OFF"
    }
}

function constructOptions() {
    chrome.storage.sync.get("status", (data) => {
        let status = data.status;

        let button = document.getElementById("eyy");
        render(button, status);

        button.addEventListener("click", handleButtonClick);
    });
}

constructOptions();
