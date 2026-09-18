
// ==========================================
// DASHBOARD.JS
// ==========================================

console.log("DASHBOARD.JS LOADED");


// ==========================================
// FLASK API URL
// ==========================================

const API_URL = "http://127.0.0.1:5000";


// ==========================================
// DOM LOADED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM LOADED");

    loadUserName();
    setupLogout();
    setupAnalysis();

});


// ==========================================
// LOAD USER NAME
// ==========================================

// ==========================================
// LOAD USER NAME + COMPANY NAME
// ==========================================

async function loadUserName() {

    const founderNameElement =
        document.getElementById("founderName");

    const companyNameElement =
        document.getElementById("companyName");

    if (!founderNameElement) {

        console.error("founderName element not found");

        return;
    }


    // Get logged-in user from localStorage
    const userData =
        localStorage.getItem("user");


    if (!userData) {

        founderNameElement.textContent = "User";

        if (companyNameElement) {
            companyNameElement.textContent = "Company";
        }

        return;
    }


    try {

        const user =
            JSON.parse(userData);


        // --------------------------------------
        // If Firebase UID is available
        // --------------------------------------

        if (user.uid) {

            const response =
                await fetch(
                    "https://startup-failure-predictor-default-rtdb.asia-southeast1.firebasedatabase.app/users/" +
                    user.uid +
                    ".json"
                );


            if (response.ok) {

                const data =
                    await response.json();


                console.log(
                    "USER DATA FROM FIREBASE:",
                    data
                );


                // ----------------------------------
                // FOUNDER NAME
                // ----------------------------------

                if (data && data.founderName) {

                    founderNameElement.textContent =
                        data.founderName;

                }

                else if (user.founderName) {

                    founderNameElement.textContent =
                        user.founderName;

                }

                else if (user.displayName) {

                    founderNameElement.textContent =
                        user.displayName;

                }

                else if (user.email) {

                    founderNameElement.textContent =
                        user.email.split("@")[0];

                }

                else {

                    founderNameElement.textContent =
                        "User";
                }


                // ----------------------------------
                // COMPANY NAME
                // ----------------------------------

                if (companyNameElement && data && data.companyName) {

                    companyNameElement.textContent =
                        data.companyName;

                }

                else if (companyNameElement && user.companyName) {

                    companyNameElement.textContent =
                        user.companyName;

                }

            }

            else {

                console.error(
                    "Unable to get user data from Firebase"
                );

                // Fallback to localStorage data

                if (user.founderName) {

                    founderNameElement.textContent =
                        user.founderName;

                }

                else if (user.displayName) {

                    founderNameElement.textContent =
                        user.displayName;

                }

                else if (user.email) {

                    founderNameElement.textContent =
                        user.email.split("@")[0];

                }

                else {

                    founderNameElement.textContent =
                        "User";
                }


                if (companyNameElement && user.companyName) {

                    companyNameElement.textContent =
                        user.companyName;

                }
            }

        }

        else {

            // ----------------------------------
            // FALLBACK
            // ----------------------------------

            if (user.founderName) {

                founderNameElement.textContent =
                    user.founderName;

            }

            else if (user.displayName) {

                founderNameElement.textContent =
                    user.displayName;

            }

            else if (user.email) {

                founderNameElement.textContent =
                    user.email.split("@")[0];

            }

            else {

                founderNameElement.textContent =
                    "User";
            }


            if (companyNameElement && user.companyName) {

                companyNameElement.textContent =
                    user.companyName;

            }
        }

    }

    catch (error) {

        console.error(
            "Error loading user:",
            error
        );

        founderNameElement.textContent =
            "User";
    }
}


// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {

    const logoutButton =
        document.getElementById("logoutBtn");


    if (!logoutButton) {

        console.error(
            "Logout button not found"
        );

        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem("user");
            localStorage.removeItem("loggedIn");


            window.location.href =
                "./index.html";

        }
    );
}


// ==========================================
// SETUP ANALYSIS
// ==========================================

function setupAnalysis() {

    const analyzeButton =
        document.getElementById("analyzeBtn");


    if (!analyzeButton) {

        console.warn(
            "analyzeBtn not found"
        );

        return;
    }


    analyzeButton.addEventListener(
        "click",
        analyzeStartup
    );
}


// ==========================================
// ANALYZE STARTUP
// ==========================================

