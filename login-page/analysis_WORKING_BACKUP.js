// ============================================================
// ANALYSIS.JS
// Startup Failure Predictor
// ============================================================

console.log("=================================");
console.log("ANALYSIS.JS LOADED");
console.log("=================================");


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM LOADED");

    const button = document.getElementById("analyzeBtn");

    console.log("ANALYZE BUTTON:", button);

    if (!button) {

        console.error(
            "ERROR: analyzeBtn was not found."
        );

        return;
    }


    // ========================================================
    // BUTTON CLICK
    // ========================================================

    button.addEventListener("click", async function (event) {

        event.preventDefault();

        console.log("=================================");
        console.log("ANALYZE BUTTON CLICKED");
        console.log("=================================");


        // Disable button while processing

        button.disabled = true;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';


        try {

            // ==================================================
            // GET INPUT VALUES
            // ==================================================

            const startupData = {

                industry:
                    document.getElementById("industry").value.trim(),

                startupAge:
                    getNumber("startupAge"),

                fundingAmount:
                    getNumber("fundingAmount"),

                numberOfFounders:
                    getNumber("numberOfFounders"),

                founderExperience:
                    getNumber("founderExperience"),

                employeesCount:
                    getNumber("employeesCount"),

                revenue:
                    getNumber("revenue"),

                burnRate:
                    getNumber("burnRate"),

                marketSize:
                    document.getElementById("marketSize").value,

                businessModel:
                    document.getElementById("businessModel").value,

                productUniquenessScore:
                    getNumber("productUniquenessScore"),

                customerRetentionRate:
                    getNumber("customerRetentionRate"),

                marketingExpense:
                    getNumber("marketingExpense")
            };


            console.log("=================================");
            console.log("STARTUP DATA");
            console.log("=================================");

            console.log(
                JSON.stringify(
                    startupData,
                    null,
                    2
                )
            );


            // ==================================================
            // BASIC VALIDATION
            // ==================================================

            if (!startupData.industry) {

                throw new Error(
                    "Please enter the industry."
                );
            }


            if (!startupData.marketSize) {

                throw new Error(
                    "Please select the market size."
                );
            }


            if (!startupData.businessModel) {

                throw new Error(
                    "Please select the business model."
                );
            }


            // ==================================================
            // API URL
            // ==================================================

            const API_URL =
                "http://127.0.0.1:5000/api/analyze";


            console.log("=================================");
            console.log("CALLING FLASK API");
            console.log("=================================");

            console.log(
                "API URL:",
                API_URL
            );


            // ==================================================
            // FETCH FLASK API
            // ==================================================

            const response = await fetch(
                API_URL,
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
                "HTTP STATUS:",
                response.status
            );

            console.log(
                "HTTP OK:",
                response.ok
            );


            // ==================================================
            // READ RESPONSE
            // ==================================================

            const responseText =
                await response.text();


            console.log(
                "RAW FLASK RESPONSE:"
            );

            console.log(
                responseText
            );


            let result;


            try {

                result =
                    JSON.parse(responseText);

            }

            catch (jsonError) {

                console.error(
                    "JSON PARSE ERROR:",
                    jsonError
                );

                throw new Error(
                    "Flask did not return valid JSON."
                );
            }


            console.log(
                "PARSED RESULT:"
            );

            console.log(result);


            // ==================================================
            // CHECK API RESPONSE
            // ==================================================

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    result.error ||
                    `Flask returned HTTP ${response.status}`
                );
            }


            if (result.status !== "success") {

                throw new Error(
                    result.message ||
                    result.error ||
                    "Analysis failed."
                );
            }


            // ==================================================
            // DISPLAY RESULTS
            // ==================================================

            displayResults(result);


            // ==================================================
            // SAVE LAST ANALYSIS
            // ==================================================

            const analysisRecord = {

                startupData:
                    startupData,

                result:
                    result,

                analyzedAt:
                    new Date().toISOString()
            };


            localStorage.setItem(
                "lastAnalysis",
                JSON.stringify(
                    analysisRecord
                )
            );


            // ==================================================
            // SAVE HISTORY
            // ==================================================

            let history = [];

            try {

                history =
                    JSON.parse(
                        localStorage.getItem(
                            "analysisHistory"
                        ) || "[]"
                    );

            }

            catch (error) {

                console.warn(
                    "Could not read analysis history."
                );

                history = [];
            }


            history.push(
                analysisRecord
            );


            localStorage.setItem(
                "analysisHistory",
                JSON.stringify(
                    history
                )
            );


            console.log(
                "ANALYSIS SAVED SUCCESSFULLY"
            );


            // ==================================================
            // SCROLL TO RESULTS
            // ==================================================

            const resultSection =
                document.getElementById(
                    "resultSection"
                );


            if (resultSection) {

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }


        }

        catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "ANALYSIS ERROR"
            );

            console.error(error);

            console.error(
                "================================="
            );


            alert(
                "Analysis failed:\n\n" +
                error.message
            );

        }

        finally {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-rocket"></i> Analyze My Startup';
        }

    });

});


