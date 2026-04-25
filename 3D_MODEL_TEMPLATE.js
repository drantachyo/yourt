// ═══════════════════════════════════════════════════════════════════════════
// ШАБЛОН ДЛЯ ДОБАВЛЕНИЯ НОВОЙ 3D МОДЕЛИ
// ═══════════════════════════════════════════════════════════════════════════
// 
// Копируй нужные части этого кода и адаптируй под свою модель
//
// ═══════════════════════════════════════════════════════════════════════════

// 1️⃣  РЕГИСТРАЦИЯ GLB ФАЙЛОВ (добавить в GLB_PARTS)
// ─────────────────────────────────────────────────────────────────────────
const GLB_PARTS_EXAMPLE = [
    { file: 'model_name.glb', key: 'component1' },
    { file: 'model_name.glb', key: 'component2' },
    { file: 'model_name.glb', key: 'component3' },
];

// Или (если части в одном GLB файле и разделены по группам):
const GLB_PARTS_SINGLE_FILE = [
    { file: 'my_model.glb', key: 'component1' },
    // GLFTLoader автоматически разберет группы объектов по userData.key
];


// 2️⃣  ЦВЕТА ПОДСВЕТКИ (добавить в PART_HIGHLIGHT)
// ─────────────────────────────────────────────────────────────────────────
const PART_HIGHLIGHT_EXAMPLE = {
    component1: 0x6b4800,  // коричневый
    component2: 0x3a2800,  // тёмный коричневый
    component3: 0x4a3a00,  // золотой коричневый
};


// 3️⃣  МАППИНГ АУДИО ФАЙЛОВ (добавить в AUDIO_FILE_MAP)
// ─────────────────────────────────────────────────────────────────────────
const AUDIO_FILE_MAP_EXAMPLE = {
    component1: 'component1_name',  // файл: component1_name_ru.mp3 и т.д.
    component2: 'component2_name',
    component3: 'component3_name',
};


// 4️⃣  i18N КЛЮЧИ (добавить в _i18nData)
// ─────────────────────────────────────────────────────────────────────────

const I18N_KEYS_EXAMPLE = {
    ru: {
        // === Заголовки и описания новой секции ===
        mymodel_title: 'Название Модели На Русском',
        mymodel_subtitle: 'Подзаголовок или описание',
        mymodel_intro: 'Вводный текст о модели...',
        
        // === Компоненты модели ===
        comp_component1_title: 'Название Компонента 1',
        comp_component1_desc: 'Подробное описание компонента 1 на русском',
        
        comp_component2_title: 'Название Компонента 2',
        comp_component2_desc: 'Подробное описание компонента 2 на русском',
        
        comp_component3_title: 'Название Компонента 3',
        comp_component3_desc: 'Подробное описание компонента 3 на русском',
    },
    kz: {
        mymodel_title: 'Модельдің Атауы Қазақша',
        mymodel_subtitle: 'Ішінара сипаттамасы',
        mymodel_intro: 'Модель туралы кіріспе мәтіні...',
        
        comp_component1_title: 'Компонент 1 Қазақша Атауы',
        comp_component1_desc: 'Компонент 1 туралы егжей-тегжей сипаттама қазақша',
        
        comp_component2_title: 'Компонент 2 Қазақша Атауы',
        comp_component2_desc: 'Компонент 2 туралы егжей-тегжей сипаттама қазақша',
        
        comp_component3_title: 'Компонент 3 Қазақша Атауы',
        comp_component3_desc: 'Компонент 3 туралы егжей-тегжей сипаттама қазақша',
    },
    en: {
        mymodel_title: 'Model Name In English',
        mymodel_subtitle: 'Subtitle or brief description',
        mymodel_intro: 'Introduction text about the model...',
        
        comp_component1_title: 'Component 1 Title',
        comp_component1_desc: 'Detailed description of component 1 in English',
        
        comp_component2_title: 'Component 2 Title',
        comp_component2_desc: 'Detailed description of component 2 in English',
        
        comp_component3_title: 'Component 3 Title',
        comp_component3_desc: 'Detailed description of component 3 in English',
    }
};


// 5️⃣  HTML БОКОВОЕ МЕНЮ (добавить в #parts-menu контейнер)
// ─────────────────────────────────────────────────────────────────────────

