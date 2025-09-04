export interface PromptButton {
  id: string
  label: string
  value: string
  category: string
}

export interface PromptCategory {
  id: string
  label: string
  icon: string
  buttons: PromptButton[]
}

export const promptCategories: PromptCategory[] = [
  {
    id: 'style',
    label: '스타일',
    icon: '🎨',
    buttons: [
      { id: 'anime', label: '애니메', value: 'anime style', category: 'style' },
      { id: 'realistic', label: '사실적', value: 'photorealistic', category: 'style' },
      { id: 'watercolor', label: '수채화', value: 'watercolor painting', category: 'style' },
      { id: 'oil', label: '유화', value: 'oil painting', category: 'style' },
      { id: '3d', label: '3D', value: '3D rendered', category: 'style' },
      { id: 'pixel', label: '픽셀아트', value: 'pixel art', category: 'style' },
      { id: 'minimal', label: '미니멀', value: 'minimalist', category: 'style' },
      { id: 'vintage', label: '빈티지', value: 'vintage style', category: 'style' },
      { id: 'cyberpunk', label: '사이버펑크', value: 'cyberpunk', category: 'style' },
      { id: 'fantasy', label: '판타지', value: 'fantasy art', category: 'style' },
    ]
  },
  {
    id: 'color',
    label: '색상/분위기',
    icon: '🌈',
    buttons: [
      { id: 'pastel', label: '파스텔', value: 'pastel colors', category: 'color' },
      { id: 'neon', label: '네온', value: 'neon colors', category: 'color' },
      { id: 'warm', label: '따뜻한', value: 'warm tones', category: 'color' },
      { id: 'cold', label: '차가운', value: 'cold tones', category: 'color' },
      { id: 'bw', label: '흑백', value: 'black and white', category: 'color' },
      { id: 'sepia', label: '세피아', value: 'sepia toned', category: 'color' },
      { id: 'vibrant', label: '생동감', value: 'vibrant colors', category: 'color' },
      { id: 'dark', label: '어두운', value: 'dark moody', category: 'color' },
      { id: 'bright', label: '밝은', value: 'bright lighting', category: 'color' },
      { id: 'dreamy', label: '몽환적', value: 'dreamy atmosphere', category: 'color' },
    ]
  },
  {
    id: 'person',
    label: '인물',
    icon: '👤',
    buttons: [
      { id: 'korean', label: '한국인', value: 'Korean person', category: 'person' },
      { id: 'asian', label: '아시아인', value: 'Asian person', category: 'person' },
      { id: 'western', label: '서양인', value: 'Western person', category: 'person' },
      { id: 'male', label: '남성', value: 'male', category: 'person' },
      { id: 'female', label: '여성', value: 'female', category: 'person' },
      { id: 'child', label: '어린이', value: 'child', category: 'person' },
      { id: 'elderly', label: '노인', value: 'elderly', category: 'person' },
      { id: 'smile', label: '웃는', value: 'smiling', category: 'person' },
      { id: 'serious', label: '진지한', value: 'serious expression', category: 'person' },
      { id: 'profile', label: '프로필', value: 'profile view', category: 'person' },
    ]
  },
  {
    id: 'background',
    label: '배경',
    icon: '🏞️',
    buttons: [
      { id: 'studio', label: '스튜디오', value: 'studio background', category: 'background' },
      { id: 'nature', label: '자연', value: 'nature background', category: 'background' },
      { id: 'city', label: '도시', value: 'city background', category: 'background' },
      { id: 'indoor', label: '실내', value: 'indoor setting', category: 'background' },
      { id: 'beach', label: '해변', value: 'beach background', category: 'background' },
      { id: 'mountain', label: '산', value: 'mountain background', category: 'background' },
      { id: 'space', label: '우주', value: 'space background', category: 'background' },
      { id: 'abstract', label: '추상', value: 'abstract background', category: 'background' },
      { id: 'solid', label: '단색', value: 'solid color background', category: 'background' },
      { id: 'gradient', label: '그라디언트', value: 'gradient background', category: 'background' },
    ]
  },
  {
    id: 'effect',
    label: '효과',
    icon: '✨',
    buttons: [
      { id: 'hdr', label: 'HDR', value: 'HDR', category: 'effect' },
      { id: 'bokeh', label: '보케', value: 'bokeh effect', category: 'effect' },
      { id: 'motion', label: '모션블러', value: 'motion blur', category: 'effect' },
      { id: 'light', label: '빛줄기', value: 'light rays', category: 'effect' },
      { id: 'fog', label: '안개', value: 'foggy', category: 'effect' },
      { id: 'particle', label: '입자', value: 'particle effects', category: 'effect' },
      { id: 'glitch', label: '글리치', value: 'glitch effect', category: 'effect' },
      { id: 'hologram', label: '홀로그램', value: 'holographic', category: 'effect' },
      { id: 'shadow', label: '그림자', value: 'dramatic shadows', category: 'effect' },
      { id: 'glow', label: '빛나는', value: 'glowing', category: 'effect' },
    ]
  }
]

