// --- CONFIGURAÇÃO BASE CENTRALIZADA (Mais organizada) ---
const CONFIG = {
    // Constantes de Caminho
    // AJUSTADO: Se sua imagem base é um arquivo .png, atualize aqui também.
    BASE_FILE_NAME: "Base.png", 
    IMAGE_PATH: "vestiario-robo/",
    
    // 1. Definição das cores e dos NOMES DOS ARQUIVOS DE IMAGEM
    COLORS: [
        // O item de índice 0 é o Padrão ORIGINAL para fins de Reset.
        // AJUSTADO: Nome do arquivo base para .png
        { name: "Padrão (Base)", hex: "#ffffff", fileName: "Base.png", category: 'default' }, 
        
        // Pele Clara
        { name: "Pele Clara - Amarelo", hex: "#ffeb3b", fileName: "Pele clara -Amarelo.png", category: 'clara' }, 
        { name: "Pele Clara - Verde-Limão", hex: "#cddc39", fileName: "Pele_clara - verde-limão.png", category: 'clara' }, 
        { name: "Pele Clara - Lilás", hex: "#9c27b0", fileName: "Pele_clara-Lílas.png", category: 'clara' }, 
        { name: "Pele Clara - Salmão", hex: "#ff9800", fileName: "Pele_clara-Salmão.png", category: 'clara' }, 
        
        // Pardo
        { name: "Pardo - Cinza", hex: "#795548", fileName: "Pardo-cinza.png", category: 'pardo' }, 
        { name: "Pardo - Rosa", hex: "#e91e63", fileName: "Pardo-Rosa.png", category: 'pardo' }, 
        
        // Negro
        { name: "Negro - Marrom", hex: "#5d4037", fileName: "Negro-Marrom.png", category: 'negro' }, 
        { name: "Negro", hex: "#212121", fileName: "robo-negro.png", category: 'negro' }, 
        { name: "Negro - Rosa", hex: "#ffc0cb", fileName: "Negro-Rosa.png", category: 'negro' }, 
        { name: "Negro - Ciano", hex: "#00bcd4", fileName: "Negro-Ciano.png", category: 'negro' }, 
        { name: "Negro - Laranja", hex: "#ff5722", fileName: "Negro-Laranja.png", category: 'negro' }, 
        { name: "Negro - Preto", hex: "#000000", fileName: "Negro-Preto.png", category: 'negro' }, 
        { name: "Negro - Azul", hex: "#1e88e5", fileName: "Negro-Azul.png", category: 'negro' }, 

        // Genéricas
        { name: "Verde", hex: "#4caf50", fileName: "Verde.png", category: 'genericas' },
        { name: "Azul", hex: "#2196f3", fileName: "Azul.png", category: 'genericas' },
        { name: "Cinza", hex: "#9e9e9e", fileName: "Cinza.png", category: 'genericas' },
        { name: "Rosa", hex: "#f48fb1", fileName: "Rosa.png", category: 'genericas' },
        { name: "Laranja", hex: "#ff9100", fileName: "Laranja.png", category: 'genericas' },
        { name: "Roxo", hex: "#673ab7", fileName: "Roxo.png", category: 'genericas' },
        { name: "Vermelho", hex: "#f44336", fileName: "Vermelho.png", category: 'genericas' },
        { name: "Ciano", hex: "#00e5ff", fileName: "Ciano.png", category: 'genericas' },
    ],
    // Mapeamento das categorias para os IDs dos elementos HTML
    CATEGORY_MAPPING: {
        'default': 'genericas-options', 
        'clara': 'clara-options',
        'pardo': 'pardo-options',
        'negro': 'negro-options',
        'genericas': 'genericas-options'
    }
};

/**
 * Classe principal para gerenciar toda a lógica de customização do robô.
 */
class RobotCustomizer {
    constructor() {
        this.dom = {
            robotImage: document.getElementById('robot-image'),
            saveButton: document.getElementById('save-button'),
            resetButton: document.getElementById('reset-button'), 
            robotCardBody: document.getElementById('robot-card-body'), 
            statusDisplay: document.getElementById('current-status'),
        };

        this.currentState = {
            fileName: CONFIG.BASE_FILE_NAME,
            colorName: "Padrão (Base)"
        };
        
        if (Object.values(this.dom).some(el => !el)) {
            console.error("Erro fatal: Um ou mais elementos DOM críticos não foram encontrados. Verifique os IDs no index.html.");
            return;
        }

        this.init();
    }

    // --- MÉTODOS DE INICIALIZAÇÃO ---

    init() {
        this.createColorSwatches();
        this.attachEventListeners();
        this.loadSavedColor();
    }

