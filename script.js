// Configuración de la API
const API_KEY = "AIzaSyDSIy5m7mTXlMMR_OOdCu2Af_EwoCd124w";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

// Variables globales
let currentImage = null;
let currentTheme = 'light';
let sharedFiles = [];
let chatHistory = [];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log("Chatbot inicializado correctamente - Versión 3.0");
    
    // Cargar tema guardado
    loadSavedTheme();
    
    // Cargar historial del chat
    loadChatHistory();
    
    // Configurar eventos
    setupEventListeners();
    
    // Configurar navegación suave
    setupSmoothNavigation();
    
    // Inicializar contador de caracteres
    setupCharacterCounter();
    
    // Actualizar hora del mensaje de bienvenida
    updateWelcomeTime();
});

// Cargar tema guardado del localStorage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('chatTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeToggleIcon();
    }
}

// Cargar historial del chat desde localStorage
function loadChatHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
        // No restaurar mensajes automáticamente para mantener la experiencia limpia
        // Los mensajes se mantienen en el historial para contexto de la conversación
    }
}

// Guardar historial del chat en localStorage
function saveChatHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Configurar todos los event listeners
function setupEventListeners() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const voiceBtn = document.getElementById('voiceBtn');
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    const fileBtn = document.getElementById('fileBtn');
    const fileInput = document.getElementById('fileInput');
    const themeToggle = document.getElementById('themeToggle');
    const filesPanelBtn = document.getElementById('filesPanelBtn');
    const closeFilesBtn = document.getElementById('closeFilesBtn');
    const helpBtn = document.getElementById('helpBtn');
    const closeHelpBtn = document.getElementById('closeHelpBtn');
    const overlay = document.getElementById('overlay');
    const clearBtn = document.getElementById('clearBtn');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const uploadFileInput = document.getElementById('uploadFileInput');
    const closeNotification = document.getElementById('closeNotification');
    
    // Evento para el botón de enviar
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Evento para la tecla Enter en el textarea
    if (userInput) {
        userInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Autoajustar altura del textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Evento para el botón de voz
    if (voiceBtn) {
        voiceBtn.addEventListener('click', startVoiceInput);
    }
    
    // Eventos para subir imagen
    if (imageBtn && imageInput) {
        imageBtn.addEventListener('click', function() {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    // Eventos para subir archivo
    if (fileBtn && fileInput) {
        fileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Evento para cambiar tema
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Eventos para paneles laterales
    if (filesPanelBtn && closeFilesBtn) {
        filesPanelBtn.addEventListener('click', function() {
            openPanel('filesPanel');
        });
        
        closeFilesBtn.addEventListener('click', function() {
            closePanels();
        });
    }
    
    if (helpBtn && closeHelpBtn) {
        helpBtn.addEventListener('click', function() {
            openPanel('helpPanel');
        });
        
        closeHelpBtn.addEventListener('click', function() {
            closePanels();
        });
    }
    
    // Evento para overlay
    if (overlay) {
        overlay.addEventListener('click', closePanels);
    }
    
    // Evento para limpiar chat
    if (clearBtn) {
        clearBtn.addEventListener('click', clearChat);
    }
    
    // Evento para subir archivo desde panel
    if (uploadFileBtn && uploadFileInput) {
        uploadFileBtn.addEventListener('click', function() {
            uploadFileInput.click();
        });
        
        uploadFileInput.addEventListener('change', handleFileUpload);
    }
    
    // Evento para cerrar notificación
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            hideNotification();
        });
    }
}

// Configurar contador de caracteres
function setupCharacterCounter() {
    const userInput = document.getElementById('userInput');
    const charCount = document.getElementById('charCount');
    
    if (userInput && charCount) {
        userInput.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = `${length}/2000`;
            
            // Cambiar color según el número de caracteres
            if (length > 1800) {
                charCount.className = 'char-count warning';
            } else if (length > 1950) {
                charCount.className = 'char-count error';
            } else {
                charCount.className = 'char-count';
            }
        });
    }
}

// Configurar navegación suave
function setupSmoothNavigation() {
    document.querySelectorAll('.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase activa de todos los enlaces
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Agregar clase activa al enlace clickeado
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            
            // Simular navegación (en una aplicación real aquí iría la lógica para cambiar secciones)
            if (targetId === '#inicio') {
                // Ya estamos en la página de inicio (chat)
                console.log("Navegando a Inicio");
            } else if (targetId === '#archivos') {
                openPanel('filesPanel');
            } else if (targetId === '#herramientas') {
                openPanel('helpPanel');
            }
        });
    });
}

