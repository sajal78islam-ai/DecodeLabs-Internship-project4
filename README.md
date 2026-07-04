# Interactive Log In & Sign Up Form

A clean, accessible, and secure tabbed component featuring both **Log In** and **Sign Up** forms with live client-side validation, built using pure HTML, CSS, and vanilla JavaScript.

# Features

- **Tabbed Interface:** Smooth transitions between Log In and Sign Up states.
- **Form Validation:** Real-time feedback for input requirements (e.g., email format, password criteria, field matching).
- **Password Strength Meter:** Dynamic visual feedback as the user types a password based on complexity rules.
- **Password Visibility Toggle:** Built-in reveal button to view/hide masked text.
- **Forgot Password Workflow:** Fully wired up to validate the user's email before simulating a password reset request.
- **Responsive Design:** A mobile-friendly layout built with standard typography and smooth animation handling (`prefers-reduced-motion`).

# File Structure

- `form.html` — The semantic HTML structural layout.
- `form.css` — Custom utility and modern layout styling.
- `form.js` — Core functional logic, field validation rules, and tab controls.

# JavaScript Configuration

You can easily adjust the password rules or validation alert copy directly inside the `CONFIG` block at the top of `form.js`:

```javascript
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