const HTML_MENU_EXAMPLE = `
<div id="parts-menu" class="absolute left-4 top-1/2 z-20 flex flex-col gap-2" style="transform:translateY(-50%);">
    <button onclick="selectPart('component1')" id="btn-component1" class="part-btn" data-key="component1">
        <span class="part-icon">🔹</span>
        <span class="part-label" data-i18n="comp_component1_title">Component 1</span>
    </button>
    <button onclick="selectPart('component2')" id="btn-component2" class="part-btn" data-key="component2">
        <span class="part-icon">🔷</span>
        <span class="part-label" data-i18n="comp_component2_title">Component 2</span>
    </button>
    <button onclick="selectPart('component3')" id="btn-component3" class="part-btn" data-key="component3">
        <span class="part-icon">🔶</span>
        <span class="part-label" data-i18n="comp_component3_title">Component 3</span>
    </button>
    <button onclick="selectPart(null)" id="btn-reset" class="part-btn-reset">
        ✕ <span data-i18n="reset_view">Reset</span>
    </button>
</div>
`;


// 6️⃣  ПОЛНАЯ HTML СЕКЦИЯ (вставить в <main>)
// ─────────────────────────────────────────────────────────────────────────

const HTML_SECTION_EXAMPLE = `
<section class="py-20 bg-steppe-900 text-white overflow-hidden reveal">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-display mb-4" data-i18n="mymodel_title">Model Title</h2>
            <p class="text-steppe-300 max-w-2xl mx-auto" data-i18n="mymodel_subtitle">Model description</p>
        </div>

        <div id="interactive-model-container" style="position:relative; width:100%; height:72vh; background:#111519; border-radius:1.5rem; overflow:hidden; box-shadow:0 30px 60px -12px rgba(0,0,0,0.6);">
            <div id="loading-model-3d" class="absolute inset-0 flex items-center justify-center bg-steppe-900 z-30">
                <div class="flex flex-col items-center gap-4">
                    <div class="w-14 h-14 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-steppe-400 font-semibold tracking-widest uppercase text-xs">Loading Model...</span>
                </div>
            </div>

            <div id="ui-hint-model" class="absolute top-5 left-5 z-20 pointer-events-none">
                <div class="glass text-steppe-900 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest" data-i18n="controls_hint">[ LMB: Rotate ] — [ Scroll: Zoom ]</div>
            </div>

            <!-- БОКОВОЕ МЕНЮ -->
            <div id="parts-menu-model" class="absolute left-4 top-1/2 z-20 flex flex-col gap-2" style="transform:translateY(-50%);">
                <button onclick="selectPartModel('component1')" class="part-btn" data-key="component1">
                    <span class="part-icon">🔹</span>
                    <span class="part-label" data-i18n="comp_component1_title">Component 1</span>
                </button>
                <button onclick="selectPartModel('component2')" class="part-btn" data-key="component2">
                    <span class="part-icon">🔷</span>
                    <span class="part-label" data-i18n="comp_component2_title">Component 2</span>
                </button>
                <button onclick="selectPartModel('component3')" class="part-btn" data-key="component3">
                    <span class="part-icon">🔶</span>
                    <span class="part-label" data-i18n="comp_component3_title">Component 3</span>
                </button>
                <button onclick="selectPartModel(null)" class="part-btn-reset">
                    ✕ <span data-i18n="reset_view">Reset</span>
                </button>
            </div>

            <div id="model-canvas-container" style="width:100%; height:100%;"></div>

            <!-- INFO CARD -->
            <div id="info-card-model" class="yurt-info-overlay p-6 rounded-2xl shadow-2xl" style="background:rgba(17,21,25,0.95);backdrop-filter:blur(16px);border:1px solid rgba(212,175,55,0.3);border-left:4px solid #d4af37;">
                <h3 id="card-title-model" class="text-xl font-display mb-2" style="color:#d4af37;"></h3>
                <div id="card-desc-model" class="text-sm leading-relaxed space-y-2" style="color:#e8dcc8;"></div>
                <div class="mt-4 pt-3 flex justify-between items-center" style="border-top:1px solid rgba(212,175,55,0.2);">
                    <span class="text-[10px] font-bold uppercase tracking-tighter" style="color:#d4af37;" data-i18n="trad_eng">Traditional Engineering</span>
                    <button onclick="selectPartModel(null)" style="color:#888;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>
`;


