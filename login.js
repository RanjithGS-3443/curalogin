// Tab switching logic
const emailTab = document.getElementById('emailTab');
const phoneTab = document.getElementById('phoneTab');
const emailForm = document.getElementById('emailForm');
const phoneForm = document.getElementById('phoneForm');
const messageDiv = document.getElementById('message');

emailTab.onclick = () => {
    emailTab.classList.add('active');
    phoneTab.classList.remove('active');
    emailForm.style.display = '';
    phoneForm.style.display = 'none';
    messageDiv.textContent = '';
};
phoneTab.onclick = () => {
    phoneTab.classList.add('active');
    emailTab.classList.remove('active');
    phoneForm.style.display = '';
    emailForm.style.display = 'none';
    messageDiv.textContent = '';
};

// Email/Password Login
emailForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Login successful!';
    } catch (err) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = err.message;
    }
};

// Google Login
const googleLoginBtn = document.getElementById('googleLogin');
googleLoginBtn.onclick = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await firebase.auth().signInWithPopup(provider);
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Google login successful!';
    } catch (err) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = err.message;
    }
};

// Phone/OTP Login
let confirmationResult = null;
const sendOtpBtn = document.getElementById('sendOtp');
const verifyOtpBtn = document.getElementById('verifyOtp');
const otpInput = document.getElementById('otp');

sendOtpBtn.onclick = async () => {
    const phone = document.getElementById('phone').value;
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            size: 'normal',
            callback: () => {},
        });
        window.recaptchaVerifier.render();
    }
    try {
        confirmationResult = await firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier);
        otpInput.style.display = '';
        verifyOtpBtn.style.display = '';
        sendOtpBtn.disabled = true;
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'OTP sent!';
    } catch (err) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = err.message;
    }
};

verifyOtpBtn.onclick = async () => {
    const otp = otpInput.value;
    try {
        await confirmationResult.confirm(otp);
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Phone login successful!';
    } catch (err) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = err.message;
    }
};