export interface PresetTemplate {
  id: string
  name: string
  description: string
  prompt: string
  icon: string
}

export const presetTemplates: PresetTemplate[] = [
  {
    id: 'profile-photo',
    name: '프로필 사진',
    description: '전문적인 프로필 사진',
    prompt: 'professional headshot portrait, studio lighting, clean white background, formal business attire, confident expression, high quality, professional photography',
    icon: '📸'
  },
  {
    id: 'sns-thumbnail',
    name: 'SNS 썸네일',
    description: '눈길 끄는 SNS 썸네일',
    prompt: 'eye-catching social media thumbnail, vibrant colors, bold composition, trendy modern style, space for text overlay, Instagram style',
    icon: '📱'
  },
  {
    id: 'product-photo',
    name: '제품 사진',
    description: '깔끔한 제품 사진',
    prompt: 'commercial product photography, pristine white background, soft professional lighting, high quality, studio shot, clean shadows, e-commerce style',
    icon: '📦'
  },
  {
    id: 'character-design',
    name: '캐릭터 디자인',
    description: '캐릭터 컨셉 아트',
    prompt: 'character concept art, full body character design, multiple angle views, detailed illustration, character sheet, anime style, professional digital art',
    icon: '🎭'
  },
  {
    id: 'logo-design',
    name: '로고 디자인',
    description: '미니멀 로고 디자인',
    prompt: 'minimalist logo design, vector style, scalable graphics, modern professional design, clean geometric lines, memorable branding',
    icon: '💼'
  },
  {
    id: 'youtube-thumbnail',
    name: '유튜브 썸네일',
    description: '클릭률 높은 썸네일',
    prompt: 'YouTube thumbnail design, high contrast colors, dramatic expression, bold text space, eye-catching composition, 16:9 aspect ratio, clickable design',
    icon: '🎬'
  },
  {
    id: 'id-photo',
    name: '증명사진',
    description: '공식 증명사진',
    prompt: 'official passport photo, formal business attire, clean white background, neutral professional expression, front-facing portrait, even lighting',
    icon: '🪪'
  },
  {
    id: 'wallpaper',
    name: '배경화면',
    description: '고품질 배경화면',
    prompt: '4K desktop wallpaper, high resolution landscape, beautiful natural scenery, stunning visual composition, desktop background, artistic photography',
    icon: '🖼️'
  },
  {
    id: 'art-portrait',
    name: '예술적 초상화',
    description: '감성적인 아트 포트레이트',
    prompt: 'artistic portrait painting, oil painting style, dramatic lighting, emotional expression, fine art quality, classical art style, detailed brushwork',
    icon: '🎨'
  },
  {
    id: 'fashion-photo',
    name: '패션 사진',
    description: '스타일리시한 패션 촬영',
    prompt: 'high fashion photography, stylish outfit, professional model pose, studio lighting, editorial style, trendy fashion, magazine quality',
    icon: '👗'
  },
  {
    id: 'food-photo',
    name: '음식 사진',
    description: '맛있어 보이는 푸드 촬영',
    prompt: 'professional food photography, appetizing presentation, natural lighting, restaurant quality, delicious looking, commercial food styling',
    icon: '🍽️'
  },
  {
    id: 'nature-landscape',
    name: '자연 풍경',
    description: '아름다운 자연 경관',
    prompt: 'breathtaking natural landscape, scenic beauty, golden hour lighting, panoramic view, nature photography, peaceful atmosphere, high detail',
    icon: '🌄'
  }
]