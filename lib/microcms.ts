export type MicroCMSImage = {
  url: string;
  height?: number;
  width?: number;
};

export type Article = {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  description?: string;
  body?: string;
  eyecatch?: MicroCMSImage;
  published?: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type Topic = {
  id: string;
  title: string;
  category?: unknown;
  description?: string;
  published?: string;
  eventDate?: string;
  startDate?: string;
  date?: string;
  venue?: string;
  status?: string;
  linkUrl?: string;
  tags?: string;
  image?: MicroCMSImage;
  eyecatch?: MicroCMSImage;
  thumbnail?: MicroCMSImage;
};

export type Tournament = {
  id: string;
  title: string;
  eventDate?: string;
  month?: string;
  dateLabel?: string;
  venue?: string;
  area?: string;
  organizer?: string;
  category?: unknown;
  status?: string;
  description?: string;
  entryUrl?: string;
  overviewUrl?: string;
  resultUrl?: string;
  officialUrl?: string;
  displayOrder?: number;
  tags?: string;
};

export type Event = {
  id: string;
  title: string;
  category?: unknown;
  eventDate?: string;
  startDate?: string;
  date?: string;
  published?: string;
  venue?: string;
  location?: string;
  description?: string;
  status?: string;
  linkUrl?: string;
  officialUrl?: string;
  tags?: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  status?: string;
  area?: string;
  city?: string;
  courseType?: string;
  coursetype?: string;
  address?: string;
  phone?: string;
  websiteUrl?: string;
  websiteurl?: string;
  reservationUrl?: string;
  reservationurl?: string;
  airportAccess?: string;
  airportaccess?: string;
  holes?: number;
  par?: number;
  summary?: string;
  features?: string;
  isBeginnerFriendly?: boolean;
  isTouristFriendly?: boolean;
  hasPracticeArea?: boolean;
  isPartnerCandidate?: boolean;
  lastChecked?: string;
  sourceUrl?: string;
  memo?: string;
  mainImage?: MicroCMSImage;
  photo1?: MicroCMSImage;
  photo2?: MicroCMSImage;
  photo3?: MicroCMSImage;
  photo4?: MicroCMSImage;
  photo5?: MicroCMSImage;
  galleryImages?: MicroCMSImage[];
  gallery?: MicroCMSImage[];
  images?: MicroCMSImage[];
};

export type Facility = {
  id: string;
  name: string;
  slug: string;
  [key: string]: unknown;
  type?: unknown;
  status?: unknown;
  area?: unknown;
  address?: string;
  phone?: string;
  website?: string;
  mapUrl?: string;
  summary?: string;
  description?: string;
  airportAccess?: string;
  gallery?: MicroCMSImage[] | MicroCMSImage;
  city?: unknown;
  facilityType?: unknown;
  holes?: number | string;
  par?: number | string;
  reservationUrl?: string;
  features?: string;
  mainImage?: MicroCMSImage;
  image?: MicroCMSImage;
  eyecatch?: MicroCMSImage;
  thumbnail?: MicroCMSImage;
  photo1?: MicroCMSImage;
  photo2?: MicroCMSImage;
  photo3?: MicroCMSImage;
  photo4?: MicroCMSImage;
  photo5?: MicroCMSImage;
  galleryImages?: MicroCMSImage[];
  images?: MicroCMSImage[];
};

export type PracticeRange = {
  id: string;
  name: string;
  imageUrl?: string;
  category?: string;
  area?: string;
  address?: string;
  phone?: string;
  url?: string;
  accessFromNaha?: string;
  summary?: string;
  description?: string;
  features?: string;
  status?: string;
  source?: "cms" | "fallback";
};

export type GolfShop = {
  id: string;
  name: string;
  slug: string;
  area?: string;
  city?: string;
  address?: string;
  phone?: string;
  website?: string;
  mapUrl?: string;
  summary?: string;
  description?: string;
  imageUrl?: string;
  storeSize?: string;
  productCondition?: string;
  categories: string[];
  source?: "cms" | "fallback";
};

export type Partner = {
  id: string;
  name: string;
  logo?: MicroCMSImage;
  websiteUrl?: string;
  status?: string;
  displayOrder?: number;
};

type MicroCMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const fallbackArticles: Article[] = [
  {
    id: "beginner-guide",
    slug: "beginner-guide",
    category: "初心者ガイド",
    published: "2026-05-31T00:00:00.000Z",
    title: "沖縄でゴルフを始める人へ。最初に知っておきたい練習場とコース選び",
    description: "道具、練習場、レッスン、ショートコース、本コースデビューまでをやさしく整理します。",
    body: "<h2>まずは屋外練習場かインドア施設へ</h2><p>最初の一歩は、打ちっぱなし練習場かインドアゴルフ施設がおすすめです。クラブを持っていない場合でも、レンタルクラブがある施設なら気軽に始められます。</p><h2>道具は最初から全部そろえなくても大丈夫</h2><p>初回からフルセットを買う必要はありません。まずはグローブ、動きやすい服装、運動靴から始めても問題ありません。</p>"
  },
  {
    id: "golf-trip",
    slug: "golf-trip",
    category: "観光ゴルフ",
    published: "2026-05-31T00:00:00.000Z",
    title: "沖縄ゴルフ旅行の組み立て方。エリア別に見るコースと移動の考え方",
    description: "本島北部・中南部・離島で、宿泊や移動時間を考えながらプレー計画を立てるコツを紹介します。",
    body: "<h2>旅行では移動時間を先に決める</h2><p>沖縄のゴルフ旅行は、宿泊地、レンタカー、スタート時間の相性が大切です。観光予定とあわせて無理のないエリアを選びましょう。</p>"
  },
  {
    id: "tournament-checklist",
    slug: "tournament-checklist",
    category: "大会参加",
    published: "2026-05-31T00:00:00.000Z",
    title: "大会情報の見方。募集要項・組み合わせ・成績表で確認したいポイント",
    description: "初めて大会に出る人や保護者向けに、要項で見るべき項目と当日の準備をまとめます。",
    body: "<h2>募集要項で確認したいこと</h2><p>参加資格、申込締切、競技方法、使用ティー、練習ラウンド、キャンセル規定を事前に確認しましょう。</p>"
  }
];

const fallbackTopics: Topic[] = [
  {
    id: "daikin-orchid-result",
    category: "大会結果",
    published: "2026-03-08T00:00:00.000Z",
    title: "第39回ダイキンオーキッドレディスは大会結果を公開",
    description: "2026年3月5日から8日まで琉球ゴルフ倶楽部で開催された大会の順位・スコア情報が公式ページで確認できます。",
    linkUrl: "https://www.daikin.co.jp/orchid",
    tags: "最新 情報 ダイキン オーキッド レディース 結果 成績 琉球 ゴルフ 倶楽部"
  },
  {
    id: "enagic-open-u22-result",
    category: "ジュニア",
    published: "2026-01-18T00:00:00.000Z",
    title: "エナジックオープンU-22の最終結果が掲載",
    description: "名護市のエナジック瀬嵩カントリークラブで開催された若手向け大会。最終結果、組み合わせ、ローカルルールを確認できます。",
    linkUrl: "https://www.enagic-junioropen.com/tournament/2026/",
    tags: "最新 情報 エナジック オープン U-22 ジュニア 最終結果 名護"
  },
  {
    id: "ritz-carlton-okinawa-cup",
    category: "イベント",
    published: "2026-03-25T00:00:00.000Z",
    title: "ザ・リッツ・カールトン沖縄カップ2026の開催レポート",
    description: "宿泊、食事、かねひで喜瀬カントリークラブでのコンペを組み合わせたリゾートゴルフイベントのレポートが公開されています。",
    linkUrl: "https://www.funq.jp/even/article/1055354/",
    tags: "最新 情報 リッツ カールトン 沖縄 カップ 喜瀬 コンペ リゾート ゴルフ"
  },
  {
    id: "jgga-demo-day",
    category: "試打会",
    published: "2026-04-06T00:00:00.000Z",
    title: "試打会情報を探しやすくする公式ページが新設",
    description: "日本ゴルフ用品協会が、加盟メーカー各社の試打会情報を一元的に確認できるページを公開。沖縄開催分の確認先として活用します。",
    linkUrl: "https://newscast.jp/smart/news/7721289",
    tags: "最新 情報 試打会 日本 ゴルフ 用品 協会 JGGA クラブ"
  },
  {
    id: "okinawa-golf-update",
    category: "お知らせ",
    published: "2026-05-31T00:00:00.000Z",
    title: "沖縄県内のゴルフ場・大会・練習場情報を順次更新中",
    description: "おきなわGOLFなびでは、県内の大会情報、施設情報、イベント情報を確認しながら更新しています。",
    tags: "最新 情報 お知らせ 沖縄 ゴルフ"
  }
];

const fallbackTournaments: Tournament[] = [
  {
    id: "daikin-amateur-2026",
    title: "ダイキンオーキッドレディス アマチュア選手権大会",
    month: "1月",
    dateLabel: "2026年1月26日-27日",
    venue: "琉球ゴルフ倶楽部",
    area: "南城市",
    organizer: "ダイキンオーキッドレディス大会事務局",
    category: "ジュニア",
    status: "成績あり",
    description: "募集要項、組み合わせ、成績、公式情報への導線をわかりやすく整理して掲載します。",
    overviewUrl: "https://www.daikin.co.jp/orchid",
    officialUrl: "https://www.daikin.co.jp/orchid",
    displayOrder: 10,
    tags: "ダイキン オーキッド アマチュア 琉球 ゴルフ 倶楽部 ジュニア"
  },
  {
    id: "enagic-open-u22-2026",
    title: "エナジックオープンU-22",
    month: "1月",
    dateLabel: "2026大会",
    venue: "沖縄県内",
    area: "沖縄県内",
    organizer: "エナジックジュニアオープン実行委員会",
    category: "ジュニア",
    status: "成績あり",
    description: "U-22、ジュニア世代向け大会の募集要項、組み合わせ、成績を確認できます。",
    overviewUrl: "https://www.enagic-junioropen.com/tournament/2026/",
    officialUrl: "https://www.enagic-junioropen.com/tournament/2026/",
    displayOrder: 20,
    tags: "エナジック オープン U-22 ジュニア"
  },
  {
    id: "daikin-orchid-2026",
    title: "第39回 ダイキンオーキッドレディスゴルフトーナメント",
    month: "3月",
    dateLabel: "2026年3月5日-8日",
    venue: "琉球ゴルフ倶楽部",
    area: "南城市",
    organizer: "ダイキンオーキッドレディス大会事務局",
    category: "プロ",
    status: "成績あり",
    description: "沖縄を代表する女子プロゴルフトーナメント。大会結果と公式情報を整理して掲載します。",
    overviewUrl: "https://www.daikin.co.jp/orchid",
    officialUrl: "https://www.daikin.co.jp/orchid",
    displayOrder: 30,
    tags: "ダイキン オーキッド レディース プロ 琉球 ゴルフ 倶楽部"
  },
  {
    id: "spring-open-competition",
    title: "県内オープンコンペ・親睦大会",
    month: "春",
    dateLabel: "春季",
    venue: "各ゴルフ場",
    area: "沖縄県内",
    organizer: "主催者確認中",
    category: "コンペ",
    status: "確認中",
    description: "県内で開催されるオープンコンペや親睦大会を確認後に掲載します。",
    displayOrder: 40,
    tags: "春 オープン コンペ 親睦 大会"
  },
  {
    id: "summer-junior-competition",
    title: "ジュニア・学生向け競技",
    month: "夏",
    dateLabel: "夏季",
    venue: "県内会場",
    area: "沖縄県内",
    organizer: "主催者確認中",
    category: "ジュニア",
    status: "確認中",
    description: "夏休み期間のジュニア・学生向け競技情報を整理して掲載します。",
    displayOrder: 50,
    tags: "夏 ジュニア 学生 競技"
  },
  {
    id: "autumn-club-championship",
    title: "クラブ選手権・地域大会",
    month: "秋",
    dateLabel: "秋季",
    venue: "各ゴルフ場",
    area: "沖縄県内",
    organizer: "主催者確認中",
    category: "一般",
    status: "確認中",
    description: "各ゴルフ場や地域団体の競技会情報を確認後に掲載します。",
    displayOrder: 60,
    tags: "秋 クラブ 選手権 地域 大会"
  },
  {
    id: "winter-charity-competition",
    title: "年末コンペ・チャリティ大会",
    month: "冬",
    dateLabel: "冬季",
    venue: "各ゴルフ場",
    area: "沖縄県内",
    organizer: "主催者確認中",
    category: "コンペ",
    status: "確認中",
    description: "年末コンペやチャリティ大会など、参加しやすいイベント型大会を掲載します。",
    displayOrder: 70,
    tags: "冬 年末 コンペ チャリティ 大会"
  }
];

const fallbackCourses: Course[] = [
  {
    id: "ryukyu-golf-club",
    title: "琉球ゴルフ倶楽部",
    slug: "ryukyu-golf-club",
    status: "published",
    area: "南部",
    city: "南城市",
    courseType: "ロングコース",
    holes: 27,
    par: 108,
    address: "〒901-0608 沖縄県南城市玉城親慶原1",
    phone: "098-948-2460",
    websiteUrl: "https://www.ryukyugolf.com/",
    airportAccess: "車で約35分",
    summary: "ダイキンオーキッドレディスの開催コースとして知られる県内有数の大会会場。"
  },
  {
    id: "kise-country-club",
    title: "かねひで喜瀬カントリークラブ",
    slug: "kise-country-club",
    status: "published",
    area: "北部",
    city: "名護市",
    courseType: "ロングコース",
    holes: 18,
    par: 72,
    address: "〒905-0026 沖縄県名護市字喜瀬1107-1",
    phone: "0980-53-6100",
    websiteUrl: "https://www.kise-cc.jp/",
    airportAccess: "車で約80〜90分",
    summary: "リゾート滞在と組み合わせやすい本格コース。観光ゴルフや大型コンペとも相性が良い施設です。"
  },
  {
    id: "kanucha-golf-course",
    title: "カヌチャリゾート カヌチャゴルフコース",
    slug: "kanucha-golf-course",
    status: "published",
    area: "北部",
    city: "名護市",
    courseType: "ロングコース",
    holes: 18,
    par: 72,
    address: "〒905-0225 沖縄県名護市安部156-2",
    phone: "0980-55-8888",
    websiteUrl: "https://www.kanucha.jp/",
    airportAccess: "車で約90分",
    summary: "観光ゴルフやコンペ需要と相性の良いリゾート内コース。"
  },
  {
    id: "pgm-golf-resort-okinawa",
    title: "PGMゴルフリゾート沖縄",
    slug: "pgm-golf-resort-okinawa",
    status: "published",
    area: "北部",
    city: "恩納村",
    courseType: "ロングコース",
    holes: 27,
    par: 108,
    address: "〒904-0413 沖縄県国頭郡恩納村字冨着1043",
    phone: "098-965-1100",
    websiteUrl: "https://www.pacificgolf.co.jp/okinawa/",
    airportAccess: "車で約60分",
    summary: "リゾートエリアからアクセスしやすい県外プレーヤー向けコース。"
  },
  {
    id: "southern-links-golf-club",
    title: "ザ・サザンリンクスゴルフクラブ",
    slug: "southern-links-golf-club",
    status: "published",
    area: "南部",
    city: "八重瀬町",
    courseType: "ロングコース",
    holes: 18,
    par: 72,
    address: "〒901-0513 沖縄県島尻郡八重瀬町字玻名城697",
    phone: "098-998-7001",
    websiteUrl: "https://www.accordiagolf.com/grand/southernlinks/",
    airportAccess: "車で約40〜50分",
    summary: "海沿いのロケーションを活かした観光ゴルフ向けコース。"
  },
  {
    id: "bashofu-course",
    title: "芭蕉布コース",
    slug: "bashofu-course",
    status: "published",
    area: "南部",
    city: "南城市",
    courseType: "ミドルコース",
    holes: 18,
    par: 63,
    address: "〒901-0604 沖縄県南城市玉城字中山1313",
    phone: "098-943-5890",
    airportAccess: "車で約35分",
    summary: "18H Par63。コースデビュー前後の練習ラウンドにも検討しやすいミドルコース。"
  },
  {
    id: "nanzan-country-club",
    title: "南山カントリークラブ",
    slug: "nanzan-country-club",
    status: "published",
    area: "南部",
    city: "糸満市",
    courseType: "ミドルコース",
    holes: 9,
    par: 34,
    address: "〒901-0331 沖縄県糸満市字真栄平1170",
    phone: "098-997-2021",
    websiteUrl: "http://www.okinawa-nanzan.com/",
    airportAccess: "車で約35分",
    summary: "9H Par34。2周で18Hとして楽しめる、初心者にも挑戦しやすいコース。"
  },
  {
    id: "onishi-terrace-golf-club",
    title: "大西テェラスゴルフクラブ",
    slug: "onishi-terrace-golf-club",
    status: "published",
    area: "中部",
    city: "北中城村",
    courseType: "ミドルコース",
    holes: 18,
    par: 63,
    address: "〒901-2306 沖縄県中頭郡北中城村字大城190",
    phone: "098-935-4300",
    websiteUrl: "https://www.otgc.co.jp/",
    airportAccess: "車で約40分",
    summary: "18H Par63。中部エリアで実戦感覚をつかみたい初心者にもおすすめ。"
  },
  {
    id: "okinawa-country-club",
    title: "沖縄カントリークラブ",
    slug: "okinawa-country-club",
    status: "published",
    area: "中部",
    city: "西原町",
    courseType: "ロングコース",
    holes: 18,
    par: 72,
    address: "〒903-0114 沖縄県中頭郡西原町字桃原109",
    phone: "098-945-3371",
    websiteUrl: "https://reserve.accordiagolf.com/golfCourse/okinawa/okinawa/",
    airportAccess: "車で約25分",
    summary: "中南部のプレーヤー向けに競技・アクセス情報を整理したい施設。"
  }
];

const fallbackPracticeRanges: PracticeRange[] = [
  {
    id: "naminoue-golf-range",
    name: "波之上ゴルフ練習場",
    category: "屋外",
    area: "南部",
    address: "沖縄県那覇市辻3-2-13",
    phone: "098-866-4218",
    url: "https://www.naminouegolf.jp/",
    accessFromNaha: "那覇空港から車で約10分",
    status: "営業確認済み"
  },
  {
    id: "tomigusuku-golf-range",
    name: "豊見城ゴルフ練習場",
    category: "屋外",
    area: "南部",
    address: "沖縄県豊見城市字高安415",
    phone: "098-850-5757",
    accessFromNaha: "那覇空港から車で約15分",
    status: "営業確認済み"
  },
  {
    id: "abc-golf-garden",
    name: "ABCゴルフガーデン",
    category: "屋外",
    area: "南部",
    address: "沖縄県糸満市字阿波根1565-1",
    phone: "098-995-0555",
    accessFromNaha: "那覇空港から車で約20分",
    status: "営業確認済み"
  },
  {
    id: "exgolf-lab",
    name: "eXGOLF LAB",
    category: "屋内 / レッスン",
    area: "中部",
    url: "/lessons",
    accessFromNaha: "スイング分析やフォーム確認におすすめ",
    status: "営業確認済み"
  },
  {
    id: "golf-lounge-sunshine-makiminato",
    name: "ゴルフラウンジサンシャイン 牧港店",
    category: "屋内",
    area: "中部",
    address: "沖縄県浦添市牧港（牧港エリア）",
    url: "https://golfloungesunshine.com/",
    accessFromNaha: "那覇空港から車で約20分",
    status: "営業確認済み"
  },
  {
    id: "golf-lounge-sunshine-gushikawa",
    name: "ゴルフラウンジサンシャイン 具志川店",
    category: "屋内",
    area: "中部",
    address: "沖縄県うるま市（具志川エリア）",
    url: "https://golfloungesunshine.com/",
    accessFromNaha: "那覇空港から車で約45分",
    status: "営業確認済み"
  },
  {
    id: "chatan-indoor-golf-studio",
    name: "北谷インドアゴルフスタジオ",
    category: "屋内",
    area: "中部",
    address: "沖縄県中頭郡北谷町（北谷スポーツセンター内）",
    url: "https://csi.okinawa/",
    accessFromNaha: "那覇空港から車で約30分",
    status: "営業確認済み"
  }
];

const fallbackGolfShops: GolfShop[] = [
  {
    id: "pga-store-toyosaki",
    name: "PGAストア豊崎",
    slug: "pga-store-toyosaki",
    area: "南部",
    city: "豊見城市",
    summary: "新品クラブやウェア、小物までまとめて見たい初心者向けの大型店舗候補。",
    imageUrl: "/assets/logo.png",
    storeSize: "大型店舗",
    productCondition: "新品",
    categories: ["大型ショップ", "新品販売", "ウェア"]
  },
  {
    id: "tsuruya-golf",
    name: "つるやゴルフ",
    slug: "tsuruya-golf",
    area: "南部",
    summary: "クラブ選びやシューズ選びを相談しながら進めたい初心者向けの専門店候補。",
    imageUrl: "/assets/logo.png",
    storeSize: "専門店",
    productCondition: "新品",
    categories: ["ショップ", "新品販売", "クラブ"]
  },
  {
    id: "mangasouko-urasoe",
    name: "マンガ倉庫浦添",
    slug: "mangasouko-urasoe",
    area: "中部",
    city: "浦添市",
    summary: "最初のギアを手頃に探したい人向けの中古用品候補。",
    imageUrl: "/assets/partners/mangasouko-logo.png",
    storeSize: "大型店舗",
    productCondition: "中古",
    categories: ["中古販売", "ショップ", "ゴルフ用品"]
  }
];

const fallbackPartners: Partner[] = [
  {
    id: "mangasouko-naha",
    name: "マンガ倉庫 那覇店",
    logo: { url: "/assets/partners/mangasouko-logo.png" },
    websiteUrl: "https://mangasouko-okinawa.com/naha/",
    status: "published",
    displayOrder: 1
  },
  {
    id: "toretore-itoman",
    name: "トレトレ倉庫 糸満店",
    logo: { url: "/assets/partners/toretore-logo.png" },
    websiteUrl: "https://mangasouko-okinawa.com/toretore-itoman/",
    status: "published",
    displayOrder: 2
  },
  {
    id: "okinawa-pet-care",
    name: "OKINAWA PET CARE",
    logo: { url: "/assets/partners/okinawa-pet-care-logo.png" },
    websiteUrl: "https://pet-care.co.jp/",
    status: "published",
    displayOrder: 3
  }
];

function normalizeServiceDomain(value?: string) {
  return (value || "")
    .replace(/^https?:\/\//, "")
    .replace(/\.microcms\.io\/?$/, "")
    .replace(/\/$/, "");
}

function getMicroCMSConfig() {
  const serviceDomain = normalizeServiceDomain(process.env.MICROCMS_SERVICE_DOMAIN);
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain || !apiKey) return null;
  return { serviceDomain, apiKey };
}

function normalizeSlug(slug: string) {
  return decodeURIComponent(slug).replace(/\.html$/, "");
}

async function requestMicroCMS<T>(path: string) {
  const config = getMicroCMSConfig();
  if (!config) return null;

  const response = await fetch(`https://${config.serviceDomain}.microcms.io/api/v1${path}`, {
    headers: {
      "X-MICROCMS-API-KEY": config.apiKey
    },
    next: {
      revalidate: 300
    }
  });

  if (!response.ok) {
    console.error(`microCMS request failed: ${response.status} ${response.statusText}`);
    return null;
  }

  return (await response.json()) as T;
}

async function requestAllMicroCMS<T>(endpoint: string, query = "") {
  const limit = 100;
  const firstSeparator = query ? "&" : "?";
  const first = await requestMicroCMS<MicroCMSListResponse<T>>(
    `/${endpoint}${query}${firstSeparator}limit=${limit}&offset=0`
  );

  if (!first) return null;

  const contents = [...(first.contents || [])];
  for (let offset = limit; offset < first.totalCount; offset += limit) {
    const separator = query ? "&" : "?";
    const next = await requestMicroCMS<MicroCMSListResponse<T>>(
      `/${endpoint}${query}${separator}limit=${limit}&offset=${offset}`
    );
    if (!next?.contents?.length) break;
    contents.push(...next.contents);
  }

  return contents;
}

export async function getArticles() {
  const data = await requestMicroCMS<MicroCMSListResponse<Article>>(
    "/articles?limit=20&orders=-published,-createdAt"
  );

  return data?.contents?.length ? data.contents : fallbackArticles;
}

function isPublishedTopic(topic: Topic) {
  if (!topic.status) return true;
  return !["draft", "下書き", "archived", "非公開"].includes(topic.status);
}

export async function getTopics() {
  const data = await requestMicroCMS<MicroCMSListResponse<Topic>>(
    "/topics?limit=10&orders=-published,-createdAt"
  );

  const topics = data?.contents?.length ? data.contents : fallbackTopics;
  const publishedTopics = topics.filter(isPublishedTopic);
  return publishedTopics.length ? publishedTopics : fallbackTopics;
}

function isPublishedTournament(tournament: Tournament) {
  if (!tournament.status) return true;
  return !["draft", "下書き", "archived", "非公開"].includes(tournament.status);
}

export async function getTournaments() {
  const data = await requestMicroCMS<MicroCMSListResponse<Tournament>>(
    "/tournaments?limit=100&orders=displayOrder,-dateLabel"
  );

  const tournaments = data?.contents?.length ? data.contents : fallbackTournaments;
  return tournaments
    .filter(isPublishedTournament)
    .sort((a, b) => tournamentSortDate(a) - tournamentSortDate(b));
}

function isPublishedEvent(event: Event) {
  if (!event.status) return true;
  return !["draft", "下書き", "archived", "非公開"].includes(event.status);
}

export async function getEvents() {
  const topics = await getTopics();

  return topics
    .filter((topic) => ["イベント", "試打会"].some((label) => topicCategoryLabel(topic).includes(label)))
    .filter(isPublishedEvent)
    .map((topic): Event => ({
      ...topic,
      eventDate: topic.eventDate || topic.startDate || topic.date || topic.published
    }))
    .sort((a, b) => (a.eventDate || "").localeCompare(b.eventDate || ""));
}

function fieldText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(fieldText).filter(Boolean).join("・");
  if (typeof value !== "object") return "";

  const field = value as Record<string, unknown>;
  const candidates = [field.value, field.label, field.name, field.title, field.text, field.type, field.area, field.id];

  for (const candidate of candidates) {
    const text = fieldText(candidate);
    if (text) return text;
  }

  return "";
}