// Abrir panel lateral
function openPanel(panelId) {
    const panel = document.getElementById(panelId);
    const overlay = document.getElementById('overlay');
    
    if (panel && overlay) {
        panel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar paneles laterales
function closePanels() {
    const panels = document.querySelectorAll('.side-panel');
    const overlay = document.getElementById('overlay');
    
    panels.forEach(panel => {
        panel.classList.remove('active');
    });
    
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Cambiar tema claro/oscuro
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('chatTheme', currentTheme);
    updateThemeToggleIcon();
}

// Actualizar icono del botón de tema
function updateThemeToggleIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Actualizar hora del mensaje de bienvenida
function updateWelcomeTime() {
    const welcomeTime = document.getElementById('welcome-time');
    if (welcomeTime) {
        welcomeTime.textContent = getCurrentTime();
    }
}

// Función para manejar la subida de imágenes
function handleImageUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Verificar que sea una imagen
    if (!file.type.match('image.*')) {
        showNotification('Por favor, selecciona solo archivos de imagen.', 'error');
        return;
    }
    
    // Limitar el tamaño de la imagen (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen es demasiado grande. Por favor, selecciona una imagen menor a 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Guardar la imagen en base64 para enviarla a la API
        currentImage = e.target.result;
        
        // Mostrar la imagen en el chat
        addImageToChat(currentImage);
        
        // Limpiar el input de archivo
        event.target.value = '';
        
        // Enviar la imagen al bot para análisis
        getBotResponse("Analiza esta imagen", currentImage);
    };
    
    reader.readAsDataURL(file);
}

// Función para manejar la subida de archivos
function handleFileUpload(event) {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Verificar tamaño del archivo (10MB máximo)
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`El archivo "${file.name}" es demasiado grande. Máximo 10MB.`, 'error');
            continue;
        }
        
        // Agregar archivo a la lista de archivos compartidos
        addFileToSharedList(file);
        
        // Mostrar archivo en el chat
        addFileToChat(file);
        
        // Analizar el archivo según su tipo
        analyzeFile(file);
        
        showNotification(`Archivo "${file.name}" subido correctamente`, 'success');
    }
    
    // Limpiar el input de archivo
    event.target.value = '';
}

// Analizar archivo según su tipo
function analyzeFile(file) {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Determinar el tipo de archivo y analizarlo
    if (fileType.startsWith('image/')) {
        // Las imágenes ya se manejan en handleImageUpload
        return;
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        analyzePDF(file);
    } else if (fileType.includes('text') || 
               fileName.endsWith('.txt') || 
               fileName.endsWith('.md') || 
               fileName.endsWith('.json') ||
               fileName.endsWith('.xml')) {
        analyzeTextFile(file);
    } else if (fileName.endsWith('.js') || 
               fileName.endsWith('.html') || 
               fileName.endsWith('.css') || 
               fileName.endsWith('.py') || 
               fileName.endsWith('.java') ||
               fileName.endsWith('.cpp') ||
               fileName.endsWith('.c')) {
        analyzeCodeFile(file);
    } else if (fileType.includes('word') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        analyzeWordFile(file);
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
               fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
        analyzeExcelFile(file);
    } else {
        // Para otros tipos de archivo, enviar información básica
        getBotResponse(`He recibido un archivo: ${file.name} (${formatFileSize(file.size)}). ¿En qué puedo ayudarte con este archivo?`);
    }
}

// Analizar archivo PDF
function analyzePDF(file) {
    showNotification(`Analizando PDF: ${file.name}`, 'info');
    
    // En una implementación real, aquí se usaría una biblioteca como pdf.js
    // Para esta demo, simularemos el análisis
    setTimeout(() => {
        getBotResponse(`He analizado el archivo PDF "${file.name}". Contiene un documento de ${formatFileSize(file.size)}. ¿Te gustaría que extraiga información específica o resuma el contenido?`);
    }, 1500);
}

// Analizar archivo de texto
function analyzeTextFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        
        // Limitar el contenido para no exceder los límites de la API
        const truncatedContent = content.length > 10000 ? content.substring(0, 10000) + '...' : content;
        
        showNotification(`Analizando archivo de texto: ${file.name}`, 'info');
        
        // Enviar el contenido a la IA para análisis
        getBotResponse(`He recibido un archivo de texto: ${file.name}. Aquí está el contenido:\n\n${truncatedContent}\n\n¿Qué análisis te gustaría que haga sobre este contenido?`);
    };
    
    reader.readAsText(file);
}

