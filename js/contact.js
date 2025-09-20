// ===== FUNCIONALIDADES MODERNAS PARA PÁGINA DE CONTACTO =====

// Variables globales para el mapa y animaciones
let map;
let userMarker;
let officeMarker;
let isFormSubmitting = false;

// Coordenadas de Warner Bros. Studios donde se filmó TBBT (Burbank, CA)
const studioLocation = [34.1486, -118.3389];

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// Función principal de inicialización
function initializeContactPage() {
    initMap();
    initFormValidation();
    initAnimations();
    initParticleEffects();
    initScrollEffects();
}

// ===== INICIALIZACIÓN DEL MAPA =====
function initMap() {
    try {
        // Crear el mapa centrado en Warner Bros. Studios
        map = L.map('map').setView(studioLocation, 15);
        
        // Agregar capa de tiles (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Crear icono personalizado para TBBT
        const tbbtIcon = L.divIcon({
            className: 'custom-div-icon',
            html: createCustomMarkerHTML('TBBT', '#ff6b35'),
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        
        // Marcador de los estudios
        officeMarker = L.marker(studioLocation, { icon: tbbtIcon }).addTo(map);
        
        // Popup mejorado para los estudios
        officeMarker.bindPopup(createStudioPopup());
        
        // Intentar obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = [position.coords.latitude, position.coords.longitude];
                    addUserMarker(userLocation);
                },
                (error) => {
                    console.log('No se pudo obtener la ubicación:', error);
                }
            );
        }
    } catch (error) {
        console.error('Error inicializando el mapa:', error);
    }
}

// Crear HTML para marcador personalizado
function createCustomMarkerHTML(text, color) {
    return `
        <div style="
            background: ${color};
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            animation: mapPulse 2s infinite;
        ">
            ${text}
        </div>
    `;
}

// Crear popup para los estudios
function createStudioPopup() {
    return `
        <div style="color: #333; font-family: Arial, sans-serif; min-width: 280px; text-align: center;">
            <div style="background: linear-gradient(45deg, #ff6b35, #ffcc02); padding: 1rem; margin: -10px -10px 15px -10px; border-radius: 10px;">
                <h3 style="margin: 0; color: white; font-size: 1.2rem;">🎬 Warner Bros. Studios</h3>
            </div>
            <div style="padding: 0 5px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">
                    📍 4000 Warner Blvd<br>Burbank, CA 91522
                </p>
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #666;">
                    ⭐ Hogar oficial de The Big Bang Theory
                </p>
                <div style="background: #f0f0f0; padding: 8px; border-radius: 8px; margin-top: 10px;">
                    <small style="color: #333;">¡12 temporadas de ciencia y risas! 🧪😄</small>
                </div>
            </div>
        </div>
    `;
}

// Agregar marcador del usuario
function addUserMarker(location) {
    if (userMarker) {
        map.removeLayer(userMarker);
    }
    
    const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: createCustomMarkerHTML('🧑', '#ffcc02'),
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
    });
    
    userMarker = L.marker(location, { icon: userIcon }).addTo(map);
    
    // Popup para el usuario
    userMarker.bindPopup(`
        <div style="color: #333; font-family: Arial, sans-serif; min-width: 200px; text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: #ffcc02;">📍 Tu ubicación</h3>
            <p style="margin: 0; font-size: 14px;">
                Lat: ${location[0].toFixed(6)}<br>
                Lng: ${location[1].toFixed(6)}
            </p>
            <div style="margin-top: 10px; padding: 5px; background: #e8f4fd; border-radius: 5px;">
                <small style="color: #0066cc;">¡Distancia calculada desde aquí! 📏</small>
            </div>
        </div>
    `);
}

// ===== NOTA: Funcionalidad del botón de ubicación removida =====
// El botón de ubicación ha sido eliminado del diseño

// ===== VALIDACIÓN Y MANEJO DEL FORMULARIO =====
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    // Validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', removeErrorState);
    });
    
    // Manejo del envío del formulario
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar estados previos
    removeErrorState(e);
    
    switch(field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, ingresa un email válido';
            }
            break;
            
        case 'text':
            if (field.required && value.length < 2) {
                isValid = false;
                errorMessage = 'Este campo debe tener al menos 2 caracteres';
            }
            break;
            
        case 'select-one':
            if (field.required && !value) {
                isValid = false;
                errorMessage = 'Por favor, selecciona una opción';
            }
            break;
            
        case 'textarea':
            if (field.required && value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remover error anterior si existe
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Crear y mostrar nuevo mensaje de error
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff4757;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    field.parentNode.appendChild(errorElement);
    
    // Animación de aparición
    setTimeout(() => {
        errorElement.style.opacity = '1';
    }, 10);
}

