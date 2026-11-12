/* =========================================================
   ✏️ عدّل معلومات الدعوة هنا — EDIT THE INVITATION DETAILS HERE
   ⚠️ هذه المعلومات منسوخة من القالب كمثال مؤقت — غيّرها قبل النشر
   ========================================================= */

export const EVENT = {
  monogram: { a: "O", b: "Z" },
  namesEn: "Omar & Zainab",
  dateShort: "12 . 09 . 2026",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Jupiter+Bnachii+Lake+Lebanon",
  venue: "Jupiter",
  music: "/music.mp3",

  // ⚠️ TEMP: example gift details copied from the template — replace with your own before sharing
  gifts: [
    { name: "WHISH MONEY", lines: ["Phone# 81769569", "or", "Phone# 71633662"] },
    { name: "BLOM Bank", lines: ["LB89 0014 0000 2902 3492 6415 8813"] },
  ],

  // Background photos shown while scrolling (files in /public/images)
  backgrounds: [
    "/images/close.jpg",
    "/images/golden.jpg",
    "/images/bw.jpg",
    "/images/faces.jpg",
    "/images/soft.jpg",
    "/images/cover.jpg",
  ],
  cover: "/images/cover.jpg",
  footer: "/images/footer.jpg",
};

export const TEXT = {
  ar: {
    start: "إضغط للبدء",
    quote: "قلبان، دربٌ واحد،<br>وحّدهما الحب إلى الأبد.",
    withlove: "بكلِّ حبٍّ،",
    families: "عائلة بيتيه و عائلة مصطفى",
    invite: "يتشرّفون بدعوتِكم لحضور<br>حفل زفاف ولدَيهم",
    names: "عمر و زينب",
    date: "يوم السبت الموافق<br>12 أيلول 2026",
    celebration: "الاحتفال",
    time: "7:30 مساءً",
    tz: "توقيت بيروت",
    place: "بحيرة بنشعي، لبنان",
    map: "خريطة الموقع",
    gifts: "الهدايا",
    giftText: "حضوركم أجمل وأثمن هدية.<br>لمن يرغب لائحة الهدايا<br>متوفرة في:",
    rsvpTitle: "حضوركم يسعدنا",
    rsvpBy: "الرجاء تأكيد الحضور قبل 1 أيلول 2026",
    who: "من سيحضر؟",
    add: "+ إضافة شخص",
    share: "شارك حبك وتمنياتك",
    msgPh: "إكتب رسالة (إختياري)",
    confirm: "تأكيد الحضور",
    sending: "جاري الإرسال...",
    thanks: "شكراً لكم! تم تأكيد ردّكم 🤍",
    error: "حدث خطأ، حاول مرة أخرى",
    needAnswer: "الرجاء كتابة الاسم واختيار نعم أو كلا",
    kiss: "قبلة دافئة مع كل محبة من<br>العروسين إلى أطفالكم قبل النوم",
    always: "دائماً وأبداً",
    yes: "نعم",
    no: "كلا",
    namePh: "الاسم",
    lang: "English",
  },
  en: {
    start: "Tap to begin",
    quote: "Two hearts, one path,<br>united by love forever.",
    withlove: "With love,",
    families: "The Baytieh &amp; Moustafa families",
    invite: "request the pleasure of your company<br>at the wedding of their children",
    names: "Omar &amp; Zainab",
    date: "Saturday<br>12 September 2026",
    celebration: "The Celebration",
    time: "7:30 PM",
    tz: "Beirut time",
    place: "Bnechii Lake, Lebanon",
    map: "View map",
    gifts: "Gifts",
    giftText: "Your presence is the most precious gift.<br>For those who wish, our gift registry<br>is available at:",
    rsvpTitle: "Kindly reply",
    rsvpBy: "Please RSVP before 1 September 2026",
    who: "Who will attend?",
    add: "+ Add guest",
    share: "Share your love and wishes",
    msgPh: "Write a message (optional)",
    confirm: "Confirm attendance",
    sending: "Sending...",
    thanks: "Thank you! Your reply has been received 🤍",
    error: "Something went wrong, please try again",
    needAnswer: "Please enter a name and choose Yes or No",
    kiss: "A warm kiss with all our love<br>to your little ones at bedtime",
    always: "Always &amp; Forever",
    yes: "Yes",
    no: "No",
    namePh: "Name",
    lang: "العربية",
  },
} as const;

export type Lang = keyof typeof TEXT;
export type TextKey = keyof (typeof TEXT)["ar"];
