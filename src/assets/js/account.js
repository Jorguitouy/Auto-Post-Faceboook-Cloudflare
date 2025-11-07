// Cargar información del usuario
        async function loadUserInfo() {
            try {
                const response = await fetch('/api/auth/current-user');
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('username').textContent = data.user.username;
                    document.getElementById('name').textContent = data.user.name;
                    document.getElementById('role').textContent = data.user.role === 'admin' ? 'Administrador' : 'Editor';
                } else {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                window.location.href = '/login';
            }
        }

        // Cargar configuración de email
        async function loadEmailConfig() {
            try {
                const response = await fetch('/api/settings/email');
                if (response.ok) {
                    const data = await response.json();
                    if (data.fromEmail) {
                        document.getElementById('fromEmail').value = data.fromEmail;
                    }
                    if (data.hasApiKey) {
                        document.getElementById('resendApiKey').placeholder = '••••••••••••••••••••';
                    }
                }
            } catch (error) {
                console.error('Error al cargar configuración de email:', error);
            }
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

        // Manejar envío del formulario
        document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const statusMessage = document.getElementById('statusMessage');
            const submitBtn = document.getElementById('submitBtn');

            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validar que las contraseñas coincidan
            if (newPassword !== confirmPassword) {
                statusMessage.textContent = '❌ Las contraseñas no coinciden';
                statusMessage.className = 'message error show';
                return;
            }

            // Validar requisitos de contraseña
            if (!validatePassword()) {
                statusMessage.textContent = '❌ La contraseña no cumple con los requisitos';
                statusMessage.className = 'message error show';
                return;
            }

            submitBtn.disabled = true;
            statusMessage.textContent = '⏳ Cambiando contraseña...';
            statusMessage.className = 'message show';

            try {
                const response = await fetch('/api/auth/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    statusMessage.textContent = '✅ Contraseña cambiada exitosamente';
                    statusMessage.className = 'message success show';
                    
                    // Limpiar formulario
                    document.getElementById('changePasswordForm').reset();
                    
                    // Redirigir al dashboard después de 2 segundos
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 2000);
                } else {
                    statusMessage.textContent = `❌ ${data.error || 'Error al cambiar contraseña'}`;
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

        // Manejar configuración de email
        document.getElementById('emailConfigForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailStatusMessage = document.getElementById('emailStatusMessage');
            const emailSubmitBtn = document.getElementById('emailSubmitBtn');

            const resendApiKey = document.getElementById('resendApiKey').value.trim();
            const fromEmail = document.getElementById('fromEmail').value.trim();

            if (!fromEmail) {
                emailStatusMessage.textContent = '❌ El email remitente es requerido';
                emailStatusMessage.className = 'message error show';
                return;
            }

            emailSubmitBtn.disabled = true;
            emailStatusMessage.textContent = '⏳ Guardando configuración...';
            emailStatusMessage.className = 'message show';

            try {
                const body = { fromEmail };
                
                // Solo incluir API key si se ingresó una nueva
                if (resendApiKey) {
                    body.resendApiKey = resendApiKey;
                }

                const response = await fetch('/api/settings/email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

                const data = await response.json();

                if (response.ok) {
                    emailStatusMessage.textContent = '✅ Configuración guardada exitosamente';
                    emailStatusMessage.className = 'message success show';
                    
                    // Limpiar campo de API key y actualizar placeholder
                    document.getElementById('resendApiKey').value = '';
                    document.getElementById('resendApiKey').placeholder = '••••••••••••••••••••';
                    
                    emailSubmitBtn.disabled = false;
                } else {
                    emailStatusMessage.textContent = `❌ ${data.error || 'Error al guardar configuración'}`;
                    emailStatusMessage.className = 'message error show';
                    emailSubmitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                emailStatusMessage.textContent = '❌ Error de conexión';
                emailStatusMessage.className = 'message error show';
                emailSubmitBtn.disabled = false;
            }
        });

        // Cerrar sesión
        async function logout() {
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                window.location.href = '/login';
            }
        }

        // Cargar información al iniciar
        loadUserInfo();
        loadEmailConfig();