    createColorSwatches() {
        CONFIG.COLORS.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color.hex;
            swatch.setAttribute('data-filename', color.fileName); 
            swatch.title = color.name;
            
            swatch.addEventListener('click', () => {
                this.changeRobotVisual(color); 
                this.setActiveSwatch(swatch);
            });

            const targetElementId = CONFIG.CATEGORY_MAPPING[color.category];
            const targetElement = document.getElementById(targetElementId);
            
            if (targetElement) {
                targetElement.appendChild(swatch);
            }
        });
    }

    // --- MÉTODOS DE MANIPULAÇÃO DE ESTADO ---

    /**
     * Atualiza a imagem, o fundo e o estado interno do robô.
     * @param {Object} color - O objeto de cor selecionado.
     */
    changeRobotVisual(color) { 
        // 1. Atualiza o DOM (Imagem e Fundo)
        this.dom.robotImage.src = `${CONFIG.IMAGE_PATH}${color.fileName}`; 
        
        // <<< CORREÇÃO APLICADA AQUI >>>
        // Mudar o background do corpo do card para a cor selecionada
        this.dom.robotCardBody.style.backgroundColor = color.hex; 

        // 2. Atualiza o Estado Interno
        this.currentState.fileName = color.fileName;
        this.currentState.colorName = color.name;
        
        // 3. Atualiza o Rodapé de Status
        this.updateStatus(this.currentState.colorName);
    }

    /**
     * Define qual swatch de cor está visualmente ativo.
     * @param {HTMLElement} selectedSwatch - O swatch selecionado.
     */
    setActiveSwatch(selectedSwatch) {
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('active');
        });
        if (selectedSwatch) {
            selectedSwatch.classList.add('active');
        }
    }

    /**
     * Atualiza o texto e a cor do status no rodapé do card.
     * @param {string} colorName - O nome da cor atual.
     */
    updateStatus(colorName) {
        this.dom.statusDisplay.textContent = `VISUAL ATUAL: ${colorName}`;
        this.dom.statusDisplay.className = 'fw-bold'; 
        
        if (colorName.includes("Padrão") || colorName.includes("SALVO")) {
            this.dom.statusDisplay.classList.add('text-success'); 
        } else {
            this.dom.statusDisplay.classList.add('text-warning'); 
        }
    }

    // --- MÉTODOS DE LOCAL STORAGE E EVENTOS ---

    /**
     * Carrega a cor salva do localStorage ao iniciar a página.
     */
    loadSavedColor() {
        const savedFileName = localStorage.getItem('robotFileName');
        
        const initialColor = savedFileName 
            ? CONFIG.COLORS.find(color => color.fileName === savedFileName)
            : CONFIG.COLORS.find(color => color.fileName === CONFIG.BASE_FILE_NAME); 

        if (initialColor) {
            this.changeRobotVisual(initialColor); 
            
            const activeSwatch = document.querySelector(`.color-swatch[data-filename="${initialColor.fileName}"]`);
            this.setActiveSwatch(activeSwatch); 
        }
    }
    
    /**
     * Manipulador do botão de Salvar.
     */
    handleSave() {
        localStorage.setItem('robotFileName', this.currentState.fileName);
        
        this.dom.saveButton.classList.add('saved-feedback');
        this.dom.saveButton.innerHTML = `<i class="fas fa-check me-2"></i> SALVO!`;
        
        this.updateStatus(this.currentState.colorName + " (SALVO)");
        this.dom.statusDisplay.classList.remove('text-warning');
        this.dom.statusDisplay.classList.add('text-success');

        setTimeout(() => {
            this.dom.saveButton.classList.remove('saved-feedback');
            this.dom.saveButton.innerHTML = `<i class="fas fa-save me-2"></i> SALVAR ESCOLHA`;
        }, 1500); 
    }

    /**
     * Manipulador do botão de Reset.
     */
    handleReset() {
        const originalColor = CONFIG.COLORS.find(color => color.fileName === CONFIG.BASE_FILE_NAME);
        
        localStorage.removeItem('robotFileName'); 
        
        this.changeRobotVisual(originalColor);
        
        const activeSwatch = document.querySelector(`.color-swatch[data-filename="${originalColor.fileName}"]`);
        this.setActiveSwatch(activeSwatch);

        this.dom.resetButton.classList.add('saved-feedback');
        this.dom.resetButton.innerHTML = `<i class="fas fa-check me-2"></i> COR RESETADA!`;
        this.updateStatus(originalColor.name);
        this.dom.statusDisplay.classList.remove('text-warning');
        this.dom.statusDisplay.classList.add('text-success');

        setTimeout(() => {
            this.dom.resetButton.classList.remove('saved-feedback');
            this.dom.resetButton.innerHTML = `<i class="fas fa-undo me-2"></i> Resetar para o Padrão`;
        }, 1500);
    }

    /**
     * Anexa os Event Listeners aos botões.
     */
    attachEventListeners() {
        this.dom.saveButton.addEventListener('click', this.handleSave.bind(this));
        this.dom.resetButton.addEventListener('click', this.handleReset.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RobotCustomizer();
});