async function analyzeStartup() {

    console.log("ANALYZE BUTTON CLICKED");


    // ======================================
    // GET INPUT VALUES
    // ======================================

    const startupData = {

        industry:
            document.getElementById("industry")?.value || "",

        startupAge:
            document.getElementById("startupAge")?.value || 0,

        fundingAmount:
            document.getElementById("fundingAmount")?.value || 0,

        numberOfFounders:
            document.getElementById("numberOfFounders")?.value || 0,

        founderExperience:
            document.getElementById("founderExperience")?.value || 0,

        employeesCount:
            document.getElementById("employeesCount")?.value || 0,

        revenue:
            document.getElementById("revenue")?.value || 0,

        burnRate:
            document.getElementById("burnRate")?.value || 0,

        marketSize:
            document.getElementById("marketSize")?.value || "",

        businessModel:
            document.getElementById("businessModel")?.value || "",

        productUniquenessScore:
            document.getElementById("productUniquenessScore")?.value || 0,

        customerRetentionRate:
            document.getElementById("customerRetentionRate")?.value || 0,

        marketingExpense:
            document.getElementById("marketingExpense")?.value || 0

    };


    console.log(
        "DATA SENT TO FLASK:",
        startupData
    );


    // ======================================
    // CALL FLASK API
    // ======================================

    try {

        const response =
            await fetch(
                `${API_URL}/api/analyze`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body:
                        JSON.stringify(startupData)
                }
            );


        console.log(
            "FLASK RESPONSE STATUS:",
            response.status
        );


        const result =
            await response.json();


        console.log(
            "FLASK RESPONSE:",
            result
        );


        // ==================================
        // ERROR FROM FLASK
        // ==================================

        if (!response.ok) {

            console.error(
                "FLASK ERROR:",
                result
            );

            alert(
                result.message ||
                "Startup analysis failed."
            );

            return;
        }


        // ==================================
        // DISPLAY RESULT
        // ==================================

        displayAnalysisResult(result);

    }

    catch (error) {

        console.error(
            "FETCH ERROR:",
            error
        );

        alert(
            "Unable to connect to Flask server. Make sure app.py is running on port 5000."
        );
    }
}


// ==========================================
// DISPLAY ANALYSIS RESULT
// ==========================================

function displayAnalysisResult(result) {

    console.log(
        "DISPLAYING ANALYSIS RESULT:",
        result
    );


    // ======================================
    // PREDICTION
    // ======================================

    setText(
        "prediction",
        result.predictionLabel
    );


    // ======================================
    // SUCCESS PROBABILITY
    // ======================================

    setText(
        "successProbability",
        `${result.successProbability}%`
    );


    // ======================================
    // FAILURE PROBABILITY
    // ======================================

    setText(
        "failureProbability",
        `${result.failureProbability}%`
    );


    // ======================================
    // HEALTH SCORE
    // ======================================

    setText(
        "healthScore",
        `${result.healthScore}/100`
    );


    // ======================================
    // RISK LEVEL
    // ======================================

    setText(
        "riskLevel",
        result.riskLevel
    );


    // ======================================
    // OVERALL RISK
    // ======================================

    setText(
        "overallRisk",
        `${result.overallRisk}%`
    );


    // ======================================
    // FINANCIAL RISK
    // ======================================

    setText(
        "financialRisk",
        result.financialRisk
    );


    // ======================================
    // MARKET RISK
    // ======================================

    setText(
        "marketRisk",
        result.marketRisk
    );


    // ======================================
    // TEAM RISK
    // ======================================

    setText(
        "teamRisk",
        result.teamRisk
    );


    // ======================================
    // OPERATIONAL RISK
    // ======================================

    setText(
        "operationalRisk",
        result.operationalRisk
    );


    // ======================================
    // BUSINESS ENVIRONMENT RISK
    // ======================================

    setText(
        "businessEnvironmentRisk",
        result.businessEnvironmentRisk
    );


    // ======================================
    // RISK FACTORS
    // ======================================

    displayList(
        "riskFactors",
        result.riskFactors
    );


    // ======================================
    // RECOMMENDATIONS
    // ======================================

    displayList(
        "recommendations",
        result.recommendations
    );


    // ======================================
    // SHOW RESULT SECTION
    // ======================================

    const resultSection =
        document.getElementById("analysisResult");


    if (resultSection) {

        resultSection.style.display = "block";
    }


    console.log(
        "ANALYSIS RESULT DISPLAYED SUCCESSFULLY"
    );
}


// ==========================================
// SET TEXT HELPER
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            `Element #${id} not found`
        );

        return;
    }


    element.textContent =
        value ?? "--";
}


// ==========================================
// DISPLAY LIST
// ==========================================

function displayList(id, items) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            `Element #${id} not found`
        );

        return;
    }


    element.innerHTML = "";


    if (!items || items.length === 0) {

        const li =
            document.createElement("li");

        li.textContent =
            "No items identified.";

        element.appendChild(li);

        return;
    }


    items.forEach(function (item) {

        const li =
            document.createElement("li");

        li.textContent =
            item;

        element.appendChild(li);

    });
}

