  // Replace with your Firebase project configuration
        const firebaseConfig = {
            apiKey: "AIzaSyAqt_xFX_ED1rrvY5ODN3txGKiDpLST7MQ",
    authDomain: "public-distribution-syst-eb08c.firebaseapp.com",
    projectId: "public-distribution-syst-eb08c",
        };
        
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Initialize reCAPTCHA
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                // reCAPTCHA solved, allow sending OTP.
            },
            'expired-callback': () => {
                // Reset reCAPTCHA and handle when it expires.
            }
        });
        
        // Map roles to phone numbers
        const roles = {
            Salem: "+919360703585",
            Karur: "+917397001625",
            Coimbatore: "+916381206494"
        };
        
        function updatePhoneNumber() {
            const selectedRole = document.getElementById('userRole').value;
            const phoneNumber = roles[selectedRole];
            
            // Display only the last two digits of the phone number
            const lastTwoDigits = phoneNumber.slice(-2);
            document.getElementById('phone').value = `********${lastTwoDigits}`;
        }
        
        function showNotification(message, isError = false) {
            const notificationElement = document.createElement('div');
            notificationElement.className = isError ? 'notification error' : 'notification';
            notificationElement.textContent = message;
            document.body.appendChild(notificationElement);
        
            setTimeout(() => {
                notificationElement.remove();
            }, 3000);
        }
        
        function sendOTP() {
            const selectedRole = document.getElementById('userRole').value;
            const phoneNumber = roles[selectedRole];
            const appVerifier = window.recaptchaVerifier;
        
            // Store the user's role in local storage or any other storage
            localStorage.setItem('userRole', selectedRole);
        
            firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
        
                    // Show OTP sent notification
                    showNotification('OTP sent!');
// Get the OTP from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const otp = urlParams.get('otp');

// Display the OTP on the dashboard
document.getElementById('otpDisplay').textContent = otp;

        
                    // Redirect to the verification page after successful OTP sent
                    window.location.href = 'dashboard.html'; // Change 'verification.html' to your verification page
                })
                .catch((error) => {
                    console.error(error);
                    showNotification('Error sending OTP. Please try again.', true);
                });
        }
        
        function verifyOTP() {
            const verificationCode = document.getElementById('verificationCode').value;
        
            window.confirmationResult.confirm(verificationCode)
                .then((result) => {
                    // User is signed in.
                    const user = result.user;
                    // Retrieve the user's role from storage
                    const userRole = localStorage.getItem('userRole');
        
                    // Perform role-based actions
                    if (userRole === 'admin') {
                        // User is an admin, grant access to admin features.
                        // Redirect to the admin dashboard or perform admin-specific actions.
                        window.location.href = `dashboard.html?otp=${verificationCode}`; // Change 'admin_dashboard.html' to your admin dashboard page
                    } else {
                        // User is not an admin, restrict access to admin features.
                        // Redirect to the user dashboard or perform user-specific actions.
                        window.location.href = `dashboard.html?otp=${verificationCode}`; // Change 'user_dashboard.html' to your user dashboard page
                    }
                })
                .catch((error) => {
                    console.error(error);
                    showNotification('Verification failed. Please try again.', true);
                });
        }
        