// Analizar archivo de código
function analyzeCodeFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        const fileExtension = file.name.split('.').pop();
        
        // Limitar el contenido para no exceder los límites de la API
        const truncatedContent = content.length > 8000 ? content.substring(0, 8000) + '...' : content;
        
        showNotification(`Analizando archivo de código: ${file.name}`, 'info');
        
        // Enviar el contenido a la IA para análisis
        getBotResponse(`He recibido un archivo de código ${fileExtension.toUpperCase()}: ${file.name}. Aquí está el código:\n\n\`\`\`${fileExtension}\n${truncatedContent}\n\`\`\`\n\n¿Te gustaría que analice el código, busque errores o sugiera mejoras?`);
    };
    
    reader.readAsText(file);
}

// Analizar archivo de Word (simulado)
function analyzeWordFile(file) {
    showNotification(`Analizando documento Word: ${file.name}`, 'info');
    
    // En una implementación real, aquí se usaría una biblioteca para extraer texto de Word
    // Para esta demo, simularemos el análisis
    setTimeout(() => {
        getBotResponse(`He analizado el documento Word "${file.name}". Es un documento de ${formatFileSize(file.size)}. ¿Te gustaría que extraiga el texto o analice el contenido?`);
    }, 1500);
}

// Analizar archivo de Excel (simulado)
function analyzeExcelFile(file) {
    showNotification(`Analizando hoja de cálculo: ${file.name}`, 'info');
    
    // En una implementación real, aquí se usaría una biblioteca para leer Excel
    // Para esta demo, simularemos el análisis
    setTimeout(() => {
        getBotResponse(`He analizado la hoja de cálculo "${file.name}". Es un archivo de ${formatFileSize(file.size)}. ¿Te gustaría que analice los datos o extraiga información específica?`);
    }, 1500);
}

// Agregar archivo a la lista de archivos compartidos
function addFileToSharedList(file) {
    const fileData = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        file: file,
        uploadDate: new Date().toLocaleString()
    };
    
    sharedFiles.push(fileData);
    updateFilesPanel();
}

