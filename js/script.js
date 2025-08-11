// Modal Personalizado
class CustomModal {
    constructor() {
        this.modal = document.getElementById('custom-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalMessage = document.getElementById('modal-message');
        this.modalConfirm = document.getElementById('modal-confirm');
        this.modalCancel = document.getElementById('modal-cancel');
        this.modalContainer = this.modal.querySelector('.modal-container');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Fechar modal ao clicar no overlay
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hide();
            }
        });

        // Botão cancelar
        this.modalCancel.addEventListener('click', () => {
            this.hide();
        });
    }

    show(options = {}) {
        const {
            title = 'Confirmar Ação',
            message = 'Tem certeza que deseja realizar esta ação?',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            type = 'default', // default, danger, success, warning
            onConfirm = () => {},
            onCancel = () => {}
        } = options;

        // Configurar conteúdo
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.modalConfirm.textContent = confirmText;
        this.modalCancel.textContent = cancelText;

        // Aplicar tipo (classe CSS)
        this.modalContainer.className = 'modal-container';
        if (type !== 'default') {
            this.modalContainer.classList.add(type);
        }

        // Configurar eventos dos botões
        this.modalConfirm.onclick = () => {
            onConfirm();
            this.hide();
        };

        this.modalCancel.onclick = () => {
            onCancel();
            this.hide();
        };

        // Mostrar modal
        document.body.classList.add('modal-open');
        this.modal.classList.add('active');
        
        // Focar no botão cancelar por padrão
        setTimeout(() => {
            this.modalCancel.focus();
        }, 100);
    }

    hide() {
        document.body.classList.remove('modal-open');
        this.modal.classList.remove('active');
    }

    // Método estático para facilitar o uso
    static confirm(options) {
        return new Promise((resolve) => {
            const modal = new CustomModal();
            modal.show({
                ...options,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }
}

// ReadingSN - JavaScript Principal
class ReadingSN {
    constructor() {
        this.currentNoteId = null;
        this.notes = this.loadNotes();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupNotes();
        this.setupContactForm();
        this.renderNotesList();
        
        // Carregar primeira anotação se existir
        if (this.notes.length > 0) {
            this.loadNote(this.notes[0].id);
        }
    }

    // Navegação
    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Toggle menu mobile
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Navegação entre seções
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                
                // Fechar menu mobile
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Atualizar link ativo
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(sectionId) {
        // Esconder todas as seções
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section-active');
        });
        
        // Mostrar seção selecionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('section-active');
        }
    }

    // Sistema de Anotações
    setupNotes() {
        const newNoteBtn = document.getElementById('new-note-btn');
        const saveNoteBtn = document.getElementById('save-note-btn');
        const deleteNoteBtn = document.getElementById('delete-note-btn');
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        const noteTitle = document.getElementById('note-title');
        const noteContent = document.getElementById('note-content');

        newNoteBtn.addEventListener('click', () => this.createNewNote());
        saveNoteBtn.addEventListener('click', () => this.saveCurrentNote());
        deleteNoteBtn.addEventListener('click', () => this.deleteCurrentNote());
        downloadPdfBtn.addEventListener('click', () => this.downloadNotePDF());

        // Auto-save ao digitar (com debounce)
        let saveTimeout;
        const autoSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (this.currentNoteId) {
                    this.saveCurrentNote(false); // false = não mostrar notificação
                }
            }, 1000);
        };

        noteTitle.addEventListener('input', autoSave);
        noteContent.addEventListener('input', autoSave);
    }

    loadNotes() {
        const saved = localStorage.getItem('readingsn-notes');
        return saved ? JSON.parse(saved) : [];
    }

    saveNotes() {
        localStorage.setItem('readingsn-notes', JSON.stringify(this.notes));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    createNewNote() {
        const newNote = {
            id: this.generateId(),
            title: 'Nova Anotação',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.notes.unshift(newNote);
        this.saveNotes();
        this.renderNotesList();
        this.loadNote(newNote.id);
        this.showNotification('Nova anotação criada!', 'success');
    }

    loadNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentNoteId = noteId;
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;

        // Atualizar item ativo na lista
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-note-id=\"${noteId}\"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    saveCurrentNote(showNotification = true) {
        if (!this.currentNoteId) return;

        const title = document.getElementById('note-title').value.trim();
        const content = document.getElementById('note-content').value;

        const noteIndex = this.notes.findIndex(n => n.id === this.currentNoteId);
        if (noteIndex === -1) return;

        this.notes[noteIndex] = {
            ...this.notes[noteIndex],
            title: title || 'Sem título',
            content: content,
            updatedAt: new Date().toISOString()
        };

        this.saveNotes();
        this.renderNotesList();
        
        if (showNotification) {
            this.showNotification('Anotação salva!', 'success');
        }
    }

    async deleteCurrentNote() {
        if (!this.currentNoteId) return;

        const confirmed = await CustomModal.confirm({
            title: 'Excluir Anotação',
            message: 'Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.',
            confirmText: 'Excluir',
            cancelText: 'Cancelar',
            type: 'danger'
        });

        if (confirmed) {
            this.notes = this.notes.filter(n => n.id !== this.currentNoteId);
            this.saveNotes();
            this.renderNotesList();

            // Limpar editor
            document.getElementById('note-title').value = '';
            document.getElementById('note-content').value = '';
            this.currentNoteId = null;

            // Carregar primeira anotação se existir
            if (this.notes.length > 0) {
                this.loadNote(this.notes[0].id);
            }

            this.showNotification('Anotação excluída!', 'success');
        }
    }

    renderNotesList() {
        const notesList = document.getElementById('notes-list');
        
        if (this.notes.length === 0) {
            notesList.innerHTML = `
                <div class=\"note-item\" style=\"text-align: center; color: var(--text-light);\">
                    <p>Nenhuma anotação ainda.</p>
                    <p>Clique em \"+ Nova Anotação\" para começar!</p>
                </div>
            `;
            return;
        }

        notesList.innerHTML = this.notes.map(note => {
            const preview = note.content.substring(0, 50) + (note.content.length > 50 ? '...' : '');
            const date = new Date(note.updatedAt).toLocaleDateString('pt-BR');
            
            return `
                <div class=\"note-item\" data-note-id=\"${note.id}\" onclick=\"app.loadNote('${note.id}')\">
                    <div class=\"note-item-title\">${note.title}</div>
                    <div class=\"note-item-preview\">${preview || 'Anotação vazia'}</div>
                    <div class=\"note-item-date\" style=\"font-size: 0.75rem; color: var(--text-light); margin-top: 4px;\">${date}</div>
                </div>
            `;
        }).join('');
    }

    downloadNotePDF() {
        if (!this.currentNoteId) {
            this.showNotification('Selecione uma anotação para baixar!', 'error');
            return;
        }

        const note = this.notes.find(n => n.id === this.currentNoteId);
        if (!note) return;

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Configurações
            const pageWidth = doc.internal.pageSize.width;
            const margin = 20;
            const maxWidth = pageWidth - (margin * 2);

            // Título
            doc.setFontSize(20);
            doc.setFont(undefined, 'bold');
            doc.text(note.title, margin, 30);

            // Data
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            const date = new Date(note.updatedAt).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            doc.text(`Última atualização: ${date}`, margin, 45);

            // Linha separadora
            doc.setDrawColor(212, 175, 55); // accent color
            doc.line(margin, 55, pageWidth - margin, 55);

            // Conteúdo
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            
            if (note.content.trim()) {
                const lines = doc.splitTextToSize(note.content, maxWidth);
                doc.text(lines, margin, 70);
            } else {
                doc.setFont(undefined, 'italic');
                doc.text('Esta anotação está vazia.', margin, 70);
            }

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont(undefined, 'normal');
                doc.text(`ReadingSN - Página ${i} de ${pageCount}`, margin, doc.internal.pageSize.height - 10);
            }

            // Download
            const filename = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
            doc.save(filename);
            
            this.showNotification('PDF baixado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            this.showNotification('Erro ao gerar PDF. Tente novamente.', 'error');
        }
    }

    // Formulário de Contato
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Simular envio (em um projeto real, enviaria para um servidor)
            this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
        });
    }

    // Sistema de Notificações
    showNotification(message, type = 'info') {
        // Remover notificação existente
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Criar nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick=\"this.parentElement.remove()\" style=\"background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 10px;\">&times;</button>
        `;

        // Estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
            animation: 'slideInRight 0.3s ease',
            backgroundColor: type === 'success' ? '#28a745' : 
                           type === 'error' ? '#dc3545' : 
                           type === 'warning' ? '#ffc107' : '#17a2b8'
        });

        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Funções globais para compatibilidade
function showSection(sectionId) {
    app.showSection(sectionId);
    
    // Atualizar navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Animações CSS adicionais
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        font-family: var(--font-sans);
    }

    .note-item-date {
        font-size: 0.75rem;
        color: var(--text-light);
        margin-top: 4px;
    }

    /* Melhorias de acessibilidade */
    .btn:focus,
    .nav-link:focus,
    .form-input:focus,
    .form-textarea:focus,
    .note-title-input:focus,
    .note-editor:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
    }

    /* Indicador de carregamento */
    .loading {
        opacity: 0.6;
        pointer-events: none;
    }

    /* Scroll suave */
    html {
        scroll-behavior: smooth;
    }

    /* Melhorias para mobile */
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            min-width: auto;
        }
    }
`;

// Adicionar estilos adicionais
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Inicializar aplicação
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ReadingSN();
});

// Melhorias de performance
// Lazy loading para imagens
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Registrar service worker aqui se necessário
    });
}

// Prevenção de perda de dados
window.addEventListener('beforeunload', (e) => {
    if (app && app.currentNoteId) {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const currentNote = app.notes.find(n => n.id === app.currentNoteId);
        
        if (currentNote && (currentNote.title !== title || currentNote.content !== content)) {
            e.preventDefault();
            e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        }
    }
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S para salvar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (app && app.currentNoteId) {
            app.saveCurrentNote();
        }
    }
    
    // Ctrl/Cmd + N para nova anotação
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (app) {
            app.createNewNote();
        }
    }
});

// Exportar para uso global
window.ReadingSN = ReadingSN;


// Inicializar modal global
let customModal;
document.addEventListener('DOMContentLoaded', () => {
    customModal = new CustomModal();
});

// Função global para usar o modal facilmente
window.showCustomModal = (options) => {
    if (customModal) {
        customModal.show(options);
    }
};

// Função global para confirmação
window.customConfirm = (options) => {
    return CustomModal.confirm(options);
};

