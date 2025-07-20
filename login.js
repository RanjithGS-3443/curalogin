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

// Phone/OTP Login using Textbelt
let sentOtp = '';
let sentPhone = '';

const sendOtpBtn = document.getElementById('sendOtp');
const verifyOtpBtn = document.getElementById('verifyOtp');
const otpInput = document.getElementById('otp');

// Add Resend OTP button dynamically
let resendOtpBtn = document.getElementById('resendOtp');
if (!resendOtpBtn) {
    resendOtpBtn = document.createElement('button');
    resendOtpBtn.type = 'button';
    resendOtpBtn.id = 'resendOtp';
    resendOtpBtn.textContent = 'Resend OTP';
    resendOtpBtn.style.display = 'none';
    resendOtpBtn.style.marginTop = '0.5rem';
    otpInput.parentNode.insertBefore(resendOtpBtn, verifyOtpBtn.nextSibling);
}

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


async function sendOtp(phone, isResend = false) {
    if (!/^\+?\d{10,15}$/.test(phone)) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = 'Enter phone in international format, e.g. +1234567890';
        return;
    }
    sentOtp = generateOtp();
    sentPhone = phone;
    try {
        const response = await fetch('https://textbelt.com/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `phone=${encodeURIComponent(phone)}&message=${encodeURIComponent('Your OTP is: ' + sentOtp)}&key=d09ee6c3b6ce0e99a9a28bb56092ec2fae4b6421UghCzxt5omgqKy9sB2KTQuCuT`
        });
        const data = await response.json();
        if (data.success) {
            otpInput.style.display = '';
            verifyOtpBtn.style.display = '';
            sendOtpBtn.disabled = true;
            resendOtpBtn.style.display = '';
            messageDiv.style.color = 'green';
            messageDiv.textContent = isResend ? 'OTP resent!' : 'OTP sent!';
        } else {
            messageDiv.style.color = '#d32f2f';
            messageDiv.textContent = 'Failed to send OTP: ' + (data.error || 'Unknown error');
        }
    } catch (err) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = 'Error sending OTP.';
    }
}

sendOtpBtn.onclick = async () => {
    const phone = document.getElementById('phone').value;
    await sendOtp(phone, false);
};

resendOtpBtn.onclick = async () => {
    resendOtpBtn.disabled = true;
    const phone = document.getElementById('phone').value;
    await sendOtp(phone, true);
    setTimeout(() => {
        resendOtpBtn.disabled = false;
    }, 30000); // 30 seconds cooldown
};

verifyOtpBtn.onclick = async () => {
    const otp = otpInput.value;
    if (otp === sentOtp && sentPhone === document.getElementById('phone').value) {
        messageDiv.style.color = 'green';
        messageDiv.textContent = 'Phone login successful!';
        resendOtpBtn.style.display = 'none';
        sendOtpBtn.disabled = false;
    } else {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = 'Invalid OTP.';
    }
};
