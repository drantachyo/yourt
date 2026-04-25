# Skill: Добавление интерактивной вращаемой 3D модели

## Описание
Скилл для добавления интерактивной 3D модели (GLB формат) на веб-страницу с поддержкой:
- Вращения и зума мышью
- Выбора компонентов модели
- Многоязычной поддержки (RU/KZ/EN)
- Аудио описаний компонентов

## Когда использовать
- Нужно добавить новую 3D модель на сайт
- Модель должна быть интерактивной (вращаемая, с выбором частей)
- Требуется поддержка нескольких языков
- Нужна озвучка описаний

## Предварительные требования
1. **GLB файл** модели (оптимально: 50-200K полигонов, <5MB)
2. **Компоненты** - разные части модели должны быть отдельными объектами в GLB
3. **Описания** компонентов на трёх языках (RU/KZ/EN)
4. **Аудио файлы** (опционально): `component_[lang].mp3`

## Пошаговая инструкция

### Шаг 1: Подготовка GLB модели
```
- Экспортировать модель в glTF/GLB формат
- Убедиться, что все компоненты это отдельные объекты/группы
- Встроить все текстуры в GLB (не внешние файлы)
- Оптимизировать: полигоны, текстуры (максимум 5MB)
- Проверить, что модель имеет правильную ориентацию (Y вверх)
```

### Шаг 2: Регистрация GLB файла
В JavaScript массив `GLB_PARTS` добавить:
```javascript
{ file: 'model_name.glb', key: 'component_key' }
```

Вариант 1 - если компоненты в разных GLB файлах:
```javascript
GLB_PARTS.push(
    { file: 'component1.glb', key: 'component1' },
    { file: 'component2.glb', key: 'component2' },
);
```

Вариант 2 - если в одном GLB с группами (GLFTLoader разберет по userData.key):
```javascript
GLB_PARTS.push(
    { file: 'my_model.glb', key: 'component1' },
    { file: 'my_model.glb', key: 'component2' },
);
```

### Шаг 3: Добавить цвета подсветки
В объект `PART_HIGHLIGHT` добавить цвета для каждого компонента:
```javascript
PART_HIGHLIGHT.component1 = 0x6b4800;  // коричневый
PART_HIGHLIGHT.component2 = 0x3a2800;  // тёмный коричневый
```

### Шаг 4: Маппить аудио файлы
В `AUDIO_FILE_MAP` связать компоненты с аудио:
```javascript
AUDIO_FILE_MAP.component1 = 'component1_name';
// Система автоматически ищет: component1_name_ru.mp3, component1_name_kz.mp3, component1_name_en.mp3
```

### Шаг 5: Добавить i18n переводы
В `window._i18nData` для каждого языка добавить:
```javascript
// Русский
comp_component1_title: 'Название компонента',
comp_component1_desc: 'Подробное описание',

// Казахский
comp_component1_title: 'Компонент атауы',
comp_component1_desc: 'Толық сипаттамасы',

// Английский
comp_component1_title: 'Component title',
comp_component1_desc: 'Detailed description',
```

### Шаг 6: Создать HTML секцию
```html
<section class="py-20 bg-steppe-900 text-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
            <h2 class="text-4xl md:text-5xl font-display mb-4" data-i18n="model_title">Model Title</h2>
            <p class="text-steppe-300" data-i18n="model_subtitle">Description</p>
        </div>

        <div id="interactive-model-container" style="position:relative; width:100%; height:72vh; background:#111519; border-radius:1.5rem; overflow:hidden;">
            <!-- Loading screen -->
            <div id="loading-3d" class="absolute inset-0 flex items-center justify-center bg-steppe-900 z-30">
                <div class="w-14 h-14 border-4 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Боковое меню -->
            <div id="parts-menu" class="absolute left-4 top-1/2 z-20 flex flex-col gap-2" style="transform:translateY(-50%);">
                <button onclick="selectPart('component1')" class="part-btn" data-key="component1">
                    <span class="part-icon">🔹</span>
                    <span class="part-label" data-i18n="comp_component1_title">Comp 1</span>
                </button>
                <button onclick="selectPart('component2')" class="part-btn" data-key="component2">
                    <span class="part-icon">🔷</span>
                    <span class="part-label" data-i18n="comp_component2_title">Comp 2</span>
                </button>
                <button onclick="selectPart(null)" class="part-btn-reset">✕ Reset</button>
            </div>

            <!-- Холст Three.js -->
            <div id="canvas-container" style="width:100%; height:100%;"></div>

            <!-- Информационная карточка -->
            <div id="info-card" class="yurt-info-overlay p-6 rounded-2xl shadow-2xl" style="...">
                <h3 id="card-title" style="color:#d4af37;"></h3>
                <div id="card-desc" style="color:#e8dcc8;"></div>
            </div>
        </div>
    </div>
</section>
```

