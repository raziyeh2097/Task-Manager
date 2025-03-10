function checkInputs() {
    const inputs = document.querySelectorAll('.in');
    let allValid = true;

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            allValid = false;
            input.style.border = "2px solid red";
        } else {
            input.style.border = "1px solid #ccc";
        }
    });

    if (!allValid) {
        alert("Please fill out all fields.");
        return false;
    }

    const pass = document.getElementById('pass').value;
    const rePass = document.getElementById('re-pass').value;
    if (pass !== rePass) {
        alert("Passwords do not match");
        return false;
    }

    return true;
}

function save_current(userEmail){
    const currentUser = {
        email: userEmail
    }
    let value = JSON.stringify(currentUser);
    localStorage.setItem("currentUser", value);
}

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('sign_in_form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (checkInputs()) {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value.toLowerCase(),
                skills: document.getElementById('skills').value,
                work_history: document.getElementById('history').value,
                password: document.getElementById('pass').value,
            };
            
            async function sendData(data) {
                try {
                    const response = await fetch('http://127.0.0.1:8000/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
            
                    const result = await response.json();
                    return result;
                } catch (error) {
                    console.error('Error:', error);
                    throw error;
                }
            }

            try {
                const result = await sendData(formData);
                if(result.is_succes == 'true'){
                    save_current(formData.email);
                    if (result.is_admin == 'true') {
                        window.location.replace('admin_home.html')
                    } else {
                        window.location.replace('user_home.html')
                    }
                } else {
                    alert(result.detail)
                }
            } catch (error) {
                console.error('Error:', error);
            }
            
        }
    });
});
