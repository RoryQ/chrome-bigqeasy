function add_click_capability() {
    document.addEventListener("keydown", function (e) {
        let key = e.which;

        if (key == 37 && !document.querySelector("input,textarea").matches(":focus")) {
            simulateMouseClick(document.querySelector("jfk-button[jfk-on-action='paginateCtrl.goToPrevPage()']"));
        } else if (key == 39 && !document.querySelector("input,textarea").matches(":focus")) {
            simulateMouseClick(document.querySelector("jfk-button[jfk-on-action='paginateCtrl.goToNextPage()']"));
        } else if ((e.keyCode == 10 || e.keyCode == 13) && (e.ctrlKey || e.metaKey)) {
            simulateMouseClick(document.querySelector("jfk-button[instrumentation-id='bq-run-query-button']"));
        }
    });
}

function init_environment() {
    window.addEventListener("DOMContentLoaded", function () {
        console.log("BigQEasy initialized");

        // Add a "Query Temp table" and "Data Studio" button
        // -----------------------------------------------
        let queryTempButton = createButton("Query Temp Table", function () {
            browser.runtime.sendMessage({ askToOpenTempTable: true, askToExploreTempTable: false }).then(function (response) {
                waitForEl("g-tab[g-tab-value='PREVIEW']", function () {
                    simulateMouseClick(document.querySelector("g-tab[g-tab-value='PREVIEW']"));
                });
            });
            simulateMouseClick(document.querySelector("a[ng-click='ctrl.goToAsset(ctrl.job.config.destinationTable)']"));
        });

        let exploreTempButton = createButton("Data Studio", function () {
            browser.runtime.sendMessage({ askToOpenTempTable: false, askToExploreTempTable: true }).then(function (response) {
                waitForEl("g-tab[g-tab-value='PREVIEW']", function () {
                    simulateMouseClick(document.querySelector("g-tab[g-tab-value='PREVIEW']"));
                });
            });
            simulateMouseClick(document.querySelector("a[ng-click='ctrl.goToAsset(ctrl.job.config.destinationTable)']"));
        });

        document.querySelector("pan-action-bar-container[container-id='secondary-panel-bar']").addEventListener("DOMSubtreeModified", function (e) {
            let saveButton = document.querySelector("pan-action-bar-button[ng-click='ctrl.openSaveResultsModal()']");
            if (saveButton) {
                if (!saveButton.parentNode.contains(queryTempButton)) {
                    saveButton.parentNode.appendChild(queryTempButton);
                }
                if (!saveButton.parentNode.contains(exploreTempButton)) {
                    saveButton.parentNode.appendChild(exploreTempButton);
                }
            }
        });

        // Rest of your code...
    });
}

// Helper function to create a button element
function createButton(text, clickHandler) {
    let button = document.createElement("pan-action-bar-button");
    button.setAttribute("role", "button");
    button.innerHTML = `
        <div class="p6n-action-bar-button-container">
            <button class="p6n-material-button p6n-action-bar-button md-primary md-button md-ink-ripple" type="button">
                <div class="p6n-action-bar-button-background" style="background-color: rgb(59, 120, 231);"></div>
                <span>${text}</span>
                <div class="md-ripple-container" style=""></div>
            </button>
        </div>
    `;
    button.onclick = clickHandler;
    return button;
}

// The rest of your code...

add_click_capability();
init_environment();