// ============================================================
// GET NUMBER
// ============================================================

function getNumber(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.error(
            "Input not found:",
            id
        );

        return 0;
    }


    const value =
        parseFloat(element.value);


    if (isNaN(value)) {

        return 0;
    }


    return value;
}


// ============================================================
// DISPLAY RESULTS
// ============================================================

function displayResults(result) {

    console.log(
        "================================="
    );

    console.log(
        "DISPLAYING RESULTS"
    );

    console.log(
        "================================="
    );


    // ========================================================
    // RESULT SECTION
    // ========================================================

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    if (resultSection) {

        resultSection.style.display =
            "block";
    }


    // ========================================================
    // SUMMARY
    // ========================================================

    setText(
        "prediction",
        result.predictionLabel || "-"
    );


    setText(
        "successProbability",
        `${result.successProbability ?? 0}%`
    );


    setText(
        "failureProbability",
        `${result.failureProbability ?? 0}%`
    );


    setText(
        "healthScore",
        `${result.healthScore ?? 0}/100`
    );


    setText(
        "riskLevel",
        result.riskLevel || "-"
    );


    // ========================================================
    // RISK CATEGORIES
    // ========================================================

    setText(
        "financialRisk",
        result.financialRisk || "-"
    );


    setText(
        "marketRisk",
        result.marketRisk || "-"
    );


    setText(
        "teamRisk",
        result.teamRisk || "-"
    );


    setText(
        "operationsRisk",
        result.operationsRisk ||
        result.operationalRisk ||
        "-"
    );


    setText(
        "businessEnvironmentRisk",
        result.businessEnvironmentRisk || "-"
    );


    // ========================================================
    // RISK FACTORS
    // ========================================================

    const riskFactors =
        document.getElementById(
            "riskFactors"
        );


    if (riskFactors) {

        riskFactors.innerHTML = "";


        const factors =
            Array.isArray(
                result.riskFactors
            )
                ? result.riskFactors
                : [];


        if (factors.length === 0) {

            const li =
                document.createElement("li");

            li.textContent =
                "No major risk factors identified.";

            riskFactors.appendChild(li);

        }

        else {

            factors.forEach(function (factor) {

                const li =
                    document.createElement("li");

                li.textContent =
                    factor;

                riskFactors.appendChild(li);

            });
        }
    }


    // ========================================================
    // RECOMMENDATIONS
    // ========================================================

    const recommendations =
        document.getElementById(
            "recommendations"
        );


    if (recommendations) {

        recommendations.innerHTML = "";


        const items =
            Array.isArray(
                result.recommendations
            )
                ? result.recommendations
                : [];


        if (items.length === 0) {

            const li =
                document.createElement("li");

            li.textContent =
                "Maintain financial discipline and sustainable growth.";

            recommendations.appendChild(li);

        }

        else {

            items.forEach(function (recommendation) {

                const li =
                    document.createElement("li");

                li.textContent =
                    recommendation;

                recommendations.appendChild(li);

            });
        }
    }


    console.log(
        "RESULTS DISPLAYED SUCCESSFULLY"
    );
}


// ============================================================
// SET TEXT SAFELY
// ============================================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (!element) {

        console.warn(
            "Element not found:",
            id
        );

        return;
    }


    element.textContent =
        value;
}