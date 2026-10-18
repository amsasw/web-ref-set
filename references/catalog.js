// Plain script so the catalog also works when opened directly with file://.
// Style directions and suggested interactions are our analysis, not source claims.
const productReferences = [
  {
    id: 'marvis', topic: 'oral', name: 'Marvis', product: '牙膏系列',
    style: '复古艺术', kind: '品牌官网', colors: ['#e5e7cb', '#264c43', '#bc7449'],
    url: 'https://www.marvis.com/en/',
    detailUrl: 'https://www.marvis.com/en/toothpastes/', detailLabel: '牙膏系列',
    structure: '品牌引导、故事内容和彩色牙膏系列，让包装成为主要视觉线索。',
    evidence: '页面提供 Brush!、Skip intro 和向下滚动提示。',
    idea: '用衬线大标题、复古配色与产品图文分段入场，突出不同口味的包装。',
    tags: ['牙膏', '包装', '衬线字', '品牌叙事']
  },
  {
    id: 'boka', topic: 'oral', name: 'Boka', product: '口味系列',
    style: '自然清新', kind: '品牌官网', colors: ['#edf1df', '#3c5d45', '#c6a0b2'],
    url: 'https://www.boka.com/pages/flavors',
    structure: '按 Mint、Fruity、Floral、Spiced 组织口味，并搭配产品图片。',
    evidence: '已核对口味分类与产品内容；未验证原站动画。',
    idea: '以薄荷与奶油色为底，结合植物和膏体特写，为口味切换加入柔和过渡。',
    tags: ['牙膏', '自然', '口味分类', '柔和配色']
  },
  {
    id: 'hismile', topic: 'oral', name: 'Hismile', product: '西瓜味牙膏',
    style: '年轻活力', kind: '品牌官网', colors: ['#ffe3e1', '#742d3e', '#f48d9c'],
    url: 'https://uk.hismileteeth.com/products/toothpaste?rdr=1',
    structure: '产品图库、牙刷上的膏体展示、数量选择与加入购物车。',
    evidence: '页面有数量加减控件和购买入口。',
    idea: '使用大色块与醒目标题，给口味选择、数量变化和加购动作明确的视觉反馈。',
    tags: ['牙膏', '高饱和', '口味', '购买反馈']
  },
  {
    id: 'bite', topic: 'oral', name: 'Bite', product: 'Toothpaste Bits 牙膏片',
    style: '环保简洁', kind: '品牌官网', colors: ['#f0ecdf', '#3a4941', '#b4c5ac'],
    url: 'https://bitetoothpastebits.com/',
    structure: '产品卡片、购买选项与使用步骤，围绕日常护理展开介绍。',
    evidence: '已核对产品与步骤内容；未验证原站动画。',
    idea: '用留白、简洁图标和逐步呈现的使用流程，解释牙膏片的使用方式。',
    tags: ['牙膏片', '日常护理', '使用步骤', '留白']
  },
  {
    id: 'dew', topic: 'oral', name: 'DEW', product: '护肤单品模板 · 可借鉴于牙膏',
    style: '柔和高级', kind: 'Framer 模板', colors: ['#faece4', '#754c43', '#eaa998'],
    url: 'https://www.framer.com/marketplace/templates/dew/',
    detailUrl: 'https://dew-skincare.framer.website/', detailLabel: '模板演示',
    structure: '围绕单一护肤产品展示质地、配方选项与购买入口。',
    evidence: '模板作者介绍包含柔和入场、配方切换和滑出式购物袋；未实测演示。',
    idea: '将质地特写替换为膏体细节，使用奶油、花瓣和珊瑚色表达细腻质感。',
    tags: ['跨品类参考', '单品', '质地特写', '柔和入场']
  },
  {
    id: 'essentia', topic: 'oral', name: 'Essentia', product: '护肤单品模板 · 可借鉴于牙膏',
    style: '极简滚动叙事', kind: 'Framer 模板', colors: ['#e8e5df', '#343b38', '#a7b3aa'],
    url: 'https://www.framer.com/marketplace/templates/essentia/',
    detailUrl: 'https://essentia.framer.media/', detailLabel: '模板演示',
    structure: '单品介绍、图片画廊、规格选项与购买操作。',
    evidence: '模板作者介绍包含滚动时固定产品、逐段特性展示和固定加购条。',
    idea: '在滚动过程中保留牙膏主体，依次介绍膏体、口味和规格；移动端改为纵向段落。',
    tags: ['跨品类参考', '单品', '滚动叙事', '固定产品']
  },
  {
    id: 'mushie', topic: 'baby', name: 'Mushie', product: '婴幼儿喂养用品',
    style: '奶油简约', kind: '品牌官网', colors: ['#eee7dc', '#665345', '#c2af9b'],
    url: 'https://mushie.com/collections/feeding',
    structure: '餐盘、围兜、杯具与套装，结合柔和配色和多款产品陈列。',
    evidence: '页面包含产品类型筛选、颜色选项与套装内容。',
    idea: '用暖色留白和整齐网格呈现材质，为颜色选择提供同步的产品图片切换。',
    tags: ['母婴', '餐具', '柔和配色', '颜色切换']
  },
  {
    id: 'bubbsi', topic: 'baby', name: 'Bubbsi', product: '婴幼儿护理与补充装',
    style: '童趣插画', kind: '品牌官网', colors: ['#fff0bd', '#663b34', '#efa286'],
    url: 'https://lovebubbsi.com/',
    structure: '圆润包装、笑脸插画、入门套装和补充装，形成鲜明的产品系列。',
    evidence: '页面提供 Cleanse、Moisturize、Protect、Detangle 分类与轮播入口。',
    idea: '以圆角卡片和插画串联护理步骤，为分类切换加入短促、轻盈的过渡。',
    tags: ['母婴', '护理', '插画', '圆润包装']
  },
  {
    id: 'pipette', topic: 'baby', name: 'Pipette', product: 'Baby Shampoo + Wash',
    style: '自然柔和', kind: '品牌官网', colors: ['#f4ecdb', '#5e513d', '#e2b96c'],
    url: 'https://www.pipettebaby.com/products/shampoo-wash',
    structure: '单品选择、使用方法、成分介绍和常见问题，按购买前的信息需求分层。',
    evidence: '已核对产品选项、使用说明与问答内容；未验证原站动画。',
    idea: '保持温和配色，将使用步骤分段呈现，让长篇产品信息便于浏览。',
    tags: ['母婴', '洗护', '信息分层', '使用说明']
  },
  {
    id: 'babybjorn', topic: 'baby', name: 'BabyBjörn', product: '婴儿背带与摇椅',
    style: '温暖生活方式', kind: '品牌官网', colors: ['#e8e7df', '#455650', '#aebdb5'],
    url: 'https://www.babybjorn.com/',
    structure: '家庭场景摄影与产品分类结合，并提供材质、颜色和产品比较入口。',
    evidence: '页面包含分类导航和比较链接；未验证原站动画。',
    idea: '在生活场景与产品细节之间切换，用材质近景、颜色选择和对比模块支持选购。',
    tags: ['母婴', '背带', '摇椅', '生活方式摄影']
  },
  {
    id: 'frida', topic: 'baby', name: 'Frida Mom', product: 'Kits & Gifts 母婴套装',
    style: '清晰功能', kind: '品牌官网', colors: ['#e9e3ef', '#574264', '#b4a2ca'],
    url: 'https://frida.com/collections/frida-mom-kits-gifts',
    structure: '按需求组织套装、礼品和产品卡片，购买路径清晰。',
    evidence: '页面提供需求筛选与产品购买入口。',
    idea: '通过套装展开视图逐件展示包含的产品，并保持规格和购买按钮可见。',
    tags: ['母婴', '产后用品', '套装', '功能筛选']
  },
  {
    id: 'nanit', topic: 'baby', name: 'Nanit', product: 'Smart Baby Monitor',
    style: '现代科技', kind: '品牌官网', colors: ['#e4edf4', '#304d68', '#99b9d0'],
    url: 'https://www.nanit.com/products/smart-baby-monitor',
    structure: '设备与应用界面共同展示，结合安装方式、套装选项和功能分段。',
    evidence: '页面包含落地或壁挂安装、摄像头或搭配显示屏的选择。',
    idea: '用设备外观与应用界面同步切换解释功能，让滚动叙事围绕同一款产品展开。',
    tags: ['母婴', '智能设备', '应用界面', '规格选择']
  }
];
