// Toggle password visibility
function togglePassword() {
    const password = document.getElementById("password");
    password.type = password.type === "password" ? "text" : "password";
}

// Role switch
const roles = document.querySelectorAll(".role");

roles.forEach(role => {
    role.addEventListener("click", () => {
        roles.forEach(r => r.classList.remove("active"));
        role.classList.add("active");
    });
});

// Form validation
document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill all fields");
        return;
    }

    // Call the global handleAuth function defined in auth.js
    if (window.handleAuth) {
        window.handleAuth(email, password, isLoginMode);
    } else {
        alert("Authentication is currently loading...");
    }
});

// Form toggling between Login and Sign Up
let isLoginMode = true;
function toggleMode(e) {
    if (e) e.preventDefault();
    isLoginMode = !isLoginMode;
    
    // Updates UI Text depending on the current mode
    document.querySelector("h2").textContent = isLoginMode ? "Login" : "Sign Up";
    document.querySelector(".login-btn").textContent = isLoginMode ? "Login" : "Sign Up";
    
    // Updates the footnote prompt
    const promptText = document.getElementById("authPrompt");
    if (isLoginMode) {
        promptText.innerHTML = `Don't have an account? <a href="#" onclick="toggleMode(event)" class="auth-link">Sign up</a>`;
    } else {
        promptText.innerHTML = `Already have an account? <a href="#" onclick="toggleMode(event)" class="auth-link">Login</a>`;
    }
}

// Remove Spline logo ("text behind the robot") persistently
const splineViewer = document.querySelector("spline-viewer");
if (splineViewer) {
    const removeLogoInterval = setInterval(() => {
        // Try selecting logo by ID or anchor tag since versions vary
        const shadow = splineViewer.shadowRoot;
        if (shadow) {
            const logo = shadow.querySelector("#logo") || shadow.querySelector("a[href*='spline']");
            if (logo) {
                logo.style.display = 'none'; // visually hide
                logo.remove(); // physically remove
                clearInterval(removeLogoInterval);
            }
        }
    }, 500); // Check every 500ms
    
    // Stop trying after 10 seconds to avoid infinite loop
    setTimeout(() => {
        clearInterval(removeLogoInterval);
    }, 10000);
}