// Actualizar panel de archivos
function updateFilesPanel() {
    const filesList = document.getElementById('filesList');
    
    if (!filesList) return;
    
    // Limpiar lista
    filesList.innerHTML = '';
    
    if (sharedFiles.length === 0) {
        filesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No hay archivos compartidos</p>
                <small>Los archivos que envíes aparecerán aquí</small>
            </div>
        `;
        return;
    }
    
    // Agregar archivos a la lista
    sharedFiles.forEach(fileData => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="${getFileIcon(fileData.type)}"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${fileData.name}</div>
                <div class="file-size">${fileData.size} • ${fileData.uploadDate}</div>
            </div>
            <div class="file-actions-mini">
                <button class="file-action-btn" onclick="downloadFile('${fileData.id}')" title="Descargar">
                    <i class="fas fa-download"></i>
                </button>
                <button class="file-action-btn" onclick="analyzeFileFromList('${fileData.id}')" title="Analizar">
                    <i class="fas fa-search"></i>
                </button>
                <button class="file-action-btn" onclick="removeFile('${fileData.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        filesList.appendChild(fileItem);
    });
}

// Analizar archivo desde la lista
function analyzeFileFromList(fileId) {
    const fileData = sharedFiles.find(file => file.id === fileId);
    
    if (!fileData) return;
    
    showNotification(`Analizando archivo: ${fileData.name}`, 'info');
    analyzeFile(fileData.file);
}

// Descargar archivo
function downloadFile(fileId) {
    const fileData = sharedFiles.find(file => file.id === fileId);
    
    if (!fileData) return;
    
    const url = URL.createObjectURL(fileData.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Eliminar archivo
function removeFile(fileId) {
    sharedFiles = sharedFiles.filter(file => file.id !== fileId);
    updateFilesPanel();
    showNotification('Archivo eliminado', 'success');
}

// Obtener icono según tipo de archivo
function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-file-image';
    if (fileType.startsWith('audio/')) return 'fas fa-file-audio';
    if (fileType.startsWith('video/')) return 'fas fa-file-video';
    if (fileType === 'application/pdf') return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('sheet') || fileType.includes('excel')) return 'fas fa-file-excel';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'fas fa-file-powerpoint';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'fas fa-file-archive';
    if (fileType.includes('javascript') || fileType.includes('text/html') || fileType.includes('text/css')) return 'fas fa-file-code';
    return 'fas fa-file';
}

// Formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para mostrar la imagen en el chat
function addImageToChat(imageData) {
    const chatBox = document.getElementById('chatBox');
    
    if (!chatBox) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const image = document.createElement('img');
    image.src = imageData;
    image.className = 'message-image';
    image.alt = 'Imagen enviada por el usuario';
    
    const caption = document.createElement('div');
    caption.className = 'image-caption';
    caption.textContent = 'Imagen enviada para análisis';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    contentDiv.appendChild(image);
    contentDiv.appendChild(caption);
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatBox.appendChild(messageDiv);
    
    // Scroll al final del chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para mostrar archivo en el chat
function addFileToChat(file) {
    const chatBox = document.getElementById('chatBox');
    
    if (!chatBox) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const fileElement = document.createElement('div');
    fileElement.className = 'message-file';
    
    const filePreview = document.createElement('div');
    filePreview.className = 'file-preview';
    filePreview.innerHTML = `<i class="${getFileIcon(file.type)}"></i>`;
    
    const fileDetails = document.createElement('div');
    fileDetails.className = 'file-details';
    
    const fileTitle = document.createElement('div');
    fileTitle.className = 'file-title';
    fileTitle.textContent = file.name;
    
    const fileMeta = document.createElement('div');
    fileMeta.className = 'file-meta';
    fileMeta.innerHTML = `<span>${formatFileSize(file.size)}</span><span>${file.type || 'Archivo'}</span>`;
    
    fileDetails.appendChild(fileTitle);
    fileDetails.appendChild(fileMeta);
    
    fileElement.appendChild(filePreview);
    fileElement.appendChild(fileDetails);
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    contentDiv.appendChild(fileElement);
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatBox.appendChild(messageDiv);
    
    // Scroll al final del chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para enviar mensaje
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const chatBox = document.getElementById('chatBox');
    
    if (!userInput || !chatBox) {
        console.error("Elementos del DOM no encontrados");
        return;
    }
    
    const userText = userInput.value.trim();
    
    // Si no hay texto y no hay imagen, mostrar alerta
    if (!userText && !currentImage) {
        showNotification("Por favor, escribe un mensaje o sube una imagen antes de enviar.", 'warning');
        return;
    }
    
    // Agregar mensaje del usuario al chat (si hay texto)
    if (userText) {
        addMessageToChat('user', userText);
        
        // Guardar en historial
        chatHistory.push({
            type: 'user',
            content: userText,
            timestamp: new Date().toISOString()
        });
        saveChatHistory();
    }
    
    // Limpiar el campo de entrada
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Actualizar contador de caracteres
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '0/2000';
        charCount.className = 'char-count';
    }
    
    // Obtener respuesta del bot
    getBotResponse(userText, currentImage);
    
    // Limpiar la imagen actual después de enviar
    currentImage = null;
}

// Función para agregar mensaje al chat
function addMessageToChat(sender, text) {
    const chatBox = document.getElementById('chatBox');
    
    if (!chatBox) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Procesar texto para formato de código
    if (text.includes('```')) {
        contentDiv.innerHTML = formatCodeBlocks(text);
    } else {
        const textParagraph = document.createElement('p');
        textParagraph.textContent = text;
        contentDiv.appendChild(textParagraph);
    }
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = getCurrentTime();
    
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatBox.appendChild(messageDiv);
    
    // Scroll al final del chat
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Función para formatear bloques de código
function formatCodeBlocks(text) {
    // Reemplazar bloques de código con formato HTML
    return text.replace(/```(\w+)?\s*([\s\S]*?)```/g, function(_, language, code) {
        return `<pre><code class="language-${language || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
    });
}

// Función para escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para obtener la hora actual formateada
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
}

// Función para obtener respuesta del bot
async function getBotResponse(userMessage, imageData = null) {
    const chatBox = document.getElementById('chatBox');
    
    // Mostrar indicador de "escribiendo"
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message bot typing';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = '<i class="fas fa-robot"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingDots = document.createElement('div');
    typingDots.className = 'typing-dots';
    typingDots.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(typingDots);
    typingIndicator.appendChild(avatarDiv);
    typingIndicator.appendChild(contentDiv);
    
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
    
    try {
        // Preparar el contenido para la API
        const contents = [{
            parts: []
        }];
        
        // Agregar contexto del historial de conversación (últimos 5 mensajes)
        if (chatHistory.length > 0) {
            const recentHistory = chatHistory.slice(-10); // Últimos 10 mensajes para contexto
            const contextMessage = "Contexto de conversación previa:\n" + 
                recentHistory.map(msg => `${msg.type === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`).join('\n') +
                "\n\nRespuesta actual:";
            
            contents[0].parts.push({ text: contextMessage });
        }
        
        // Agregar texto si existe
        if (userMessage) {
            contents[0].parts.push({ text: userMessage });
        }
        
        // Agregar imagen si existe
        if (imageData) {
            // Convertir data URL a base64 (eliminar el prefijo data:image/...;base64,)
            const base64Data = imageData.split(',')[1];
            const mimeType = imageData.split(';')[0].split(':')[1];
            
            contents[0].parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Data
                }
            });
        }
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remover el indicador de "escribiendo"
        typingIndicator.remove();
        
        // Extraer el texto de respuesta
        const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                           "Lo siento, no pude procesar tu solicitud. Por favor, intenta de nuevo.";
        
        // Agregar respuesta al chat
        addMessageToChat('bot', botResponse);
        
        // Guardar en historial
        chatHistory.push({
            type: 'bot',
            content: botResponse,
            timestamp: new Date().toISOString()
        });
        saveChatHistory();
        
    } catch (error) {
        console.error('Error al obtener respuesta del bot:', error);
        
        // Remover el indicador de "escribiendo"
        typingIndicator.remove();
        
        // Mostrar mensaje de error
        const errorMessage = '⚠️ Error de conexión. Por favor, verifica tu conexión a Internet e intenta nuevamente.';
        addMessageToChat('bot', errorMessage);
        
        // Guardar error en historial
        chatHistory.push({
            type: 'bot',
            content: errorMessage,
            timestamp: new Date().toISOString()
        });
        saveChatHistory();
    }
}

// Función para entrada de voz
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    
    recognition.start();
    
    // Cambiar icono del botón durante el reconocimiento
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        const originalIcon = voiceBtn.innerHTML;
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        voiceBtn.style.background = 'var(--accent-color)';
        voiceBtn.style.color = 'white';
        
        recognition.onend = function() {
            voiceBtn.innerHTML = originalIcon;
            voiceBtn.style.background = '';
            voiceBtn.style.color = '';
        };
    }
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
        showNotification('Voz reconocida correctamente', 'success');
    };
    
    recognition.onerror = function(event) {
        console.error('Error en reconocimiento de voz:', event.error);
        showNotification('Error en el reconocimiento de voz: ' + event.error, 'error');
    };
}

// Limpiar chat
function clearChat() {
    const chatBox = document.getElementById('chatBox');
    
    if (!chatBox) return;
    
    // Confirmar antes de limpiar
    if (confirm('¿Estás seguro de que quieres limpiar todo el chat? Esta acción no se puede deshacer.')) {
        // Guardar mensaje de bienvenida
        const welcomeMessage = chatBox.querySelector('.welcome-message');
        
        // Limpiar chat
        chatBox.innerHTML = '';
        
        // Limpiar historial
        chatHistory = [];
        saveChatHistory();
        
        // Restaurar mensaje de bienvenida
        if (welcomeMessage) {
            chatBox.appendChild(welcomeMessage);
        } else {
            // Crear mensaje de bienvenida si no existe
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'message bot welcome-message';
            welcomeDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <h3>¡Chat limpiado!</h3>
                    <p>El chat ha sido limpiado. Puedes comenzar una nueva conversación.</p>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `;
            chatBox.appendChild(welcomeDiv);
        }
        
        showNotification('Chat limpiado correctamente', 'success');
    }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationIcon || !notificationText) return;
    
    // Configurar notificación según el tipo
    notification.className = `notification ${type}`;
    notificationText.textContent = message;
    
    // Cambiar icono según el tipo
    switch (type) {
        case 'success':
            notificationIcon.className = 'fas fa-check-circle';
            break;
        case 'error':
            notificationIcon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            notificationIcon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            notificationIcon.className = 'fas fa-info-circle';
    }
    
    // Mostrar notificación
    notification.classList.add('show');
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

// Ocultar notificación
function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// Exportar historial de chat
function exportChatHistory() {
    const chatData = {
        version: '3.0',
        exportDate: new Date().toISOString(),
        messages: chatHistory
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Historial de chat exportado correctamente', 'success');
}

// Importar historial de chat
function importChatHistory(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.messages && Array.isArray(importedData.messages)) {
                chatHistory = importedData.messages;
                saveChatHistory();
                showNotification('Historial de chat importado correctamente', 'success');
                
                // Recargar la conversación
                clearChat();
                // Aquí podrías implementar la recreación de mensajes desde el historial
            } else {
                showNotification('El archivo no contiene un historial de chat válido', 'error');
            }
        } catch (error) {
            console.error('Error al importar historial:', error);
            showNotification('Error al importar el historial de chat', 'error');
        }
    };
    
    reader.readAsText(file);
}