function removeErrorState(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, 300);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isFormSubmitting) return;
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validar todos los campos
    const requiredFields = form.querySelectorAll('[required]');
    let hasErrors = false;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            hasErrors = true;
        }
    });
    
    if (hasErrors) {
        showNotification('Por favor, corrige los errores antes de enviar el formulario.', 'error');
        return;
    }
    
    // Procesar envío
    submitForm(form, data);
}

async function submitForm(form, data) {
    isFormSubmitting = true;
    const submitBtn = form.querySelector('.form-submit');
    const originalBtnHTML = submitBtn.innerHTML;
    
    // Animación de envío
    submitBtn.innerHTML = `
        <span class="btn-text">
            <i class="fas fa-spinner fa-spin"></i>
            Enviando mensaje cuántico...
        </span>
    `;
    submitBtn.disabled = true;
    
    try {
        // Simular envío a servidor (aquí conectarías con tu backend)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Éxito
        showSuccessMessage(data);
        form.reset();
        
    } catch (error) {
        showNotification('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
    } finally {
        submitBtn.innerHTML = originalBtnHTML;
        submitBtn.disabled = false;
        isFormSubmitting = false;
    }
}

function showSuccessMessage(data) {
    const message = `
        <div style="text-align: center;">
            <h3 style="color: #27ae60; margin-bottom: 1rem;">¡Mensaje enviado con éxito! 🚀</h3>
            <p>Gracias ${data.nombre}, hemos recibido tu mensaje sobre "${data.asunto}".</p>
            <p>Te responderemos pronto a ${data.email}.</p>
            <div style="margin-top: 1rem; padding: 1rem; background: linear-gradient(45deg, #ff6b35, #ffcc02); border-radius: 10px;">
                <p style="margin: 0; color: white; font-weight: bold;">¡BAZINGA! 😄</p>
                <small style="color: white;">Tu mensaje está viajando a la velocidad de la luz cuántica.</small>
            </div>
        </div>
    `;
    
    showNotification(message, 'success', 6000);
}

// ===== SISTEMA DE NOTIFICACIONES =====
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    // Estilos base
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1.5rem 2rem;
        border-radius: 15px;
        color: white;
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    // Colores según el tipo
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #e74c3c, #ff4757)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(45deg, #3498db, #74b9ff)';
            break;
    }
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remover
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 400);
    }, duration);
    
    // Cerrar al hacer click
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    });
}

// ===== ANIMACIONES Y EFECTOS VISUALES =====
function initAnimations() {
    // Intersection Observer para animaciones al scrollear
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    const animatedElements = document.querySelectorAll('.contact-card, .social-card, .form-group');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

function initParticleEffects() {
    // Efecto de partículas en el hero
    const hero = document.querySelector('.contact-hero');
    if (!hero) return;
    
    // Crear partículas adicionales dinámicamente
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFloatingParticle(hero);
        }, i * 1000);
    }
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ffcc02;
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.7;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
    `;
    
    container.appendChild(particle);
    
    // Remover después de la animación
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 15000);
}

function initScrollEffects() {
    // Efecto parallax suave en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.contact-hero');
        
        if (hero) {
            const speed = scrolled * 0.5;
            hero.style.transform = `translateY(${speed}px)`;
        }
    });
}

// ===== UTILIDADES =====
function calculateDistance(pos1, pos2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
    const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// ===== ESTILOS CSS DINÁMICOS =====
const dynamicStyles = `
    <style>
        @keyframes mapPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes floatParticle {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .form-input.error,
        .form-select.error,
        .form-textarea.error {
            border-color: #ff4757 !important;
            box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.2) !important;
        }
        
        .notification {
            cursor: pointer;
        }
        
        .notification:hover {
            transform: translateX(-5px) !important;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', dynamicStyles);

// Mensaje de bienvenida
console.log('🚀 Página de contacto The Big Bang Theory cargada exitosamente!');
console.log('💫 Sistema de contacto cuántico activado. ¡BAZINGA!');