### Шаг 7: Инициализация Three.js
Функция инициализации сцены:
```javascript
function initModel() {
    const container = document.getElementById('canvas-container');
    
    // Three.js сцена, камера, рендерер
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    
    // Освещение
    const ambient = new THREE.AmbientLight(0xfff5e1, 2.5);
    scene.add(ambient);
    
    const sun = new THREE.DirectionalLight(0xffffff, 4.0);
    sun.position.set(20, 40, 20);
    sun.castShadow = true;
    scene.add(sun);
    
    // Контролы
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    
    loadGLBModel();
    animate();
}
```

### Шаг 8: Загрузка и масштабирование модели
```javascript
function loadGLBModel() {
    const loader = new GLTFLoader();
    const glbGroup = new THREE.Group();
    
    // Загрузить все части
    GLB_PARTS.forEach(({ file, key }) => {
        loader.load(`./${file}`, (gltf) => {
            const model = gltf.scene;
            model.traverse(child => {
                if (child.isMesh) {
                    child.userData.key = key;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // Клонировать материал для независимого управления
                    if (child.material) {
                        child.material = child.material.clone();
                        child.material.emissive = new THREE.Color(0x000000);
                    }
                }
            });
            glbGroup.add(model);
        });
    });
    
    // Автоматическое масштабирование
    const bbox = new THREE.Box3().setFromObject(glbGroup);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 18.0 / maxDim;
    
    glbGroup.scale.setScalar(scale);
    
    // Центрирование
    const bbox2 = new THREE.Box3().setFromObject(glbGroup);
    const center = new THREE.Vector3();
    bbox2.getCenter(center);
    
    glbGroup.position.x = -center.x;
    glbGroup.position.y = -bbox2.min.y;
    glbGroup.position.z = -center.z;
    
    scene.add(glbGroup);
    
    document.getElementById('loading-3d').style.display = 'none';
}
```

### Шаг 9: Функция выбора компонента
```javascript
function selectPart(key) {
    scene.traverse(obj => {
        if (!obj.isMesh || !obj.userData.key) return;
        
        if (key === null) {
            // Все видимы
            obj.material.opacity = 1.0;
            obj.material.transparent = false;
        } else if (obj.userData.key === key) {
            // Выбранный - яркий
            obj.material.emissive.setHex(PART_HIGHLIGHT[key]);
            obj.material.opacity = 1.0;
        } else {
            // Остальные - полупрозрачные
            obj.material.transparent = true;
            obj.material.opacity = 0.1;
        }
    });
    
    // Показать информационную карточку
    if (key) {
        showCard(key);
        speakDescription(key); // воспроизвести аудио
    } else {
        hideCard();
    }
}
```

### Шаг 10: Функция анимации
```javascript
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
```

## Оптимизация производительности

| Параметр | Рекомендация |
|----------|-------------|
| **Размер GLB** | Максимум 5MB |
| **Полигоны** | 50-200K |
| **Текстуры** | Встроены в GLB, размер 2K или 4K |
| **Лайтмап** | Использовать для сложных сцен |
| **Shadow Map** | 1024×1024 для хорошего качества |
| **Ambient Light** | 2.5 для яркости |

## Тестирование

Проверить:
- ✅ Модель загружается без ошибок
- ✅ Вращение работает (мышь + сенсор)
- ✅ Зум работает (колёсико + пинч)
- ✅ Компоненты выделяются корректно
- ✅ Информационная карточка появляется
- ✅ Аудио воспроизводится на всех языках
- ✅ Все языки переводятся правильно
- ✅ FPS стабилен (60 FPS)

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| Модель не загружается | Проверить путь файла и консоль браузера |
| Модель перевёрнута | Переориентировать в 3D редакторе (Y вверх) |
| Компоненты не выбираются | Убедиться что parts это отдельные объекты в GLB |
| Низкий FPS | Уменьшить полигоны, упростить текстуры |
| Тёмная модель | Увеличить ambientLight интенсивность |
| Зум слишком быстрый | Уменьшить `controls.zoomSpeed` |

## Примеры кода

### Пример 1: Казахский щит
```javascript
GLB_PARTS.push(
    { file: 'shield.glb', key: 'center' },
    { file: 'shield.glb', key: 'rim' },
    { file: 'shield.glb', key: 'details' }
);

PART_HIGHLIGHT.center = 0x8b0000;
PART_HIGHLIGHT.rim = 0xd4af37;
PART_HIGHLIGHT.details = 0x6b4800;
```

### Пример 2: Боевой конь
```javascript
GLB_PARTS.push(
    { file: 'horse.glb', key: 'body' },
    { file: 'horse.glb', key: 'saddle' },
    { file: 'horse.glb', key: 'armor' }
);

AUDIO_FILE_MAP.body = 'horse_body';
AUDIO_FILE_MAP.saddle = 'horse_saddle';
AUDIO_FILE_MAP.armor = 'horse_armor';
```

## Дополнительные ресурсы

- Three.js Документация: https://threejs.org/docs/
- GLB/glTF Spec: https://www.khronos.org/gltf/
- Three.js Editor: https://threejs.org/editor/
- Примеры Three.js: https://threejs.org/examples/