// 7️⃣  ФУНКЦИИ ДЛЯ НОВОЙ МОДЕЛИ (JavaScript)
// ─────────────────────────────────────────────────────────────────────────

/*
// Переменные для отдельной модели
let modelScene, modelCamera, modelRenderer, modelControls, modelRaycaster, modelMouse;
let modelGroup = null;

function initModel() {
    const container = document.getElementById('model-canvas-container');
    
    modelScene = new THREE.Scene();
    modelScene.background = new THREE.Color(0x111519);
    modelScene.fog = new THREE.FogExp2(0x111519, 0.006);

    modelCamera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    modelCamera.position.set(30, 18, 30);

    modelRenderer = new THREE.WebGLRenderer({ antialias: true });
    modelRenderer.setSize(container.clientWidth, container.clientHeight);
    modelRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    modelRenderer.shadowMap.enabled = true;
    modelRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(modelRenderer.domElement);

    // Lighting setup
    const ambient = new THREE.AmbientLight(0xfff5e1, 2.5);
    modelScene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 4.0);
    sun.position.set(20, 40, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    modelScene.add(sun);

    // Controls
    modelControls = new OrbitControls(modelCamera, modelRenderer.domElement);
    modelControls.enableDamping = true;
    modelControls.dampingFactor = 0.08;
    modelControls.autoRotate = true;
    modelControls.autoRotateSpeed = 0.4;

    modelRaycaster = new THREE.Raycaster();
    modelMouse = new THREE.Vector2(-9999, -9999);

    loadModelFile(); // загрузить GLB
    animateModel();
}

async function loadModelFile() {
    const loader = new GLTFLoader();
    loader.load('./my_model.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material && !Array.isArray(child.material)) {
                    child.material = child.material.clone();
                    child.material.emissive = new THREE.Color(0x000000);
                }
            }
        });
        
        modelGroup = new THREE.Group();
        modelGroup.add(model);
        modelScene.add(modelGroup);
        
        // Автомасштабирование
        const bbox = new THREE.Box3().setFromObject(modelGroup);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 18.0 / maxDim;
        
        modelGroup.scale.setScalar(scale);
        const bbox2 = new THREE.Box3().setFromObject(modelGroup);
        const c2 = new THREE.Vector3();
        bbox2.getCenter(c2);
        modelGroup.position.set(-c2.x, -bbox2.min.y, -c2.z);
        
        document.getElementById('loading-model-3d').style.display = 'none';
    });
}

function animateModel() {
    requestAnimationFrame(animateModel);
    modelControls.update();
    modelRenderer.render(modelScene, modelCamera);
}

// Функция выбора компонента
function selectPartModel(key) {
    // Аналогично selectPart() для юрты
    // ... код выделения компонента ...
}
*/


// ═══════════════════════════════════════════════════════════════════════════
// ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ
// ═══════════════════════════════════════════════════════════════════════════

/*
ШАГ 1: Подготовка файлов
   └─ Поместить my_model.glb в корень проекта
   └─ Поместить аудио файлы: component1_[lang].mp3 и т.д.

ШАГ 2: Обновить массивы в JavaScript
   └─ GLB_PARTS → добавить { file, key } объекты
   └─ PART_HIGHLIGHT → добавить цвета подсветки
   └─ AUDIO_FILE_MAP → связать компоненты с аудио

ШАГ 3: Добавить i18n ключи
   └─ Все ключи в window._i18nData[lang]
   └─ Следовать формату: "comp_[key]_title" и "comp_[key]_desc"

ШАГ 4: Добавить HTML секцию
   └─ Скопировать HTML_SECTION_EXAMPLE в <main>
   └─ Обновить ID контейнеров если нужно
   └─ Настроить дизайн (цвета, размеры)

ШАГ 5: Инициализация (если отдельная модель)
   └─ Вызвать initModel() для отдельного контейнера
   └─ Или интегрировать в существующую систему

ШАГ 6: Тестирование
   └─ Проверить загрузку GLB
   └─ Проверить вращение и зум
   └─ Проверить выбор компонентов
   └─ Проверить все языки (RU/KZ/EN)
   └─ Проверить аудио воспроизведение
*/