function numberValue(value: number | string | undefined) {
  if (typeof value === "number") return value;
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isPublishedStatus(status: unknown) {
  const value = fieldText(status);
  if (!value) return true;
  return !["draft", "下書き", "archived", "非公開"].includes(value);
}

function facilityTypeValue(facility: Facility) {
  return fieldText(facility.type);
}

function isGolfCourseFacility(facility: Facility) {
  return facilityTypeValue(facility) === "golf_course";
}

function isPracticeRangeFacility(facility: Facility) {
  const values = [
    facilityTypeValue(facility),
    fieldText(facility.facilityType),
    fieldText(facility.category),
    facility.name
  ].filter(Boolean);

  return values.some((value) => {
    const normalized = value.toLowerCase();
    return (
      ["outdoor_practice_range", "indoor_practice_range", "practice_range", "golf_practice_range", "range"].includes(normalized) ||
      normalized.includes("practice") ||
      normalized.includes("range") ||
      value.includes("練習場") ||
      value.includes("打ちっぱなし") ||
      value.includes("インドア") ||
      value.includes("屋内") ||
      value.includes("室内") ||
      value.includes("屋外") ||
      value.includes("ゴルフガーデン") ||
      value.includes("グリーンセンター") ||
      value.includes("ゴルフラウンジ")
    );
  });
}

function isGolfShopFacility(facility: Facility) {
  const values = [
    fieldText(facility.type),
    fieldText(facility.facilityType),
    fieldText(facility.category),
    fieldText(facility.shopType),
    facility.name
  ].filter(Boolean);

  return values.some((value) => {
    const normalized = value.toLowerCase();
    return (
      ["golf_shop", "shop", "pro_shop", "golf_goods_shop", "golf_store"].includes(normalized) ||
      normalized.includes("golf5") ||
      value.includes("ショップ") ||
      value.includes("店舗") ||
      value.includes("用品") ||
      value.includes("工房") ||
      value.includes("PGAストア") ||
      value.includes("ゴルフ5") ||
      value.includes("つるやゴルフ")
    );
  });
}

function microCMSImages(value: unknown) {
  if (!value) return [];
  const values = Array.isArray(value) ? value : [value];
  return values.filter((item): item is MicroCMSImage => {
    return Boolean(item && typeof item === "object" && "url" in item && typeof (item as MicroCMSImage).url === "string");
  });
}

function facilityGallery(facility: Facility) {
  return [
    ...microCMSImages(facility.mainImage),
    ...microCMSImages(facility.image),
    ...microCMSImages(facility.eyecatch),
    ...microCMSImages(facility.thumbnail),
    ...microCMSImages(facility.gallery),
    ...microCMSImages(facility.galleryImages),
    ...microCMSImages(facility.images),
    ...microCMSImages(facility.photo1),
    ...microCMSImages(facility.photo2),
    ...microCMSImages(facility.photo3),
    ...microCMSImages(facility.photo4),
    ...microCMSImages(facility.photo5)
  ];
}

function facilityToCourse(facility: Facility): Course {
  const area = fieldText(facility.area);
  const city = fieldText(facility.city);
  const facilityType = fieldText(facility.facilityType);
  const status = fieldText(facility.status);

  return {
    id: facility.id,
    title: facility.name,
    slug: facility.slug,
    status,
    area,
    city,
    courseType: facilityType,
    address: facility.address,
    phone: facility.phone,
    websiteUrl: facility.website,
    reservationUrl: facility.reservationUrl,
    airportAccess: facility.airportAccess,
    holes: numberValue(facility.holes),
    par: numberValue(facility.par),
    summary: facility.summary,
    features: facility.features,
    gallery: facilityGallery(facility)
  };
}

function facilityToPracticeRange(facility: Facility): PracticeRange {
  const type = facilityTypeValue(facility);
  const facilityType = fieldText(facility.facilityType);
  const image = facilityGallery(facility)[0];
  const category =
    facilityType ||
    (type === "indoor_practice_range" ? "屋内" : "屋外");

  return {
    id: facility.id,
    name: facility.name,
    imageUrl: image?.url,
    category,
    area: fieldText(facility.area),
    address: facility.address,
    phone: facility.phone,
    url: facility.website,
    accessFromNaha: facility.airportAccess,
    summary: firstFieldText(facility, ["summary", "description", "intro", "introduction", "copy", "body", "features"]),
    description: facility.description,
    features: facility.features,
    status: fieldText(facility.status),
    source: "cms"
  };
}

function splitTags(value: unknown) {
  const text = fieldText(value);
  if (!text) return [];
  return text
    .split(/[、,／/｜|・\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstFieldText(facility: Facility, fields: string[]) {
  for (const field of fields) {
    const text = fieldText(facility[field]);
    if (text) return text;
  }
  return "";
}

function normalizeStoreSize(value: string) {
  if (!value) return "店舗規模未確認";
  if (value.includes("大型") || value.toLowerCase().includes("large")) return "大型店舗";
  if (value.includes("普通") || value.includes("通常") || value.toLowerCase().includes("standard")) return "普通店舗";
  return value;
}

function normalizeProductCondition(value: string) {
  if (!value) return "新品・中古未確認";
  if (value.includes("新品") && value.includes("中古")) return "新品・中古";
  if (value.includes("中古") || value.toLowerCase().includes("used")) return "中古";
  if (value.includes("新品") || value.toLowerCase().includes("new")) return "新品";
  return value;
}

function facilityToGolfShop(facility: Facility): GolfShop {
  const image = facilityGallery(facility)[0];
  const categories = [
    ...splitTags(facility.categories),
    ...splitTags(facility.shopCategories),
    ...splitTags(facility.products),
    ...splitTags(facility.features)
  ];

  return {
    id: facility.id,
    name: facility.name,
    slug: facility.slug,
    area: fieldText(facility.area),
    city: fieldText(facility.city),
    address: facility.address,
    phone: facility.phone,
    website: facility.website,
    mapUrl: firstFieldText(facility, ["mapUrl", "googleMapUrl", "googleMapsUrl", "googlemapurl", "map", "mapsUrl"]),
    summary: firstFieldText(facility, ["summary", "description", "intro", "introduction", "copy", "body", "features"]),
    description: facility.description,
    imageUrl: image?.url,
    storeSize: normalizeStoreSize(
      firstFieldText(facility, ["storeSize", "shopSize", "size", "scale", "storeType"])
    ),
    productCondition: normalizeProductCondition(
      firstFieldText(facility, ["productCondition", "condition", "salesType", "itemCondition", "handlingType"])
    ),
    categories: Array.from(new Set(categories)).slice(0, 6),
    source: "cms"
  };
}

export async function getFacilities() {
  const data = await requestMicroCMS<MicroCMSListResponse<Facility>>(
    "/facilities?limit=100&orders=area,city"
  );

  return data?.contents?.length ? data.contents.filter((facility) => isPublishedStatus(facility.status)) : [];
}

function isPublishedCourse(course: Course) {
  if (!course.status) return true;
  return ["published", "掲載OK", "公開"].includes(course.status);
}

function normalizeCourse(course: Course): Course {
  return {
    ...course,
    courseType: course.courseType || course.coursetype,
    websiteUrl: course.websiteUrl || course.websiteurl,
    reservationUrl: course.reservationUrl || course.reservationurl,
    airportAccess: course.airportAccess || course.airportaccess
  };
}

export async function getCourses() {
  const facilities = await getFacilities();
  if (facilities.length) {
    const courses = facilities
      .filter(isGolfCourseFacility)
      .map(facilityToCourse)
      .map(normalizeCourse)
      .filter(isPublishedCourse);

    if (courses.length) return courses;
  }

  return fallbackCourses.map(normalizeCourse).filter(isPublishedCourse);
}

function isPublishedPracticeRange(range: PracticeRange) {
  if (!range.status) return true;
  return !["draft", "下書き", "archived", "非公開"].includes(range.status);
}

export async function getPracticeRanges() {
  const facilities = await getFacilities();
  if (facilities.length) {
    const ranges = facilities
      .filter(isPracticeRangeFacility)
      .map(facilityToPracticeRange)
      .filter(isPublishedPracticeRange);

    if (ranges.length) return ranges;
  }

  return fallbackPracticeRanges
    .map((range) => ({ ...range, source: "fallback" as const }))
    .filter(isPublishedPracticeRange);
}

export async function getGolfShops() {
  const facilities = await getFacilities();
  const shops = facilities.filter(isGolfShopFacility).map(facilityToGolfShop);
  return shops.length ? shops : fallbackGolfShops.map((shop) => ({ ...shop, source: "fallback" as const }));
}

export async function getSiteStats() {
  const [tournaments, facilities, topics] = await Promise.all([
    requestAllMicroCMS<Tournament>("tournaments", "?orders=displayOrder,-dateLabel"),
    requestAllMicroCMS<Facility>("facilities", "?orders=area,city"),
    requestAllMicroCMS<Topic>("topics", "?orders=-published,-createdAt")
  ]);

  const visibleTournaments = (tournaments || fallbackTournaments).filter(isPublishedTournament);
  const visibleFacilities = (facilities || []).filter((facility) => isPublishedStatus(facility.status));
  const visibleTopics = (topics || fallbackTopics).filter(isPublishedTopic);
  const courseCount = visibleFacilities.length
    ? visibleFacilities.filter(isGolfCourseFacility).length
    : fallbackCourses.map(normalizeCourse).filter(isPublishedCourse).length;
  const practiceRangeCount = visibleFacilities.length
    ? visibleFacilities.filter(isPracticeRangeFacility).length
    : fallbackPracticeRanges.filter(isPublishedPracticeRange).length;

  return {
    tournaments: visibleTournaments.length,
    courses: courseCount,
    practiceRanges: practiceRangeCount,
    events: visibleTopics.length
  };
}

function isPublishedPartner(partner: Partner) {
  if (!partner.status) return true;
  return !["draft", "下書き", "archived", "非公開"].includes(partner.status);
}

export async function getPartners() {
  return fallbackPartners
    .filter(isPublishedPartner)
    .sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
}

export async function getCourse(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  const data = await requestMicroCMS<MicroCMSListResponse<Facility>>(
    `/facilities?filters=slug[equals]${encodeURIComponent(normalizedSlug)}&limit=1`
  );

  const facility = data?.contents?.find(isGolfCourseFacility);
  const course = facility ? facilityToCourse(facility) : fallbackCourses.find((item) => item.slug === normalizedSlug) || null;
  if (!course) return null;

  const normalizedCourse = normalizeCourse(course);
  return isPublishedCourse(normalizedCourse) ? normalizedCourse : null;
}

export async function getArticle(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  const data = await requestMicroCMS<MicroCMSListResponse<Article>>(
    `/articles?filters=slug[equals]${encodeURIComponent(normalizedSlug)}&limit=1`
  );

  if (data?.contents?.[0]) return data.contents[0];

  const articleById = await requestMicroCMS<Article>(
    `/articles/${encodeURIComponent(normalizedSlug)}`
  );

  return (
    articleById ||
    fallbackArticles.find((article) => articleRouteSlug(article) === normalizedSlug) ||
    null
  );
}

export function formatDate(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo"
  }).format(new Date(value));
}

export function articlePath(article: Article) {
  return `/articles/${encodeURIComponent(articleRouteSlug(article))}.html`;
}

export function articleRouteSlug(article: Article) {
  return article.slug?.trim() || article.id;
}

export function coursePath(course: Course) {
  return `/courses/${course.slug}`;
}

export function articleKeywords(article: Article) {
  return ["ブログ", "記事", article.category, article.title, article.description, article.tags]
    .filter(Boolean)
    .join(" ");
}

export function topicKeywords(topic: Topic) {
  return ["最新", "情報", topicCategoryLabel(topic), topic.title, topic.description, topic.tags]
    .filter(Boolean)
    .join(" ");
}

export function topicCategoryLabel(topic: Topic) {
  return normalizeTopicCategory(topic.category) || "お知らせ";
}

function normalizeTopicCategory(value: unknown): string {
  const selectIdLabels: Record<string, string> = {
    sel001: "大会結果",
    sel002: "募集開始",
    sel003: "イベント",
    sel004: "試打会",
    sel005: "お知らせ",
    sel006: "ジュニア"
  };

  if (!value) return "";
  if (typeof value === "string") return selectIdLabels[value] || value.trim();
  if (Array.isArray(value)) {
    return value.map(normalizeTopicCategory).filter(Boolean).join("・");
  }
  if (typeof value !== "object") return "";

  const category = value as Record<string, unknown>;
  const candidates = [
    category.value,
    category.label,
    category.name,
    category.title,
    category.text,
    category.category,
    category.id,
    category["カテゴリ"]
  ];

  for (const candidate of candidates) {
    const label = normalizeTopicCategory(candidate);
    if (label) return label;
  }

  return "";
}

export function topicImage(topic: Topic) {
  return topic.image?.url || topic.eyecatch?.url || topic.thumbnail?.url || "/assets/logo.png";
}

export function tournamentFilterCategory(tournament: Tournament) {
  const values = [];
  const status = tournament.status || "";
  const category = tournamentTargetLabel(tournament);

  if (["募集中", "開催予定", "確認中", "予定", "published", "掲載OK", "公開"].includes(status)) values.push("upcoming");
  if (["成績あり", "開催済み", "終了"].includes(status)) values.push("past");

  if (category.includes("一般") || category.includes("アマ")) values.push("general");
  if (category.includes("シニア") || category.includes("マスター")) values.push("senior");
  if (category.includes("女性") || category.includes("女子") || category.includes("レディ")) values.push("women");
  if (category.includes("ジュニア") || category.includes("学生")) values.push("junior");
  if (category.includes("プロ")) values.push("pro");

  return values.join(" ");
}

export function tournamentKeywords(tournament: Tournament) {
  return [
    tournament.month,
    tournament.dateLabel,
    tournament.title,
    tournament.venue,
    tournament.area,
    tournament.organizer,
    tournamentTargetLabel(tournament),
    tournament.status,
    tournament.description,
    tournament.tags
  ]
    .filter(Boolean)
    .join(" ");
}

export function tournamentTargetLabel(tournament: Tournament) {
  return fieldText(tournament.category) || "対象確認中";
}

export function tournamentSortDate(tournament: Tournament) {
  const text = `${tournament.dateLabel || ""} ${tournament.month || ""}`;
  const year = Number(text.match(/(\d{4})年/)?.[1] || "2026");
  const japaneseDate = text.match(/(\d{1,2})月\s*(\d{1,2})日/);
  const slashDate = text.match(/(\d{1,2})\/(\d{1,2})/);
  const seasonMonth: Record<string, number> = {
    春: 4,
    夏: 7,
    秋: 10,
    冬: 12
  };

  if (japaneseDate) {
    return year * 10000 + Number(japaneseDate[1]) * 100 + Number(japaneseDate[2]);
  }

  if (slashDate) {
    return year * 10000 + Number(slashDate[1]) * 100 + Number(slashDate[2]);
  }

  const month = Number(text.match(/(\d{1,2})月/)?.[1] || seasonMonth[tournament.month || ""] || 12);
  return year * 10000 + month * 100 + 99;
}

export function tournamentLink(tournament: Tournament) {
  if (tournament.status === "成績あり" && tournament.resultUrl) {
    return { url: tournament.resultUrl, text: "成績を見る" };
  }

  if (tournament.entryUrl) return { url: tournament.entryUrl, text: "募集要項を見る" };
  if (tournament.officialUrl) return { url: tournament.officialUrl, text: "公式情報を見る" };
  return null;
}

export function tournamentActionLinks(tournament: Tournament) {
  return [
    { label: "公式ページ", url: tournament.officialUrl },
    { label: "大会概要", url: tournament.overviewUrl || tournament.entryUrl },
    { label: "成績表", url: tournament.resultUrl }
  ];
}

export function courseKeywords(course: Course) {
  return [
    course.title,
    course.area,
    course.city,
    course.courseType,
    course.address,
    course.summary,
    course.features,
    course.airportAccess
  ]
    .filter(Boolean)
    .join(" ");
}

export function courseDescription(course: Course) {
  return (
    course.summary ||
    `${course.city || course.area || "沖縄県"}にあるゴルフ場「${course.title}」の施設情報、アクセス、公式サイトへの導線を掲載しています。`
  );
}

export function practiceRangeKeywords(range: PracticeRange) {
  return [
    range.name,
    range.category,
    range.area,
    range.address,
    range.phone,
    range.accessFromNaha,
    range.status
  ]
    .filter(Boolean)
    .join(" ");
}

export function courseImages(course: Course) {
  const images = [
    course.mainImage,
    course.photo1,
    course.photo2,
    course.photo3,
    course.photo4,
    course.photo5,
    ...(course.galleryImages || []),
    ...(course.gallery || []),
    ...(course.images || [])
  ];

  const uniqueUrls = new Set<string>();
  return images.filter((image): image is MicroCMSImage => {
    if (!image?.url || uniqueUrls.has(image.url)) return false;
    uniqueUrls.add(image.url);
    return true;
  }).slice(0, 5);
}

export function googleMapsUrl(course: Course) {
  const query = [course.title, course.address].filter(Boolean).join(" ");
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : "";
}
