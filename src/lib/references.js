export const referenceGroups = [
  {
    id: "inspiration",
    title: "قائمة الإلهام",
    titleEn: "Inspiration references",
    description: "الاختيارات البصرية المعتمدة لتوجيه تصميم موقع BRXEL وبناء لغته الإبداعية.",
    descriptionEn: "The approved visual references guiding the BRXEL website and its creative language.",
    items: [
      {
        name: "Oasis — Creative Agency",
        url: "https://dribbble.com/shots/19601282-Oasis-Creative-Agency-Landing-Page",
        focus: "صفحة وكالة جريئة",
        focusEn: "Bold agency landing page",
        note: "مرجع لتكوين الصفحة الرئيسية، العناوين الكبيرة، وترتيب المحتوى البصري.",
        noteEn: "A reference for homepage composition, oversized headlines, and visual content hierarchy.",
      },
      {
        name: "Formix — Creative Digital Agency",
        url: "https://www.behance.net/gallery/252758597/Formix-Creative-Digital-Agency-Website-Design?tracking_source=search_projects%7Ccreative%2Bagency%2Bwebsite&l=22",
        focus: "هوية رقمية متكاملة",
        focusEn: "Complete digital identity",
        note: "مرجع لنظام بصري متماسك يمتد من الهوية إلى صفحات الموقع ودراسات الأعمال.",
        noteEn: "A reference for a cohesive visual system spanning identity, web pages, and project presentation.",
      },
      {
        name: "Hurricane — Creative Agency",
        url: "https://dribbble.com/shots/19726952-Hurricane-Creative-Agency-Landing-page",
        focus: "تخطيط تجريبي",
        focusEn: "Exploratory layout",
        note: "مرجع للإيقاع البصري، المساحات غير التقليدية، وعرض خدمات الوكالة بحيوية.",
        noteEn: "A reference for visual rhythm, unconventional spacing, and energetic service presentation.",
      },
      {
        name: "Tive — Creative Digital Agency",
        url: "https://dribbble.com/shots/20384307-Tive-Creative-Digital-Agency-Landing-Page",
        focus: "واجهة رقمية حديثة",
        focusEn: "Modern digital interface",
        note: "مرجع لدمج عرض الخدمات والأعمال في صفحة وكالة واضحة ذات حضور بصري قوي.",
        noteEn: "A reference for combining services and work in a clear agency page with strong visual presence.",
      },
      {
        name: "Tanseeq Studio",
        url: "https://tanseeqstudio.com/ar",
        focus: "تجربة عربية حقيقية",
        focusEn: "Live Arabic experience",
        note: "مرجع مباشر لبناء موقع استوديو إبداعي عربي واتجاه الكتابة والتسلسل المحلي للمحتوى.",
        noteEn: "A live reference for an Arabic creative-studio website, RTL direction, and localized content flow.",
      },
    ],
  },
];

export const referenceCount = referenceGroups.reduce((total, group) => total + group.items.length, 0);
