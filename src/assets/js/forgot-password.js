document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const statusMessage = document.getElementById('statusMessage');
            const submitBtn = document.getElementById('submitBtn');
            const username = document.getElementById('username').value.trim();

            if (!username) {
                statusMessage.textContent = '❌ Por favor ingresa tu nombre de usuario';
                statusMessage.className = 'message error show';
                return;
            }

            submitBtn.disabled = true;
            statusMessage.textContent = '⏳ Enviando email...';
            statusMessage.className = 'message show';

            try {
                const response = await fetch('/api/auth/request-reset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                const data = await response.json();

                if (response.ok) {
                    statusMessage.textContent = '✅ ' + data.message;
                    statusMessage.className = 'message success show';
                    document.getElementById('forgotPasswordForm').reset();
                    
                    // Redirigir al login después de 3 segundos
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 3000);
                } else {
                    statusMessage.textContent = `❌ ${data.error || 'Error al procesar la solicitud'}`;
                    statusMessage.className = 'message error show';
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                statusMessage.textContent = '❌ Error de conexión. Por favor intenta nuevamente.';
                statusMessage.className = 'message error show';
                submitBtn.disabled = false;
            }
        });