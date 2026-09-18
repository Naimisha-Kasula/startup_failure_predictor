function loadUserName() {

    console.log("LOADING USER DATA...");

    const userNameElement =
        document.getElementById("userName");

    const companyNameElement =
        document.getElementById("companyName");

    const storedUser =
        localStorage.getItem("user");

    console.log("LOCAL STORAGE USER:", storedUser);


    // ==========================================
    // NO USER FOUND
    // ==========================================

    if (!storedUser) {

        console.log("No user found in localStorage.");

        if (userNameElement) {
            userNameElement.textContent = "User";
        }

        if (companyNameElement) {
            companyNameElement.textContent = "Company Name";
        }

        return;
    }


    try {

        const user =
            JSON.parse(storedUser);

        console.log("PARSED USER:", user);


        // ==========================================
        // FOUNDER NAME
        // ==========================================

        if (userNameElement) {

            userNameElement.textContent =
                user.founderName ||
                user.displayName ||
                "User";
        }


        // ==========================================
        // COMPANY NAME
        // ==========================================

        if (companyNameElement) {

            companyNameElement.textContent =
                user.companyName ||
                "Company Name";
        }


        console.log(
            "Founder:",
            user.founderName
        );

        console.log(
            "Company:",
            user.companyName
        );

    } catch (error) {

        console.error(
            "ERROR READING USER DATA:",
            error
        );

    }
}