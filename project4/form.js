const CONFIG = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
  },
  messages: {
    loginSuccess: "You're logged in.",
    loginInvalid: "Check the highlighted field(s) and try again.",
    signupSuccess: "Account created. You can now log in.",
    signupInvalid: "Check the highlighted field(s) and try again.",
  },
};

/* ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginPanel = document.getElementById("login-panel");
  const signupPanel = document.getElementById("signup-panel");

  // ---------------- Tab switching ----------------

  function showLogin() {
    tabLogin.classList.add("is-active");
    tabSignup.classList.remove("is-active");
    tabLogin.setAttribute("aria-selected", "true");
    tabSignup.setAttribute("aria-selected", "false");
    loginPanel.hidden = false;
    signupPanel.hidden = true;
  }

  function showSignup() {
    tabSignup.classList.add("is-active");
    tabLogin.classList.remove("is-active");
    tabSignup.setAttribute("aria-selected", "true");
    tabLogin.setAttribute("aria-selected", "false");
    signupPanel.hidden = false;
    loginPanel.hidden = true;
  }

  tabLogin.addEventListener("click", showLogin);
  tabSignup.addEventListener("click", showSignup);

  // ---------------- Password reveal ----------------

  document.querySelectorAll(".reveal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      const isShown = target.type === "text";
      target.type = isShown ? "password" : "text";
      btn.classList.toggle("is-shown", !isShown);
      btn.setAttribute("aria-label", isShown ? "Show password" : "Hide password");
    });
  });

  // ---------------- Validators ----------------

  const validators = {
    loginEmail(value) {
      const v = value.trim();
      if (!v) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
      return "";
    },
    loginPassword(value) {
      if (!value) return "Password is required.";
      return "";
    },
    signupName(value) {
      const v = value.trim();
      if (!v) return "Full name is required.";
      if (v.length < 2 || v.length > 40) return "Name must be 2–40 characters.";
      if (!/^[A-Za-z\s'-]+$/.test(v)) return "Use letters and spaces only.";
      return "";
    },
    signupEmail(value) {
      const v = value.trim();
      if (!v) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
      return "";
    },
    signupPassword(value) {
      const p = CONFIG.password;
      if (!value) return "Password is required.";
      if (value.length < p.minLength) return `Password needs at least ${p.minLength} characters.`;
      if (p.requireUppercase && !/[A-Z]/.test(value)) return "Include at least one uppercase letter.";
      if (p.requireNumber && !/[0-9]/.test(value)) return "Include at least one number.";
      return "";
    },
    signupConfirmPassword(value) {
      const pw = document.getElementById("signupPassword").value;
      if (!value) return "Please confirm your password.";
      if (value !== pw) return "Passwords do not match.";
      return "";
    },
  };

  // ---------------- UI helpers ----------------

  function setFieldState(name, error) {
    const row = document.querySelector(`.field[data-field="${name}"]`);
    const input = document.getElementById(name);
    const errorEl = document.getElementById(`${name}-error`);

    row.classList.remove("is-valid", "is-invalid");
    if (error) {
      row.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = error;
    } else {
      row.classList.add("is-valid");
      input.setAttribute("aria-invalid", "false");
      errorEl.textContent = "";
    }
    return !error;
  }

  function validateField(name) {
    const el = document.getElementById(name);
    const error = validators[name](el.value);
    return setFieldState(name, error);
  }

  function validateCheckbox(id, errorId, message) {
    const el = document.getElementById(id);
    const errorEl = document.getElementById(errorId);
    if (!el.checked) {
      el.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      return false;
    }
    el.setAttribute("aria-invalid", "false");
    errorEl.textContent = "";
    return true;
  }

  function updatePasswordStrength(value) {
    const fill = document.getElementById("strength-fill");
    if (!fill) return;
    let score = 0;
    if (value.length >= CONFIG.password.minLength) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    if (value.length >= 12) score++;

    fill.style.width = `${(score / 5) * 100}%`;
    let color = "var(--error)";
    if (score >= 4) color = "var(--success)";
    else if (score >= 2) color = "#d97706";
    fill.style.backgroundColor = color;
  }

  function shakeForm(form) {
    form.classList.remove("shake");
    void form.offsetWidth;
    form.classList.add("shake");
  }

  // ---------------- Wire up live validation ----------------

  function wireField(name) {
    const el = document.getElementById(name);
    el.addEventListener("input", () => {
      if (el.dataset.touched === "true") validateField(name);
      if (name === "signupPassword") {
        updatePasswordStrength(el.value);
        if (document.getElementById("signupConfirmPassword").dataset.touched === "true") {
          validateField("signupConfirmPassword");
        }
      }
    });
    el.addEventListener("blur", () => {
      el.dataset.touched = "true";
      validateField(name);
    });
  }

  ["loginEmail", "loginPassword", "signupName", "signupEmail", "signupPassword", "signupConfirmPassword"]
    .forEach(wireField);

  // ---------------- Login submit ----------------

  const loginForm = document.getElementById("login-form");
  const loginBanner = document.getElementById("login-banner");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("loginEmail").dataset.touched = "true";
    document.getElementById("loginPassword").dataset.touched = "true";

    const emailOk = validateField("loginEmail");
    const passOk = validateField("loginPassword");

    if (emailOk && passOk) {
      loginBanner.textContent = CONFIG.messages.loginSuccess;
      loginBanner.classList.add("is-success");
    } else {
      loginBanner.textContent = CONFIG.messages.loginInvalid;
      loginBanner.classList.remove("is-success");
      shakeForm(loginForm);
      const firstInvalid = loginForm.querySelector(".field.is-invalid input");
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // ---------------- Signup submit ----------------

  const signupForm = document.getElementById("signup-form");
  const signupBanner = document.getElementById("signup-banner");

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let allValid = true;

    ["signupName", "signupEmail", "signupPassword", "signupConfirmPassword"].forEach((name) => {
      document.getElementById(name).dataset.touched = "true";
      if (!validateField(name)) allValid = false;
    });

    const termsOk = validateCheckbox("signupTerms", "signupTerms-error", "You must agree to the terms to continue.");
    if (!termsOk) allValid = false;

    if (allValid) {
      signupBanner.textContent = CONFIG.messages.signupSuccess;
      signupBanner.classList.add("is-success");
    } else {
      signupBanner.textContent = CONFIG.messages.signupInvalid;
      signupBanner.classList.remove("is-success");
      shakeForm(signupForm);
      const firstInvalid = signupForm.querySelector(".field.is-invalid input");
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // ---------------- Forgot password functionality ----------------

  document.getElementById("forgot-link").addEventListener("click", (e) => {
    e.preventDefault();
    
    const emailInput = document.getElementById("loginEmail");
    emailInput.dataset.touched = "true";
    
    // Check if the current value in the login email field is valid
    const isEmailValid = validateField("loginEmail");
    
    if (isEmailValid) {
      loginBanner.textContent = `A password reset link has been sent to ${emailInput.value.trim()}.`;
      loginBanner.classList.add("is-success");
    } else {
      loginBanner.textContent = "Please enter a valid email address first.";
      loginBanner.classList.remove("is-success");
      shakeForm(loginForm);
      emailInput.focus();
    }
  });
});