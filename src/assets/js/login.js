const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        // Toggle mostrar/ocultar contraseña
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
        });

        // Manejar submit del formulario
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !password) {
                showError('Por favor completa todos los campos');
                return;
            }

            // Mostrar loading
            loginBtn.disabled = true;
            loading.classList.add('show');
            errorMessage.classList.remove('show');

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    // Login exitoso - redirigir al dashboard
                    window.location.href = '/dashboard';
                } else {
                    showError(data.error || 'Error al iniciar sesión');
                    loginBtn.disabled = false;
                }
            } catch (error) {
                showError('Error de conexión. Por favor intenta nuevamente.');
                loginBtn.disabled = false;
            } finally {
                loading.classList.remove('show');
            }
        });

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }

        // Verificar si ya hay una sesión activa
        (async () => {
            try {
                const response = await fetch('/api/auth/me');
                const data = await response.json();
                
                if (data.authenticated) {
                    // Ya está autenticado - redirigir al dashboard
                    window.location.href = '/dashboard';
                }
            } catch (error) {
                // No hay sesión - mostrar login
                console.log('No hay sesión activa');
            }
        })();