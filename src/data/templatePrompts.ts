import { Language } from '@store/languageStore'

export interface TemplatePrompt {
  id: string
  category: 'creative' | 'professional' | 'fun'
  icon: string
  withSelection: Record<Language, string>
  withoutSelection: Record<Language, string>
  previewImage?: string
}

export const templatePrompts: TemplatePrompt[] = [
  // Creative Templates
  {
    id: 'figurine',
    category: 'creative',
    icon: '🎎',
    previewImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&q=80',
    withSelection: {
      en: 'Transform the person from the reference image into a hyper-realistic 1/7 scale figurine, placed on an iMac computer desk with a white Apple keyboard. The figurine perfectly captures the person\'s appearance, clothing, and personality. The figurine stands on a transparent acrylic base. The iMac screen shows the ZBrush modeling process. Next to it is a packaging box designed to match the person\'s style theme.',
      'zh-TW': '將參考圖片中的人物轉換成超寫實的1/7比例模型，放置在iMac電腦桌上，旁邊有白色Apple鍵盤。模型完美捕捉人物的外觀、服裝和個性。模型站在透明壓克力底座上。iMac螢幕顯示ZBrush建模過程。旁邊放置包裝盒，盒子設計配合人物風格主題。',
      es: 'Transforma a la persona de la imagen de referencia en una figurita hiperrealista a escala 1/7, colocada en un escritorio de iMac con un teclado Apple blanco. La figurita captura perfectamente la apariencia, ropa y personalidad de la persona. La figurita está sobre una base acrílica transparente. La pantalla del iMac muestra el proceso de modelado en ZBrush. Junto a ella hay una caja de embalaje diseñada para coincidir con el tema de estilo de la persona.',
      ja: '参考画像の人物を、白いAppleキーボードと一緒にiMacコンピューターデスクに置かれた、超リアルな1/7スケールフィギュアに変換します。フィギュアは人物の外観、服装、個性を完璧に捉えています。フィギュアは透明なアクリルベースの上に立っています。iMacの画面にはZBrushモデリングプロセスが表示されています。その隣には、人物のスタイルテーマに合わせてデザインされたパッケージボックスがあります。',
      fr: 'Transformez la personne de l\'image de référence en une figurine hyperréaliste à l\'échelle 1/7, placée sur un bureau iMac avec un clavier Apple blanc. La figurine capture parfaitement l\'apparence, les vêtements et la personnalité de la personne. La figurine se dresse sur une base acrylique transparente. L\'écran iMac affiche le processus de modélisation ZBrush. À côté se trouve une boîte d\'emballage conçue pour correspondre au thème de style de la personne.'
    },
    withoutSelection: {
      en: 'Create an exquisite anime character 1/7 scale figurine, placed on a work desk, professional studio lighting, showcasing figurine details.',
      'zh-TW': '創建一個精緻的動漫角色1/7比例模型，放置在工作桌上，專業攝影棚燈光，展現模型細節。',
      es: 'Crea una exquisita figurita de personaje de anime a escala 1/7, colocada en un escritorio de trabajo, iluminación de estudio profesional, mostrando los detalles de la figurita.',
      ja: '精巧なアニメキャラクター1/7スケールフィギュアを作成し、作業机の上に配置し、プロのスタジオ照明でフィギュアの詳細を紹介します。',
      fr: 'Créez une figurine de personnage d\'anime exquise à l\'échelle 1/7, placée sur un bureau de travail, éclairage de studio professionnel, mettant en valeur les détails de la figurine.'
    }
  },
  {
    id: 'handDrawn',
    category: 'creative',
    icon: '✏️',
    previewImage: 'https://images.unsplash.com/photo-1609845234176-c1b46ccc3ecc?w=600&h=400&fit=crop&q=80',
    withSelection: {
      en: 'Transform the image into a 4-stage hand-drawn illustration process: 1. Pencil sketch outline 2. Add basic lines 3. Add details and shadows 4. Complete color illustration. Show the drawing steps from sketch to finished artwork.',
      'zh-TW': '將圖片轉換成4階段手繪插畫過程：1.鉛筆草稿輪廓 2.加入基本線條 3.添加細節和陰影 4.完成的彩色插畫。展示從草圖到完成品的繪畫步驟。',
      es: 'Transforma la imagen en un proceso de ilustración dibujada a mano de 4 etapas: 1. Contorno de boceto a lápiz 2. Agregar líneas básicas 3. Agregar detalles y sombras 4. Ilustración completa en color. Muestra los pasos de dibujo desde el boceto hasta la obra terminada.',
      ja: '画像を4段階の手描きイラストプロセスに変換：1.鉛筆スケッチの輪郭 2.基本的な線を追加 3.詳細と影を追加 4.完全なカラーイラスト。スケッチから完成した作品までの描画ステップを示します。',
      fr: 'Transformez l\'image en un processus d\'illustration dessinée à la main en 4 étapes : 1. Contour de croquis au crayon 2. Ajouter des lignes de base 3. Ajouter des détails et des ombres 4. Illustration couleur complète. Montrez les étapes de dessin du croquis à l\'œuvre finie.'
    },
    withoutSelection: {
      en: 'Create a character\'s 4-stage hand-drawing process, from simple sketch to complete color illustration',
      'zh-TW': '創建一個角色的4階段手繪過程，從簡單草稿到完整彩色插畫',
      es: 'Crea el proceso de dibujo a mano de 4 etapas de un personaje, desde un boceto simple hasta una ilustración completa en color',
      ja: 'キャラクターの4段階手描きプロセスを作成し、シンプルなスケッチから完全なカラーイラストまで',
      fr: 'Créez le processus de dessin à la main en 4 étapes d\'un personnage, du croquis simple à l\'illustration couleur complète'
    }
  },
  {
    id: 'crossSection',
    category: 'creative',
    icon: '🔧',
    withSelection: {
      en: 'Create a 3D cross-section diagram of the object, showing internal structure and components, technical diagram style, labeling each part, engineering drawing style',
      'zh-TW': '創建物體的3D剖面圖，展示內部結構和組件，技術圖解風格，標註各部分名稱，工程圖紙風格',
      es: 'Crea un diagrama de sección transversal 3D del objeto, mostrando la estructura interna y los componentes, estilo de diagrama técnico, etiquetando cada parte, estilo de dibujo de ingeniería',
      ja: 'オブジェクトの3D断面図を作成し、内部構造とコンポーネントを示し、技術図スタイル、各部分にラベルを付け、エンジニアリング図面スタイル',
      fr: 'Créez un diagramme de coupe transversale 3D de l\'objet, montrant la structure interne et les composants, style de diagramme technique, étiquetant chaque partie, style de dessin d\'ingénierie'
    },
    withoutSelection: {
      en: 'Generate a 3D cross-section diagram of a building, showing internal floor structure',
      'zh-TW': '生成建築物的3D剖面圖，展示內部樓層結構',
      es: 'Genera un diagrama de sección transversal 3D de un edificio, mostrando la estructura interna del piso',
      ja: '建物の3D断面図を生成し、内部フロア構造を示す',
      fr: 'Générez un diagramme de coupe transversale 3D d\'un bâtiment, montrant la structure interne du plancher'
    }
  },
  {
    id: 'restoration',
    category: 'creative',
    icon: '📸',
    previewImage: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=400&fit=crop&q=80',
    withSelection: {
      en: 'Restore and colorize this old photo, remove scratches, stains and fading, enhance details, add natural colors, maintain original composition and character features',
      'zh-TW': '修復並上色這張老照片，去除刮痕、污漬和褪色，增強細節，添加自然色彩，保持原始構圖和人物特徵',
      es: 'Restaura y colorea esta foto antigua, elimina rayones, manchas y decoloración, mejora los detalles, agrega colores naturales, mantiene la composición original y las características del personaje',
      ja: 'この古い写真を復元し、着色し、傷、汚れ、色あせを除去し、詳細を強化し、自然な色を追加し、元の構図とキャラクターの特徴を維持します',
      fr: 'Restaurez et coloriez cette vieille photo, supprimez les rayures, les taches et la décoloration, améliorez les détails, ajoutez des couleurs naturelles, maintenez la composition originale et les caractéristiques du personnage'
    },
    withoutSelection: {
      en: 'Restore a 1950s black and white family photo, add colors',
      'zh-TW': '修復一張1950年代的黑白家庭照片，添加色彩',
      es: 'Restaura una foto familiar en blanco y negro de los años 1950, agrega colores',
      ja: '1950年代の白黒家族写真を復元し、色を追加します',
      fr: 'Restaurez une photo de famille en noir et blanc des années 1950, ajoutez des couleurs'
    }
  },

  // Professional Templates
  {
    id: 'idPhoto',
    category: 'professional',
    icon: '📷',
    previewImage: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=600&h=400&fit=crop&q=80',
    withSelection: {
      en: 'Transform the person into a professional ID photo: white background, formal attire, confident expression, ID photo format, professional studio lighting, maintain person\'s facial features',
      'zh-TW': '將人物轉換成專業證件照：白色背景、正裝、自信表情、證件照規格、專業攝影棚燈光、保持人物臉部特徵',
      es: 'Transforma a la persona en una foto de identificación profesional: fondo blanco, vestimenta formal, expresión confiada, formato de foto de identificación, iluminación de estudio profesional, mantén las características faciales de la persona',
      ja: '人物をプロフェッショナルなID写真に変換：白い背景、フォーマルな服装、自信に満ちた表情、ID写真フォーマット、プロのスタジオ照明、人物の顔の特徴を維持',
      fr: 'Transformez la personne en photo d\'identité professionnelle : arrière-plan blanc, tenue formelle, expression confiante, format de photo d\'identité, éclairage de studio professionnel, maintenez les traits du visage de la personne'
    },
    withoutSelection: {
      en: 'Generate professional business ID photo, white background, formal attire',
      'zh-TW': '生成專業商務證件照，白色背景，正裝',
      es: 'Genera una foto de identificación comercial profesional, fondo blanco, vestimenta formal',
      ja: 'プロフェッショナルなビジネスID写真を生成、白い背景、フォーマルな服装',
      fr: 'Générez une photo d\'identité commerciale professionnelle, arrière-plan blanc, tenue formelle'
    }
  },
  {
    id: 'product',
    category: 'professional',
    icon: '📦',
    withSelection: {
      en: 'Transform the product into professional e-commerce photography: pure white background, multi-angle display, professional lighting, showcase product details and texture',
      'zh-TW': '將產品轉換成專業電商攝影：純白背景、多角度展示、專業打光、展現產品細節和質感',
      es: 'Transforma el producto en fotografía profesional de comercio electrónico: fondo blanco puro, exhibición en múltiples ángulos, iluminación profesional, muestra los detalles y textura del producto',
      ja: '製品をプロフェッショナルなeコマース写真に変換：純白の背景、多角度表示、プロの照明、製品の詳細と質感を紹介',
      fr: 'Transformez le produit en photographie professionnelle de commerce électronique : arrière-plan blanc pur, affichage multi-angles, éclairage professionnel, mettez en valeur les détails et la texture du produit'
    },
    withoutSelection: {
      en: 'Create professional product photography, suitable for e-commerce platforms',
      'zh-TW': '創建專業產品攝影，適合電商平台使用',
      es: 'Crea fotografía profesional de productos, adecuada para plataformas de comercio electrónico',
      ja: 'プロフェッショナルな製品写真を作成し、eコマースプラットフォームに適している',
      fr: 'Créez une photographie de produit professionnelle, adaptée aux plateformes de commerce électronique'
    }
  },
  {
    id: 'interior',
    category: 'professional',
    icon: '🏠',
    withSelection: {
      en: 'Redesign the space: add modern furniture, change wall colors, add decorations, professional interior design style',
      'zh-TW': '將空間重新設計：添加現代家具、改變牆面顏色、加入裝飾品、專業室內設計風格',
      es: 'Rediseña el espacio: agrega muebles modernos, cambia los colores de las paredes, agrega decoraciones, estilo de diseño de interiores profesional',
      ja: 'スペースを再設計：モダンな家具を追加、壁の色を変更、装飾を追加、プロのインテリアデザインスタイル',
      fr: 'Redessinez l\'espace : ajoutez des meubles modernes, changez les couleurs des murs, ajoutez des décorations, style de design d\'intérieur professionnel'
    },
    withoutSelection: {
      en: 'Design modern minimalist living room, including sofa, coffee table and decorations',
      'zh-TW': '設計現代簡約風格客廳，包含沙發、茶几和裝飾',
      es: 'Diseña una sala de estar minimalista moderna, incluyendo sofá, mesa de café y decoraciones',
      ja: 'ソファ、コーヒーテーブル、装飾を含むモダンなミニマリストのリビングルームをデザイン',
      fr: 'Concevez un salon minimaliste moderne, comprenant un canapé, une table basse et des décorations'
    }
  },
  {
    id: 'marketing',
    category: 'professional',
    icon: '📱',
    withSelection: {
      en: 'Create social media marketing material: add attractive background, text space, brand colors, suitable for Instagram posting',
      'zh-TW': '創建社群媒體行銷素材：加入吸引人的背景、文字空間、品牌色彩、適合Instagram發布',
      es: 'Crea material de marketing para redes sociales: agrega fondo atractivo, espacio de texto, colores de marca, adecuado para publicar en Instagram',
      ja: 'ソーシャルメディアマーケティング素材を作成：魅力的な背景、テキストスペース、ブランドカラーを追加、Instagram投稿に適している',
      fr: 'Créez du matériel de marketing pour les médias sociaux : ajoutez un arrière-plan attrayant, un espace de texte, des couleurs de marque, adapté à la publication Instagram'
    },
    withoutSelection: {
      en: 'Design eye-catching social media advertising images',
      'zh-TW': '設計引人注目的社群媒體廣告圖片',
      es: 'Diseña imágenes publicitarias llamativas para redes sociales',
      ja: '目を引くソーシャルメディア広告画像をデザイン',
      fr: 'Concevez des images publicitaires accrocheuses pour les médias sociaux'
    }
  },

  // Fun Templates
  {
    id: 'tryOn',
    category: 'fun',
    icon: '👗',
    withSelection: {
      en: 'Dress the person from the first image in the clothing from the second image, keep the person\'s pose and background unchanged, clothing should fit naturally',
      'zh-TW': '將第一張圖片的人物穿上第二張圖片的服裝，保持人物姿勢和背景不變，服裝要自然貼合',
      es: 'Viste a la persona de la primera imagen con la ropa de la segunda imagen, mantén la pose y el fondo de la persona sin cambios, la ropa debe quedar naturalmente',
      ja: '最初の画像の人物に2番目の画像の服を着せ、人物のポーズと背景を変更せず、服は自然にフィットするようにします',
      fr: 'Habillez la personne de la première image avec les vêtements de la deuxième image, gardez la pose et l\'arrière-plan de la personne inchangés, les vêtements doivent s\'ajuster naturellement'
    },
    withoutSelection: {
      en: 'Show model trying on different style outfits',
      'zh-TW': '展示模特兒試穿不同風格服裝',
      es: 'Muestra un modelo probándose diferentes estilos de conjuntos',
      ja: 'モデルが異なるスタイルの衣装を試着している様子を表示',
      fr: 'Montrez un modèle essayant différents styles de tenues'
    }
  },
  {
    id: 'timeTravel',
    category: 'fun',
    icon: '⏰',
    withSelection: {
      en: 'Place the person in different eras: 1920s vintage style, 1960s hippie style, 1980s disco, 2000s Y2K style, maintain person\'s features',
      'zh-TW': '將人物放到不同年代：1920年代復古風、1960年代嬉皮風、1980年代迪斯可、2000年代Y2K風格，保持人物特徵',
      es: 'Coloca a la persona en diferentes épocas: estilo vintage de los años 1920, estilo hippie de los años 1960, disco de los años 1980, estilo Y2K de los años 2000, mantén las características de la persona',
      ja: '人物を異なる時代に配置：1920年代のヴィンテージスタイル、1960年代のヒッピースタイル、1980年代のディスコ、2000年代のY2Kスタイル、人物の特徴を維持',
      fr: 'Placez la personne dans différentes époques : style vintage des années 1920, style hippie des années 1960, disco des années 1980, style Y2K des années 2000, maintenez les caractéristiques de la personne'
    },
    withoutSelection: {
      en: 'Show the same character in different historical period styles',
      'zh-TW': '展示同一角色在不同歷史時期的造型',
      es: 'Muestra el mismo personaje en estilos de diferentes períodos históricos',
      ja: '同じキャラクターを異なる歴史的時代のスタイルで表示',
      fr: 'Montrez le même personnage dans des styles de différentes périodes historiques'
    }
  },
  {
    id: 'petAdventure',
    category: 'fun',
    icon: '🐾',
    withSelection: {
      en: 'Place the pet in adventure scenes: astronaut costume on the moon, pirate captain on a ship, superhero flying, knight armor in a castle',
      'zh-TW': '將寵物放入冒險場景：太空人裝扮在月球、海盜船長在船上、超級英雄飛行、騎士盔甲在城堡',
      es: 'Coloca a la mascota en escenas de aventura: disfraz de astronauta en la luna, capitán pirata en un barco, superhéroe volando, armadura de caballero en un castillo',
      ja: 'ペットを冒険シーンに配置：月の宇宙飛行士のコスチューム、船の海賊船長、飛行するスーパーヒーロー、城の騎士の鎧',
      fr: 'Placez l\'animal dans des scènes d\'aventure : costume d\'astronaute sur la lune, capitaine pirate sur un navire, super-héros volant, armure de chevalier dans un château'
    },
    withoutSelection: {
      en: 'Create fantasy adventure scenes for pets',
      'zh-TW': '創造寵物的奇幻冒險場景',
      es: 'Crea escenas de aventura fantástica para mascotas',
      ja: 'ペットのファンタジー冒険シーンを作成',
      fr: 'Créez des scènes d\'aventure fantastique pour animaux de compagnie'
    }
  },
  {
    id: 'ingredients',
    category: 'fun',
    icon: '🍳',
    withSelection: {
      en: 'Break down the food into ingredients: each ingredient in separate bowls, label names and quantities, cooking tutorial style arrangement',
      'zh-TW': '將食物分解成食材：每個食材放在單獨的碗中，標註名稱和份量，烹飪教學風格排列',
      es: 'Descompón la comida en ingredientes: cada ingrediente en tazones separados, etiqueta nombres y cantidades, disposición estilo tutorial de cocina',
      ja: '食べ物を材料に分解：各材料を別々のボウルに入れ、名前と分量をラベル付け、料理チュートリアルスタイルの配置',
      fr: 'Décomposez la nourriture en ingrédients : chaque ingrédient dans des bols séparés, étiquetez les noms et les quantités, arrangement de style tutoriel de cuisine'
    },
    withoutSelection: {
      en: 'Display all ingredients and seasonings for a dish',
      'zh-TW': '展示料理的所有食材和調味料',
      es: 'Muestra todos los ingredientes y condimentos para un plato',
      ja: '料理のすべての材料と調味料を表示',
      fr: 'Affichez tous les ingrédients et assaisonnements pour un plat'
    }
  },

  // Enhancement Templates
  {
    id: 'backgroundRemoval',
    category: 'professional',
    icon: '✂️',
    withSelection: {
      en: 'REMOVE ALL BACKGROUND completely, make background fully transparent, isolate main subject only, cutout style, PNG with alpha channel, white background becomes transparent, solid subject with clean edges, preserve subject 100% unchanged',
      'zh-TW': '完全移除所有背景，讓背景完全透明，只保留主要物體，去背風格，PNG透明通道，白色背景變透明，保持主體邊緣乾淨，100%保持主體不變',
      es: 'ELIMINAR COMPLETAMENTE TODO EL FONDO, hacer el fondo completamente transparente, aislar solo el sujeto principal, estilo de recorte, PNG con canal alfa, el fondo blanco se vuelve transparente, sujeto sólido con bordes limpios, preservar el sujeto 100% sin cambios',
      ja: 'すべての背景を完全に削除し、背景を完全に透明にし、メインの被写体のみを分離し、カットアウトスタイル、アルファチャンネル付きPNG、白い背景を透明にし、きれいなエッジで被写体を確実にし、被写体を100%変更しない',
      fr: 'SUPPRIMER COMPLÈTEMENT TOUT L\'ARRIÈRE-PLAN, rendre l\'arrière-plan complètement transparent, isoler uniquement le sujet principal, style de découpe, PNG avec canal alpha, l\'arrière-plan blanc devient transparent, sujet solide avec des bords nets, préserver le sujet 100% inchangé'
    },
    withoutSelection: {
      en: 'Remove background from object, transparent PNG output',
      'zh-TW': '移除物體背景，輸出透明PNG',
      es: 'Eliminar fondo del objeto, salida PNG transparente',
      ja: 'オブジェクトから背景を削除、透明PNG出力',
      fr: 'Supprimer l\'arrière-plan de l\'objet, sortie PNG transparente'
    }
  },
  {
    id: 'qualityEnhancement',
    category: 'professional',
    icon: '✨',
    withSelection: {
      en: 'preserve original appearance, enhance clarity, reduce noise, maintain exact same composition and features, improve sharpness and detail while keeping the original look identical',
      'zh-TW': '保持原始外觀，增強清晰度，減少雜訊，維持完全相同的構圖和特徵，提升銳利度和細節同時保持原始外觀一致',
      es: 'preservar la apariencia original, mejorar la claridad, reducir el ruido, mantener exactamente la misma composición y características, mejorar la nitidez y los detalles manteniendo el aspecto original idéntico',
      ja: '元の外観を保持し、明瞭度を向上させ、ノイズを減らし、まったく同じ構成と特徴を維持し、元の外観を同一に保ちながらシャープネスと詳細を改善します',
      fr: 'préserver l\'apparence originale, améliorer la clarté, réduire le bruit, maintenir exactement la même composition et les mêmes caractéristiques, améliorer la netteté et les détails tout en gardant l\'aspect original identique'
    },
    withoutSelection: {
      en: 'Enhance image quality and clarity, professional photo enhancement',
      'zh-TW': '增強圖像品質和清晰度，專業照片增強',
      es: 'Mejorar la calidad y claridad de la imagen, mejora profesional de fotos',
      ja: '画像の品質と明瞭度を向上させ、プロの写真強化',
      fr: 'Améliorer la qualité et la clarté de l\'image, amélioration professionnelle des photos'
    }
  }
]

export function getTemplatePrompt(templateId: string, hasSelection: boolean, language: Language): string {
  const template = templatePrompts.find(t => t.id === templateId)
  if (!template) return ''
  
  const prompts = hasSelection ? template.withSelection : template.withoutSelection
  return prompts[language] || prompts['en'] // fallback to English
}