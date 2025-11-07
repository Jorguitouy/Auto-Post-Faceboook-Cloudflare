// Obtener token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            document.getElementById('statusMessage').textContent = '❌ Token inválido o expirado';
            document.getElementById('statusMessage').className = 'message error show';
            document.getElementById('resetPasswordForm').style.display = 'none';
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        }

        // Alternar visibilidad de contraseña
        function togglePassword(fieldId) {
            const field = document.getElementById(fieldId);
            field.type = field.type === 'password' ? 'text' : 'password';
        }

        // Validar contraseña
        function validatePassword() {
            const password = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            const submitBtn = document.getElementById('submitBtn');

            // Requisitos
            const hasLength = password.length >= 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const passwordsMatch = password === confirm && password.length > 0;

            // Actualizar UI de requisitos
            document.getElementById('req-length').className = hasLength ? 'valid' : '';
            document.getElementById('req-uppercase').className = hasUppercase ? 'valid' : '';
            document.getElementById('req-lowercase').className = hasLowercase ? 'valid' : '';
            document.getElementById('req-number').className = hasNumber ? 'valid' : '';

            // Habilitar/deshabilitar botón
            const allValid = hasLength && hasUppercase && hasLowercase && hasNumber && passwordsMatch;
            submitBtn.disabled = !allValid;

            return allValid;
        }

        document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const statusMessage = document.getElementById('statusMessage');
            const submitBtn = document.getElementById('submitBtn');
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                statusMessage.textContent = '❌ Las contraseñas no coinciden';
                statusMessage.className = 'message error show';
                return;
            }

            if (!validatePassword()) {
                statusMessage.textContent = '❌ La contraseña no cumple con los requisitos';
                statusMessage.className = 'message error show';
                return;
            }

            submitBtn.disabled = true;
            statusMessage.textContent = '⏳ Restableciendo contraseña...';
            statusMessage.className = 'message show';

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token,
                        newPassword
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    statusMessage.textContent = '✅ Contraseña restablecida exitosamente. Redirigiendo...';
                    statusMessage.className = 'message success show';
                    
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    statusMessage.textContent = `❌ ${data.error || 'Error al restablecer contraseña'}`;
                    statusMessage.className = 'message error show';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                statusMessage.textContent = '❌ Error de conexión';
                statusMessage.className = 'message error show';
                submitBtn.disabled = false;
            }
        });