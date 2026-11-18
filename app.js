// ПОТУЖНЕ МІСТО — сирий прототип. Вся логіка в одному файлі.
'use strict';

// ---------- ДОВІДНИКИ ----------
const GRD = ['D', 'C', 'B', 'A', 'A+', 'A++'], GM_ST = [0.8, 1, 1.2, 1.5, 1.9, 2.5], GM_PR = [0.6, 1, 1.6, 3, 6, 14], GCOL = ['#888', '#2a7', '#27c', '#a3c', '#e80', '#d22'];
const gB = g => `<b style="color:${GCOL[g]}">[${GRD[g]}]</b>`;
const itG = i => i.g == null ? 1 : i.g;
function rollG() { let x = Math.random() * 100; for (const [g, w] of [[0, 30], [1, 43], [2, 20], [3, 6], [4, 1]]) { x -= w; if (x < 0) return g; } return 1; }
const wg = () => S.wg || (S.wg = {});
const wgOf = k => wg()[k] == null ? 1 : wg()[k];
const RAR = ['Звичайна', 'Незвичайна', 'Рідкісна', 'Епічна', 'Легендарна'];
const fmt = n => Math.round(n).toLocaleString('uk-UA');
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const today = () => new Date().toISOString().slice(0, 10);

// Речі, які реально одягаються на героя (вирізані зі спрайт-листа)
const WEAR = {
  cap:      { name: 'Кепка чорна',        slot: 'head',   tab: 'acc',  img: 'cap',      rar: 1, price: 8000,  stat: { luck: 1, crit: 1 } },
  glasses:  { name: 'Окуляри-авіатори',   slot: 'eyes',   tab: 'acc',  img: 'glasses',  rar: 2, price: 12000, stat: { crit: 2 } },
  chain:    { name: 'Ланцюжок з жетоном', slot: 'neck',   tab: 'acc',  img: 'chain',    rar: 3, price: 25000, stat: { luck: 3, dmg: 3 } },
  watch:    { name: 'Годинник тактичний', slot: 'wristR', tab: 'acc',  img: 'watch',    rar: 2, price: 15000, stat: { crit: 1 } },
  bracelet: { name: 'Браслет',            slot: 'wristL', tab: 'acc',  img: 'bracelet', rar: 1, price: 6000,  stat: { dmg: 1 } },
  hoodie:   { name: 'Худі пісочне',       slot: 'top',    tab: 'wear', img: 'hoodie',   rar: 2, price: 18000, stat: { dmg: 2 } },
  vest:     { name: 'Жилет пуховий',      slot: 'outer',  tab: 'wear', img: 'vest',     rar: 3, price: 30000, stat: { dmg: 8 } },
  pants:    { name: 'Штани карго',        slot: 'legs',   tab: 'wear', img: 'pants',    rar: 2, price: 16000, stat: { dmg: 6 } },
  sneakers: { name: 'Кросівки',           slot: 'feet',   tab: 'wear', img: 'sneakers_m_layer', layer: { m: ['sneakers_m_L', 'sneakers_m_R'] }, def: { s: 0.9, dy: 2 }, rar: 2, price: 14000, stat: { dmg: 2, crit: 1 } },
};
const SLOT_NAME = { head: 'Голова', eyes: 'Очі', neck: 'Шия', top: 'Тулуб (верх)', outer: 'Верхній одяг', legs: 'Ноги', feet: 'Взуття', wristR: 'Зап\'ястя П', wristL: 'Зап\'ястя Л' };
// позиції речей на фігурі (в пікселях картинки героя висотою 900)
const ANCH = {
  m: { W: 328, head: [116, -14, 112], eyes: [128, 38, 92], neck: [150, 128, 50], top: [6, 110, 330], outer: [70, 128, 190],
       legs: [48, 385, 242, 412], feetL: [36, 722, 72], feetR: [228, 722, 72], wristR: [290, 385, 34], wristL: [25, 410, 34] },
  f: { W: 291, head: [106, 4, 104], eyes: [117, 60, 88], neck: [138, 140, 44], top: [12, 124, 268], outer: [68, 145, 160],
       legs: [44, 345, 242, 500], feetL: [0, 782, 72], feetR: [206, 782, 72], wristR: [256, 400, 32], wristL: [22, 425, 32] },
};
const ZORD = ['legs', 'feet', 'top', 'outer', 'neck', 'wristL', 'wristR', 'eyes', 'head'];
const SETS = [
  { id: 'street', name: 'Набір «Вулиця»', items: ['hoodie', 'pants', 'sneakers', 'cap'], bonus: '+14% шкоди по босах', stat: { dmg: 14 } },
  { id: 'boss', name: 'Набір «Бос»', items: ['vest', 'pants', 'glasses', 'chain', 'watch'], bonus: '+8% удачі, +18% шкоди по босах, +3% криту', stat: { luck: 8, dmg: 18, crit: 3 } },
];

// Каталог речей для ринку / секонд-хенду (cat = категорія ринку)
const CAT = ['Головні убори', 'Верхній одяг', 'Одяг', 'Штани', 'Взуття', 'Рукавиці', 'Рюкзаки', 'Аксесуари', 'Годинники', 'Спорядження', 'Кільця', 'Ресурси', 'Інше'];
const ITEMS = [
  { id: 'i_cap', name: 'Кепка польова', cat: 'Головні убори', rar: 1, base: 1500, stat: 'Захист +12', wear: 'cap' },
  { id: 'i_armor', name: 'Бронежилет легкий', cat: 'Верхній одяг', rar: 2, base: 8200, stat: 'Захист +42' },
  { id: 'i_jacket', name: 'Куртка тактична', cat: 'Верхній одяг', rar: 3, base: 14900, stat: 'Захист +68' },
  { id: 'i_vest', name: 'Жилет пуховий', cat: 'Верхній одяг', rar: 3, base: 12000, stat: 'Захист +40', wear: 'vest' },
  { id: 'i_pants', name: 'Штани польові', cat: 'Штани', rar: 2, base: 6300, stat: 'Захист +36', wear: 'pants' },
  { id: 'i_boots', name: 'Берці посилені', cat: 'Взуття', rar: 3, base: 10800, stat: 'Захист +48' },
  { id: 'i_sneak', name: 'Кросівки', cat: 'Взуття', rar: 2, base: 5200, stat: 'Спритність +5', wear: 'sneakers' },
  { id: 'i_ring', name: 'Кільце сили', cat: 'Кільця', rar: 4, base: 28000, stat: 'Атака +10%' },
  { id: 'i_hoodie', name: 'Худі', cat: 'Одяг', rar: 1, base: 4100, stat: 'Шкода +2%', wear: 'hoodie' },
  { id: 'i_tee', name: 'Футболка «Маямі»', cat: 'Одяг', rar: 3, base: 3500, stat: 'Шкода +4%' },
  { id: 'i_glasses', name: 'Окуляри-авіатори', cat: 'Аксесуари', rar: 3, base: 7400, stat: 'Крит +2%', wear: 'glasses' },
  { id: 'i_chain', name: 'Ланцюжок з жетоном', cat: 'Аксесуари', rar: 3, base: 9900, stat: 'Удача +3', wear: 'chain' },
  { id: 'i_bracelet', name: 'Браслет', cat: 'Аксесуари', rar: 1, base: 2100, stat: 'Шкода +1%', wear: 'bracelet' },
  { id: 'i_belt', name: 'Ремінь шкіряний', cat: 'Аксесуари', rar: 0, base: 900, stat: '—' },
  { id: 'i_watch', name: 'Годинник тактичний', cat: 'Годинники', rar: 2, base: 6600, stat: 'Крит +1%', wear: 'watch' },
  { id: 'i_gloves', name: 'Рукавиці тактичні', cat: 'Рукавиці', rar: 1, base: 2400, stat: 'Захист +8' },
  { id: 'i_bag', name: 'Рюкзак міський', cat: 'Рюкзаки', rar: 1, base: 3300, stat: 'Слоти +4' },
  { id: 'i_radio', name: 'Рація', cat: 'Спорядження', rar: 2, base: 4700, stat: '—' },
  { id: 'i_scrap', name: 'Брухт', cat: 'Ресурси', rar: 0, base: 300, stat: 'Ресурс' },
  { id: 'i_parts', name: 'Запчастини авто', cat: 'Ресурси', rar: 1, base: 1200, stat: 'Ресурс' },
  { id: 'i_lighter', name: 'Запальничка Zippo', cat: 'Інше', rar: 2, base: 1800, stat: '—' },
];
const IT = Object.fromEntries(ITEMS.map(i => [i.id, i]));
// Іконки речей: той самий спрайт, що й на герої (обрізаний по контуру); без спрайта: емодзі категорії
const CAT_EMO = { 'Головні убори': '🧢', 'Верхній одяг': '🧥', 'Одяг': '👕', 'Штани': '👖', 'Взуття': '👟', 'Рукавиці': '🧤', 'Рюкзаки': '🎒', 'Аксесуари': '📿', 'Годинники': '⌚', 'Спорядження': '🛡️', 'Кільця': '💍', 'Ресурси': '📦' };
const CROP = {};
function cropURL(img) {
  const orig = `img/${img}.png`; if (CROP[img]) return CROP[img] === 1 ? orig : CROP[img];
  CROP[img] = 1; const im = new Image();
  im.onload = () => {
    try {
      const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
      const d = x.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = 0, y1 = 0;
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (d[(yy * w + xx) * 4 + 3] > 20) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
      if (x1 <= x0 || y1 <= y0) return;
      const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
      CROP[img] = o.toDataURL(); if (cur().name !== 'fit') render();
    } catch (e) { }
  };
  im.src = orig; return orig;
}
const wearIcon = (wid, cls) => `<img class="${cls || 'ico'}" src="${cropURL(WEAR[wid].img)}">`;
const ico = id => { const it = IT[id]; if (!it) return ''; return it.wear ? wearIcon(it.wear) : `<span class="ico">${CAT_EMO[it.cat] || '📦'}</span>`; };


const WEAPONS = [
  { id: 'w_bat', name: 'Бита', price: 0, dmg: 1.0 },
  { id: 'w_pistol', name: 'Пістолет', price: 25000, dmg: 1.4 },
  { id: 'w_shotgun', name: 'Дробовик', price: 90000, dmg: 2.0 },
  { id: 'w_smg', name: 'Пістолет-кулемет', price: 250000, dmg: 3.0 },
  { id: 'w_rifle', name: 'Автомат', price: 120, cur: 'crystals', dmg: 4.0 },
];
const BOSSES = [
  { id: 'toro', name: 'Ель Торо', lvl: 1, hp: 150000, rew: { money: 30000, crystals: 3 } },
  { id: 'molot', name: 'Молот', lvl: 3, hp: 480000, rew: { money: 80000, crystals: 5 } },
  { id: 'vipera', name: 'Ла Віпера', lvl: 5, hp: 1200000, rew: { money: 200000, crystals: 8 } },
  { id: 'karlo', name: 'Дон Карло', lvl: 8, hp: 3500000, rew: { money: 600000, crystals: 15, gold: 5 } },
  { id: 'senator', name: 'Сенатор', lvl: 12, hp: 9000000, needLvl: 13, rew: { money: 2000000, crystals: 40, gold: 15 } },
];
const RAID_REW = [[5000, 0, 0], [6000, 0, 0], [7000, 1, 1], [8000, 1, 0], [9000, 1, 1], [11000, 1, 0], [13000, 1, 1], [15000, 2, 0], [17000, 2, 1], [22000, 2, 2], [25000, 2, 2], [28000, 2, 3]]; // ≈165 тис. 💵 і 15 💎 за повний рейд (≈1000 💵 і 0.09 💎 на 1 ⚡)
const PARTS = [['engine', 'Двигун', 'pow'], ['exhaust', 'Вихлоп', 'pow'], ['susp', 'Підвіска', 'hand'], ['brakes', 'Гальма', 'hand'], ['wheels', 'Колеса', 'spd'], ['turbo', 'Турбо', 'spd']];
const TRACKS = [{ n: 'Прибережна', km: 4.2, laps: 3, req: 0 }, { n: 'Даунтаун', km: 3.1, laps: 4, req: 1200 }, { n: 'Нічне шосе', km: 6.8, laps: 2, req: 1500 }];

// ---------- СТАН ----------
// --- ДОСЯГНЕННЯ: очки (рівень досягнень видно всім у профілі) + 💎 за верхні щаблі
const ACH_PTS = [5, 10, 15, 25, 40, 60, 90, 140, 200, 300, 450, 700];
// драбини ступенів
const LD = {
  n: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
  s: [1, 3, 5, 10, 25, 50, 100, 250, 500, 1000],
  t: [1, 2, 3, 5, 10, 20, 30, 50],
  m: [1000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000, 100000000, 1000000000],
  c: [10, 50, 100, 250, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000],
  g: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  b: [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000],
  L: [2, 3, 5, 7, 10, 15, 20, 30, 50, 75, 100],
  d: [1, 3, 7, 14, 30, 60, 100, 200, 365, 500],
  x: [10, 100, 500, 1000, 5000, 10000, 50000, 100000]
};
const ACH = [];
const A = (cat, key, label, ld, flag) => ACH.push([cat, key, label, Array.isArray(ld) ? ld : LD[ld], flag]);
// ⚔️ Бої
A('⚔️ Бої', 'fights', 'Перемог у боях', [10, 50, 200, 1000, 5000, 20000, 100000]);
A('⚔️ Бої', 'raids', 'Рейдів пройдено', [5, 25, 100, 400, 1500, 5000]);
A('⚔️ Бої', 'distStages', 'Етапів атаки на район пройдено', 'n');
A('⚔️ Бої', 'weapOwned', 'Зброї у власності', [2, 3, 4, 5]);
// 💀 Боси
A('💀 Боси', 'bossKills', 'Босів переможено', [1, 5, 20, 60, 200, 1000], 50);
A('💀 Боси', 'bossDmg', 'Загальна шкода по босах', [100000, 1000000, 10000000, 50000000, 250000000, 1000000000, 5000000000, 25000000000]);
A('💀 Боси', 'bossHits', 'Ударів по босах', 'n');
A('💀 Боси', 'bossCrits', 'Критичних ударів', 'n');
A('💀 Боси', 'grenUsed', 'Гранат використано в бою', 's');
A('💀 Боси', 'kill_toro', 'Ель Торо переможено', 's');
A('💀 Боси', 'kill_molot', 'Молота переможено', 's');
A('💀 Боси', 'kill_vipera', 'Ла Віперу переможено', 's');
A('💀 Боси', 'kill_karlo', 'Дона Карло переможено', 's');
A('💀 Боси', 'kill_senator', 'Сенатора переможено', 's');
// 📈 Торгівля
A('📈 Торгівля', 'sellN', 'Речей продано', [5, 25, 100, 500, 2000, 10000, 50000]);
A('📈 Торгівля', 'buyN', 'Речей куплено', [5, 25, 100, 500, 2000, 10000, 50000]);
A('📈 Торгівля', 'sellSum', 'Виручка з продажів, 💵', [10000, 100000, 1000000, 10000000, 100000000, 1000000000], 50);
A('📈 Торгівля', 'buySum', 'Витрачено на купівлі, 💵', [500, 3000, 15000, 60000, 250000, 1000000, 10000000, 100000000]);
A('📈 Торгівля', 'lotsPosted', 'Лотів виставлено на аукціон', 'n');
A('📈 Торгівля', 'lotsSold', 'Лотів продано на аукціоні', [1, 10, 50, 200, 1000, 5000]);
// 💼 Робота
A('💼 Робота', 'bags', 'Завезень відкрито', [5, 10, 30, 50, 100, 400, 1500, 5000, 20000]);
A('💼 Робота', 'shifts', 'Змін відпрацьовано', [5, 25, 100, 400, 1500, 5000, 20000]);
A('💼 Робота', 'jobEarn', 'Зароблено на підробітку, 💵', [10000, 100000, 1000000, 10000000, 50000000, 250000000]);
A('💼 Робота', 'swlvl', 'Рівень секонд-хенду (склад)', [2, 3, 5, 7, 10, 15]);
// 🎁 Знахідки
A('🎁 Знахідки', 'itemsFound', 'Речей знайдено', 'n');
A('🎁 Знахідки', 'itemsRare', 'Рідкісних речей (клас B і вище)', 's');
A('🎁 Знахідки', 'itemsEpic', 'Епічних речей (клас A і вище)', 's');
A('🎁 Знахідки', 'itemsLegend', 'Легендарних речей (A+ і вище)', 't');
A('🎁 Знахідки', 'invN', 'Речей в інвентарі одночасно', [5, 10, 25, 50, 100, 200, 500]);
// 🧵 Баба Валя
A('🧵 Баба Валя', 'bvN', 'Прошивок зроблено', 'n');
A('🧵 Баба Валя', 'bvUp', 'Вдалих прошивок (ранг вгору)', 's');
A('🧵 Баба Валя', 'bvDown', 'Невдалих прошивок (ранг вниз)', 's');
A('🧵 Баба Валя', 'bvSpent', 'Витрачено на прошивки, 💎', 'x');
// 🎰 Слоти
A('🎰 Слоти', 'spins', 'Спінів у слотах', [20, 100, 500, 2500, 10000, 50000, 200000]);
A('🎰 Слоти', 'slotWins', 'Виграшів у слотах', [10, 50, 250, 1000, 4000, 20000]);
A('🎰 Слоти', 'slotBig', 'Найбільший виграш у слотах, x', [5, 20, 50, 100, 200, 500, 1000], 50);
A('🎰 Слоти', 'slotX10', 'Виграшів x10 і більше', 's');
A('🎰 Слоти', 'slotX50', 'Виграшів x50 і більше', 't');
A('🎰 Слоти', 'slotBonus', 'Бонусних ігор у слотах', [1, 3, 10, 30, 100, 300]);
A('🎰 Слоти', 'bonusWon', 'Виграно в бонусних іграх, 🎟', 'b');
A('🎰 Слоти', 'slotBet', 'Поставлено в слотах, 🎟', 'b');
A('🎰 Слоти', 'slotLost', 'Програно в слотах, 🎟', [200, 1000, 5000, 20000, 100000, 500000]);
A('🎰 Слоти', 'slotWon', 'Виграно в слотах, 🎟', [200, 1000, 5000, 20000, 100000, 500000]);
// 🃏 Покер
A('🃏 Покер', 'pokerPlayed', 'Роздач у покер', [5, 25, 100, 400, 1500, 5000]);
A('🃏 Покер', 'pokerWins', 'Перемог у покер', [3, 15, 60, 200, 800, 3000]);
A('🃏 Покер', 'pokerWon', 'Виграно в покер, 🎟', [10000, 100000, 1000000, 10000000, 100000000, 1000000000]);
A('🃏 Покер', 'pokerSpent', 'Фішок витрачено в покері', 'b');
A('🃏 Покер', 'pkPair', 'Зібрано: Пара', 'n');
A('🃏 Покер', 'pkTwo', 'Зібрано: Дві пари', 'n');
A('🃏 Покер', 'pkTrips', 'Зібрано: Трійка', 'n');
A('🃏 Покер', 'pkStr', 'Зібрано: Стріт', 's');
A('🃏 Покер', 'pkFlush', 'Зібрано: Флеш', 's');
A('🃏 Покер', 'pkFull', 'Зібрано: Фул-хаус', 's');
A('🃏 Покер', 'pkQuads', 'Зібрано: Каре', 't');
A('🃏 Покер', 'pkSF', 'Зібрано: Стріт-флеш', 't');
// 🎟 Клуб
A('🎟 Клуб', 'chipsEarned', 'Отримано фішок, 🎟', 'b');
A('🎟 Клуб', 'chipsSpent', 'Витрачено фішок, 🎟', 'b');
A('🎟 Клуб', 'chipsClaimN', 'Днів із щоденними фішками', 'd');
A('🎟 Клуб', 'clubDays', 'Днів із повним клубним днем (45 очок)', 'd');
A('🎟 Клуб', 'clubShopN', 'Покупок у крамниці клубу', 'n');
A('🎟 Клуб', 'cosN', 'Куплено косметики клубу', [1, 2, 3, 5, 7, 9]);
// 🏁 Гонки
A('🏁 Гонки', 'racesN', 'Гонок пройдено', [1, 5, 10, 20, 80, 300, 1000, 5000]);
A('🏁 Гонки', 'raceWins', 'Перемог у гонках', [1, 3, 10, 40, 150, 500, 2000], 50);
A('🏁 Гонки', 'raceTop3', 'Подіумів (місця 1-3)', 'n');
A('🏁 Гонки', 'partUp', 'Покращень деталей авто', 'n');
A('🏁 Гонки', 'carParts', 'Сума рівнів деталей авто', [10, 15, 20, 30, 40, 50, 60]);
A('🏁 Гонки', 'carStars', 'Зірок авто', [1, 2, 3, 4, 5]);
A('🏁 Гонки', 'carRepairs', 'Ремонтів авто', 's');
// 🚗 Перекуп
A('🚗 Перекуп', 'flipN', 'Авто продано', [1, 5, 20, 50, 150, 500]);
A('🚗 Перекуп', 'flipProfit', 'Прибуток від перекупу, 💵', [10000, 100000, 1000000, 10000000, 50000000, 250000000], 50);
A('🚗 Перекуп', 'fllvl', 'Рівень перекупа', [2, 3, 5, 7, 10, 15]);
// 🗺 Райони
A('🗺 Райони', 'distTakes', 'Районів захоплено', [1, 3, 10, 30, 100]);
A('🗺 Райони', 'distDays', 'Діб володіння районом', [1, 7, 30, 100, 365, 1000], 50);
A('🗺 Райони', 'distRating', 'Найвищий рейтинг району', [500, 2000, 10000, 30000, 60000, 100000]);
// 👥 Клан
A('👥 Клан', 'donated', 'Внесок у групування (очки)', [10, 50, 250, 1000, 5000, 25000]);
A('👥 Клан', 'donateN', 'Внесків у групування', 'n');
A('👥 Клан', 'clanLvl', 'Рівень групування', [2, 5, 10, 20, 30, 50, 75, 100]);
A('👥 Клан', 'nodes', 'Вузлів розвитку вивчено', [1, 3, 5, 10, 20, 30, 50, 75, 99]);
A('👥 Клан', 'nodeRace', 'Вузлів гілки «Гонщики»', [1, 3, 5, 10, 15, 20, 30, 40, 50]);
A('👥 Клан', 'nodeFight', 'Вузлів гілки «Бійці»', [1, 3, 5, 10, 15, 20, 30, 40, 50]);
A('👥 Клан', 'nodeTrade', 'Вузлів гілки «Торговці»', [1, 3, 5, 10, 15, 20, 30, 40, 50]);
// 💬 Спілкування
A('💬 Спілкування', 'chatMsgs', 'Повідомлень у чаті', 'n');
A('💬 Спілкування', 'mailGifts', 'Подарунків з пошти забрано', 's');
// 💰 Гроші
A('💰 Гроші', 'earned', 'Отримано грошей, 💵', [10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000], 50);
A('💰 Гроші', 'spent', 'Витрачено грошей, 💵', [10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000]);
A('💰 Гроші', 'crysEarned', 'Отримано кристалів, 💎', 'c');
A('💰 Гроші', 'crysSpent', 'Витрачено кристалів, 💎', 'c');
A('💰 Гроші', 'goldEarned', 'Отримано золотих прикрас, 🟡', 'g');
A('💰 Гроші', 'goldSpent', 'Витрачено золотих прикрас, 🟡', 'g');
A('💰 Гроші', 'energySpent', 'Витрачено енергії, ⚡', 'x');
A('💰 Гроші', 'starsN', 'Покупок за Telegram Stars', 't');
A('💰 Гроші', 'starsSum', 'Витрачено Stars, ⭐', [50, 100, 500, 1000, 5000, 10000]);
// ⭐ Прогрес
A('⭐ Прогрес', 'lvl', 'Рівень гравця', [5, 10, 15, 20, 30, 50, 75, 100, 150], 50);
A('⭐ Прогрес', 'xpEarned', 'Отримано досвіду', 'x');
A('⭐ Прогрес', 'tasks', 'Завдань виконано', [5, 25, 100, 400, 1500, 5000]);
A('⭐ Прогрес', 'dailyChests', 'Щоденних скринь', 'd');
A('⭐ Прогрес', 'logins', 'Днів входу в гру', [1, 3, 7, 14, 30, 100, 200, 365]);
A('⭐ Прогрес', 'streakMax', 'Входів поспіль', [2, 3, 5, 7, 14, 30, 60, 100]);
A('⭐ Прогрес', 'owned', 'Речей у гардеробі', [4, 8, 15, 25, 40]);
A('⭐ Прогрес', 'outfits', 'Змін одягу', 'n');
// 🏆 Сезон
A('🏆 Сезон', 'spClaims', 'Нагород сезонного пропуску', [1, 5, 10, 25, 50, 100, 250, 500]);
A('🏆 Сезон', 'spMax', 'Найвищий рівень сезонного пропуску', [1, 5, 10, 15, 20, 25, 30]);
const ACH_CAT_NOCR = ['🎰', '🃏', '🎟'];
const ACH_MAXPTS = () => ACH.reduce((s, a) => s + a[3].reduce((t, g, i) => t + ACH_PTS[i], 0), 0);
const ACH_TIERS = () => ACH.reduce((s, a) => s + a[3].length, 0);
const ACH_RANKS = [[0, 'Новачок'], [0.02, 'Вуличний'], [0.07, 'Бандит'], [0.18, 'Авторитет'], [0.35, 'Бос'], [0.6, 'Легенда'], [0.9, 'Король міста'], [1, '👑 FULL']];
// --- СЕЗОННИЙ ПРОПУСК (місяць): очки за активність, безкоштовна й платна гілка
const SP_PTS = { fights: 10, racesN: 8, raids: 5, shifts: 4, bags: 3, flipN: 6, lotsSold: 3 }, SP_LV = 30, SP_PER = 100, SP_BUY = 40;
function spS() { const m = new Date().toISOString().slice(0, 7); if (!S.sp || S.sp.m !== m) { S.sp = { m, pts: 0, fr: {}, pr: {} }; S.sprem = 0; } return S.sp; }
const spLvl = () => Math.min(SP_LV, Math.floor(spS().pts / SP_PER));
function spRew(l, prem) {
  if (!prem) {
    if (l === 30) return { item: ['i_hoodie', 2], chips: 300 };
    if (l % 5 === 0) return { chips: 100 + l * 5 };
    if (l % 3 === 0) return { ammo: 30 };
    if (l % 2 === 0) return { money: 5000 + l * 500 };
    return { energy: 5 };
  }
  if (l === 10) return { item: ['i_glasses', 3], crystals: 50 };
  if (l === 20) return { item: ['i_vest', 3], crystals: 50 };
  if (l === 30) return { item: ['i_chain', 4], crystals: 50 };
  if (l % 5 === 0) return { crystals: 30, grenades: 2 };
  if (l % 2 === 0) return { crystals: 8, money: 10000 + l * 1000 };
  if (l % 3 === 0) return { grenades: 2, ammo: 50 };
  return { money: 15000 + l * 1500, energy: 10 };
}
function spTxt(r) { return Object.entries(r).map(([k, v]) => k === 'item' ? IT[v[0]].name + ' ' + GRD[v[1]] : fmt(v) + ' ' + ({ money: '💵', crystals: '💎', gold: '🟡', chips: '🎟', ammo: '🔫', grenades: '💣', energy: '⚡' }[k])).join(' · '); }
function spClaim(l, prem) {
  const sp = spS(), box = prem ? sp.pr : sp.fr; if (box[l] || spLvl() < l || (prem && !S.sprem)) return;
  box[l] = 1; bump('spClaims'); bump('spMax', spLvl(), 'max'); const r = { ...spRew(l, prem) }; const it = r.item; delete r.item; if (Object.keys(r).length) give(r, 'Сезонний пропуск'); if (it) { addItem(it[0], it[1]); toast('Річ: ' + IT[it[0]].name + ' ' + GRD[it[1]]); } render();
}
function spBuyLvl() { if (spLvl() >= SP_LV) return; if (!pay('crystals', SP_BUY)) return; spS().pts = (spLvl() + 1) * SP_PER; render(); }
function seasonScreen() {
  const sp = spS(), lv = spLvl(), d = new Date(), left = new Date(d.getFullYear(), d.getMonth() + 1, 1) - d, dl = Math.ceil(left / 864e5);
  let h = `<h2>🏆 СЕЗОННИЙ ПРОПУСК</h2><div class="box"><div class="bar sp"><b>Рівень ${lv} / ${SP_LV}</b><span class="small">до кінця сезону ${dl} дн.</span></div><div class="prog"><i style="width:${lv >= SP_LV ? 100 : sp.pts % SP_PER}%"></i></div><div class="small">Очки: ${sp.pts} · ${SP_PER} очок на рівень. Очки дають боси, гонки, рейди, робота, перекуп, продажі.</div>
  <button style="width:100%;margin-top:4px" onclick="spBuyLvl()">+1 рівень — ${SP_BUY} 💎</button>
  ${S.sprem ? '<div class="small" style="color:#090;margin-top:4px">⭐ Преміум пропуск активний</div>' : `<button class="y" style="width:100%;margin-top:4px" onclick="buyStars(800,{sprem:1},'Преміум сезонний пропуск')">⭐ Преміум пропуск — 800</button><div class="small">Відкриває платну гілку: 💎, гранати, сильні речі (рівні 10, 20, 30).</div>`}</div>`;
  h += `<div class="bar sp small" style="padding:0 4px"><b>Рівень</b><b>Безкоштовно</b><b>⭐ Преміум</b></div>`;
  for (let l = 1; l <= SP_LV; l++) {
    const f = spRew(l, false), p = spRew(l, true), fo = sp.fr[l], po = sp.pr[l], ok = lv >= l;
    h += `<div class="row" style="${ok ? '' : 'opacity:.55'}"><b style="width:26px">${l}</b><div class="f small">${spTxt(f)}<br><button class="${fo ? 'dis' : ok ? 'y' : 'dis'}" style="font-size:11px" onclick="spClaim(${l},false)">${fo ? '✓' : 'Забрати'}</button></div><div class="f small">${spTxt(p)}<br><button class="${po ? 'dis' : ok && S.sprem ? 'y' : 'dis'}" style="font-size:11px" onclick="spClaim(${l},true)">${po ? '✓' : S.sprem ? 'Забрати' : '🔒'}</button></div></div>`;
  }
  return h;
}
function bump(k, n, mode) { if (!S.st) S.st = {}; n = n === undefined ? 1 : n; if (mode === 'max') S.st[k] = Math.max(S.st[k] || 0, n); else S.st[k] = (S.st[k] || 0) + n; if (SP_PTS[k] && mode !== 'max' && n > 0) spS().pts += SP_PTS[k]; achScan(); }
const STSP = { swlvl: () => swLvl(), fllvl: () => flLvl(), lvl: () => S.lvl, owned: () => S.owned.length, invN: () => Math.max(S.inv.length, (S.st && S.st.invN) || 0), clanLvl: () => (S.group && S.group.member ? S.group.lvl : 0), carParts: () => partsTot(), carStars: () => S.car.stars || 0, weapOwned: () => S.weapons.length, spMax: () => Math.max((S.st && S.st.spMax) || 0, S.sp ? spLvl() : 0) };
const stV = k => STSP[k] ? STSP[k]() : (S.st && S.st[k]) || 0;
const achCr = (a, i) => { if (ACH_CAT_NOCR.some(c => a[0].startsWith(c))) return 0; const k = a[3].length - 1 - i; return k === 0 ? (a[4] ? 15 : 8) : k === 1 ? 4 : k === 2 ? 2 : k === 3 ? 1 : 0; };
function achPts() { let p = 0; ACH.forEach(a => { const v = stV(a[1]); a[3].forEach((g, i) => { if (v >= g) p += ACH_PTS[i]; }); }); return p; }
const achPct = () => achPts() / ACH_MAXPTS();
function achRank(p) { const f = p / ACH_MAXPTS(); let r = ACH_RANKS[0]; ACH_RANKS.forEach(x => { if (f >= x[0] - 1e-9) r = x; }); return r; }
function achDone() { let n = 0; ACH.forEach(a => { const v = stV(a[1]); a[3].forEach(g => { if (v >= g) n++; }); }); return n; }
function achScan(silent) {
  if (S.ach.v !== 2) { S.ach.v = 2; S.ach.seen = undefined; S.ach.cl = {}; }
  if (!S.ach.seen) { S.ach.seen = {}; silent = true; }
  if (!S.st) S.st = {}; S.st.invN = Math.max(S.st.invN || 0, S.inv.length);
  const fresh = [];
  ACH.forEach(a => { const v = stV(a[1]); a[3].forEach((g, i) => { const key = a[1] + i; if (v >= g && !S.ach.seen[key]) { S.ach.seen[key] = 1; if (!silent) { fresh.push([a, g, i]); (S.ach.recent = S.ach.recent || []).unshift([a[2], g, i]); S.ach.recent.length = Math.min(S.ach.recent.length, 5); } } }); });
  fresh.slice(0, 3).forEach(([a, g, i]) => toast(`🏅 Досягнення: ${a[2]} ${fmtG(g)} · +${ACH_PTS[i]} очок${achCr(a, i) ? ' · 💎' + achCr(a, i) + ' у «Завданнях»' : ''}`));
  if (fresh.length > 3) toast(`🏅 І ще ${fresh.length - 3} нових досягнень (вкладка «Завдання» → «Досягнення»)`);
}
const fmtG = g => g >= 1e9 ? g / 1e9 + ' млрд' : g >= 1e6 ? g / 1e6 + ' млн' : g >= 1e3 ? g / 1e3 + ' тис.' : g;
function achClaimable() { return ACH.some(a => a[3].some((g, i) => stV(a[1]) >= g && achCr(a, i) > 0 && !(S.ach.cl || {})[a[1] + i])); }
function claimAch(key) { const a = ACH.find(x => x[3].some((g, j) => x[1] + j === key)); if (!a) return; const i = +key.slice(a[1].length); if (stV(a[1]) < a[3][i]) return; if (!S.ach.cl) S.ach.cl = {}; if (S.ach.cl[key]) return; S.ach.cl[key] = 1; give({ crystals: achCr(a, i) }, 'Досягнення'); render(); }
function claimAllAch() { ACH.forEach(a => a[3].forEach((g, i) => { const key = a[1] + i; if (stV(a[1]) >= g && achCr(a, i) > 0 && !(S.ach.cl || {})[key]) { if (!S.ach.cl) S.ach.cl = {}; S.ach.cl[key] = 1; give({ crystals: achCr(a, i) }, 'Досягнення'); } })); render(); }
function achHeader() {
  const p = achPts(), mx = ACH_MAXPTS(), f = p / mx, r = achRank(p), nx = ACH_RANKS.find(x => x[0] > f + 1e-9), done = achDone(), tot = ACH_TIERS();
  return `<div class="box" style="text-align:center"><div style="font-size:30px">🏅 ${fmt(p)}</div><b>${r[1]}</b> <span class="small">· ${(f * 100).toFixed(1)}% усіх досягнень</span><div class="prog"><i style="width:${f * 100}%"></i></div>
  <div class="small">Отримано ${fmt(done)} з ${fmt(tot)} досягнень · ${fmt(p)} з ${fmt(mx)} очок</div>${nx ? `<div class="small">До звання «${nx[1]}»: ще ${fmt(Math.ceil(nx[0] * mx - p))} очок</div>` : '<div class="small">Максимальне звання! Ти один із найкращих гравців міста.</div>'}<div class="small">Звання й відсоток бачать усі гравці у твоєму профілі.</div></div>`;
}
function achCatStat(cat) { let d = 0, t = 0; ACH.forEach(a => { if (cat && a[0] !== cat) return; const v = stV(a[1]); a[3].forEach(g => { t++; if (v >= g) d++; }); }); return [d, t]; }
function achTab(p) {
  const cats = [...new Set(ACH.map(a => a[0]))], c = p.ac || 'all';
  const pend = achClaimable();
  let h = achHeader() + `<div class="bar" style="margin:4px 0"><button class="${c === 'all' ? 'sel' : ''}" onclick="setP('ac','all')">Усі</button>${cats.map(x => `<button class="${c === x ? 'sel' : ''}" onclick="setP('ac','${x}')">${x.split(' ')[0]}</button>`).join('')}</div>${c !== 'all' ? (() => { const [d, t] = achCatStat(c); return `<div class="box small"><b>${c}</b>: ${d} з ${t} (${Math.round(d / t * 100)}%)<div class="prog"><i style="width:${d / t * 100}%"></i></div></div>`; })() : ''}${pend ? '<button class="y" style="width:100%;margin-bottom:4px" onclick="claimAllAch()">🎁 Забрати всі нагороди 💎</button>' : ''}`;
  const sk = a => { const v = stV(a[1]), g = a[3], cl = S.ach.cl || {}; if (g.some((x, j) => v >= x && achCr(a, j) > 0 && !cl[a[1] + j])) return 3; const i = g.findIndex(x => v < x); return i < 0 ? 0 : 1 + v / g[i]; };
  const rows = ACH.filter(a => c === 'all' || a[0] === c).sort((a, b) => sk(b) - sk(a)).map(a => {
    const v = stV(a[1]), g = a[3]; let i = g.findIndex((x, j) => v < x || (achCr(a, j) > 0 && !(S.ach.cl || {})[a[1] + j])); const done = i < 0; if (done) i = g.length - 1;
    const reached = v >= g[i], cr = achCr(a, i), cl = (S.ach.cl || {})[a[1] + i];
    const dots = g.map((x, j) => v >= x ? '●' : '○').join('') + ' ' + g.filter(x => v >= x).length + '/' + g.length;
    return `<div class="row" style="position:relative">${reached && cr && !cl ? DOT : ''}<div class="f"><b>${a[2]}</b> <span class="small">${dots}</span><div class="prog"><i style="width:${Math.min(1, v / g[i]) * 100}%"></i></div><span class="small">${fmtG(Math.min(v, g[i]))} / ${fmtG(g[i])} · +${ACH_PTS[i]} очок${cr ? ' · +' + cr + ' 💎' : ''}</span></div>
    ${reached && cr && !cl ? `<button class="y" onclick="claimAch('${a[1] + i}')">Забрати</button>` : reached ? '<button class="g" disabled>✓</button>' : '<span class="small">' + a[0].split(' ')[0] + '</span>'}</div>`;
  }).join('');
  return h + rows;
}

const DEF = () => ({
  ver: 2, created: false, name: 'Гравець', gender: 'm', lvl: 1, xp: 0,
  money: 5000, crystals: 30, gold: 0, chips: 0, energy: 60, energyTs: Date.now(), ammo: 30, grenades: 0,
  owned: ['glasses'], equipped: { eyes: 'glasses' },
  inv: [], uidN: 10,
  weapons: ['w_bat'], weapon: 'w_bat',
  day: today(), daily: { fights: 0, raids: 0, market: 0, donate: 0, casino: 0, collect: 0, claimed: {}, chest: false },
  week: { fights: 0, raids: 0, races: 0, bags: 0, claimed: {} },
  ach: { bossKills: 0, bags: 0, raceWins: 0, pokerWins: 0, claimed: {} },
  mail: null, bosses: {}, raidStage: 1,
  car: { name: 'Буревій GT', stars: 3, parts: { engine: 3, exhaust: 2, susp: 3, brakes: 2, wheels: 3, turbo: 3 }, color: 'Червоний', sticker: 'Немає', view: 'Спереду' },
  group: { member: false, lvl: 1, prog: 0 },
  login: { day: 0, last: '' },
  slots: { bet: 10 }, bonusGame: 0, pokerPath: 3,
  lots: [], orders: [], stall: null, vip: false, starsSpent: 0,
});
let S;
function load() {
  try { const raw = JSON.parse(localStorage.getItem('pm_state') || '{}'); S = Object.assign(DEF(), raw); if (raw.created && !raw.ver) S.legacy = true; S.ver = 2; } catch (e) { S = DEF(); }
  if (S.pokerTickets) { S.chips = (S.chips || 0) + S.pokerTickets * 50; } delete S.pokerTickets; // квитки покеру злито з фішками клубу
  if (!S.mail) S.mail = defMail();
  if (!S.st) S.st = {};
  if (!S.ach.seen) achScan(true);
  if (S.day !== today()) { S.day = today(); S.daily = DEF().daily; Object.values(S.bosses).forEach(b => b.tries = bossMax()); }
}
// ---------- НАДІЙНЕ ЗБЕРЕЖЕННЯ: localStorage + Telegram CloudStorage ----------
const TGW = window.Telegram && Telegram.WebApp;
const CS = TGW && TGW.CloudStorage && TGW.isVersionAtLeast && TGW.isVersionAtLeast('6.9') ? TGW.CloudStorage : null;
const csSet = (k, v) => new Promise(r => { try { CS.setItem(k, v, (e, ok) => r(!e && !!ok)); } catch (e) { r(false); } });
const csGet = ks => new Promise(r => { try { CS.getItems(ks, (e, v) => r(e ? null : v)); } catch (e) { r(null); } });
const csDel = ks => new Promise(r => { try { CS.removeItems(ks, () => r()); } catch (e) { r(); } });
const SAVE_CH = 3500;
let lastJ = '', cloudT = null, cloudBusy = false, cloudN = 0;
const stateJ = () => JSON.stringify(S, (k, v) => k === 'savedAt' ? undefined : v);
let restoring = !!CS;
function save() {
  if (restoring) return;
  try {
    const j = stateJ();
    if (j !== lastJ) { lastJ = j; S.savedAt = Date.now(); localStorage.setItem('pm_state', JSON.stringify(S)); schedCloud(); schedUp(); }
  } catch (e) { }
}
// дзеркало в базу артефакта (лише всередині Claude): звідти я забираю стан і вшиваю в збірку Telegram
async function stateUpload() { try { if (!window.claude || !claude.use || !S || !S.created) return; const db = await claude.use('db'); if (!db) return; await db.doc('sync/state').set({ state: JSON.stringify(S), ts: Date.now() }); } catch (e) { } }
let upT = null;
function schedUp() { if (CS || !window.claude) return; clearTimeout(upT); upT = setTimeout(stateUpload, 3000); }
function schedCloud(now) { if (!CS) return; clearTimeout(cloudT); cloudT = setTimeout(cloudPush, now ? 0 : 2500); }
async function cloudPush() {
  if (!CS || cloudBusy || !S || !S.created) return; cloudBusy = true;
  try {
    const t = S.savedAt || Date.now(), z = b64u(await zip(JSON.stringify(S), 'c')), n = Math.ceil(z.length / SAVE_CH);
    for (let i = 0; i < n; i++) if (!(await csSet('pm' + i, z.slice(i * SAVE_CH, (i + 1) * SAVE_CH)))) throw 0;
    if (!(await csSet('pm_n', String(n)))) throw 0; await csSet('pm_t', String(t));
    if (cloudN > n) await csDel(Array.from({ length: cloudN - n }, (_, k) => 'pm' + (n + k)));
    cloudN = n;
  } catch (e) { }
  cloudBusy = false;
}
async function cloudRestore() {
  if (!CS) return false;
  const m = await Promise.race([csGet(['pm_t', 'pm_n']), new Promise(r => setTimeout(() => r(null), 2500))]);
  if (!m || !+m.pm_n) return false;
  cloudN = +m.pm_n; const ct = +m.pm_t || 0;
  if (S.created && ct <= (S.savedAt || 0)) return false;
  const keys = Array.from({ length: cloudN }, (_, i) => 'pm' + i), v = await csGet(keys);
  if (!v) return false;
  const z = keys.map(k => v[k] || '').join(''); if (!z) return false;
  const o = JSON.parse(new TextDecoder().decode(await zip2(unb64u(z))));
  if (!o || !o.created) return false;
  localStorage.setItem('pm_state', JSON.stringify(o)); return true;
}
document.addEventListener('visibilitychange', () => { if (document.hidden) { save(); schedCloud(true); } });
window.addEventListener('pagehide', () => { save(); schedCloud(true); });
function defMail() {
  return [
    { id: 1, from: 'Системне повідомлення', t: 'Щоденна нагорода', body: 'Ваша щоденна нагорода вже доступна.', when: 'Сьогодні, 20:14', gift: { money: 10000, crystals: 20 }, read: false, box: 'in' },
    { id: 2, from: 'Групування: Miami Syndicate', t: 'Запрошення до групування', body: 'Вас запрошено приєднатися до групування.', when: 'Сьогодні, 18:47', act: 'group', read: false, box: 'in' },
    { id: 3, from: 'Ринок', t: 'Предмет продано', body: 'Ваш лот «Кепка польова» успішно продано. +1 480', when: 'Сьогодні, 15:26', read: false, box: 'in' },
    { id: 4, from: 'Підтримка', t: 'Відповідь на звернення', body: 'Дякуємо за ваше звернення. Проблему вирішено.', when: 'Вчора, 22:08', read: true, box: 'in' },
    { id: 5, from: 'Сезон', t: 'Нагорода за рейтинг', body: 'Ви отримали нагороду за місце в рейтингу.', when: 'Вчора, 19:40', gift: { gold: 15 }, read: true, box: 'in' },
    { id: 6, from: 'Події', t: 'Новий івент: «Вуличні перегони»', body: 'Розпочалася нова подія. Беріть участь і отримуйте нагороди.', when: '11.11.2026', act: 'races', read: true, box: 'in' },
    { id: 7, from: 'Групування: Miami Syndicate', t: 'Новини групування', body: 'Оновлено правила та цілі групування.', when: '10.11.2026', read: true, box: 'in' },
    { id: 8, from: 'Ви → Підтримка', t: 'Звернення', body: 'Не прийшла нагорода за рейд.', when: 'Вчора, 21:00', read: true, box: 'sent' },
  ];
}

// ---------- ДОПОМІЖНЕ ----------
const $ = id => document.getElementById(id);
function toast(t) { const d = document.createElement('div'); d.textContent = t; $('toast').appendChild(d); setTimeout(() => d.remove(), 2200); }
function modal(html) { $('modalIn').innerHTML = html + '<div style="margin-top:8px;text-align:right"><button onclick="closeModal()">Закрити</button></div>'; $('modal').style.display = 'flex'; }
function closeModal() { $('modal').style.display = 'none'; }
function pay(cur, n) {
  if (S[cur] < n) { toast('Не вистачає: ' + curName(cur)); return false; }
  S[cur] -= n; if (cur === 'money') bump('spent', n); else if (cur === 'crystals') bump('crysSpent', n); else if (cur === 'gold') bump('goldSpent', n); else if (cur === 'chips') bump('chipsSpent', n); else if (cur === 'energy') bump('energySpent', n); return true;
}
function curName(c) { return { money: 'гроші 💵', crystals: 'кристали 💎', gold: 'золоті прикраси 🟡', energy: 'енергія ⚡', chips: 'фішки 🎟' }[c] || c; }
function give(r, why) {
  const parts = [];
  for (const k in r) {
    let v = r[k]; if (S.vip && (k === 'money')) v *= 2;
    S[k] = (S[k] || 0) + v; if (k === 'money') bump('earned', v); else if (k === 'crystals') bump('crysEarned', v); else if (k === 'gold') bump('goldEarned', v); else if (k === 'chips') bump('chipsEarned', v); else if (k === 'xp') bump('xpEarned', v); parts.push(fmt(v) + ' ' + ({ money: '💵', crystals: '💎', gold: '🟡', chips: '🎟', sprem: 'преміум пропуск', ammo: 'патронів', grenades: 'гранат', xp: 'XP' }[k] || k));
  }
  if (r.xp) lvlCheck();
  toast((why ? why + ': ' : '') + '+' + parts.join(', +'));
}
const xpNeed = l => l * 500;
function lvlCheck() { while (S.xp >= xpNeed(S.lvl)) { S.xp -= xpNeed(S.lvl); S.lvl++; toast('Новий рівень ' + S.lvl + '!'); } }
function addItem(id, g) { const u = { uid: ++S.uidN, id }; if (g != null) u.g = g; S.inv.push(u); bump('itemsFound'); if (g >= 2) bump('itemsRare'); if (g >= 3) bump('itemsEpic'); if (g >= 4) bump('itemsLegend'); return u; }
const EN_MIN = 4; // хвилин на 1 енергії: 1440/4 = 360 ⚡ на добу, тобто 6 повних запасів
function energyTick() {
  const iv = EN_MIN * (subTier() ? TIERS[subTier()].regen : 1) * 60000, mins = Math.floor((Date.now() - S.energyTs) / iv);
  if (mins > 0) { if (S.energy < 60) S.energy = Math.min(60, S.energy + mins); S.energyTs += mins * iv; }
}
function stats() {
  const s = { luck: 5, dmg: 0, crit: 5 };
  Object.values(S.equipped).forEach(k => { if (k && WEAR[k]) for (const st in WEAR[k].stat) s[st] = Math.round((s[st] + WEAR[k].stat[st] * GM_ST[wgOf(k)]) * 10) / 10; });
  activeSets().forEach(st => { for (const k in st.stat) s[k] += st.stat[k]; });
  return s;
}
function activeSets() { const eq = Object.values(S.equipped); return SETS.filter(st => st.items.every(i => eq.includes(i))); }
// Шкода по босах: сила героя, зброя, бонус речей (dmg%), крит (подвійний удар), клан
function bossBase() { const s = stats(); return 30000 * 1.2 * weaponMult() * (1 + s.dmg / 100) * (1 + (clanEff('bossDmg') + clanBase()) / 100); }
const avgHit = () => Math.round(bossBase() * (1 + stats().crit / 100));
function weaponMult() { return (WEAPONS.find(w => w.id === S.weapon) || WEAPONS[0]).dmg; }
function rarBadge(r) { return `<span class="small">[${RAR[r]}]</span>`; }

// ---------- ЧЕРВОНІ ТОЧКИ (є що забрати) ----------
const DOT = '<span class="badge">●</span>';
function canClaim(list, store) { return list.some(x => x.v >= x.goal && !store.claimed[x.k]); }
function seasonList() { return weekList().map(x => ({ ...x, goal: x.goal * 4, k: 's_' + x.k })); }
const N = {
  mailIn: () => S.mail.some(m => m.box === 'in' && (m.gift || !m.read)),
  day: () => canClaim(dailyList(), S.daily) || (Object.keys(S.daily.claimed).length >= 6 && !S.daily.chest),
  week: () => canClaim(weekList(), S.week),
  season: () => canClaim(seasonList(), S.week),
  ach: () => achClaimable(),
  tasks: () => N.day() || N.week() || N.season() || N.ach(),
  login: () => S.login.last !== today() || (subTier() && S.sub.claimed !== today()),
  bonus: () => !S.daily.chipsClaim,
  any: () => N.mailIn() || N.tasks() || N.login() || N.bonus(),
};
const dot = f => f ? DOT : '';

// ---------- НАВІГАЦІЯ ----------
let stack = [];
function go(name, p) { stack.push({ name, p: p || {} }); render(); $('app').scrollTop = 0; }
function back() { if (stack.length > 1) stack.pop(); render(); }
function home() { stack = [{ name: 'home', p: {} }]; render(); }
function cur() { return stack[stack.length - 1]; }
function setP(k, v) { cur().p[k] = v; render(); }
// ---------- ПОСТУПОВЕ ВІДКРИТТЯ КОНТЕНТУ ----------
const hasCar = () => !!(S.legacy || (S.beat && S.beat.molot));
// ключ: [рівень, чи потрібна машина, назва]
const UNL = {
  chat: [3, 0, '💬 Чат'], secondhand: [3, 0, '🧥 Секонд-хенд'], jobs: [3, 0, '💼 Робота'], events: [5, 0, '🏆 Події'],
  slots: [5, 0, '🎰 Слоти'], club: [5, 0, '🎰 Ігровий клуб'], season: [7, 0, '🏆 Сезон'], market: [8, 0, '📈 Ринок і Аукціон'],
  group: [10, 0, '👥 Групування'], bv: [10, 0, '🧵 Баба Валя'], district: [12, 0, '🏙 Райони'], poker: [15, 0, '🃏 Покер'],
  flip: [20, 0, '🚗 Перекуп авто'], garage: [0, 1, '🔧 Транспорт'], races: [0, 1, '🏁 Гонки']
};
function lockOf(n) {
  if (S.devAll) return ''; const u = UNL[n]; if (!u) return '';
  if (u[1] && !hasCar()) return 'Відкриється після перемоги над другим босом (Молот): там ти отримаєш першу машину.';
  if (u[0] && S.lvl < u[0]) return 'Відкриється на рівні ' + u[0] + ' (зараз ' + S.lvl + ').';
  return '';
}
function lockedScreen(n, txt) {
  const u = UNL[n] || [0, 0, n];
  return `<div style="text-align:center;padding:60px 12px"><div style="font-size:64px">🔒</div><h2>${u[2]}</h2><div class="box">${txt}</div><div class="small">Грай далі: переможи босів, виконуй завдання й підвищуй рівень.</div><button class="y" style="width:100%;padding:12px;margin-top:10px" onclick="home()">◀ Назад у меню</button><button style="width:100%;margin-top:6px" onclick="showUnlocks()">📋 Що коли відкривається</button></div>`;
}
function showUnlocks() {
  const rows = Object.entries(UNL).sort((a, b) => (a[1][1] ? 99 : a[1][0]) - (b[1][1] ? 99 : b[1][0])).map(([k, u]) => `<div class="bar sp small" style="padding:3px 0"><span>${lockOf(k) ? '🔒' : '✅'} ${u[2]}</span><b>${u[1] ? 'після 2-го боса' : 'рівень ' + u[0]}</b></div>`).join('');
  modal(`<h3>Що коли відкривається</h3><div class="small">З самого початку: Профіль, Інвентар, Гардероб, Наліт (боси), Завдання, Пошта, Магазин.</div><div style="margin:6px 0">${rows}</div><button class="y" style="width:100%" onclick="closeModal()">Закрити</button>`);
}
function chatGo() { const l = lockOf('chat'); if (l) return toast('🔒 ' + l); cur().p.chat = true; render(); }
function showTut() {
  if (S.tut || !S.created) return; S.tut = 1; save();
  modal(`<h3>👋 Ласкаво просимо в Потужне Місто!</h3><div class="row"><div class="f">1️⃣ Одягни героя в <b>Гардеробі</b></div></div><div class="row"><div class="f">2️⃣ Зайди в <b>Наліт</b> і переможи першого боса, Ель Торо</div></div><div class="row"><div class="f">3️⃣ Новий рівень відкриває нові розділи. Замок 🔒 підкаже коли</div></div><div class="row"><div class="f">🚗 Після другого боса отримаєш першу машину</div></div><button class="y" style="width:100%;margin-top:6px" onclick="closeModal()">Зрозуміло</button><button style="width:100%;margin-top:6px" onclick="closeModal();showUnlocks()">📋 Що коли відкривається</button>`);
}
let after = [];
function render() {
  if (typeof spinning !== 'undefined' && spinning && cur().name === 'slots') return;
  energyTick(); save();
  const c = cur(); after = [];
  const scr = SCREENS[c.name];
  const lk = lockOf(c.name);
  $('app').innerHTML = lk ? lockedScreen(c.name, lk) : scr(c.p);
  const noBars = c.name === 'create';
  $('topbar').innerHTML = noBars ? '' : topbar(c.name);
  $('navbar').innerHTML = (c.name === 'home' || NAVS.includes(c.name)) ? navbar(c.name) : '';
  after.forEach(f => f());
}
const NAVS = ['profile', 'inventory', 'wardrobe', 'garage'];
// --- ВАЛЮТИ ЗВЕРХУ: 2 слоти (завжди 💵 і 💎 при вході), по натисканню можна показати іншу валюту
const HUD_C = { money: ['💵', 'Гроші'], crystals: ['💎', 'Кристали'], gold: ['🟡', 'Золоті прикраси'], chips: ['🎟', 'Фішки клубу'] };
let HUD = ['money', 'crystals'];
const hudChip = i => `<span class="cur" onclick="hudPick(${i})">${HUD_C[HUD[i]][0]} ${fmt(S[HUD[i]] || 0)} ▾</span>`;
function hudPick(i) {
  modal(`<h3>Показати валюту</h3><div class="small">Обери, що показувати в цьому місці. При новому вході знову 💵 і 💎.</div>
  ${Object.keys(HUD_C).map(k => `<div class="row"><div class="f">${HUD_C[k][0]} ${HUD_C[k][1]}<div class="small">${fmt(S[k] || 0)}</div></div><button class="${HUD[i] === k ? 'g' : 'y'}" onclick="hudSet(${i},'${k}')">${HUD[i] === k ? '✓' : 'Показати'}</button></div>`).join('')}
  <button style="width:100%;margin-top:6px" onclick="closeModal();go('shop',{tab:'cur'})">🛒 Поповнити в магазині</button>`);
}
function hudSet(i, k) { const o = 1 - i; if (HUD[o] === k) HUD[o] = HUD[i]; HUD[i] = k; closeModal(); render(); }
function topbar(name) {
  return `<div class="top">
    ${name !== 'home' ? '<button onclick="back()">◀</button>' : ''}
    <span class="cur" onclick="go('profile')">👤 ${S.lvl} · <span class="nm">${S.name}</span></span>
    <span class="cur" onclick="go('district',{tab:'shop'})">⚡ ${S.energy}${S.energy <= 60 ? '/60' : ''} +</span>
    ${['money','crystals','gold'].map(k => `<span class="cur" onclick="go('shop',{tab:'cur'})">${HUD_C[k][0]} ${fmt(S[k] || 0)}</span>`).join('')}
    ${name !== 'home' ? `<button style="position:relative" onclick="home()">⌂${dot(N.any())}</button>` : ''}
  </div>`;
}
function navbar(a) {
  const b = [['profile', 'Профіль', '👤'], ['inventory', 'Інвентар', '🎒'], ['wardrobe', 'Гардероб', '👔'], ['garage', 'Транспорт', '🚗']];
  return `<div class="navb">${b.map(([k, t, ic]) => `<button class="${a === k ? 'sel' : ''}" onclick="stack=[{name:'home',p:{}}];go('${k}')"><span class="ic">${lockOf(k) ? '🔒' : ic}</span>${t}</button>`).join('')}</div>`;
}
function tabs(list, curT, key, dots) {
  return `<div class="tabs">${list.map(([k, t]) => `<button style="position:relative" class="${curT === k ? 'y' : ''}" onclick="setP('${key || 'tab'}','${k}')">${t}${dots && dots[k] ? DOT : ''}</button>`).join('')}</div>`;
}

// ---------- ГЕРОЙ (лялька з одягом) ----------
// Підгонка одягу (інструмент «Примірка»): значення на кожну річ і стать
let FIT = {}; try { FIT = JSON.parse(localStorage.getItem('pm_fit') || '{}'); } catch (e) { }
let FITS = null; try { FITS = JSON.parse(localStorage.getItem('pm_fit_saved') || 'null'); } catch (e) { }
const FITS_DEFAULT = {"m":{"hoodie":{"dx":-25,"dy":-34,"s":0.98,"r":0,"z":0,"o":50,"ops":[],"pad":true,"mesh":{"d":[[0.10117897356797531,0.010560619112651102],[0.22494105516126106,0.010986420140729177],[0.3370250118723631,0.01055101679132777],[0.3724256103615964,0.00721939604954945],[0.48934803436769114,0.017049068041528996],[0.5430967049993758,0.04123605794814407],[0.23483565375866236,0.02607351876397245],[0.19563112487357015,0.02053014229019655],[0.2621850282422889,0.02030578598397313],[0.3593913129987871,0.018896258797726797],[0.4674383302968038,0.001915591702823112],[0.6046309987029227,-0.022046461721494652],[0.6226174878224002,-0.013471536958568776],[0.2280007188376988,0.004499805617707112],[0.0982031879321869,0.010468548079819083],[0.13319309716211092,-0.011320213526080663],[0.17298585618387594,-0.03886645675418316],[0.24353533131323374,-0.035445961838774964],[0.3375761892131186,-0.03229554886615013],[0.5424883253501656,-0.036411771919639443],[0.15742042033208445,-0.010113538458678854],[0.06039931541380802,-0.005148002516025519],[0.20841073165449542,-0.044532566185874534],[0.1910384188030711,-0.09835679815419315],[0.12090785645848165,-0.09324209727519336],[0.3194672399752621,0.0013101033008511018],[0.5544512767362162,0.02449118522676974],[0.12691159355599121,0.005369646676884309],[0.07641494863964685,-0.046793656465784164],[0.33124417266664724,-0.06081875142529378],[0.24466183894445734,-0.05701867990843666],[0.21129032429809422,-0.013559992957130788],[0.7932026205439511,0.10204444866490871],[0.6463057451792524,0.08776209571598785],[0.12961728861222405,0.01980612991689061],[0.019360430294056735,-0.072624623342812],[0.3082797113883463,-0.06371528126769672],[0.1961407391952412,-0.021642930294171962],[0.19941129050188888,0.024158228106902456],[0.7424043722714248,0.09256332285813736],[0.3844079712977837,0.043910202984744316],[0.07578118890717028,0.00719259494368391],[0.0653462503341489,-0.020875849393720634],[0.2581489096885579,-0.011873213376002379],[0.1551879871748214,0.0010049824949276871],[0.02287515320835088,0.0027923285351199754],[0.24296295222634504,0.021561091260134158],[0.2718094198492698,0.005836548661935604],[0.23460852143887867,0.01517261977564999]]}},"vest":{"dx":11,"dy":-34,"s":1,"r":0,"z":0,"o":100,"ops":[{"t":"erase","r":0.03333333333333333,"pts":[[0.4929,0.2073],[0.5054,0.2111],[0.518,0.2126],[0.5293,0.2118],[0.523,0.2019],[0.5268,0.1905],[0.5356,0.1829],[0.5456,0.1776],[0.5431,0.1898],[0.5532,0.1844],[0.5607,0.1761],[0.5594,0.1882],[0.5657,0.1783],[0.5582,0.1898],[0.5532,0.2012],[0.5519,0.2126],[0.5519,0.224],[0.5481,0.2134],[0.5481,0.2012],[0.5506,0.2126],[0.5494,0.224],[0.5431,0.2347],[0.5356,0.2438],[0.5243,0.2461],[0.513,0.2469],[0.5016,0.2469],[0.4916,0.24],[0.4903,0.2286],[0.4929,0.2172],[0.4966,0.2278],[0.4979,0.2149],[0.4966,0.1997],[0.4941,0.1882],[0.4916,0.1768],[0.4878,0.1882],[0.4866,0.1997],[0.4929,0.1898],[0.4954,0.1776],[0.4941,0.1898],[0.4941,0.2035],[0.5029,0.1951],[0.5067,0.1829],[0.4966,0.189],[0.4878,0.1997],[0.4778,0.2103],[0.4677,0.2042],[0.4627,0.1913],[0.4577,0.1799],[0.4527,0.1943],[0.4501,0.2065],[0.4476,0.1905],[0.4464,0.1791],[0.4401,0.189],[0.4363,0.2027],[0.43,0.1882],[0.4263,0.1768],[0.4225,0.1875],[0.4225,0.1761],[0.4225,0.1882],[0.4225,0.1997],[0.4225,0.1882],[0.4225,0.1997],[0.4225,0.1882],[0.4225,0.1768],[0.4238,0.1882],[0.4212,0.2012],[0.42,0.1882],[0.4225,0.1768],[0.425,0.1898],[0.4225,0.2012],[0.42,0.1882],[0.42,0.1761],[0.4238,0.1867],[0.425,0.1997],[0.4263,0.2111],[0.4275,0.2233],[0.4313,0.2339],[0.4363,0.2438],[0.4426,0.2537],[0.4313,0.2545],[0.42,0.2499],[0.4087,0.2499],[0.3974,0.2484],[0.3861,0.2507],[0.3974,0.253],[0.4087,0.2568],[0.42,0.2583],[0.4313,0.2583],[0.4439,0.2583],[0.4564,0.2598],[0.4677,0.2598],[0.479,0.2598],[0.4903,0.2606],[0.5016,0.2583],[0.513,0.2575],[0.5243,0.2575],[0.5117,0.2614],[0.4966,0.2629],[0.4841,0.2629],[0.4728,0.2629],[0.4614,0.2629],[0.4501,0.2629],[0.4627,0.2652],[0.474,0.2659],[0.4853,0.2667],[0.4966,0.2674],[0.5092,0.2682],[0.5217,0.2682],[0.5331,0.2682],[0.5444,0.2674],[0.5557,0.2652],[0.567,0.2606],[0.5783,0.2553],[0.5896,0.2499],[0.5846,0.2393],[0.5733,0.2347],[0.562,0.2316],[0.5544,0.2233],[0.5544,0.2118],[0.5544,0.2004],[0.5582,0.189],[0.5607,0.2012],[0.5582,0.2134],[0.5582,0.2263],[0.5569,0.2377],[0.5469,0.2438]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.4974,0.5435],[0.493,0.5275],[0.493,0.5129],[0.4908,0.4982],[0.4886,0.4862],[0.4974,0.4769],[0.504,0.4889],[0.5062,0.5035],[0.5084,0.5169],[0.5106,0.5302],[0.5106,0.5422],[0.5128,0.5555],[0.515,0.5675],[0.515,0.5794],[0.5172,0.5914],[0.5172,0.5781],[0.5194,0.5648],[0.5238,0.5515],[0.526,0.5382],[0.526,0.5501],[0.526,0.5635],[0.526,0.5754],[0.5238,0.5888],[0.5282,0.5768],[0.5304,0.5928],[0.5326,0.6047],[0.5391,0.5954],[0.5391,0.5821],[0.5391,0.5688],[0.5391,0.5568],[0.537,0.5448],[0.5348,0.5328],[0.5304,0.5222],[0.526,0.5115],[0.526,0.4995],[0.5238,0.4876],[0.5238,0.4756],[0.5238,0.4636],[0.5216,0.4516],[0.5216,0.4396],[0.5216,0.4276],[0.5216,0.4157],[0.5194,0.4037],[0.5172,0.3917],[0.515,0.3797],[0.515,0.3677],[0.5128,0.3557],[0.5128,0.3438],[0.5128,0.3318],[0.5172,0.3211],[0.5194,0.3091],[0.5238,0.2985],[0.5304,0.2892],[0.537,0.2798],[0.5435,0.2705],[0.5348,0.2785],[0.5304,0.2905],[0.526,0.3025],[0.5216,0.3171],[0.5172,0.3291],[0.5172,0.3411],[0.5194,0.3264],[0.5194,0.3131],[0.5216,0.2985],[0.5238,0.2852],[0.526,0.2732],[0.5326,0.2625],[0.5413,0.2545],[0.5523,0.2492],[0.5501,0.2612],[0.5435,0.2718],[0.5391,0.2825],[0.5326,0.2918],[0.5282,0.3025],[0.526,0.3158],[0.5194,0.3264],[0.515,0.3384],[0.5084,0.3477],[0.5062,0.3597],[0.5062,0.3717],[0.5062,0.3837],[0.5062,0.3957]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.4886,0.3464],[0.4864,0.3584],[0.4864,0.3717],[0.4886,0.385],[0.4886,0.3983],[0.4886,0.4103],[0.4908,0.4223],[0.4908,0.4343],[0.4908,0.4476],[0.4886,0.4596],[0.4864,0.4716],[0.4842,0.4836],[0.482,0.4955],[0.4776,0.5075],[0.4776,0.5195],[0.4776,0.5315],[0.4754,0.5448],[0.4732,0.5568],[0.471,0.5701],[0.471,0.5821],[0.471,0.5941],[0.471,0.6061],[0.471,0.6181],[0.471,0.63],[0.4688,0.642],[0.4666,0.654],[0.4644,0.666],[0.4644,0.678],[0.4666,0.666],[0.471,0.654]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.4889,0.2766],[0.4889,0.2893],[0.4906,0.3015],[0.4923,0.3127],[0.4956,0.3],[0.4956,0.2867],[0.4931,0.2745],[0.4881,0.2862],[0.4864,0.2974],[0.4822,0.2852],[0.4755,0.2755],[0.4713,0.2867],[0.4637,0.2771],[0.4562,0.2689],[0.4453,0.2648],[0.4427,0.2766],[0.4478,0.2878],[0.4444,0.2755],[0.4394,0.2654],[0.4276,0.2654],[0.4285,0.2766],[0.4335,0.2867],[0.4402,0.2959],[0.4478,0.3051],[0.4553,0.3137],[0.4629,0.3229],[0.4688,0.3336],[0.4747,0.3433],[0.4789,0.3545],[0.4839,0.3646],[0.4872,0.3753],[0.4898,0.3865],[0.4914,0.3977],[0.4914,0.4089]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.5737,0.2521],[0.5687,0.2633],[0.5645,0.274],[0.5603,0.2847],[0.5536,0.2944],[0.5485,0.3046],[0.5427,0.3147],[0.5359,0.3244],[0.5309,0.3346],[0.5267,0.3453],[0.5217,0.356],[0.5192,0.3672],[0.5158,0.3789],[0.515,0.3906],[0.5141,0.4018],[0.5133,0.414]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.483,0.3234],[0.4839,0.3346],[0.4847,0.3458],[0.4847,0.3585],[0.4856,0.3697],[0.4864,0.3809],[0.4864,0.3921],[0.4856,0.4038],[0.4839,0.415],[0.4822,0.4268],[0.4814,0.439],[0.4814,0.4502],[0.4805,0.4614],[0.4805,0.4731],[0.4814,0.4853],[0.4814,0.4965]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.4889,0.3371],[0.4889,0.3494],[0.4889,0.3606],[0.4889,0.3718],[0.4856,0.3825],[0.4822,0.3932],[0.483,0.3814],[0.4839,0.3702],[0.4839,0.359],[0.4864,0.3473],[0.4864,0.3585],[0.4898,0.3718],[0.4906,0.383],[0.4898,0.3957],[0.4889,0.4089],[0.4889,0.4217],[0.4898,0.4339]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.4881,0.5927],[0.4856,0.6045],[0.4822,0.6152],[0.478,0.6258],[0.4747,0.6365],[0.4705,0.6488],[0.4663,0.661],[0.4621,0.6477],[0.4621,0.6355],[0.4621,0.6243],[0.4637,0.6126],[0.4688,0.6024],[0.4747,0.5917],[0.4747,0.5805],[0.4755,0.5693],[0.4696,0.58],[0.4663,0.5907],[0.4654,0.6029],[0.4654,0.6141],[0.4654,0.6269],[0.4663,0.6391],[0.4646,0.6508],[0.4621,0.6625],[0.4595,0.6742],[0.452,0.6839],[0.4486,0.6956],[0.4469,0.7073],[0.4469,0.7195],[0.4486,0.7312],[0.4495,0.743],[0.4495,0.7547],[0.4461,0.7664],[0.4427,0.7771],[0.4411,0.7648],[0.4436,0.7526],[0.4436,0.7414],[0.4444,0.7282],[0.4478,0.7144],[0.4486,0.7012],[0.4503,0.688],[0.4537,0.6757],[0.4562,0.6635],[0.4579,0.6523],[0.4612,0.6406],[0.4654,0.6299],[0.4705,0.6192],[0.4747,0.608],[0.4797,0.5973],[0.483,0.5866],[0.4856,0.5744],[0.4856,0.5617],[0.4856,0.55],[0.4847,0.5388],[0.4847,0.5276],[0.4847,0.5159],[0.4856,0.5047],[0.4772,0.5133]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.4763,0.5184],[0.478,0.5296],[0.4814,0.5403],[0.4864,0.5301],[0.4898,0.5189],[0.4923,0.5077],[0.4931,0.4965],[0.4931,0.4848],[0.4923,0.4731],[0.4914,0.4619],[0.4898,0.4741],[0.4889,0.4868],[0.4881,0.498],[0.4872,0.5103],[0.4847,0.5225],[0.4797,0.5327],[0.473,0.5418],[0.4688,0.5525],[0.4755,0.5434],[0.4797,0.5327],[0.483,0.5215],[0.4856,0.5103],[0.4856,0.4991],[0.4864,0.4874],[0.4881,0.4761],[0.4898,0.4649],[0.4864,0.4761],[0.4864,0.4884]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.8468,0.3104],[0.8449,0.3227],[0.8439,0.3338],[0.843,0.3449],[0.8449,0.3326],[0.8478,0.3209],[0.8536,0.311],[0.8603,0.301],[0.8565,0.3122],[0.8517,0.3227],[0.8459,0.3326],[0.842,0.3438],[0.841,0.3549],[0.8372,0.366],[0.8343,0.3771],[0.8314,0.3889],[0.8314,0.4011],[0.8314,0.4123],[0.8304,0.4246],[0.8304,0.4374],[0.8323,0.4486],[0.8343,0.4597],[0.8391,0.4702],[0.8449,0.4802],[0.8401,0.4691],[0.8372,0.4579],[0.8333,0.4474],[0.8304,0.4363],[0.8295,0.448],[0.8333,0.4369],[0.8314,0.4228],[0.8285,0.4111],[0.8285,0.4],[0.8295,0.3877],[0.8314,0.376],[0.8343,0.3648],[0.8362,0.3531],[0.8381,0.3414],[0.843,0.3309],[0.8497,0.3203],[0.8565,0.3098],[0.8603,0.2987],[0.8652,0.2881]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.8632,0.2794],[0.8507,0.2776],[0.8391,0.2718],[0.8285,0.2665],[0.8169,0.2624],[0.8053,0.2595],[0.7947,0.2559],[0.7851,0.2501],[0.7928,0.2612],[0.8034,0.2688],[0.814,0.2759],[0.8256,0.2805],[0.8362,0.284],[0.8488,0.2881],[0.8594,0.2922],[0.87,0.2981],[0.8584,0.2911],[0.8478,0.287],[0.8362,0.2829],[0.8237,0.2788],[0.8121,0.2747],[0.8015,0.2712],[0.7889,0.2682],[0.7773,0.2671],[0.7657,0.2636],[0.7551,0.26],[0.7445,0.2559]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.1531,0.2771],[0.1598,0.2862],[0.1657,0.2974],[0.1699,0.3086],[0.1724,0.3203],[0.1741,0.3321],[0.1757,0.3438],[0.1766,0.355],[0.1783,0.3667],[0.1791,0.3779],[0.1799,0.3891],[0.1799,0.4003],[0.1799,0.4115],[0.1799,0.4227]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.1766,0.2745],[0.1783,0.2633],[0.1892,0.2587],[0.2009,0.2562],[0.2127,0.2531],[0.2236,0.2506],[0.2345,0.2475],[0.2219,0.2506],[0.211,0.2562],[0.1984,0.2613],[0.1875,0.2648],[0.1757,0.2674],[0.164,0.2694],[0.1514,0.2715],[0.1405,0.2745],[0.1296,0.2781],[0.143,0.2781],[0.1556,0.274],[0.1665,0.2674],[0.1774,0.2603]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.1557,0.4557],[0.1613,0.4665],[0.1635,0.4779],[0.1646,0.49],[0.1646,0.5035],[0.1646,0.5163],[0.1624,0.5284],[0.1602,0.5398],[0.1591,0.5526],[0.1579,0.5647],[0.1602,0.5761],[0.1602,0.5876],[0.1613,0.599],[0.1613,0.6111],[0.1613,0.6239],[0.1602,0.6354],[0.1579,0.6468],[0.1546,0.6589],[0.1513,0.6697],[0.1502,0.6811],[0.1491,0.6926],[0.1457,0.704],[0.1446,0.7161],[0.1402,0.7269],[0.1358,0.7383],[0.1324,0.7498],[0.1435,0.7491],[0.1502,0.7397],[0.1535,0.7289],[0.1535,0.7175],[0.1535,0.706],[0.1524,0.6919],[0.1502,0.6791],[0.1502,0.6677],[0.1513,0.6549],[0.1513,0.6434],[0.1546,0.6307],[0.1557,0.6179],[0.1568,0.6051],[0.1568,0.593],[0.1568,0.5815],[0.1568,0.5694],[0.1568,0.558],[0.1568,0.5465],[0.1591,0.5344],[0.1635,0.5237],[0.1668,0.5115],[0.1702,0.4994],[0.1724,0.4866],[0.1757,0.4752],[0.1757,0.4631],[0.1757,0.451],[0.1779,0.4395],[0.1746,0.4281]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.8404,0.4623],[0.8375,0.4739],[0.8389,0.4854],[0.8389,0.497],[0.8419,0.5077],[0.8419,0.5202],[0.8419,0.5318],[0.8404,0.5433],[0.8419,0.5567],[0.8404,0.5683],[0.8404,0.5807],[0.8404,0.5923],[0.8375,0.6057],[0.8375,0.6181],[0.8375,0.6306],[0.8389,0.6431],[0.8389,0.6555],[0.8419,0.6662],[0.8433,0.6778],[0.8463,0.6911],[0.8492,0.7027],[0.8507,0.7161],[0.8507,0.7285],[0.8536,0.7401],[0.8551,0.7526],[0.8551,0.7651],[0.8551,0.7766],[0.8551,0.7891],[0.858,0.8025],[0.8654,0.8131],[0.8712,0.8229],[0.8786,0.8318]]}],"pad":true},"cap":{"dx":3,"dy":6,"s":0.72,"r":0,"z":0,"o":100,"ops":[]},"glasses":{"dx":2,"dy":0,"s":0.7,"r":0,"z":0,"o":100,"ops":[]},"chain":{"dx":-1,"dy":-7,"s":0.76,"r":0,"z":0,"o":100,"ops":[]},"watch":{"dx":14,"dy":0,"s":0.6,"r":-45,"z":-2,"o":100,"ops":[]},"bracelet":{"dx":-4,"dy":-12,"s":1,"r":45,"z":0,"o":100,"ops":[{"t":"erase","r":0.03333333333333333,"pts":[[0.7473,0.3815],[0.7322,0.3858],[0.717,0.3986],[0.7069,0.4158],[0.6867,0.4329],[0.6665,0.45],[0.6514,0.4715],[0.6261,0.4929],[0.611,0.5143],[0.5958,0.5272],[0.5857,0.5443],[0.5908,0.5229],[0.5958,0.5015],[0.5958,0.4758],[0.6009,0.4543],[0.611,0.4286],[0.616,0.3986],[0.6211,0.3772],[0.6312,0.3601],[0.6362,0.3472],[0.6463,0.3386],[0.6615,0.3429],[0.6716,0.3515],[0.6716,0.3686],[0.6766,0.3901],[0.6817,0.4115],[0.6817,0.4372],[0.6766,0.4672],[0.6766,0.5015],[0.6716,0.5315],[0.6615,0.5658],[0.6514,0.5915],[0.6362,0.6129],[0.6362,0.63],[0.6312,0.6086],[0.6362,0.5872],[0.6413,0.5658],[0.6463,0.5272],[0.6615,0.4886],[0.6766,0.45],[0.6918,0.4115],[0.7069,0.3815],[0.7221,0.3515],[0.7372,0.3301],[0.7423,0.3429],[0.7423,0.3686],[0.7372,0.3986],[0.7372,0.4329],[0.7322,0.4715],[0.717,0.5186],[0.7019,0.5658],[0.6867,0.6043],[0.6817,0.6429],[0.6766,0.6729],[0.6665,0.6815],[0.6716,0.6515],[0.6766,0.6215],[0.6817,0.5829],[0.6968,0.5443],[0.7069,0.5015],[0.7221,0.4629],[0.7372,0.4243],[0.7524,0.4029],[0.7574,0.3815],[0.7625,0.3686],[0.7675,0.3815],[0.7675,0.3986],[0.7726,0.42],[0.7675,0.45],[0.7625,0.4886],[0.7574,0.5272],[0.7423,0.5658],[0.7322,0.6],[0.7221,0.6343],[0.712,0.66],[0.712,0.6429],[0.7221,0.6172],[0.7271,0.5872],[0.7372,0.5529],[0.7473,0.5186],[0.7625,0.4715],[0.7827,0.4372],[0.8029,0.4029],[0.818,0.3729],[0.8231,0.3601],[0.8332,0.3515],[0.8382,0.3815],[0.8433,0.4029],[0.8433,0.4372],[0.8382,0.4758],[0.8382,0.5186],[0.8231,0.5658],[0.8029,0.6172],[0.7827,0.66],[0.7625,0.7029],[0.7423,0.7286],[0.7271,0.75],[0.717,0.7586],[0.712,0.7457],[0.712,0.7286],[0.7069,0.7072],[0.712,0.6772],[0.712,0.6429],[0.7221,0.6],[0.7322,0.5572],[0.7524,0.5143],[0.7776,0.4672],[0.7978,0.4329],[0.818,0.4072],[0.8281,0.3901],[0.8281,0.4158],[0.8332,0.4458],[0.8332,0.4715],[0.8231,0.5143],[0.818,0.5529],[0.8029,0.5915],[0.7827,0.6258],[0.7625,0.66],[0.7524,0.6857],[0.7473,0.6986],[0.7372,0.6729],[0.7372,0.6558],[0.7473,0.6215],[0.7524,0.5915],[0.7726,0.5486],[0.7978,0.51],[0.8231,0.4715],[0.8483,0.4329],[0.8685,0.4072],[0.8837,0.3858],[0.8736,0.4029],[0.8584,0.4329],[0.8433,0.4629],[0.8231,0.5058],[0.8029,0.5486],[0.7726,0.5915],[0.7423,0.6429],[0.7069,0.69],[0.6766,0.7243],[0.6564,0.75],[0.6463,0.7672],[0.6413,0.7457],[0.6463,0.7243],[0.6463,0.69],[0.6514,0.6515],[0.6615,0.6086],[0.6665,0.5615],[0.6817,0.5143],[0.7019,0.4715],[0.7221,0.4286],[0.7423,0.3858],[0.7574,0.3558],[0.7675,0.3386],[0.7675,0.3215],[0.7625,0.3343],[0.7625,0.3515],[0.7574,0.3729],[0.7574,0.3986],[0.7473,0.4329],[0.7322,0.4715],[0.712,0.5143],[0.6968,0.5615],[0.6716,0.6],[0.6514,0.6429],[0.6362,0.6729],[0.6211,0.6943],[0.611,0.7029],[0.6009,0.6772],[0.6009,0.66],[0.6009,0.6258],[0.6009,0.5915],[0.6059,0.5615],[0.611,0.5229],[0.616,0.4843],[0.6261,0.45],[0.6463,0.4072],[0.6615,0.3772],[0.6766,0.3386],[0.6665,0.3643],[0.6615,0.3943],[0.6564,0.4329],[0.6362,0.4758],[0.6059,0.5272],[0.5807,0.5829],[0.5554,0.6386],[0.52,0.6857],[0.4998,0.7286],[0.4746,0.7586],[0.4594,0.78],[0.4493,0.7886],[0.4443,0.7672],[0.4443,0.7415],[0.4443,0.7072],[0.4544,0.6729],[0.4695,0.6343],[0.4897,0.5829],[0.5554,0.4758],[0.5958,0.4243],[0.6362,0.3729],[0.6665,0.3301],[0.6918,0.3086],[0.7069,0.2872],[0.7069,0.3129],[0.7069,0.3301],[0.7019,0.3601],[0.7069,0.3901],[0.7019,0.4286],[0.6968,0.4672],[0.6817,0.5143],[0.6261,0.6129],[0.5908,0.66],[0.5554,0.6986],[0.5301,0.7286],[0.5099,0.7543],[0.4998,0.7372],[0.5049,0.7157],[0.5049,0.6815],[0.5251,0.5958],[0.5402,0.54],[0.5605,0.48],[0.5857,0.4243],[0.616,0.3643],[0.6514,0.3172],[0.6817,0.2658],[0.7069,0.2358],[0.7271,0.2101],[0.7322,0.1972],[0.7271,0.2101],[0.7221,0.2315],[0.717,0.2529],[0.7069,0.2872],[0.6918,0.3343],[0.6716,0.3858],[0.6463,0.4415],[0.5807,0.5572],[0.5453,0.6043],[0.5099,0.6429],[0.4847,0.6729],[0.4645,0.69],[0.4544,0.6558],[0.4594,0.6343],[0.4645,0.6043],[0.4594,0.5658],[0.4695,0.5315],[0.4948,0.45],[0.5099,0.4115],[0.5301,0.3772],[0.5402,0.3515],[0.5503,0.3258],[0.5554,0.3386],[0.5554,0.3558],[0.5554,0.3729],[0.5554,0.3901],[0.5554,0.4158],[0.5554,0.4329],[0.5453,0.45],[0.5453,0.4672],[0.5352,0.4758],[0.5301,0.4543],[0.5251,0.4415],[0.5251,0.4243],[0.5301,0.4029],[0.5301,0.3772],[0.5352,0.3301],[0.5352,0.3129],[0.5453,0.2958],[0.5503,0.2829],[0.5402,0.3001],[0.5301,0.3258],[0.52,0.3429],[0.5049,0.3558],[0.4897,0.3772],[0.4746,0.3986],[0.4544,0.4158],[0.4291,0.4372],[0.414,0.4329],[0.4039,0.4158],[0.3988,0.4029],[0.3938,0.3901],[0.3887,0.3686],[0.3938,0.3558],[0.4089,0.3515],[0.4241,0.3472],[0.4392,0.3429],[0.4493,0.3343],[0.4645,0.3215],[0.4746,0.3129],[0.4847,0.3043],[0.4948,0.2958],[0.5301,0.2658],[0.5453,0.2529],[0.5554,0.2443],[0.5655,0.2358],[0.5756,0.2272],[0.5857,0.2186],[0.5958,0.2101],[0.6059,0.2186],[0.5908,0.2315],[0.5756,0.2443],[0.5605,0.2572],[0.5352,0.2786],[0.4897,0.3172],[0.4695,0.3429],[0.4443,0.3643],[0.419,0.4029],[0.4089,0.42],[0.4039,0.4415],[0.4039,0.4586],[0.3938,0.4843],[0.3988,0.4972],[0.3938,0.51],[0.3938,0.5358],[0.3988,0.5486],[0.414,0.5358],[0.4241,0.5186],[0.4392,0.4972],[0.4544,0.4758],[0.4897,0.42],[0.5049,0.3986],[0.515,0.3901],[0.52,0.3772],[0.5301,0.3943],[0.5352,0.4072],[0.5402,0.4372],[0.5402,0.4543],[0.5453,0.4758],[0.5453,0.4929],[0.5554,0.5186],[0.5605,0.4886],[0.5706,0.4629],[0.5807,0.4372],[0.6009,0.3772],[0.6059,0.3472],[0.6211,0.3258],[0.6261,0.3043],[0.6312,0.2915],[0.6261,0.3043],[0.6261,0.3215],[0.6211,0.3429],[0.611,0.3686],[0.6059,0.4072],[0.5908,0.4458],[0.5402,0.54],[0.515,0.5786],[0.4746,0.6472],[0.4645,0.6643],[0.4594,0.6515],[0.4594,0.6343],[0.4594,0.6172],[0.4594,0.5915],[0.4645,0.5443],[0.4746,0.5186],[0.4847,0.4929],[0.4948,0.4758],[0.5099,0.4543],[0.52,0.4629],[0.5301,0.4715],[0.5453,0.4929],[0.5605,0.5315],[0.5756,0.5529],[0.5807,0.5743],[0.5908,0.6086],[0.5958,0.6215],[0.5908,0.6086],[0.5908,0.5915],[0.5857,0.57],[0.5857,0.5186],[0.5807,0.4972],[0.5756,0.4758],[0.5706,0.4629],[0.5605,0.4458],[0.5453,0.4415],[0.5301,0.4543],[0.515,0.4758],[0.4998,0.5058],[0.4847,0.5358],[0.4443,0.6215],[0.4342,0.6643],[0.419,0.7372],[0.4241,0.7586],[0.4241,0.7329],[0.4291,0.7029],[0.4291,0.6772],[0.4594,0.6],[0.4746,0.5615],[0.4948,0.5272],[0.515,0.4758],[0.5251,0.4672],[0.5301,0.4886],[0.5352,0.5015],[0.5503,0.5486],[0.5554,0.5615],[0.5554,0.5786],[0.5402,0.5658],[0.5251,0.5529],[0.5049,0.5358],[0.4746,0.51],[0.4594,0.4972],[0.4392,0.4886],[0.414,0.4929],[0.4089,0.5143],[0.4089,0.5315],[0.4089,0.5572],[0.4089,0.5743],[0.4089,0.6],[0.4089,0.6172],[0.4089,0.6343],[0.414,0.6472],[0.4241,0.6386],[0.4241,0.6215],[0.4241,0.6043],[0.419,0.5915],[0.419,0.5743],[0.4342,0.5872],[0.4493,0.6],[0.4544,0.6129],[0.4695,0.6343],[0.4847,0.6729],[0.4897,0.6943],[0.4998,0.72],[0.5049,0.7329],[0.5099,0.7457],[0.515,0.7586],[0.5099,0.7457],[0.5099,0.7286],[0.5099,0.7029],[0.5099,0.6772],[0.4998,0.66],[0.4998,0.6429],[0.4948,0.6215],[0.4897,0.6086],[0.5049,0.6215],[0.515,0.63],[0.5352,0.6558],[0.5807,0.6943],[0.6009,0.7115],[0.6312,0.7372],[0.6463,0.7329],[0.6514,0.7029],[0.6463,0.6815],[0.6463,0.6472],[0.6463,0.5786],[0.6463,0.5015],[0.6413,0.4715],[0.6312,0.4115],[0.6211,0.3943],[0.611,0.3772],[0.616,0.3643],[0.6261,0.3558],[0.6312,0.3429],[0.6312,0.3258],[0.6413,0.3086],[0.6312,0.3001],[0.6362,0.2872],[0.6261,0.2786],[0.616,0.2872],[0.6312,0.2829],[0.6413,0.2743],[0.6615,0.2658],[0.6918,0.2486],[0.7221,0.2229],[0.7574,0.2101],[0.7675,0.2015],[0.7776,0.1929],[0.7625,0.1886],[0.7473,0.1929],[0.7271,0.2015],[0.7069,0.2101],[0.6564,0.2443],[0.6312,0.2658],[0.5807,0.3086],[0.5503,0.3429],[0.5605,0.3343],[0.5706,0.3258],[0.5857,0.3043],[0.611,0.2743],[0.6312,0.2572],[0.6564,0.2272],[0.6817,0.2058],[0.6968,0.2101],[0.7019,0.1972],[0.7019,0.1801],[0.7069,0.1586],[0.712,0.1458],[0.712,0.1115],[0.712,0.0944],[0.7069,0.0729],[0.7069,0.0558],[0.6968,0.0472],[0.6817,0.0344],[0.6716,0.0258],[0.6615,0.0344],[0.6514,0.0429],[0.6463,0.0644],[0.6463,0.0815],[0.6463,0.1158],[0.6564,0.1415],[0.6665,0.1672],[0.6817,0.2143],[0.7069,0.2443],[0.717,0.2529],[0.717,0.2358],[0.7069,0.2272],[0.7019,0.2143],[0.6766,0.1843],[0.6665,0.1672],[0.6312,0.1372],[0.611,0.1201],[0.5807,0.1115],[0.5706,0.1029],[0.5554,0.1072],[0.5655,0.1243],[0.5857,0.1415],[0.616,0.1843],[0.6362,0.2015],[0.6564,0.2272],[0.6665,0.2358],[0.6716,0.2229],[0.6615,0.2143],[0.6514,0.1972],[0.6211,0.1543],[0.5807,0.1201],[0.5655,0.1072],[0.5453,0.0901],[0.5605,0.1029],[0.5756,0.1158],[0.5908,0.1372],[0.6312,0.1801],[0.6463,0.1929],[0.6716,0.2229],[0.6817,0.2315],[0.6665,0.2186],[0.6564,0.2101],[0.6211,0.1886],[0.6059,0.1758],[0.5605,0.1543],[0.5402,0.1372],[0.5301,0.1286],[0.5453,0.1415],[0.5605,0.1543],[0.5706,0.1715],[0.6059,0.2101],[0.6312,0.2401],[0.6362,0.2529],[0.6261,0.2443],[0.616,0.2358],[0.6009,0.2229],[0.5908,0.2143],[0.5857,0.2015],[0.6009,0.2143],[0.6211,0.2315],[0.6312,0.2401],[0.6463,0.2615],[0.6564,0.2701],[0.6716,0.2743],[0.6817,0.2829],[0.712,0.3086],[0.7271,0.3301],[0.7625,0.3858],[0.7928,0.4372],[0.7978,0.4843],[0.7978,0.5015],[0.7928,0.5229],[0.7827,0.54],[0.7675,0.5615],[0.7473,0.5786],[0.7322,0.5915],[0.6968,0.5958],[0.6716,0.5915],[0.6615,0.5829],[0.6362,0.5615],[0.6261,0.5443],[0.6009,0.5143],[0.5857,0.5015],[0.5908,0.5143],[0.5958,0.5358],[0.6059,0.5529],[0.616,0.6129],[0.6261,0.6472],[0.6312,0.7115],[0.6312,0.7372],[0.6362,0.7757],[0.6362,0.7586],[0.6312,0.7457],[0.616,0.7329],[0.6059,0.7157],[0.5958,0.7072],[0.5958,0.7243],[0.5958,0.7415],[0.6009,0.78],[0.6059,0.8186],[0.6009,0.84],[0.5908,0.8315],[0.5857,0.8186],[0.5655,0.7843],[0.5402,0.7457],[0.5251,0.7329],[0.4998,0.7115],[0.4897,0.7029],[0.4998,0.72],[0.5049,0.7415],[0.5402,0.7886],[0.5655,0.8272],[0.5908,0.8486],[0.5807,0.84],[0.5706,0.8315],[0.5554,0.8186],[0.5251,0.7929],[0.4998,0.7543],[0.4897,0.7372],[0.4847,0.69],[0.4847,0.6386],[0.4695,0.5743],[0.4695,0.5486],[0.4594,0.4972],[0.4544,0.4672],[0.4645,0.4586],[0.4796,0.4543],[0.4897,0.4458],[0.4998,0.4372],[0.5099,0.42],[0.5099,0.4029],[0.4998,0.4115],[0.4796,0.4372],[0.4746,0.4586],[0.4594,0.4972],[0.4544,0.5358],[0.4493,0.5486],[0.4645,0.5443],[0.4645,0.5272],[0.4645,0.51],[0.4746,0.4929],[0.4897,0.5058],[0.52,0.54],[0.5352,0.57],[0.5706,0.6429],[0.611,0.7286],[0.6312,0.7886],[0.6413,0.8057],[0.6514,0.8229],[0.6564,0.81],[0.6463,0.8015],[0.6362,0.7757],[0.616,0.75],[0.5807,0.7115],[0.5503,0.6857],[0.5352,0.6729],[0.5301,0.6857],[0.5503,0.72],[0.5605,0.7372],[0.5857,0.7843],[0.6059,0.8186],[0.616,0.8272],[0.611,0.8057],[0.611,0.7886],[0.5908,0.7457],[0.5756,0.7243],[0.5503,0.6857],[0.5301,0.66],[0.5554,0.6729],[0.5958,0.7072],[0.6211,0.7286],[0.6615,0.7715],[0.6817,0.7886],[0.6766,0.7757],[0.6665,0.7672],[0.6463,0.75],[0.6261,0.7415],[0.5958,0.7243],[0.5655,0.7157],[0.5655,0.7329],[0.5706,0.7457],[0.5958,0.7757],[0.6261,0.8015],[0.6413,0.8057],[0.6665,0.7929],[0.6716,0.78],[0.6817,0.7372],[0.6968,0.6643],[0.7271,0.57],[0.7473,0.5186],[0.7776,0.4243],[0.7978,0.3472],[0.8029,0.2915],[0.7978,0.2786],[0.7928,0.2658],[0.7877,0.2529],[0.7776,0.2443],[0.7675,0.2358],[0.7524,0.2401],[0.7372,0.2529],[0.712,0.2743],[0.6766,0.3129],[0.6564,0.3301],[0.6514,0.3686],[0.6615,0.3858],[0.6716,0.3943],[0.6867,0.3901],[0.6968,0.3815],[0.712,0.3601],[0.7322,0.3429],[0.7524,0.3258],[0.7625,0.3172],[0.7726,0.3086],[0.7625,0.3001],[0.7524,0.2915],[0.7372,0.2958],[0.7271,0.3043],[0.7271,0.2872],[0.7372,0.3043],[0.7372,0.3215],[0.7322,0.3343],[0.7271,0.3472],[0.7221,0.3601],[0.7069,0.3815]]}],"pad":true},"pants":{"dx":20,"dy":-44,"s":1,"r":0,"z":0,"o":100,"pad":true,"ops":[],"mesh":{"d":[[-0.01515718562874252,0.014062499999999993],[-0.047904191616766484,0.05750248015873015],[-0.018946482035928178,0.07090153769841272],[-0.010081399700598917,0.07281125992063495],[0.016131646982125217,0.06491472352062704],[0.0494947604790419,0.060838293650793615],[0.01393291943721513,0.016012193758722246],[-0.0017876853655078148,0.0011563426129195522],[-0.015157185628742518,0.015543370317657757],[-0.0017876853655078156,0.018981516984916773],[0.00022346067068847392,0.03894475048291088],[0.009142817509190585,0.016205063378599158],[0.031450069952125626,0.015728058050959497],[0.00724816930559779,0.0013932818637447935],[0,-0.0015873015873015817],[0,-0.0005022321428571411],[0.0037892964071856586,0.020591517857142853],[0.011976047904191711,0.06507936507936507],[0.00445967841925109,0.020532283044436543],[0.0059074052814669315,-0.0005614669555634513],[0.0025650302156582606,-0.0005614669555634513],[-0.00663126871257485,0.0005022321428571411],[-0.0007821123474096686,5.923481270631029e-05],[0.000446921341376957,0.00242862732095873],[0.0037892964071856586,0.020591517857142853],[0.000446921341376957,0.00242862732095873],[0.002118108874281308,-0.0005614669555634513],[0.007882672155688684,-0.0020895337301587227],[-0.023800056137724544,0.00016121031746035158],[-0.0069664597186075644,0.0006490554094764245],[0,0],[0,0],[0,0],[0.002118108874281308,-0.0005614669555634513],[0.007882672155688684,-0.0020895337301587227],[-0.016398712868226868,-0.013223545407900252],[-0.01028329802914354,-0.013801086023647009],[-0.0007854082275083184,-0.0012380910148755632],[0,0],[0.0007576458506189605,-0.0010794867843077894],[0.006456610584304396,-0.009630982015705579],[0.0010356197841388025,-0.005135468443044105],[-0.009501185681733871,-0.024465368600491866],[-0.02138159377571458,-0.03699835684180916],[-0.006659213376344654,-0.010497359154929602],[0,0],[0.006423825478604843,-0.009152606990704807],[0.018685786501813923,-0.0324805074124277],[0.0013143364275099694,-0.020384210398915532]]}},"sneakers:L":{"dx":63,"dy":-40,"s":1,"r":0,"z":0,"o":100,"pad":true,"ops":[{"t":"erase","r":0.006666666666666667,"pts":[[0.3747,0.7577],[0.3769,0.7582],[0.3791,0.7593],[0.3812,0.7602],[0.3798,0.7584],[0.3769,0.7586],[0.3754,0.7606],[0.3776,0.7614],[0.3754,0.7602],[0.3732,0.7597],[0.371,0.7591],[0.3681,0.7586],[0.3659,0.7574],[0.3637,0.7559],[0.3659,0.757],[0.3681,0.7577],[0.3703,0.7584],[0.3725,0.7595],[0.3747,0.76],[0.3761,0.7618],[0.374,0.7607],[0.3718,0.7602],[0.3688,0.7597],[0.3659,0.759],[0.3637,0.7584],[0.3615,0.7575],[0.3594,0.7565],[0.3615,0.7558],[0.3652,0.7561],[0.3688,0.7567]]},{"t":"erase","r":0.006666666666666667,"pts":[[0.3718,0.7621],[0.3747,0.7625]]}],"mesh":{"d":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.0021775101072045873,0.00012045511093542851],[0.006103693752236497,0.0005324059748766736],[0.014009296118664142,0.0011588253640999573],[0.0015849314751147953,0.0001312163572608114],[0,0],[0,0],[0,0],[-0.022590670504413442,0.0006389557344445611],[0.010945671870457205,0.0024946388110737776],[0.053305957150026714,0.0036240412946883186],[0.014338632529077603,0.0010775485283591232],[0,0],[0,0],[0,0],[-0.07016475881106075,0.00022306601233315398],[-0.04739983651603079,0.0005600298801537438],[0.024207375600136125,0.0003237897582311064],[0.009220217430713237,-0.0001654608579290038],[0,0],[0,0],[0,0]]}},"sneakers:R":{"dx":110,"dy":-50,"s":1.04,"r":0,"z":0,"o":100,"ops":[{"t":"erase","r":0.03333333333333333,"pts":[[0.9364,0.7101],[0.9364,0.7225],[0.9386,0.7335],[0.943,0.7459],[0.9408,0.7583],[0.9364,0.7693],[0.9275,0.7776],[0.9164,0.7693],[0.9098,0.7597],[0.9009,0.7459],[0.8965,0.7294],[0.8965,0.7156],[0.8943,0.7046],[0.8987,0.717],[0.8965,0.728],[0.8965,0.7404]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.892,0.7542],[0.8943,0.7652],[0.8943,0.7776],[0.8943,0.7913]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.9009,0.7225],[0.9053,0.7362],[0.9076,0.75],[0.9098,0.7652],[0.9098,0.7803],[0.912,0.7955],[0.9142,0.8079]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.9053,0.7046],[0.8987,0.717],[0.8965,0.728],[0.892,0.7418],[0.8876,0.7569],[0.8876,0.7748],[0.8854,0.79],[0.8854,0.8037],[0.8898,0.7927],[0.8898,0.7734],[0.892,0.7555],[0.8943,0.739],[0.8943,0.7266],[0.9009,0.717]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.9031,0.7335],[0.9009,0.7473],[0.9009,0.761]]},{"t":"erase","r":0.03333333333333333,"pts":[[0.7491,0.4334],[0.7372,0.4483],[0.7372,0.4631],[0.7253,0.4779],[0.7134,0.5001],[0.7015,0.5149],[0.6895,0.5446],[0.6538,0.5964],[0.6419,0.626],[0.6181,0.6483],[0.6062,0.6705],[0.5943,0.7075],[0.5824,0.7223],[0.5824,0.7372],[0.5824,0.752],[0.5705,0.752],[0.5586,0.7668],[0.5467,0.7742],[0.5348,0.789],[0.5229,0.789],[0.511,0.7964],[0.4991,0.7964],[0.4753,0.8186],[0.4395,0.826],[0.4157,0.8409],[0.3443,0.8705],[0.2967,0.8779],[0.2491,0.8927],[0.1538,0.9149],[0.1181,0.9223],[0.0705,0.9372],[0.0348,0.9446],[-0.0009,0.9594],[-0.0247,0.9594],[-0.0128,0.952],[0.0348,0.9223],[0.1181,0.8853],[0.2134,0.8334],[0.3205,0.7816],[0.4276,0.7297],[0.5348,0.6779],[0.7253,0.589],[0.7848,0.552],[0.8443,0.5223],[0.8681,0.4927],[0.88,0.4779],[0.8919,0.4705],[0.88,0.4779],[0.8681,0.4779],[0.8562,0.4927],[0.8443,0.4927],[0.8324,0.5001],[0.8086,0.5075],[0.7967,0.5149],[0.7372,0.5446],[0.7134,0.5668],[0.6657,0.5964],[0.6181,0.626],[0.5229,0.6927],[0.4634,0.7297],[0.4157,0.7594],[0.3681,0.789],[0.3086,0.8186],[0.2967,0.826],[0.3086,0.8186],[0.3205,0.8038],[0.3324,0.7964]]},{"t":"erase","r":0.006666666666666667,"pts":[[0.6253,0.7523],[0.6229,0.7535],[0.6204,0.7548],[0.6229,0.7546],[0.6253,0.7535],[0.6277,0.7527],[0.6253,0.7531],[0.6229,0.7535],[0.6204,0.7541],[0.6196,0.7562],[0.6172,0.7566],[0.6148,0.7572],[0.6124,0.7576],[0.614,0.7556],[0.6164,0.7543],[0.614,0.7539],[0.6116,0.7546],[0.6092,0.7554],[0.6067,0.756],[0.6051,0.7576],[0.6075,0.758],[0.6108,0.7572],[0.614,0.7564],[0.6108,0.7564],[0.6083,0.7572],[0.6059,0.7582],[0.6051,0.7603],[0.6075,0.7599],[0.6116,0.7588],[0.6164,0.7576],[0.6196,0.757],[0.6172,0.7566],[0.614,0.7574],[0.6116,0.7584],[0.6092,0.7594],[0.6067,0.7601],[0.6043,0.7611],[0.6011,0.7623],[0.5979,0.7633],[0.5954,0.7643],[0.5946,0.7664]]},{"t":"erase","r":0.006666666666666667,"pts":[[0.2419,0.7548],[0.244,0.7555],[0.2469,0.7562],[0.2504,0.7572],[0.2532,0.7579],[0.2511,0.7572]]}],"pad":true,"mesh":{"d":[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[-0.0008761573722674212,7.737493677166644e-05],[-0.009127731640900291,0.0008030458495614827],[-0.015282144179024734,0.0013238206937407574],[-0.0016990866524259404,0.00014700966876116667],[0,0],[0,0],[0,0],[-0.008307559499325837,0.0003949025469584491],[-0.04242997142008197,0.000792381077234234],[-0.027962107491840513,0.00153200911042527],[-0.0010321268263858796,-0.00029702041775753424],[0,0],[0,0],[0,0],[-0.008328179215600647,-0.002136689707050556],[-0.008038901680417793,-0.008851691341050448],[0.06561087927094764,-0.01051837456716408],[0.05602471168638715,-0.006397811694266521]]}},"sneakers":{"dx":126,"dy":-17,"s":0.94,"r":0,"z":0,"o":100,"ops":[],"pad":true}},"f":{"hoodie":{"dx":71,"dy":-12,"s":1,"r":0,"z":0,"o":100,"ops":[],"pad":true,"mesh":{"d":[[-0.00030692917776689956,-0.0006349564946444798],[-0.002602349726663842,-0.0053835835103836485],[-0.00030692917776689956,-0.0006349564946444798],[0,0],[9.352865164154497e-05,0.0001384709907420228],[0.0007929981203007694,0.001174049165120579],[9.352865164154497e-05,0.0001384709907420228],[0.00118063129543844,-0.006757461471196621],[-0.03968552164488828,-0.024396684112157226],[-0.006418645451286451,-0.006247128809906288],[0,0],[0.0036923863211885967,0.0011048136697495655],[0.0269956787418422,0.002915844070473176],[0.0028993882008878273,-0.0006562600779313381],[-0.030242768537355857,-0.01735427458295021],[-0.10185159678753491,-0.02923000945294967],[-0.0499351063004316,-0.0018326760058359846],[-0.004375221313144223,2.9927601224895458e-05],[0.008417784873440217,-0.0053012998240323725],[0.105888119905793,0.005790662076763105],[0.02823693738803593,-0.002467808655519077],[-0.08604734408488036,-0.010335074894622452],[-0.06518019066147472,0.0009911743378780596],[-0.07859538910873895,0.02903027695542859],[-0.035726854667386655,0.002119641277313007],[-0.001077000121882115,-0.007420714048170481],[0.0698759218311769,-0.004109793038351106],[0.05346945459987252,0.02933500642475608],[-0.09698234951647623,0.056822322319724373],[-0.023001399899953538,0.05198663836323225],[-0.08000028771623319,0.04286433420329015],[0.006663251778312959,0.015669657314117853],[0.04889393487039864,-0.014555461386528603],[-0.0450579305709899,-0.053999853918667344],[0.038976935996230144,0.030503129297259294],[-0.11296750104371157,0.0837831255360937],[-0.04945337615899776,0.06674432587504434],[-0.0681138574847596,0.015045726342545467],[-8.478266459368763e-05,-0.0017153668406514513],[0.07926501939923697,-0.003970707982191502],[-0.024892015541944527,0.030034263485640277],[0.08937799358223107,0.04551083929382691],[-0.16437699350225946,0.13103847734845128],[-0.11821428216622133,0.13470518926465266],[-0.10150172057649523,0.035429858396838376],[0.028103965821541316,-0.01756407279326125],[0.16531461082327478,-0.028522117892613892],[0.058772837393240615,0.10756474798929863],[0.10281820195175102,0.10058392151728493]]}}}};
if (!Object.keys(FIT).length) FIT = JSON.parse(JSON.stringify(FITS_DEFAULT));
if (!FITS || !Object.keys(FITS).length) FITS = JSON.parse(JSON.stringify(FITS_DEFAULT));
// вивантаження підгонки в базу артефакта (працює лише всередині Claude; у Telegram тихо пропускається)
async function fitUpload() { try { if (!window.claude || !claude.use || !Object.keys(FITS || {}).length) return; const db = await claude.use('db'); if (!db) return; await db.doc('sync/fit').set({ fits: JSON.stringify(FITS), fit: JSON.stringify(FIT), ts: Date.now() }); } catch (e) { } }
setTimeout(fitUpload, 1500); setTimeout(() => { if (typeof schedUp === 'function') stateUpload(); }, 2500);
const FSRC = () => (cur().name === 'fit' ? FIT : FITS);
const FIT0 = { dx: 0, dy: 0, s: 1, r: 0, z: 0, o: 100 };
const defOf = (g, key) => { const w = WEAR[key.split(':')[0]]; return w && w.layer && w.layer[g] && w.def ? w.def : {}; };
const fitOf = (g, key) => Object.assign({}, FIT0, defOf(g, key), (FSRC()[g] || {})[key] || {});
const fitEnt = (g, key) => ((FIT[g] = FIT[g] || {})[key] = (FIT[g] || {})[key] || {});
const IMGC = {}, BAKE = {};
const PADF = 0.25, MESHN = 6;
const hasEdit = e => !!(e && ((e.ops && e.ops.length) || e.mesh || e.pad));
function drawTri(x, im, s0, s1, s2, d0, d1, d2) {
  const det = (s1[0] - s0[0]) * (s2[1] - s0[1]) - (s2[0] - s0[0]) * (s1[1] - s0[1]); if (Math.abs(det) < 1e-6) return;
  const A = ((d1[0] - d0[0]) * (s2[1] - s0[1]) - (d2[0] - d0[0]) * (s1[1] - s0[1])) / det, B = ((d1[1] - d0[1]) * (s2[1] - s0[1]) - (d2[1] - d0[1]) * (s1[1] - s0[1])) / det,
    C = ((d2[0] - d0[0]) * (s1[0] - s0[0]) - (d1[0] - d0[0]) * (s2[0] - s0[0])) / det, D = ((d2[1] - d0[1]) * (s1[0] - s0[0]) - (d1[1] - d0[1]) * (s2[0] - s0[0])) / det;
  const E = d0[0] - A * s0[0] - C * s0[1], F = d0[1] - B * s0[0] - D * s0[1];
  const cx = (d0[0] + d1[0] + d2[0]) / 3, cy = (d0[1] + d1[1] + d2[1]) / 3, ex = q => { const vx = q[0] - cx, vy = q[1] - cy, l = Math.hypot(vx, vy) || 1; return [q[0] + vx / l * 0.8, q[1] + vy / l * 0.8]; };
  x.save(); x.beginPath(); [d0, d1, d2].map(ex).forEach((q, k) => k ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); x.closePath(); x.clip();
  x.setTransform(A, B, C, D, E, F); x.drawImage(im, 0, 0); x.restore();
}
const meshG = i => (PADF + i / MESHN) / (1 + 2 * PADF);
function bake(im, ent) {
  const w0 = im.naturalWidth, h0 = im.naturalHeight, W = Math.round(w0 * (1 + 2 * PADF)), H = Math.round(h0 * (1 + 2 * PADF));
  let c = document.createElement('canvas'); c.width = W; c.height = H; let x = c.getContext('2d'); x.drawImage(im, Math.round(w0 * PADF), Math.round(h0 * PADF));
  if (ent.mesh) {
    const o = document.createElement('canvas'); o.width = W; o.height = H; const ox = o.getContext('2d'), n = MESHN, d = ent.mesh.d;
    const S = (i, j) => [meshG(i) * W, meshG(j) * H], T = (i, j) => { const q = d[j * (n + 1) + i] || [0, 0]; return [(meshG(i) + q[0]) * W, (meshG(j) + q[1]) * H]; };
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      drawTri(ox, c, S(i, j), S(i + 1, j), S(i, j + 1), T(i, j), T(i + 1, j), T(i, j + 1));
      drawTri(ox, c, S(i + 1, j), S(i + 1, j + 1), S(i, j + 1), T(i + 1, j), T(i + 1, j + 1), T(i, j + 1));
    }
    c = o; x = ox;
  }
  (ent.ops || []).forEach(o => {
    if (o.t === 'erase') {
      x.globalCompositeOperation = 'destination-out';
      o.pts.forEach(([u, v]) => { const rr = Math.max(1, o.r * W), g = x.createRadialGradient(u * W, v * H, rr * 0.55, u * W, v * H, rr); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.beginPath(); x.arc(u * W, v * H, rr, 0, 7); x.fill(); });
      x.globalCompositeOperation = 'source-over';
    }
  });
  return c.toDataURL();
}
function spriteURL(img, ent) {
  const orig = { url: `img/${img}.png`, pad: 0 }; if (!hasEdit(ent)) return orig;
  const im = IMGC[img] = IMGC[img] || Object.assign(new Image(), { src: orig.url });
  if (!im.complete || !im.naturalWidth) { im.onload = () => { if (cur().name === 'fit') fitRefresh(); else render(); }; return orig; }
  const k = img + JSON.stringify([ent.ops, ent.mesh]);
  if (!BAKE[k]) { if (Object.keys(BAKE).length > 80) for (const q in BAKE) delete BAKE[q]; try { BAKE[k] = bake(im, ent); } catch (e) { BAKE[k] = null; } }
  return BAKE[k] ? { url: BAKE[k], pad: PADF, im } : orig;
}
function fitSave() { try { localStorage.setItem('pm_fit', JSON.stringify(FIT)); } catch (e) { } }
const fitDirty = () => JSON.stringify(FIT) !== JSON.stringify(FITS);
function fitCommit() { FITS = JSON.parse(JSON.stringify(FIT)); try { localStorage.setItem('pm_fit_saved', JSON.stringify(FITS)); } catch (e) { } fitUpload(); toast('💾 Збережено. Тепер так одягається в усій грі'); render(); }
function fitRevert() { FIT = JSON.parse(JSON.stringify(FITS)); fitSave(); render(); }
function doll(height, gender, equipped) {
  const g = gender || S.gender, A = ANCH[g], eq = equipped || S.equipped;
  const W = A.W, k = height / 900;
  let html = `<div class="doll" style="width:${W * k}px;height:${height}px"><img src="img/hero_${g}.png" style="left:0;top:0;width:100%;height:100%">`;
  ZORD.forEach((slot, zi) => {
    const id = eq[slot]; if (!id) return;
    const it = WEAR[id];
    const put = (a, img, key) => {
      const f = fitOf(g, key), su = spriteURL(img, (FSRC()[g] || {})[key]);
      let l = a[0] + f.dx, t = a[1] + f.dy, w = a[2], h = a[3], sty = '';
      if (su.pad) { const h0 = h || w * su.im.naturalHeight / su.im.naturalWidth; l -= su.pad * w; t -= su.pad * h0; w *= 1 + 2 * su.pad; h = h0 * (1 + 2 * su.pad); }
      html += `<img data-k="${key}" src="${su.url}" style="opacity:${f.o / 100};z-index:${10 + zi * 10 + f.z};left:${l * k}px;top:${t * k}px;width:${w * k}px;${h ? 'height:' + h * k + 'px;' : ''}transform:rotate(${f.r}deg) scale(${f.s});transform-origin:50% 50%">`;
    };
    if (slot === 'feet' && it.layer && it.layer[g]) { const ls = [].concat(it.layer[g]); if (ls.length > 1) { put([0, 0, W, 900], ls[0], id + ':L'); put([0, 0, W, 900], ls[1], id + ':R'); } else put([0, 0, W, 900], ls[0], id); }
    else if (slot === 'feet') { put(A.feetL, 'shoeL', id + ':L'); put(A.feetR, 'shoeR', id + ':R'); }
    else put(A[slot], it.img, id);
  });
  return html + '</div>';
}

// ---------- ЕКРАНИ ----------
const SCREENS = {};

SCREENS.create = p => {
  const g = p.g || 'm';
  return `<h2>ОБЕРИ СТАТЬ ТА ІМ'Я</h2><div class="small" style="text-align:center">Почни свою історію на тропічному узбережжі</div>
  <div class="bar" style="justify-content:center;margin:8px 0">
    <div style="opacity:${g === 'm' ? 1 : .4}" onclick="setP('g','m')">${doll(260, 'm', {})}</div>
    <div style="opacity:${g === 'f' ? 1 : .4}" onclick="setP('g','f')">${doll(260, 'f', {})}</div>
  </div>
  <div class="bar" style="justify-content:center"><button class="${g === 'm' ? 'sel' : ''}" onclick="setP('g','m')">♂ ЧОЛОВІК</button><button class="${g === 'f' ? 'sel' : ''}" onclick="setP('g','f')">♀ ЖІНКА</button></div>
  <div class="box"><div>Введи своє ім'я</div><input id="nm" placeholder="Наприклад: Максим" style="width:100%" value="${p.n || ''}"></div>
  <button class="y" style="width:100%;padding:12px" onclick="createHero('${g}')">ПРОДОВЖИТИ ▶</button>`;
};
function createHero(g) {
  const n = $('nm').value.trim(); if (n.length < 2) return toast('Введи ім\'я (мін. 2 літери)');
  S.name = n; S.gender = g; S.created = true; home();
}

// --- ШВИДКИЙ ДОСТУП: гравець сам обирає кнопки в правому стовпчику головного екрана
const QA = {
  shop: ['🛒 Магазин', 'shop'], auction: ['🏪 Аукціон', 'market', { tab: 'buy' }], market: ['📈 Ринок', 'market'], club: ['🎰 Ігровий клуб', 'club'],
  group: ['👥 Групування', 'group'], races: ['🏁 Гонки', 'races'], grace: ['🏁 Груп. заїзд', 'races', { rt: 'group' }], jobs: ['💼 Робота', 'jobs'], sh: ['🧥 Секонд-хенд', 'secondhand'],
  bv: ['🧵 Баба Валя', 'bv'], season: ['🏆 Сезон', 'season'], boss: ['💀 Наліт', 'raidBoss'], dist: ['🏙 Райони', 'district'], inv: ['🎒 Інвентар', 'inventory'], ward: ['👕 Гардероб', 'wardrobe'], garage: ['🔧 Гараж', 'garage'],
  prof: ['👤 Профіль', 'profile']
};
const QA_MAX = 6;
const qaKey = side => side === 'L' ? 'qaL' : 'qa';
const qaList = side => (S[qaKey(side || 'R')] || []).filter(k => QA[k]);
function qaGo(k) { go(QA[k][1], QA[k][2] ? { ...QA[k][2] } : {}); }
function qaToggle(k, side) {
  const l = qaList(side), i = l.indexOf(k), other = side === 'L' ? 'R' : 'L';
  if (i >= 0) l.splice(i, 1); else {
    if (l.length >= QA_MAX) return toast('Максимум ' + QA_MAX + ' кнопок. Зніми якусь');
    l.push(k); S[qaKey(other)] = qaList(other).filter(x => x !== k); // розділ тримаємо лише з одного боку
  }
  S[qaKey(side)] = l; qaPick(side); render();
}
function qaPick(side) {
  side = side || 'R'; const l = qaList(side);
  modal(`<h3>⚡ Швидкий доступ (${side === 'L' ? 'ліворуч' : 'праворуч'})</h3><div class="small">Обери до ${QA_MAX} розділів (${l.length}/${QA_MAX}). Натисни ще раз, щоб прибрати. Якщо розділ уже з іншого боку, він перейде сюди.</div>
  <div class="grid g2" style="margin-top:6px">${Object.keys(QA).map(k => `<button class="${l.includes(k) ? 'y' : ''}" onclick="qaToggle('${k}','${side}')">${l.includes(k) ? '✓ ' : ''}${QA[k][0]}</button>`).join('')}</div>
  <button style="width:100%;margin-top:6px" onclick="closeModal()">Готово</button>`);
}
SCREENS.season = seasonScreen;
SCREENS.home = () => {
  const unread = S.mail.filter(m => m.box === 'in' && (!m.read || m.gift)).length, cu = chTotal();
  after.push(() => {
    if (!S.tut) setTimeout(showTut, 500);
    const box = $('homeBox'); if (!box) return;
    const Hh = Math.max(300, $('app').clientHeight - 14), oc = cur().p.chat; box.style.height = (Hh + 12) + 'px';
    const hh = Math.round((Hh - 70) * 0.9); $('homeDoll').innerHTML = `<div style="position:relative;display:inline-block"><div style="position:absolute;left:6%;right:6%;bottom:-6px;height:${Math.round(hh * 0.035)}px;background:radial-gradient(ellipse,rgba(10,0,20,.85),rgba(0,0,0,0) 70%);filter:blur(2px)"></div><div style="position:relative;filter:drop-shadow(0 0 6px rgba(255,120,60,.35))">${doll(hh)}</div></div>`; $('homeDoll').style.top = (oc ? 8 : Math.round(Hh - 44 - hh * 0.97)) + 'px';
  });
  return `<div id="homeBox" style="position:relative;background:url(img/home_bg.jpg) center bottom/cover no-repeat;border-radius:0;overflow:hidden;margin:-6px -6px 0">
    <div class="side" style="position:absolute;left:8px;top:12px;z-index:3">
      <button onclick="go('mail')">✉️ Пошта${unread ? `<span class="badge">${unread}</span>` : ''}</button>
      <button onclick="go('tasks')">☑ Завдання${dot(N.tasks())}</button>
      <button onclick="go('events')">🏆 Події</button>
      <button onclick="chatGo()">${lockOf('chat') ? '🔒' : '💬'} Чат${cu ? `<span class="badge">${cu}</span>` : ''}</button>
      <button class="y" onclick="qaPick('L')" style="font-size:11px"><span style="filter:brightness(.25)">⚡</span> Швидкий доступ</button>
      ${qaList('L').map(k => `<button onclick="qaGo('${k}')">${lockOf(QA[k][1]) ? '🔒 ' : ''}${QA[k][0]}</button>`).join('')}
    </div>
    <div style="position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse 85% 75% at 50% 50%,rgba(0,0,0,0) 55%,rgba(8,0,16,.55) 100%)"></div>
    <div id="homeDoll" style="position:absolute;left:0;right:0;top:0;text-align:center;z-index:2"></div>
    <div class="side" style="position:absolute;right:8px;top:12px;z-index:3">
      <button onclick="go('settings')">⚙</button>
      <button onclick="go('rewards')">🎁 Нагороди${dot(N.login())}</button>
      <button class="y" onclick="qaPick('R')" style="font-size:11px"><span style="filter:brightness(.25)">⚡</span> Швидкий доступ</button>
      ${qaList('R').map(k => `<button onclick="qaGo('${k}')">${lockOf(QA[k][1]) ? '🔒 ' : ''}${QA[k][0]}</button>`).join('')}
    </div>
    ${false ? '' : `<button class="play" style="position:absolute;left:12px;right:12px;bottom:12px;padding:14px;font-size:22px;z-index:3" onclick="go('play')">ГРАТИ ▶${dot(N.bonus())}</button>`}
  ${cur().p.chat ? `<div style="position:absolute;left:0;right:0;bottom:0;height:56%;z-index:6;overflow:auto;background:rgba(18,12,26,.96);border-top:2px solid #d8b25a;padding:6px;color:#eee">${chatPanel(cur().p, true)}</div>` : ''}</div>`;
};


const QA_D = { boss: 'Боси, рейди, рейтинг шкоди', dist: 'Атака на райони, 12 етапів', club: 'Слоти, покер, клубний день', slots: 'Барабани удачі за фішки', poker: 'Столи 10 / 50 / 500 / 1000 фішок', races: 'Траси, старт, нагороди', grace: 'Командні заїзди 5×5', jobs: 'Секонд-хенд, перекуп авто', sh: 'Завезення, полиці, зміни', market: 'Купити / продати, графіки цін', auction: 'Лоти гравців і біржа', shop: 'Кристали, золото, підписки', bv: 'Прошивка речей: ранг D…A++', season: 'Нагороди за активність, 30 рівнів', group: 'Твоя група, внески, гілки', inv: 'Твої речі', ward: 'Одяг і набори', garage: 'Авто, тюнінг, ремонт', weap: 'Зброя для боса', prof: 'Герой, досягнення' };
const PLAY_EXTRA = [['✉ Пошта', 'mail', 'Листи й подарунки'], ['☑ Завдання', 'tasks', 'Щоденні, тижневі, досягнення'], ['🏆 Події', 'events', 'Події та турніри'], ['🎁 Нагороди', 'rewards', 'Щоденний вхід, подарунки'], ['⚙ Налаштування', 'settings', 'Звук, мова, розробник']];
SCREENS.play = () => {
  const row = (label, scr, d, onclick, dotH) => { const lk = lockOf(scr); return `<div class="row" style="position:relative" onclick="${onclick}">${dotH || ''}<div class="f"><b>${lk ? '🔒 ' : ''}${label}</b><div class="small">${lk || d}</div></div><button class="${lk ? 'dis' : 'y'}">${lk ? '🔒' : '▶'}</button></div>`; };
  const bk = `<button class="y" style="width:100%;padding:12px;margin:4px 0" onclick="home()">◀ Назад у меню</button>`;
  return bk + `<h2>ГРАТИ: усі розділи</h2><button style="width:100%;margin:4px 0" onclick="showUnlocks()">📋 Що коли відкривається</button><div class="small">Тут усі вкладки гри. Найчастіші можна винести на головний екран у «⚡ Швидкий доступ» (по 6 з кожного боку).</div>
  ${Object.keys(QA).map(k => row(QA[k][0], QA[k][1], QA_D[k] || '', `qaGo('${k}')`, k === 'club' ? dot(N.bonus()) : '')).join('')}
  ${PLAY_EXTRA.map(([l, scr, d]) => row(l, scr, d, `go('${scr}')`)).join('')}` + bk;
};

// --- ПОШТА
SCREENS.mail = p => {
  const t = p.tab || 'in';
  const list = S.mail.filter(m => m.box === t);
  return `<h2>✉ Пошта</h2>${tabs([['in', 'Вхідні'], ['sent', 'Надіслані'], ['arch', 'Архів']], t, 'tab', { in: N.mailIn() })}
  ${list.length ? '' : '<div class="box small">Порожньо</div>'}
  ${list.map(m => `<div class="row" style="position:relative;${m.read ? '' : 'font-weight:bold'}" onclick="openMail(${m.id})">${m.gift || !m.read ? DOT : ''}
    <div class="f">${m.read ? '' : '🔴 '}${m.from}<div>${m.t}</div><div class="small">${m.body.slice(0, 40)}…</div></div>
    <div class="small">${m.when}<br>${m.gift ? '🎁' : '»'}</div></div>`).join('')}
  <div class="bar sp"><button onclick="S.mail.forEach(m=>m.read=true);render()">☑ Позначити всі</button>
  <button onclick="S.mail.filter(m=>m.read&&m.box==='in'&&!m.gift).forEach(m=>m.box='arch');render()">🗑 Видалити прочитані (в архів)</button></div>`;
};
function openMail(id) {
  const m = S.mail.find(x => x.id === id); m.read = true; render();
  modal(`<h3>${m.from}</h3><b>${m.t}</b><p>${m.body}</p><div class="small">${m.when}</div>
    ${m.gift ? `<button class="y" onclick="claimMail(${m.id})">Забрати: ${Object.entries(m.gift).map(([k, v]) => v + ' ' + curName(k)).join(', ')}</button>` : ''}
    ${m.act === 'group' && !S.group.member ? `<button class="g" onclick="joinClan('Miami Syndicate');closeModal();toast('Ви в групуванні Miami Syndicate');go('group')">Прийняти запрошення</button>` : ''}
    ${m.act === 'races' ? `<button onclick="closeModal();go('races')">До гонок</button>` : ''}`);
}
function claimMail(id) { const m = S.mail.find(x => x.id === id); bump('mailGifts'); give(m.gift, 'Пошта'); delete m.gift; S.daily.collect++; closeModal(); render(); }
function sendMail(from, t, body, gift) { S.mail.unshift({ id: Date.now() + Math.random(), from, t, body, when: 'Щойно', gift, read: false, box: 'in' }); }

// --- ЗАВДАННЯ
function dailyList() {
  const d = S.daily;
  return [
    { k: 'fights', t: 'Проведи 3 бої', v: d.fights, goal: 3, r: { money: 5000 }, go: 'raidBoss' },
    { k: 'raids', t: 'Виконай 2 рейди', v: d.raids, goal: 2, r: { crystals: 8 }, go: 'district' },
    { k: 'market', t: 'Здійсни 1 покупку на ринку', v: d.market, goal: 1, r: { money: 10000 }, go: 'market' },
    { k: 'donate', t: 'Зроби внесок у групування', v: d.donate, goal: 1, r: { money: 5000 }, go: 'group' },
    { k: 'casino', t: 'Зіграй у клубі 1 раз', v: d.casino, goal: 1, r: { chips: 100 }, go: 'club' },
    { k: 'collect', t: 'Збери 3 нагороди', v: d.collect, goal: 3, r: { crystals: 4 }, go: 'mail' },
  ];
}
function weekList() {
  const w = S.week;
  return [
    { k: 'fights', t: 'Проведи 20 боїв', v: w.fights, goal: 20, r: { money: 20000 }, go: 'raidBoss' },
    { k: 'raids', t: 'Виконай 10 рейдів', v: w.raids, goal: 10, r: { crystals: 15 }, go: 'district' },
    { k: 'races', t: 'Візьми участь у 5 гонках', v: w.races, goal: 5, r: { gold: 2 }, go: 'races' },
    { k: 'bags', t: 'Відкрий 5 завезень', v: w.bags, goal: 5, r: { money: 15000 }, go: 'jobs' },
  ];
}
function achList() {
  const a = S.ach;
  return [
    { k: 'bossKills', t: 'Переможи 3 босів', v: a.bossKills, goal: 3, r: { gold: 30 }, go: 'raidBoss' },
    { k: 'bags', t: 'Відкрий 20 завезень', v: a.bags, goal: 20, r: { crystals: 300 }, go: 'secondhand' },
    { k: 'raceWins', t: 'Виграй 10 гонок', v: a.raceWins, goal: 10, r: { gold: 25 }, go: 'races' },
    { k: 'pokerWins', t: 'Виграй 5 роздач у покер', v: a.pokerWins, goal: 5, r: { crystals: 200 }, go: 'poker' },
  ];
}
SCREENS.tasks = p => {
  const t = p.tab || 'day';
  if (t === 'ach') return `<h2>☑ Завдання</h2>${tabs([['day', 'Щоденні'], ['week', 'Тижневі'], ['season', 'Сезонні'], ['ach', '🏅 Досягнення']], t, 'tab', { day: N.day(), week: N.week(), season: N.season(), ach: N.ach() })}` + achTab(p);
  const src = { day: [dailyList(), S.daily], week: [weekList(), S.week], season: [weekList().map(x => ({ ...x, goal: x.goal * 4, k: 's_' + x.k })), S.week], ach: [achList(), S.ach] }[t];
  const [list, store] = src;
  const doneN = dailyList().filter(x => S.daily.claimed[x.k]).length;
  return `<h2>☑ Завдання</h2>${tabs([['day', 'Щоденні'], ['week', 'Тижневі'], ['season', 'Сезонні'], ['ach', 'Досягнення']], t, 'tab', { day: N.day(), week: N.week(), season: N.season(), ach: N.ach() })}
  ${t === 'day' ? `<div class="box"><div class="bar sp"><b>Щоденний прогрес</b><span>Виконано: ${doneN} / 6</span></div><div class="prog"><i style="width:${doneN / 6 * 100}%"></i></div></div>` : ''}
  ${t === 'season' ? '<div class="note">Сезонні = тижневі ×4 (заглушка)</div>' : ''}
  ${list.map(x => {
    const ok = x.v >= x.goal, cl = store.claimed[x.k];
    return `<div class="row" style="position:relative">${ok && !cl ? DOT : ''}<div class="f"><b>${x.t}</b><div class="prog"><i style="width:${Math.min(1, x.v / x.goal) * 100}%"></i></div><span class="small">${Math.min(x.v, x.goal)} / ${x.goal} · нагорода: ${Object.entries(x.r).map(([k, v]) => fmt(v) + ' ' + curName(k)).join(', ')}</span></div>
    ${cl ? '<button class="g" disabled>✓ Виконано</button>' : ok ? `<button class="y" onclick="claimTask('${t}','${x.k}')">Забрати</button>` : `<button onclick="go('${x.go}')">Перейти ›</button>`}</div>`;
  }).join('')}
  ${t === 'day' ? `<div class="box" style="position:relative">${doneN >= 6 && !S.daily.chest ? DOT : ''}<b>Нагорода за всі щоденні завдання</b><div>30 000 💵 · 20 💎 · +10 до бонус-прогресу слотів</div>
    <button class="${doneN >= 6 && !S.daily.chest ? 'y' : 'dis'}" onclick="claimDailyChest()">${S.daily.chest ? 'Отримано' : 'Отримати'}</button></div>` : ''}`;
};
function claimTask(t, k) {
  const list = { day: dailyList(), week: weekList(), season: weekList().map(x => ({ ...x, goal: x.goal * 4, k: 's_' + x.k })), ach: achList() }[t];
  const store = { day: S.daily, week: S.week, season: S.week, ach: S.ach }[t];
  const x = list.find(i => i.k === k); if (!x || x.v < x.goal) return;
  store.claimed[k] = true; bump('tasks'); give(x.r, 'Завдання'); if (t !== 'day') S.daily.collect++; render();
}
function claimDailyChest() {
  if (S.daily.chest) return; if (Object.keys(S.daily.claimed).length < 6) return toast('Спочатку виконай всі 6 завдань');
  S.daily.chest = true; bump('dailyChests'); give({ money: 30000, crystals: 20 }, 'Скриня'); render();
}

// --- ПОДІЇ
SCREENS.events = () => `<h2>🏆 Події</h2>
  ${[['Вуличні перегони', 'Гонки на Прибережній трасі. Подвійні нагороди.', 'races', '2 дн 4 год'], ['Рейд на Даунтаун', 'Захопи район за 12 етапів.', 'district', '5 дн'],
    ['Турнір покеру', 'Шлях гравця: дійди до 10 рівня.', 'poker', '1 дн 12 год'], ['Бос тижня: Дон Карло', 'Подвійна шкода по босу.', 'raidBoss', '3 дн']]
    .map(([t, d, g, tm]) => `<div class="row"><div class="f"><b>${t}</b><div class="small">${d}</div><div class="small">⏱ ${tm}</div></div><button class="y" onclick="go('${g}')">Взяти участь</button></div>`).join('')}`;

// --- ГРУПУВАННЯ
/*CLAN*/
// --- РОЗВИТОК КЛАНУ: 3 гілки по 12 вузлів, 1 очко за рівень клану (макс. рівень 30, тож усі гілки не вивчити)
const CLAN_MAX = 100;
const CT_STAGES = {
  race: ['Гараж', 'Підпільні заїзди', 'Тюнінг-цех', 'Нічні траси', 'Піт-команда', 'Спонсорські контракти', 'Чемпіонат міста', 'Заводська команда', 'Світова ліга', 'Легенда траси'],
  fight: ['Двір', 'Вуличні бійки', 'Зброярня', 'Розвідка', 'Штурмова група', 'Мисливці на босів', 'Піхота району', 'Спецзагін', 'Армія клану', 'Володарі міста'],
  trade: ['Лоток', 'Знайомства', 'Склад', 'Торгова точка', 'Оптові закупівлі', 'Зв\'язки в мерії', 'Біржова команда', 'Торговий дім', 'Монополія', 'Король ринку'],
};
function ctBuild(b) {
  const nodes = [];
  for (let i = 1; i <= 50; i++) {
    const st = CT_STAGES[b][Math.floor((i - 1) / 5)], k = (i - 1) % 5 + 1, ms = i % 10 === 0; let e;
    if (b === 'race') e = ms ? { raceRew: 2, raceSpd: 1 } : (i % 3 === 2 ? { raceSpd: 0.25 } : { raceRew: 0.4 });
    else if (b === 'fight') e = ms ? { bossDmg: 2, raidRew: 2 } : (i % 2 ? { bossDmg: 0.4 } : { raidRew: 0.4 });
    else e = ms ? { fee: 1, jobInc: 3 } : i % 10 === 5 ? { lim: 1 } : i % 10 === 2 ? { ord: 1 } : (i === 22 || i === 42) ? { shifts: 1 } : (i % 2 ? { fee: 0.1 } : { jobInc: 0.5 });
    nodes.push([(ms ? '★ ' : '') + st + ' · ' + k, e]);
  }
  return nodes;
}
const CT = { race: { n: '🏁 Гонщики', c: 'Швидкість і нагороди гонок', nodes: ctBuild('race') }, fight: { n: '💥 Бійці', c: 'Шкода по босах і нагороди рейдів', nodes: ctBuild('fight') }, trade: { n: '💼 Торговці', c: 'Комісія, ліміти, слоти, підробіток', nodes: ctBuild('trade') } };
const CT_LBL = { raceSpd: '% швидкості в гонках', raceRew: '% нагород гонок', bossDmg: '% шкоди по босах', raidRew: '% нагород рейдів', fee: ' п.п. менша комісія аукціону', lim: ' до ліміту купівель/продажів на товар', ord: ' слот для лотів', jobInc: '% до заробітку на підробітку', shifts: ' зміна підробітку на день' };
const r1 = v => +v.toFixed(2);
const ctTxt = e => Object.entries(e).map(([k, v]) => '+' + r1(v) + CT_LBL[k]).join(', ');
function ctSum(b) { const o = {}; gTree()[b].forEach(i => { const e = CT[b].nodes[i][1]; for (const k in e) o[k] = (o[k] || 0) + e[k]; }); return o; }
function gTree() { const g = S.group; if (!g.tree) g.tree = {}; ['race', 'fight', 'trade'].forEach(k => { const v = g.tree[k]; if (typeof v === 'number') g.tree[k] = Array.from({ length: v }, (_, i) => i); else if (!v) g.tree[k] = []; }); return g.tree; }
const gSpent = () => { const t = gTree(); return t.race.length + t.fight.length + t.trade.length; };
const gFree = () => Math.max(0, S.group.lvl - 1 - gSpent());
const clanBase = () => S.group.member ? Math.min(10, 0.1 * S.group.lvl) : 0; // % до нагород від самого рівня клану
function clanEff(key) {
  if (!S.group.member) return 0; const t = gTree(); let v = 0;
  for (const b in CT) t[b].forEach(i => { const e = CT[b].nodes[i] && CT[b].nodes[i][1]; if (e && e[key]) v += e[key]; });
  return v;
}
const clanMul = key => 1 + (clanEff(key) + (['raceRew', 'raidRew', 'jobInc'].includes(key) ? clanBase() : 0)) / 100;
const clanFee = () => S.group.member ? clanEff('fee') + Math.min(1, 0.01 * S.group.lvl) : 0;
function learnNode(b, i) {
  if (!S.group.owner) return toast('Розвиток обирає лише лідер клану');
  const t = gTree(); if (t[b].includes(i)) return; if (gFree() < 1) return toast('Немає вільних очок. Очко дається за кожен рівень клану');
  t[b].push(i); bump('nodes'); bump('node' + b[0].toUpperCase() + b.slice(1)); toast('Вивчено: ' + CT[b].nodes[i][0]); render();
}
function resetTree() { if (!S.group.owner) return; if (!pay('crystals', 50)) return; S.group.tree = { race: [], fight: [], trade: [] }; toast('Гілки скинуто'); render(); }
const CT_IC = { raceRew: '💰', raceSpd: '🏎', bossDmg: '💥', raidRew: '🎁', fee: '📉', jobInc: '💼', lim: '📦', ord: '🏷', shifts: '⏱' };
function ctSel(b, i) { cur().p.ts = [b, i]; render(); }
function clanTreeUI() {
  const g = S.group, t = gTree(), sel = cur().p.ts;
  let h = `<div class="box"><b>Очки розвитку: ${gFree()}</b> <span class="small">(1 очко за рівень клану, зараз ${g.lvl} з ${CLAN_MAX})</span><div class="small">${g.owner ? 'Три окремі гілки. Тисни на будь-яку іконку в будь-якій гілці й вивчай у будь-якому порядку, один вузол = 1 очко. Кожен дає трохи, ★ більше. Усі 150 вузлів за 99 очок не вивчити.' : 'Розвиток обирає лідер клану, а бонус отримують усі учасники. Тисни на іконки, щоб подивитись.'}</div>
  <div class="small">🎖 За рівень клану для всіх: +${r1(clanBase())}% до нагород, −${r1(Math.min(1, 0.01 * g.lvl))} п.п. комісії.</div></div>`;
  if (sel) {
    const [b, i] = sel, B = CT[b], n = B.nodes[i], done = t[b].includes(i);
    h += `<div class="box" style="background:#fffbe0;position:sticky;top:0;z-index:5"><b>${B.n}: ${n[0]}</b><div>${ctTxt(n[1])}</div>
    <div class="small">${done ? '✓ вивчено' : 'не вивчено'} · гілка зараз дає: ${t[b].length ? ctTxt(ctSum(b)) : 'нічого'}</div>
    ${g.owner && !done ? `<button class="${gFree() ? 'y' : 'dis'}" style="margin-top:3px" onclick="learnNode('${b}',${i})">Вивчити за 1 очко</button>` : ''}</div>`;
  }
  h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">' + Object.keys(CT).map(b => {
    const B = CT[b], rows = B.nodes.map((n, i) => {
      const ms = n[0][0] === '★', done = t[b].includes(i), on = sel && sel[0] === b && sel[1] === i;
      return `<button onclick="ctSel('${b}',${i})" style="position:relative;z-index:1;height:38px;padding:0;font-size:18px;line-height:1;border:${on ? '3px solid #000' : ms ? '2px solid #d90' : '1px solid #888'};background:${done ? '#9be39b' : '#fff'}">${CT_IC[Object.keys(n[1])[0]]}${ms ? '<span style="position:absolute;left:1px;top:-1px;font-size:9px">★</span>' : ''}</button>`;
    }).join('');
    return `<div><div class="box" style="margin:0 0 6px;text-align:center;padding:6px 2px;border-width:2px"><b style="font-size:12px">${B.n}</b><div class="small">${t[b].length}/${B.nodes.length}</div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;position:relative;padding:2px 0;background:linear-gradient(#000,#000) center/3px 100% no-repeat">${rows}</div></div>`;
  }).join('') + '</div>';
  return h + (g.owner ? `<button style="margin-top:6px" onclick="resetTree()">Скинути всі гілки (50 💎)</button>` : '');
}
const GCUR = { money: ['💵', 'Гроші', 1000], crystals: ['💎', 'Кристали', 1], gold: ['🟡', 'Золоті прикраси', 5] }; // [іконка, назва, к-сть за 1 очко]
const gNeed = () => S.group.lvl * 150;
function gPts(c, n) { return Math.floor(n * (c === 'gold' ? 12 : c === 'crystals' ? 2.5 : 0.001) * 10) / 10; }
SCREENS.group = p => {
  const g = S.group;
  if (!g.member) return `<h2>👥 Групування</h2><div class="box">Ви не в групуванні.</div>
    <div class="row"><div class="f"><b>Miami Syndicate</b><div class="small">Рівень 3 · 24/30 учасників</div></div><button class="y" onclick="joinClan('Miami Syndicate')">Вступити</button></div>
    <div class="row"><div class="f"><b>Vice Kings</b><div class="small">Рівень 5 · 30/30</div></div><button disabled>Повне</button></div>
    <div class="box"><b>Створити своє групування</b><div class="small">Вартість: <b>500 💎</b> (у вас ${fmt(S.crystals)} 💎). Ви станете лідером.</div>
    <div class="bar" style="margin-top:4px"><input id="cn" placeholder="Назва клану (3-20 літер)" maxlength="20" style="flex:1" value="${p.cname || ''}" oninput="cur().p.cname=this.value"><button class="y" onclick="createClan()">Створити за 500 💎</button></div></div>`;
  const gt = p.gt || 'don';
  const head = `<h2>👥 ${g.name || 'Групування'}</h2><div class="box">Рівень групування: ${g.lvl}${g.lvl >= CLAN_MAX ? ' (макс.)' : ''}${g.owner ? ' · ви лідер 👑' : ''}<div class="prog"><i style="width:${Math.min(100, g.prog / gNeed() * 100)}%"></i></div><span class="small">${fmt(g.prog)} / ${fmt(gNeed())} очок до наступного рівня</span></div>${tabs([['don', 'Внески'], ['tree', '🌳 Розвиток'], ['mem', 'Учасники']], gt, 'gt', { tree: g.owner && gFree() > 0 })}`;
  if (gt === 'tree') return head + clanTreeUI();
  if (gt === 'mem') return head + gMembers() + `<button onclick="leaveClan()">${g.owner ? 'Розпустити клан' : 'Вийти з групування'}</button>`;
  const c = p.dc || 'money', have = S[c], amt = Math.max(0, Math.floor(p.amt ?? Math.min(have, c === 'money' ? 10000 : 10)));
  const pts = gPts(c, Math.min(amt, have));
  return head + `
  <div class="box"><b>Внесок у клан</b>
    <div class="tabs">${Object.entries(GCUR).map(([k, v]) => `<button class="${c === k ? 'y' : ''}" onclick="cur().p.dc='${k}';cur().p.amt=undefined;render()">${v[0]} ${v[1]}</button>`).join('')}</div>
    <div class="small">У вас: <b>${fmt(have)}</b> ${GCUR[c][0]} · курс: ${c === 'money' ? '1 очко за 1 000 (базовий курс)' : c === 'crystals' ? '2.5 очка за 1 💎 (вигідніше на +25%)' : '12 очок за 1 🟡 (вигідніше на +50%)'}</div>
    <div class="bar" style="margin:4px 0"><button onclick="gAmt(-1)">−</button><input id="ga" type="number" min="0" value="${amt}" style="width:110px;text-align:center" oninput="cur().p.amt=Math.max(0,Math.floor(+this.value||0));gPrev()"><button onclick="gAmt(1)">+</button>${GCUR[c][0]}</div>
    <div class="bar"><button onclick="gSet(0.1)">10%</button><button onclick="gSet(0.25)">25%</button><button onclick="gSet(0.5)">50%</button><button onclick="gSet(1)">Усе</button></div>
    <div class="small" id="gp" style="margin:4px 0">Це дасть клану: <b>+${pts} очок</b></div>
    <button class="y" style="width:100%;padding:10px" onclick="donate('${c}')">Внести</button></div>
  <div class="small">Рівні клану дають очки розвитку, а лідер вкладає їх у гілки: 🏁 гонщики, 💥 бійці, 💼 торговці.</div>`;
};
const G_MOCK = [['Бос: Гравець_Віталік', 30, { money: 4200000, crystals: 850, gold: 40 }], ['Козак', 42, { money: 2900000, crystals: 1200, gold: 15 }], ['Ла Ріка', 18, { money: 600000, crystals: 90, gold: 0 }], ['Бандерас', 15, { money: 250000, crystals: 20, gold: 2 }]];
const G_MOCK_H = [['Козак', 'crystals', 200, '18:42'], ['Бос: Гравець_Віталік', 'money', 500000, '17:15'], ['Ла Ріка', 'money', 80000, '15:03'], ['Бандерас', 'gold', 2, 'вчора'], ['Козак', 'money', 300000, 'вчора']];
function gMembers() {
  const g = S.group, d = g.don || { money: 0, crystals: 0, gold: 0 }, ic = { money: '💵', crystals: '💎', gold: '🟡' };
  const tot = x => gPts('money', x.money) + gPts('crystals', x.crystals) + gPts('gold', x.gold);
  const list = [...G_MOCK.map(([n, l, x]) => [n, l, x]), [S.name + ' (ви)', S.lvl, d]].sort((a, b) => tot(b[2]) - tot(a[2]));
  const hist = [...(g.hist || []), ...G_MOCK_H.map(([n, c, a, t]) => ({ n, c, a, t }))].slice(0, 12);
  return `<div class="box"><b>Внески за весь час</b>${list.map(([n, l, x], i) => `<div class="row" style="${n.includes('(ви)') ? 'background:#fff6cc' : ''}"><div class="f"><b>${i + 1}. ${n}</b> <span class="small">рів. ${l}</span><div class="small">💵 ${fmt(x.money)} · 💎 ${fmt(x.crystals)} · 🟡 ${fmt(x.gold)}</div></div><span class="small">${fmt(Math.round(tot(x)))} оч.</span></div>`).join('')}</div>
  <div class="box"><b>Останні внески</b>${hist.map(h => `<div class="bar sp small"><span>${h.n}</span><span>+${fmt(h.a)} ${ic[h.c]} · ${h.t}</span></div>`).join('')}</div>`;
}
function gStep(c) { return c === 'money' ? 1000 : c === 'crystals' ? 10 : 1; }
function gAmt(d) { const p = cur().p, c = p.dc || 'money'; p.amt = Math.max(0, Math.floor((p.amt ?? 0) + d * gStep(c))); render(); }
function gSet(f) { const p = cur().p, c = p.dc || 'money'; p.amt = Math.floor(S[c] * f); render(); }
function gPrev() { const p = cur().p, c = p.dc || 'money', el = $('gp'); if (el) el.innerHTML = 'Це дасть клану: <b>+' + gPts(c, Math.min(p.amt, S[c])) + ' очок</b>'; }
function donate(c) {
  const p = cur().p; const n = Math.floor(p.amt ?? 0);
  if (!(n > 0)) return toast('Вкажи суму внеску');
  if (!pay(c, n)) return;
  S.group.prog += gPts(c, n); bump('donated', gPts(c, n)); { const g = S.group; if (!g.don) g.don = { money: 0, crystals: 0, gold: 0 }; g.don[c] += n; if (!g.hist) g.hist = []; g.hist.unshift({ n: S.name + ' (ви)', c, a: n, t: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) }); g.hist.length = Math.min(g.hist.length, 20); } let up = 0;
  while (S.group.prog >= gNeed() && S.group.lvl < CLAN_MAX) { S.group.prog -= gNeed(); S.group.lvl++; up++; }
  if (up) toast('Групування підняло рівень до ' + S.group.lvl + '!');
  S.daily.donate++; bump('donateN'); give({ xp: 100 }, 'Внесок ' + fmt(n) + ' ' + GCUR[c][0]); p.amt = undefined; render();
}
function joinClan(n) { S.group = { member: true, name: n, lvl: 3, prog: 40, owner: false, tree: { race: [0, 1], fight: [], trade: [] } }; render(); }
function createClan() {
  const n = ($('cn').value || '').trim(); if (n.length < 3) return toast('Назва мінімум 3 літери');
  if (!pay('crystals', 500)) return;
  S.group = { member: true, name: n, lvl: 1, prog: 0, owner: true, tree: { race: [], fight: [], trade: [] } }; toast('Клан «' + n + '» створено!'); render();
}
function leaveClan() { S.group = { member: false, lvl: 1, prog: 0 }; render(); }

// --- НАГОРОДИ (щоденний вхід)
const LOGIN = [{ money: 5000 }, { crystals: 5 }, { money: 15000 }, { gold: 2 }, { money: 30000 }, { crystals: 10 }, { gold: 10, crystals: 20 }];
SCREENS.rewards = () => {
  const can = S.login.last !== today();
  return `<h2>🎁 Нагороди</h2><div class="small">Щоденний вхід: 7 днів, потім по колу</div>
  <div class="grid g4">${LOGIN.map((r, i) => {
    const got = i < S.login.day, now = i === S.login.day % 7 && can;
    return `<div class="cell ${got ? 'done' : now ? 'cur-st' : ''}">День ${i + 1}<br>${Object.entries(r).map(([k, v]) => fmt(v) + ' ' + ({ money: '💵', crystals: '💎', gold: '🟡' }[k])).join('<br>')}</div>`;
  }).join('')}</div>
  ${subTier() ? `<div class="box"><b>⭐ Виплата підписки «${TIERS[subTier()].n}»</b> <button class="${S.sub.claimed === today() ? 'dis' : 'y'}" onclick="claimSub()">${S.sub.claimed === today() ? 'Отримано' : 'Забрати ' + TIERS[subTier()].daily + ' 💎 + ' + TIERS[subTier()].chips + ' 🎟'}</button></div>` : ''}
  <button class="${can ? 'y' : 'dis'}" style="width:100%;margin-top:8px;position:relative" onclick="claimLogin()">${dot(can)}${can ? 'Забрати' : 'Завтра ще'}</button>`;
};
function claimLogin() {
  if (S.login.last === today()) return; give(LOGIN[S.login.day % 7], 'День ' + (S.login.day % 7 + 1));
  { const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10); S.streak = S.login.last === y ? (S.streak || 0) + 1 : 1; bump('streakMax', S.streak, 'max'); }
  S.login.day = (S.login.day + 1) % 7; S.login.last = today(); S.daily.collect++; bump('logins'); render();
}

// --- МАГАЗИН
const CR_PACKS = [[250, 150, 0], [750, 400, 10], [1700, 850, 15], [3600, 1700, 20], [7500, 3000, 25]];
const GOLD_PACKS = [[50, 150, 0], [150, 400, 10], [350, 850, 15], [750, 1700, 20], [1600, 3000, 25]];
const EXCH = [[100000, 10], [500000, 45], [1500000, 120]];
SCREENS.shop = p => {
  const t = p.tab || 'cur';
  let h = `<h2>🛒 Магазин</h2>${tabs([['cur', 'Валюта'], ['sets', 'Набори'], ['prem', 'Преміум'], ['style', 'Стиль']], t)}`;
  if (t === 'cur') {
    h += `<div class="box"><b>Елітний набір</b> <span style="color:#c00">-50%</span><div>6 000 💎 + 1 200 🟡</div><button class="y" onclick="buyStars(5000,{crystals:6000,gold:1200},'Елітний набір')">⭐ 5 000 Telegram Stars</button></div>
    <div class="box"><b>💎 Кристали</b> <span class="small">основна донат-валюта</span><div class="grid g5">${CR_PACKS.map(([n, s, b]) => `<div class="cell">${fmt(n)} 💎${b ? `<br><span class="small">+${b}%</span>` : '<br>&nbsp;'}<button class="y" style="width:100%;padding:3px 0" onclick="buyStars(${s},{crystals:${n}},'${n} кристалів')">⭐${fmt(s)}</button></div>`).join('')}</div></div>
    <div class="box"><b>🟡 Золоті прикраси</b> <span class="small">рідкісна донат-валюта</span><div class="grid g5">${GOLD_PACKS.map(([n, s, b]) => `<div class="cell">${fmt(n)} 🟡${b ? `<br><span class="small">+${b}%</span>` : '<br>&nbsp;'}<button class="y" style="width:100%;padding:3px 0" onclick="buyStars(${s},{gold:${n}},'${n} золотих прикрас')">⭐${fmt(s)}</button></div>`).join('')}</div></div>
    <div class="box"><b>💵 Обмін валют</b> <span class="small">золоті прикраси → ігрові гроші</span><div class="grid g3">${EXCH.map(([m, g]) => `<div class="cell">${fmt(m)} 💵<button class="y" style="width:100%" onclick="exch(${m},${g})">🟡 ${g}</button></div>`).join('')}</div></div>`;
  } else if (t === 'sets') {
    h += [['Стартовий', 300, { money: 200000, gold: 20 }, ['hoodie', 'pants']], ['Вуличний', 900, { money: 500000 }, ['hoodie', 'pants', 'sneakers', 'cap']], ['Бос', 2500, { money: 1000000, gold: 100 }, ['vest', 'chain', 'watch', 'glasses']]]
      .map(([n, c, r, it]) => `<div class="row"><div class="f"><b>Набір «${n}»</b><div class="small">${fmt(r.money)} 💵${r.gold ? ' + ' + r.gold + ' 🟡' : ''} + речі: ${it.map(i => WEAR[i].name).join(', ')}</div></div><button class="y" onclick="buyPack(${c},${JSON.stringify(r).replace(/"/g, "'")},'${it.join(',')}')">${c} 💎</button></div>`).join('');
  } else if (t === 'prem') {
    const cur_ = subTier();
    h += `<div class="small">Підписки на 30 днів, як Value Pack у Black Desert: менше комісії на аукціоні, більше лімітів, щоденні кристали.</div>`
      + Object.entries(TIERS).map(([k, T]) => `<div class="box ${cur_ === k ? 'winner' : ''}"><div class="bar sp"><b>⭐ ${T.n}</b><span class="small">${cur_ === k ? 'активна ще ' + subDays() + ' дн.' : ''}</span></div>
        <div class="small">Комісія з продажу <b>${T.fee}%</b> (без підписки ${BASE_FEE}%) · ліміт ${T.lim}/день · заявок ${T.ord} · +${T.daily} 💎 і +${T.en} ⚡ і +${T.chips} 🎟 щодня · енергія відновлюється на ${Math.round((1 - T.regen) * 100)}% швидше · +${T.boss} спроб боса</div><div class="small"><b>${T.who}</b></div>
        <button class="y" style="width:100%;margin-top:4px" onclick="buySub('${k}')">${cur_ === k ? 'Продовжити' : 'Оформити'} ⭐ ${fmt(T.stars)}</button></div>`).join('')
      + `<div class="box ${ringOn() ? 'winner' : ''}"><b>💍 Перстень торговця</b> <span class="small">${ringOn() ? 'активний ще ' + Math.ceil((S.ring - Date.now()) / 864e5) + ' дн.' : ''}</span><div class="small">−${RING_BONUS}% комісії аукціону на 30 днів. Діє разом з підпискою.</div><button class="y" style="width:100%;margin-top:4px" onclick="buyRing()">300 💎</button></div>
      <div class="box small">Поточна комісія: ${feeBreakdown()}</div>
    <div class="box"><b>Пропуск сезону</b><div class="small">Нагороди за активність: 💎, гранати, сильні речі.</div><button class="y" onclick="go('season')">Відкрити ›</button></div>`;
  } else {
    h += `<div class="small">Одяг за кристали (той самий, що в гардеробі)</div><div class="grid g3">${Object.entries(WEAR).map(([k, w]) => `<div class="cell r${w.rar}">${wearIcon(k)}${w.name}<br>${S.owned.includes(k) ? '<b>Є</b>' : `<button class="y" onclick="buyWear('${k}','crystals')">${Math.round(w.price / 100)} 💎</button>`}</div>`).join('')}</div>`;
  }
  return h + `<div class="note">Telegram Stars: оплата симулюється (без справжнього платежу). Витрачено ⭐ ${fmt(S.starsSpent)}</div>`;
};
function buyStars(stars, r, what) {
  modal(`<h3>Оплата Telegram Stars</h3><p>${what}</p><p>До сплати: <b>⭐ ${fmt(stars)}</b></p><p class="note">Симуляція. У грі тут відкриється вікно оплати Telegram.</p>
  <button class="y" onclick='S.starsSpent+=${stars};bump("starsN");bump("starsSum",${stars});give(${JSON.stringify(r)},"Покупка");closeModal();render()'>Сплатити ⭐ ${fmt(stars)}</button>`);
}
function exch(m, g) { if (!pay('gold', g)) return; give({ money: m }, 'Обмін'); render(); }
function buyPack(c, r, items) {
  if (!pay('crystals', c)) return; give(r, 'Набір'); items.split(',').forEach(i => { if (!S.owned.includes(i)) S.owned.push(i); }); render();
}
function buyWear(k, curr) {
  const w = WEAR[k]; const price = curr === 'crystals' ? Math.round(w.price / 100) : w.price;
  if (!pay(curr, price)) return; S.owned.push(k); toast('Куплено: ' + w.name); render();
}

// --- ПРОФІЛЬ
SCREENS.profile = () => {
  const s = stats();
  return `<h2>👤 Профіль</h2><div class="bar"><div>${doll(220)}</div><div class="f" style="flex:1">
  <div class="box" style="${cosFrame() ? 'border:3px solid ' + cosFrame() : ''}"><b>${S.name}</b> ${cosTitle() ? '<span class="small">«' + cosTitle() + '»</span>' : ''} (${S.gender === 'm' ? 'чоловік' : 'жінка'})<br>Рівень ${S.lvl}<br><span onclick="go('tasks',{tab:'ach'})" style="cursor:pointer">🏅 <b>${achRank(achPts())[1]}</b> · ${(achPct() * 100).toFixed(1)}% досягнень · ${fmt(achPts())} очок</span><div class="prog"><i style="width:${S.xp / xpNeed(S.lvl) * 100}%"></i></div><span class="small">${S.xp} / ${xpNeed(S.lvl)} XP</span></div>
  <div class="box" style="text-align:center"><b>⚔️ Бойова сила</b><div style="font-size:34px;font-weight:800;line-height:1.1">${fmt(avgHit())}</div><div class="small">середній удар по босу</div><hr style="margin:6px 0"><div style="text-align:left">Шкода по босах: +${s.dmg}%<br>Крит: ${s.crit}% <span class="small">(подвійний удар)</span><br>Удача: ${s.luck} <span class="small">(кращі знахідки)</span><br>Колекція: ${S.owned.length}/${Object.keys(WEAR).length} речей у гардеробі<br>Зброя: ${(WEAPONS.find(w => w.id === S.weapon) || {}).name} (x${weaponMult()})<br>Авто: ${S.car.name}</div>
  ${profBox()}
  <div class="box small">Патрони: ${S.ammo} · Гранати: ${S.grenades}</div></div></div>
  <div class="bar"><input id="rn" value="${S.name}" style="flex:1"><button onclick="S.name=$('rn').value||S.name;render()">Змінити ім'я</button></div>`;
};

// --- ІНВЕНТАР
SCREENS.inventory = p => {
  const c = p.cat || 'Усе';
  const cats = ['Усе', ...new Set(S.inv.map(i => IT[i.id].cat))];
  const list = S.inv.filter(i => c === 'Усе' || IT[i.id].cat === c);
  return `<h2>🎒 Інвентар (${S.inv.length})</h2><div class="bar">${cats.map(x => `<button class="${x === c ? 'y' : ''}" onclick="setP('cat','${x}')">${x}</button>`).join('')}</div>
  ${list.length ? '' : '<div class="box small">Порожньо. Відкрий завезення в секонд-хенді або купи на ринку.</div>'}
  ${list.map(i => { const d = IT[i.id]; return `<div class="row r${d.rar}"><div class="f">${ico(i.id)}<b>${d.name}</b> ${gB(itG(i))} ${rarBadge(d.rar)}<div class="small">${d.cat} · ${d.stat}</div></div>
    ${d.cat !== 'Ресурси' && d.stat !== '—' ? `<button onclick="go('bv',{src:'i:${i.uid}'})">🧵 БВ</button>` : ''}${d.wear ? `<button onclick="toWardrobe(${i.uid})">У гардероб</button>` : ''}<button onclick="sellItem(${i.uid})">Продати ${fmt(sellPrice(i.id))}</button></div>`; }).join('')}`;
};
function sellPrice(id) { return Math.round(IT[id].base * 0.6); }
function sellItem(uid) { const i = S.inv.find(x => x.uid === uid); S.inv = S.inv.filter(x => x.uid !== uid); give({ money: sellPrice(i.id) }, 'Продано'); render(); }
function toWardrobe(uid) {
  const i = S.inv.find(x => x.uid === uid); const w = IT[i.id].wear;
  if (S.owned.includes(w)) return toast('Така річ уже є в гардеробі. Можна продати.');
  S.owned.push(w); wg()[w] = itG(i); S.inv = S.inv.filter(x => x.uid !== uid); toast('Додано в гардероб: ' + WEAR[w].name); render();
}

// --- БАБА ВАЛЯ (БВ): прошивка речей за 💎, випадково краще/гірше
const BV_ODDS = [[55, 45, 0], [45, 35, 20], [35, 35, 30], [16, 32, 52], [8, 27, 65], [0, 0, 0]];
const BV_CM = [1, 2.5, 6, 15, 40, 100]; // множник ціни спроби за рангом: вищі ранги дуже дорогі // [краще, так само, гірше] за рангом
function bvItem(src) {
  if (!src) return null; const [t, v] = src.split(':');
  if (t === 'i') { const i = S.inv.find(x => x.uid === +v); return i ? { it: IT[i.id], g: itG(i), set: g => i.g = g, nm: IT[i.id].name, pity: i.bp || 0, setP: n => i.bp = n } : null; }
  if (!S.owned.includes(v)) return null; const it = ITEMS.find(x => x.wear === v); return { it: it || { base: WEAR[v].price }, g: wgOf(v), set: g => wg()[v] = g, nm: WEAR[v].name, pity: (S.wp || {})[v] || 0, setP: n => { if (!S.wp) S.wp = {}; S.wp[v] = n; } };
}
const BV_PITY = 4, BV_PITY_MAX = 5; // +4% до шансу «краще» за кожну невдачу поспіль, до 5 невдач
const bvOdds = o => { const [u, sm, d] = BV_ODDS[o.g], b = Math.min(o.pity, BV_PITY_MAX) * BV_PITY, add = Math.min(b, sm + d); const fromD = Math.min(add, d); return [u + add, sm - (add - fromD), d - fromD]; };
const bvCost = (it, g) => Math.max(5, Math.round((it.base || 5000) / 300 * BV_CM[g]));
SCREENS.bv = p => {
  const o = bvItem(p.src);
  let h = `<div class="bar sp"><h2 style="margin:4px 0">🧵 БАБА ВАЛЯ</h2><button class="y" onclick="bvFaq()">❓ FAQ</button></div><div class="box">Залиш їй річ на прошивку за 💎. Результат випадковий: ранг може <b>піднятись</b>, <b>лишитись</b> або <b>впасти</b>. Вищий ранг дає більше статів і дорожчий на аукціоні. Шанси завжди видно нижче.</div>
  <div class="box small">Ранги: ${GRD.map((x, g) => `${gB(g)} ×${GM_ST[g]} стати, ціна ×${GM_PR[g]}`).join(' · ')}</div>`;
  if (!o) {
    const inv = S.inv.filter(i => IT[i.id].cat !== 'Ресурси' && IT[i.id].stat !== '—'), ow = S.owned.filter(k => WEAR[k]);
    return h + `<b>Інвентар</b>${inv.map(i => `<div class="row"><div class="f">${ico(i.id)}${IT[i.id].name} ${gB(itG(i))}</div><button onclick="setP('src','i:${i.uid}')">Обрати</button></div>`).join('') || '<div class="small">Порожньо</div>'}
    <b>Гардероб</b>${ow.map(k => `<div class="row"><div class="f">${WEAR[k].name} ${gB(wgOf(k))}</div><button onclick="setP('src','w:${k}')">Обрати</button></div>`).join('') || '<div class="small">Порожньо</div>'}`;
  }
  const [up, same, down] = bvOdds(o), cost = bvCost(o.it, o.g), nxt = bvCost(o.it, o.g + 1);
  if (o.g >= 5) return h + `<div class="box"><b>${o.nm}</b> ${gB(o.g)}<br>Ідеальний ранг. Баба Валя тут уже безсила.</div><button onclick="setP('src','')">Обрати іншу</button>`;
  return h + `<div class="box" style="text-align:center"><b>${o.nm}</b> ${gB(o.g)}<br><span class="small">Далі: ${gB(o.g + 1)}</span>
  ${o.pity ? `<div class="small" style="color:#090">🍀 Бонус невдач: +${Math.min(o.pity, BV_PITY_MAX) * BV_PITY}% до «краще»</div>` : ''}
  <div class="grid g3" style="margin-top:6px"><div class="cell" style="color:#090">⬆ Краще<br><b>${up}%</b></div><div class="cell">➡ Так само<br><b>${same}%</b></div><div class="cell" style="color:#c00">⬇ Гірше<br><b>${down}%</b></div></div></div>
  <button class="y" style="width:100%;padding:12px;font-size:16px" onclick="bvDo('${p.src}')">🧵 Прошити — ${fmt(cost)} 💎</button><div class="small" style="text-align:center;margin-top:4px">Після успіху наступна спроба дорожча: ${fmt(nxt)} 💎 (ранг ${GRD[o.g + 1]}), зате річ коштує ×${(GM_PR[o.g + 1] / GM_PR[o.g]).toFixed(1)} на аукціоні</div><button style="width:100%;margin-top:4px" onclick="setP('src','')">Обрати іншу річ</button>`;
};
function bvFaq() {
  modal(`<h3>❓ Баба Валя</h3>
  <p class="small">• Дай речі на прошивку за 💎. Ранг речі може <b>піднятись</b>, <b>лишитись</b> або <b>впасти</b> на 1.</p>
  <p class="small">• Ранги: D, C, B, A, A+, A++. Вищий ранг дає більше статів і дорожчий на аукціоні.</p>
  <p class="small">• Чим вищий ранг, тим дорожча спроба й тим менший шанс піднятись.</p>
  <p class="small">• Невдала спроба збільшує шанс наступної (до +20%). Успіх скидає бонус.</p>
  <p class="small">• Ранг D не падає, A++ вже максимальний.</p>
  <p class="small">• Річ з рангом, відмінним від C, продається на дошці лотів. Біржа приймає тільки C.</p>`);
}
function bvDo(src) {
  const o = bvItem(src); if (!o || o.g >= 5) return; const cost = bvCost(o.it, o.g); if (!pay('crystals', cost)) return;
  const [up, same] = bvOdds(o), x = Math.random() * 100, ng = x < up ? o.g + 1 : x < up + same ? o.g : o.g - 1;
  o.set(ng); o.setP(ng > o.g ? 0 : o.pity + 1); bump('bvN'); bump('bvSpent', cost); bump(ng > o.g ? 'bvUp' : ng < o.g ? 'bvDown' : 'bvSame');
  modal(`<h3>Баба Валя пошепотіла…</h3><p><b>${o.nm}</b>: ${gB(o.g)} → ${gB(ng)}</p><p><b style="color:${ng > o.g ? '#090' : ng < o.g ? '#c00' : '#555'}">${ng > o.g ? '⬆ Вийшло краще!' : ng < o.g ? '⬇ Не пощастило, стало гірше' : '➡ Нічого не змінилось'}</b></p>`); render();
}

// --- ГАРДЕРОБ
SCREENS.wardrobe = p => {
  const t = p.tab || 'wear', f = p.f || 'all', sel = p.sel;
  const H = Math.min(window.innerHeight * 0.42, 360);
  let h = `<h2>👕 Гардероб</h2>${tabs([['wear', 'Одяг'], ['acc', 'Аксесуари'], ['skin', 'Скіни'], ['sets', 'Набори']], t)}
  <div class="bar" style="align-items:flex-start;flex-wrap:nowrap">
    <div style="flex:0 0 auto">${doll(H)}</div>
    <div style="flex:1;min-width:0;font-size:11px">${Object.keys(SLOT_NAME).map(sl => `<div class="row" style="padding:2px 4px;margin:2px 0">${SLOT_NAME[sl]}: <b class="f">${S.equipped[sl] ? WEAR[S.equipped[sl]].name : '—'}</b>${S.equipped[sl] ? `<button style="padding:1px 4px" onclick="unequip('${sl}')">✕</button>` : ''}</div>`).join('')}</div>
  </div>`;
  if (t === 'wear' || t === 'acc') {
    const items = Object.entries(WEAR).filter(([k, w]) => w.tab === t && (f === 'all' || (f === 'my' ? S.owned.includes(k) : !S.owned.includes(k))));
    h += tabs([['all', 'Усі'], ['my', 'Мої'], ['av', 'Доступні']], f, 'f');
    h += `<div class="grid g4">${items.map(([k, w]) => `<div class="cell r${w.rar}" onclick="setP('sel','${k}')" style="${sel === k ? 'outline:3px solid #000' : ''}">${wearIcon(k)}${w.name}${S.owned.includes(k) ? '<br>' + gB(wgOf(k)) : '<br>🔒'}${Object.values(S.equipped).includes(k) ? '<br>✓' : ''}</div>`).join('') || '<div class="small">Немає</div>'}</div>`;
    if (sel && WEAR[sel]) {
      const w = WEAR[sel], own = S.owned.includes(sel), on = S.equipped[w.slot] === sel;
      h += `<div class="box"><b>${w.name}</b> ${own ? gB(wgOf(sel)) : ''} ${rarBadge(w.rar)}<div class="small">Слот: ${SLOT_NAME[w.slot]} · ${Object.entries(w.stat).map(([k, v]) => ({ luck: 'Удача', dmg: 'Шкода по босах %', crit: 'Крит %' }[k]) + ' +' + (Math.round(v * GM_ST[own ? wgOf(sel) : 1] * 10) / 10)).join(', ')}</div>
      ${own ? `<button onclick="go('bv',{src:'w:${sel}'})">🧵 До баби Валі</button> <button onclick="fromWardrobe('${sel}')">У інвентар (для продажу)</button>` : ''}
      ${own ? (on ? `<button class="g" onclick="unequip('${w.slot}')">✓ Екіпіровано (зняти)</button>` : `<button class="y" onclick="equip('${sel}')">Екіпірувати</button>`) : `<button class="y" onclick="buyWear('${sel}','money')">Купити ${fmt(w.price)} 💵</button> <span class="small">або знайди в секонд-хенді</span>`}</div>`;
    }
  } else if (t === 'skin') {
    h += `<div class="box">Скін героя (стать):<div class="bar"><button class="${S.gender === 'm' ? 'sel' : ''}" onclick="S.gender='m';render()">Чоловік</button><button class="${S.gender === 'f' ? 'sel' : ''}" onclick="S.gender='f';render()">Жінка</button></div>
    <div class="note">Інші скіни: з'являться пізніше (заглушка).</div></div>`;
  } else {
    h += SETS.map(st => {
      const have = st.items.every(i => S.owned.includes(i)), act = activeSets().includes(st);
      return `<div class="box"><b>${st.name}</b> ${act ? '✓ активний' : ''}<div class="small">${st.items.map(i => (S.owned.includes(i) ? '✓ ' : '🔒 ') + WEAR[i].name).join(' · ')}</div><div>Бонус набору: ${st.bonus}</div>
      ${have ? `<button class="y" onclick="wearSet('${st.id}')">Одягнути набір</button>` : '<span class="small">Збери всі речі</span>'}</div>`;
    }).join('');
  }
  const as = activeSets();
  h += `<div class="box"><b>Бонус набору:</b> ${as.length ? as.map(s => s.name + ': ' + s.bonus).join('; ') : 'немає (одягни повний набір)'}</div>
  <button onclick="S.equipped={};render()">Зняти все</button>`;
  return h;
};
function fromWardrobe(k) { const it = ITEMS.find(x => x.wear === k); if (!it) return; if (S.equipped[WEAR[k].slot] === k) delete S.equipped[WEAR[k].slot]; addItem(it.id, wgOf(k)); S.owned = S.owned.filter(x => x !== k); delete wg()[k]; toast('Річ в інвентарі'); render(); }
function equip(k) { S.equipped[WEAR[k].slot] = k; bump('outfits'); render(); }
function unequip(sl) { delete S.equipped[sl]; render(); }
function wearSet(id) { SETS.find(s => s.id === id).items.forEach(k => S.equipped[WEAR[k].slot] = k); render(); }

// --- ГАРАЖ / ТРАНСПОРТ
const carCond = () => S.car.cond == null ? 100 : S.car.cond;
const carMult = () => 0.6 + 0.4 * carCond() / 100;
const partsTot = () => Object.values(S.car.parts).reduce((a, b) => a + b, 0);
const repairCost = () => Math.round((100 - carCond()) * (60 + partsTot() * 20));
function carPower() { const s = carStats(); return Math.round((s.pow + s.spd + s.hand) * carMult()); }
function repairCar() { const c = repairCost(); if (c <= 0) return toast('Авто в ідеальному стані'); if (!pay('money', c)) return; S.car.cond = 100; bump('carRepairs'); toast('Авто відремонтовано'); render(); }
function wearCar(n) { S.car.cond = Math.max(0, carCond() - n); }
function carStats() {
  const p = S.car.parts, s = { pow: 300, spd: 250, dur: 420, hand: 240 };
  PARTS.forEach(([k, , st]) => s[st] += p[k] * 10);
  return s;
}
SCREENS.garage = p => {
  const t = p.tab || 'tune', part = p.part || 'engine', c = S.car, s = carStats();
  let h = `<h2>🔧 ГАРАЖ</h2><div class="box" style="text-align:center;height:90px;line-height:80px;font-size:30px">🚗 <span class="small">[вигляд: ${c.view}, колір: ${c.color}, наліпка: ${c.sticker}]</span></div>
  <div class="bar">${['Спереду', 'Ззаду', 'Збоку (ліва)', 'Збоку (права)'].map(v => `<button class="${c.view === v ? 'y' : ''}" onclick="S.car.view='${v}';render()">${v}</button>`).join('')}</div>
  <div class="box bar sp"><b>${c.name}</b><span>${'★'.repeat(c.stars)}${'☆'.repeat(5 - c.stars)}</span></div>
  <div class="box bar sp"><span>⚙️ Сила авто: <b>${carPower()}</b></span><span>Стан: <b style="color:${carCond() < 40 ? '#c00' : '#090'}">${Math.round(carCond())}%</b></span></div>
  <button class="${carCond() >= 100 ? 'dis' : 'g'}" style="width:100%;margin-bottom:5px" onclick="repairCar()">🛠 Ремонт — ${fmt(repairCost())} 💵</button>
  <div class="grid g4"><div class="cell">Потужність<br><b>${s.pow}</b></div><div class="cell">Швидкість<br><b>${s.spd}</b></div><div class="cell">Міцність<br><b>${s.dur}</b></div><div class="cell">Керування<br><b>${s.hand}</b></div></div>
  ${tabs([['tune', 'Тюнінг'], ['style', 'Стиль'], ['paint', 'Фарбування'], ['stick', 'Наліпки']], t)}`;
  if (t === 'tune') {
    h += `<div class="grid g3">${PARTS.map(([k, n]) => `<div class="cell" onclick="setP('part','${k}')" style="${part === k ? 'outline:3px solid #000' : ''}">${n}<br>${'■'.repeat(c.parts[k])}${'□'.repeat(6 - c.parts[k])}</div>`).join('')}</div>`;
    const lv = c.parts[part], cost = 5000 * (lv + 1) * (lv + 1);
    h += lv >= 6 ? '<div class="box">Максимальний рівень</div>' : `<button class="g" style="width:100%;padding:10px;margin-top:5px" onclick="upPart('${part}',${cost})">🔧 Покращити ${PARTS.find(x => x[0] === part)[1]} — ${fmt(cost)} 💵</button>`;
  } else if (t === 'paint') {
    h += `<div class="bar">${['Червоний', 'Чорний', 'Жовтий', 'Білий', 'Фіолетовий неон'].map(col => `<button class="${c.color === col ? 'y' : ''}" onclick="paint('${col}')">${col} (5 000)</button>`).join('')}</div>`;
  } else if (t === 'stick') {
    h += `<div class="bar">${['Немає', 'Полум\'я', 'Пальми', 'Смуги', 'Череп'].map(x => `<button class="${c.sticker === x ? 'y' : ''}" onclick="S.car.sticker='${x}';render()">${x}</button>`).join('')}</div>`;
  } else h += `<div class="box small">Стиль: диски, спойлер, обвіс (заглушка)</div>`;
  return h + `<button style="width:100%;margin-top:6px" onclick="go('races')">🏁 До гонок</button>`;
};
function upPart(k, cost) { if (!pay('money', cost)) return; S.car.parts[k]++; bump('partUp'); const tot = Object.values(S.car.parts).reduce((a, b) => a + b, 0); S.car.stars = Math.min(5, 1 + Math.floor(tot / 8)); toast('Покращено!'); render(); }
function paint(col) { if (!pay('money', 5000)) return; S.car.color = col; render(); }

// --- ЗБРОЯ
const weaponsList = () => `<div class="note">Множник шкоди впливає на бій з босами.</div>
  ${WEAPONS.map(w => { const own = S.weapons.includes(w.id); return `<div class="row"><div class="f"><b>${w.name}</b><div class="small">Шкода x${w.dmg}</div></div>
  ${own ? (S.weapon === w.id ? '<button class="g" disabled>В руках</button>' : `<button class="y" onclick="S.weapon='${w.id}';render()">Взяти</button>`) : `<button class="y" onclick="buyWeapon('${w.id}')">${fmt(w.price)} ${w.cur === 'crystals' ? '💎' : '💵'}</button>`}</div>`; }).join('')}`;
function buyWeapon(id) { const w = WEAPONS.find(x => x.id === id); if (!pay(w.cur || 'money', w.price)) return; S.weapons.push(id); S.weapon = id; render(); }

// --- НАЛІТ (боси)
const BOSS_EN = 3, AMMO_HIT = 10, NOAMMO_MULT = 0.4, GREN_MULT = 2;
const bossMax = () => 6 + (subTier() ? TIERS[subTier()].boss : 0);
function bossSt(b) { if (!S.bosses[b.id]) S.bosses[b.id] = { hp: b.hp, tries: bossMax() }; return S.bosses[b.id]; }
SCREENS.raidBoss = p => {
  const t = p.tab || 'boss';
  let h = `<h2>💀 НАЛІТ</h2>${tabs([['boss', 'Боси'], ['weap', '🔫 Зброя'], ['raids', 'Рейди'], ['ev', 'Події'], ['rank', 'Рейтинг']], t)}`;
  if (t === 'weap') h += weaponsList();
  if (t === 'boss') {
    h += `<div class="box"><b>Боєприпаси</b> <span class="small">(впливають на шкоду)</span>
      <div class="bar sp" style="margin-top:4px"><span>🔫 Патрони: <b>${S.ammo}</b> · ${AMMO_HIT}/удар</span><button class="${S.bossAm !== false ? 'y' : ''}" onclick="S.bossAm=${S.bossAm === false};render()">${S.bossAm !== false ? 'Увімк' : 'Вимк'}</button></div>
      <div class="bar sp"><span>💣 Гранати: <b>${S.grenades}</b> · +${GREN_MULT * 100}% шкоди</span><button class="${S.bossGr ? 'y' : ''}" onclick="S.bossGr=!S.bossGr;render()">${S.bossGr ? 'Увімк' : 'Вимк'}</button></div>
      <div class="bar sp small"><span>⚔️ Середній удар: <b>${fmt(avgHit())}</b></span><span>🗡 Шкода +${stats().dmg}% · 💥 Крит ${stats().crit}%</span></div><div class="small">Без патронів удар слабший (×${NOAMMO_MULT}). Патрони й гранати: крамниця клубу, магазин рейдів, трофеї босів.</div></div>` + BOSSES.map(b => {
      const st = bossSt(b), locked = b.needLvl && S.lvl < b.needLvl;
      return `<div class="row ${locked ? 'lock' : ''}"><div class="f"><b>${b.name}</b> <span class="small">Рівень ${b.lvl}</span><div class="prog"><i style="width:${st.hp / b.hp * 100}%;background:#c33"></i></div>
      <span class="small">❤ ${fmt(st.hp)} / ${fmt(b.hp)} · Нагорода (раз на добу): ${fmt(b.rew.money)}💵 ${b.rew.crystals}💎 ${b.rew.gold ? b.rew.gold + '🟡' : ''}</span></div>
      ${locked ? `<button disabled>🔒 Потрібен рівень ${b.needLvl}</button>` : `<div style="text-align:center"><div class="small">Спроб: ${st.tries}/${bossMax()} · ⚡${BOSS_EN} за удар</div><button class="y" onclick="hitBoss('${b.id}')">НАЛІТ »</button></div>`}</div>`;
    }).join('') + `<button onclick="restoreTries()">Відновити всі спроби — 50 💎</button>`;
  } else if (t === 'weap') { /* вже показано вище */ } else if (t === 'raids') h += `<div class="box">Рейди на райони міста.</div><button class="y" onclick="go('district')">Рейд на Даунтаун ▶</button>`;
  else if (t === 'ev') h += `<div class="box">Бос тижня: <b>Дон Карло</b> — подвійна шкода (заглушка).</div>`;
  else {
    const me = stV('bossDmg'), L = [['Козак', 9200000], ['Ла Ріка', 5100000], ['Тоні', 2400000], ['Бандерас', 800000], ['Лисий', 150000], [S.name, me]].sort((a, b) => b[1] - a[1]);
    h += `<div class="box"><b>Рейтинг шкоди по босах</b>${L.map(([n, v], i) => `<div class="bar sp" style="${n === S.name ? 'font-weight:bold;background:#fff6cc' : ''}"><span>${i + 1}. ${n}</span><span>${fmt(v)}</span></div>`).join('')}</div><div class="small">Твоя загальна шкода враховується в досягненнях.</div>`;
  }
  return h;
};
const EN_PACKS = [[50, 22, 5], [100, 40, 5], [500, 180, 3], [1000, 330, 2]]; // [енергія, 💎, ліміт на день]
function raidShop() {
  const d = S.daily.en || {};
  return `<div class="box"><b>⚡ Енергія</b><div class="small">Енергія відновлюється сама (1 за 4 хв до 60, повний запас 60 ⚡ за 4 години, це 6 запасів на добу). Куплена понад 60 не пропадає й не заважає відновленню. У тебе: <b>${S.energy}</b> ⚡</div></div>` + EN_PACKS.map(([n, c, lim]) => `<div class="row"><div class="f"><b>+${n} ⚡</b><div class="small">${c} 💎 · ${(c / n).toFixed(2)} 💎 за 1 ⚡ · сьогодні ${d[n] || 0}/${lim}</div></div><button class="${(d[n] || 0) >= lim ? 'dis' : 'y'}" onclick="buyEnergy(${n})">${c} 💎</button></div>`).join('') +
    `<div class="box"><b>🔫 Боєприпаси</b><div class="small">У тебе: патрони <b>${S.ammo}</b> · гранати <b>${S.grenades}</b></div></div>` + AMMO_SHOP.map(([k, n, c, nm]) => `<div class="row"><div class="f"><b>${nm}</b></div><button class="y" onclick="buyAmmo('${k}',${n},${c})">${fmt(c)} 💵</button></div>`).join('');
}
const AMMO_SHOP = [['ammo', 50, 5000, '🔫 Патрони ×50'], ['ammo', 200, 18000, '🔫 Патрони ×200'], ['grenades', 1, 8000, '💣 Граната ×1'], ['grenades', 5, 36000, '💣 Гранати ×5']];
function buyAmmo(k, n, c) { if (!pay('money', c)) return; S[k] += n; toast('+' + n + (k === 'ammo' ? ' 🔫' : ' 💣')); render(); }
function buyEnergy(n) {
  const pk = EN_PACKS.find(x => x[0] === n); if (!S.daily.en) S.daily.en = {};
  if ((S.daily.en[n] || 0) >= pk[2]) return toast('Ліміт цього набору на сьогодні вичерпано');
  if (!pay('crystals', pk[1])) return; S.daily.en[n] = (S.daily.en[n] || 0) + 1; S.energy += n; toast('+' + n + ' ⚡'); render();
}
function rankTable(names, what) { return `<div class="box">${names.map((n, i) => `<div class="bar sp" style="${n === S.name ? 'font-weight:bold' : ''}"><span>${i + 1}. ${n}</span><span>${fmt((6 - i) * 123457)} ${what}</span></div>`).join('')}</div>`; }
function hitBoss(id) {
  const b = BOSSES.find(x => x.id === id), st = bossSt(b);
  if (st.tries <= 0) return toast('Немає спроб. Відновлення завтра або за 50 💎');
  if (!pay('energy', BOSS_EN)) return;
  st.tries--; S.daily.fights++; S.week.fights++; bump('fights');
  const s = stats(); let am = 1, gnote = '', anote = '';
  if (S.bossAm !== false) { if (S.ammo >= AMMO_HIT) { S.ammo -= AMMO_HIT; anote = ` (−${AMMO_HIT} 🔫)`; } else { am = NOAMMO_MULT; anote = ' (без патронів, слабкий удар)'; } } else { am = NOAMMO_MULT; anote = ' (без патронів)'; }
  let dmg = Math.round(bossBase() * am * (0.8 + Math.random() * 0.4)), crit = Math.random() * 100 < s.crit; if (crit) dmg *= 2; if (crit) anote += ' 💥КРИТ ×2!';
  if (S.bossGr && S.grenades >= 1) { S.grenades--; bump('grenUsed'); const ex = Math.round(dmg * GREN_MULT); dmg += ex; gnote = ` + 💣 граната ${fmt(ex)}`; }
  st.hp = Math.max(0, st.hp - dmg); bump('bossDmg', dmg); bump('bossHits'); if (crit) bump('bossCrits');
  let msg = `Ви завдали ${fmt(dmg)} шкоди босу ${b.name}${anote}${gnote}.`;
  if (st.hp === 0) {
    if (!S.daily.bk) S.daily.bk = {}; S.ach.bossKills++; bump('bossKills'); bump('kill_' + b.id); st.hp = b.hp; if (!S.beat) S.beat = {}; const hadCar = hasCar(); S.beat[b.id] = 1; if (!hadCar && hasCar()) setTimeout(() => modal('<h3>🚗 Перша машина!</h3><p>Ти переміг другого боса й отримав першу машину. Відкрились <b>Транспорт</b> (гараж, тюнінг) і <b>Гонки</b>.</p><button class="y" style="width:100%" onclick="closeModal()">Чудово</button>'), 400);
    if (!S.daily.bk[b.id]) { S.daily.bk[b.id] = 1; give({ ...b.rew, ammo: 30, grenades: 1 }, 'Бос переможений'); const it = pick(ITEMS); addItem(it.id, rollG()); msg += ` БОС ПЕРЕМОЖЕНИЙ! Трофей: ${it.name}. Бос відродився.`; }
    else { give({ money: Math.round(b.rew.money * 0.2) }, 'Повторне вбивство'); msg += ' Бос переможений ще раз: сьогодні повна нагорода вже отримана, лише 20% грошей. Бос відродився.'; }
  }
  S.xp += 50; lvlCheck();
  modal(`<h3>Бій</h3><p>${msg}</p>`); render();
}
function restoreTries() { if (!pay('crystals', 50)) return; BOSSES.forEach(b => bossSt(b).tries = bossMax()); render(); }

// --- АТАКА НА РАЙОН (рейд)
// --- РАЙОНИ: район тримає гравець з найвищим рейтингом по ньому. Володар щодоби отримує невеликий дохід (листом).
// Рейтинг дають успішні атаки, а суперники щодня ростуть, тож утримання вимагає постійних рейдів (≈2 рейди на добу).
const DISTS = [
  { id: 'down', n: 'Даунтаун', mult: 1, inc: [15000, 2], rv: [4000, 7000], gain: [700, 1400] },
  { id: 'beach', n: 'Пляж', mult: 1.25, inc: [22000, 3], rv: [6000, 9000], gain: [850, 1700] },
  { id: 'port', n: 'Порт', mult: 1.5, inc: [32000, 4], rv: [8000, 12000], gain: [1100, 2200] },
];
const DIST_RIV = ['Козак', 'Ла Ріка', 'Бандерас', 'Тоні', 'Дон Карло', 'Віталік', 'Мікі'];
function dAll() {
  if (!S.dist) S.dist = { ts: today(), d: {} };
  DISTS.forEach(D => { if (!S.dist.d[D.id]) { const nm = [...DIST_RIV].sort(() => Math.random() - 0.5).slice(0, 3); S.dist.d[D.id] = { r: 0, stage: 1, riv: nm.map(n => [n, rnd(D.rv[0], D.rv[1])]) }; } });
  return S.dist.d;
}
const dS = id => dAll()[id];
const rStage = id => id === 'down' ? S.raidStage : dS(id).stage;
function setStage(id, v) { if (id === 'down') S.raidStage = v; else dS(id).stage = v; }
function dBoard(id) { const d = dS(id); return [[S.name, d.r, true], ...d.riv.map(x => [x[0], x[1], false])].sort((a, b) => b[1] - a[1]); }
const dHolder = id => dBoard(id)[0];
const dMine = id => dHolder(id)[2];
function dRate(id, pts) {
  const was = dMine(id); dS(id).r += pts; bump('distRating', pts, 'max');
  if (!was && dMine(id)) { toast('👑 Ви захопили район ' + DISTS.find(x => x.id === id).n + '!'); bump('distTakes'); }
}
// щодобова обробка: рейтинги спадають на 5%, суперники ростуть, володарю йде дохід
function distDaily() {
  dAll(); const t = today(); if (S.dist.ts === t) return;
  const days = Math.min(7, Math.max(1, Math.round((new Date(t) - new Date(S.dist.ts)) / 864e5)) || 1);
  for (let k = 0; k < days; k++) DISTS.forEach(D => {
    const d = S.dist.d[D.id], was = dMine(D.id);
    d.r = Math.round(d.r * 0.95); d.riv.forEach(x => { x[1] = Math.round(x[1] * 0.95 + rnd(D.gain[0], D.gain[1])); });
    const now = dMine(D.id);
    if (was && now) { sendMail('Район ' + D.n, 'Дохід з району', `Ваш район ${D.n} приніс дохід за добу.`, { money: D.inc[0], crystals: D.inc[1] }); bump('distDays'); }
    else if (was && !now) sendMail('Район ' + D.n, 'Район втрачено', `Гравець ${dHolder(D.id)[0]} випередив вас за рейтингом і тепер тримає ${D.n}. Поверніть район рейдами.`);
  });
  S.dist.ts = t;
}
const dMineCount = () => DISTS.filter(D => dMine(D.id)).length;
function holderPlate(id) {
  const h = dHolder(id);
  return `<div style="border:3px solid ${h[2] ? '#3c3' : '#f5b800'};background:${h[2] ? '#dfd' : '#fff6cc'};border-radius:6px;padding:3px 6px;text-align:center;min-width:110px"><div class="small">👑 Тримає район</div><b>${h[2] ? 'ВИ' : h[0]}</b><div class="small">рейтинг ${fmt(h[1])}</div></div>`;
}
SCREENS.district = p => {
  const t = p.tab || 'raid', id = p.dd || 'down', D = DISTS.find(x => x.id === id), st = rStage(id);
  distDaily();
  let h = `<h2>⚔ Атака на район</h2>${tabs([['raid', 'Рейд'], ['rank', 'Рейтинг'], ['ctrl', 'Контроль'], ['shop', 'Крамниця рейдів']], t, 'tab', { ctrl: false })}`;
  if (t === 'raid') {
    const r = RAID_REW[Math.min(st, 12) - 1];
    h += `<div class="bar" style="margin:3px 0">${DISTS.map(x => `<button class="${x.id === id ? 'sel' : ''}" onclick="setP('dd','${x.id}')">${x.n}${dMine(x.id) ? ' 👑' : ''}</button>`).join('')}</div>
    <div class="bar sp" style="align-items:flex-start"><div class="box" style="margin:0"><b>Район: ${D.n}</b><br><span class="small">Прогрес рейду: ${Math.min(st - 1, 12)}/12<br>Ваш рейтинг: ${fmt(dS(id).r)}</span></div>${holderPlate(id)}</div>
    <div class="map">${Array.from({ length: 12 }, (_, i) => i + 1).map(n => `<div class="cell ${n < st ? 'done' : n === st ? 'cur-st' : 'lock'}">${n === 12 ? '💀 Бос' : 'Етап ' + n}<br>${n < st ? '✓' : n === st ? '◉' : '🔒'}</div>`).join('')}</div>
    ${st > 12 ? `<div class="box">Район пройдено! <button class="y" onclick="setStage('${id}',1);render()">Почати знову</button></div>` :
      `<div class="box"><b>Нагорода за етап ${st}</b><div>${fmt(Math.round(r[0] * D.mult))} 💵 · ${Math.round(r[1] * D.mult)} 💎 · ${r[2]} 🟡 · ${st * 10} XP · ⭐ +${Math.round(st * 8 + (st === 12 ? 200 : 0))} рейтингу району</div></div>
      <button class="y" style="width:100%;padding:10px" onclick="attackStage('${id}')">${st === 12 ? '💀 Атакувати боса' : 'Атакувати'} ⚡${RAID_EN[st - 1]}</button><div class="small" style="text-align:center">Ціна етапів: ${RAID_EN.map((e, i) => i + 1 === st ? '<b>' + e + '</b>' : e).join(' → ')} ⚡</div>`}`;
  } else if (t === 'rank') h += `<div class="bar" style="margin:3px 0">${DISTS.map(x => `<button class="${x.id === id ? 'sel' : ''}" onclick="setP('dd','${x.id}')">${x.n}</button>`).join('')}</div><div class="box"><b>Рейтинг району ${D.n}</b>${dBoard(id).map((x, i) => `<div class="bar sp" style="${x[2] ? 'font-weight:bold;background:#fff6cc' : ''}"><span>${i + 1}. ${i === 0 ? '👑 ' : ''}${x[2] ? S.name + ' (ви)' : x[0]}</span><span>${fmt(x[1])}</span></div>`).join('')}</div><div class="small">Рейтинг щодоби спадає на 5%, тож щоб залишатись першим, треба регулярно проходити рейд.</div>`;
  else if (t === 'ctrl') h += `<div class="box"><b>Контроль районів</b><div class="small">Район тримає гравець із найвищим рейтингом по ньому. Володар щодоби отримує дохід листом у пошту. Ваші райони: <b>${dMineCount()}</b></div></div>` + DISTS.map(x => { const hd = dHolder(x.id), b = dBoard(x.id), me = b.findIndex(y => y[2]); return `<div class="box"><div class="bar sp"><b>${x.n}</b>${holderPlate(x.id)}</div><div class="small">Дохід володаря: ${fmt(x.inc[0])} 💵 + ${x.inc[1]} 💎 на добу · ваше місце: ${me + 1}/4 (${fmt(dS(x.id).r)})${hd[2] ? '' : ' · до лідера ще ' + fmt(hd[1] - dS(x.id).r + 1)}</div><button class="y" style="width:100%;margin-top:3px" onclick="cur().p.dd='${x.id}';setP('tab','raid')">Рейд на ${x.n}</button></div>`; }).join('');
  else h += raidShop();
  return h;
};
const raidChance = () => { const q = stats(); return Math.min(0.95, 0.8 + (q.luck - 5) * 0.005); }; // удача підвищує шанс успіху атаки
const luckB = () => Math.max(0, stats().luck - 5) * 0.003; // удача підвищує шанс кращих знахідок
const RAID_EN = [2, 3, 5, 8, 10, 12, 13, 14, 15, 16, 18, 20]; // вартість енергії за етап, 12-й це бос
function attackStage(id) {
  id = id || 'down'; const D = DISTS.find(x => x.id === id), st = rStage(id);
  if (!pay('energy', RAID_EN[st - 1])) return;
  S.daily.raids++; S.week.raids++; bump('raids');
  if (Math.random() < raidChance()) {
    const r = RAID_REW[st - 1], m = clanMul('raidRew') * D.mult;
    bump('distStages');
    give({ money: Math.round(r[0] * m), crystals: Math.round(r[1] * m), gold: r[2], xp: st * 10 }, D.n + ', етап ' + st + ' пройдено'); setStage(id, st + 1);
    dRate(id, Math.round(st * 8 + (st === 12 ? 200 : 0)));
  } else toast('Атака відбита! Спробуй ще.');
  render();
}


// --- ІГРОВИЙ КЛУБ
function ctabs(a) {
  const t = [['club', '🏛 Клуб'], ['slots', '🎰 Слоти'], ['poker', '🃏 Покер']];
  return `<div class="tabs">${t.map(([k, n]) => `<button style="position:relative" class="${a === k ? 'y' : ''}" onclick="stack[stack.length-1]={name:'${k}',p:{}};render()">${n}</button>`).join('')}</div>
  <div class="box bar sp small" style="margin:4px 0"><span>🎟 Фішки: <b>${fmt(S.chips || 0)}</b></span><span onclick="go('club',{tab:'day'})" style="cursor:pointer">⭐ ${S.daily.cp || 0}/${CP_MAX} → нагороди ›</span><span>${S.daily.chipsClaim ? 'Щоденні фішки отримано' : '<a onclick="go(\'club\',{tab:\'bon\'})" style="color:#c70;font-weight:bold">Забери щоденні ›</a>'}</span></div>`;
}
// --- КЛУБНИЙ ДЕНЬ (тест): очки за кількість ігор, не за виграш; цінності клубу: лише косметика
const CP_MAX = 45;
const CP_TRACK = [[10, { money: 10000 }, '10 000 💵'], [25, { energy: 10 }, '10 ⚡'], [45, { money: 25000, chips: 100 }, '25 000 💵 + 100 🎟']];
function clubPt() { const n = S.daily.cp || 0; if (n < CP_MAX) { S.daily.cp = n + 1; if (S.daily.cp === CP_MAX) { bump('clubDays'); toast('⭐ Клубний день: 45 очок, максимум на сьогодні'); } } }
function cpClaim(i) { const [need, r] = CP_TRACK[i]; if ((S.daily.cp || 0) < need) return; const c = S.daily.cpc || (S.daily.cpc = {}); if (c[i]) return; c[i] = true; give(r, 'Клубний день'); render(); }
const CLUB_COS = [
  ['t1', '🏷 Титул «Новачок клубу»', 500], ['t2', '🏷 Титул «Азартний»', 1500], ['t3', '🏷 Титул «Везунчик»', 3000], ['t4', '🏷 Титул «Шулер»', 6000], ['t5', '🏷 Титул «Бос столу»', 12000], ['t6', '🏷 Титул «Король барабанів»', 20000],
  ['f1', '🖼 Рамка профілю: золото', 800, '#d9a400'], ['f2', '🖼 Рамка профілю: неон', 2500, '#d0f'], ['f3', '🖼 Рамка профілю: вогонь', 8000, '#e33']
];
const clubOwn = () => S.cos || (S.cos = { own: [], title: '', frame: '' });
function cosBuy(k) { const c = CLUB_COS.find(x => x[0] === k), o = clubOwn(); if (o.own.includes(k)) return; if (!pay('chips', c[2])) return; o.own.push(k); bump('cosN'); toast('Куплено: ' + c[1]); render(); }
function cosUse(k) { const c = CLUB_COS.find(x => x[0] === k), o = clubOwn(), key = k[0] === 't' ? 'title' : 'frame'; o[key] = o[key] === k ? '' : k; render(); }
const cosTitle = () => { const k = clubOwn().title, c = CLUB_COS.find(x => x[0] === k); return c ? c[1].replace(/^🏷 Титул /, '') : ''; };
const cosFrame = () => { const k = clubOwn().frame, c = CLUB_COS.find(x => x[0] === k); return c ? c[3] : ''; };
const CLUB_SHOP = [
  ['en10', '⚡ +10 енергії', 150, () => give({ energy: 10 })], ['en25', '⚡ +25 енергії', 350, () => give({ energy: 25 })],
  ['m5', '💵 5 000', 100, () => give({ money: 5000 })], ['m15', '💵 15 000', 250, () => give({ money: 15000 })],
  ['am', '🔫 Патрони ×50', 80, () => give({ ammo: 50 })], ['gr', '💣 Гранати ×2', 120, () => give({ grenades: 2 })],
  ['bag', '📦 +1 завезення в секонд-хенді', 300, () => { const x = shS(); x.bags = Math.max(0, x.bags - 1); }],
  ['srch', '🧥 +1 оновлення полиць', 200, () => { const x = shS(); x.search = Math.max(0, x.search - 1); }],
  ['rep', '🚗 Ремонт авто на 50%', 150, () => { S.car.cond = Math.min(100, carCond() + 50); }],
  ['key', '🔑 Ключ складу ×1', 400, () => { sw().keys++; }], ['crt', '📦 Ящики складу ×2', 250, () => { sw().crates += 2; }],
  ['flp', '🔄 +1 купівля авто', 180, () => { const x = shS(); x.flips = Math.max(0, x.flips - 1); }]
];
function clubBuy(k) { const c = CLUB_SHOP.find(x => x[0] === k), d = S.daily.cs || (S.daily.cs = {}); if (d[k]) return toast('Сьогодні вже куплено'); if (!pay('chips', c[2])) return; d[k] = true; bump('clubShopN'); c[3](); toast('Куплено: ' + c[1]); render(); }
const CHIPS_SPINS = 20, CHIPS_POKER = 25, CHIPS_DAILY = CHIPS_SPINS * 10 + CHIPS_POKER * 10; // 450
function claimChips() { if (S.daily.chipsClaim) return; S.daily.chipsClaim = true; bump('chipsClaimN'); give({ chips: CHIPS_DAILY }, 'Щоденні фішки'); render(); }
SCREENS.club = p => {
  const t = p.tab || 'bon';
  let h = `<h2>🎰 ІГРОВИЙ КЛУБ</h2>${ctabs('club')}
  <div class="grid g2"><button class="y" style="padding:22px 4px" onclick="go('slots')">🎰 БАРАБАНИ УДАЧІ ›</button><button class="y" style="padding:22px 4px" onclick="go('poker')">🃏 КАРТКОВА ГРА ›</button></div>
  ${tabs([['bon', 'Фішки'], ['day', '⭐ День'], ['sh', '🛒 Крамниця'], ['cos', '🎁 Косметика'], ['rank', 'Рейтинг']], t)}`;
  if (t === 'bon') h += `<div class="box"><b>Щоденні фішки</b><div class="small">Вистачає на ${CHIPS_SPINS} спінів у слотах і ${CHIPS_POKER} партій у покері. Фішки не купуються й не обмінюються на інші валюти.</div><button class="${S.daily.chipsClaim ? 'dis' : 'y'}" style="width:100%;margin-top:4px" onclick="claimChips()">${S.daily.chipsClaim ? 'Отримано сьогодні' : 'Забрати ' + CHIPS_DAILY + ' 🎟'}</button>${subTier() ? `<div class="small" style="margin-top:4px">Підписка додає ще +${TIERS[subTier()].chips} 🎟 до щоденної виплати.</div>` : ''}</div><div class="box small">Фішки можна виграти й програти, ними не можна купити нічого за реальні гроші. Приз клубу: фішки, патрони, гранати.</div>`;
  if (t === 'day') {
    const n = S.daily.cp || 0, c = S.daily.cpc || {};
    h += `<div class="box"><b>⭐ Клубний день</b><div class="small">Очки дають за кожен спін або партію, незалежно від результату. Максимум ${CP_MAX} на добу, скидаються щодня.</div><div class="prog"><i style="width:${n / CP_MAX * 100}%"></i></div><div class="small">${n} / ${CP_MAX} очок</div></div>` +
      CP_TRACK.map(([need, r, txt], i) => `<div class="row"><div class="f"><b>${need} очок</b><div class="small">${txt}</div></div><button class="${c[i] ? 'dis' : n >= need ? 'y' : 'dis'}" onclick="cpClaim(${i})">${c[i] ? 'Отримано' : n >= need ? 'Забрати' : '🔒'}</button></div>`).join('');
  }
  if (t === 'sh') {
    const d = S.daily.cs || {};
    h += `<div class="box"><b>🛒 Крамниця клубу</b><div class="small">Корисні речі за 🎟. Кожну можна купити 1 раз на день. У тебе <b>${fmt(S.chips || 0)}</b> 🎟.</div></div>` +
      CLUB_SHOP.map(([k, n, p]) => `<div class="row"><div class="f">${n}</div><button class="${d[k] ? 'dis' : 'y'}" onclick="clubBuy('${k}')">${d[k] ? 'Куплено' : fmt(p) + ' 🎟'}</button></div>`).join('');
  }
  if (t === 'cos') {
    const o = clubOwn();
    h += `<div class="box"><b>🎁 Магазин клубу</b><div class="small">Косметика лише за 🎟. Не продається й не обмінюється. У тебе <b>${fmt(S.chips || 0)}</b> 🎟.</div></div>` +
      CLUB_COS.map(([k, n, p]) => { const has = o.own.includes(k), on = o.title === k || o.frame === k; return `<div class="row"><div class="f">${n}</div>${has ? `<button class="${on ? 'g' : 'y'}" onclick="cosUse('${k}')">${on ? '✓ Одягнено' : 'Одягти'}</button>` : `<button class="y" onclick="cosBuy('${k}')">${fmt(p)} 🎟</button>`}</div>`; }).join('');
  }
  if (t === 'rank') h += rankTable(['Тоні', 'Ла Ріка', 'Козак', S.name, 'Бандерас'], 'фішок');
  return h;
};

// --- СЛОТИ
// Математика: результат спіну визначається таблицею ваг (RTP ≈ 97%), барабани малюються під результат.
const SYM = ['7️⃣', '💲', '🔫', '💵', '🎲', '👑', '💎', '🥃', '🂡', '🔒', '🥇', '🚬'];
const SLOT_GOAL = 50;
const SLOT_BASE = [[1, 220000], [2, 104000], [3, 50000], [5, 24000], [10, 8000], [20, 2500], [50, 600], [100, 100], [200, 25], [500, 5]];
const SLOT_BONUS = [[2, 560000], [3, 230000], [5, 120000], [10, 55000], [25, 22000], [50, 8000], [100, 3500], [250, 1000], [500, 400], [1000, 100]];
const WINMAP = { 1: ['🥃', 3], 2: ['🚬', 3], 3: ['🎲', 3], 5: ['🔫', 3], 10: ['💵', 4], 20: ['💲', 4], 50: ['👑', 5], 100: ['💎', 5], 200: ['🥇', 5], 500: ['7️⃣', 5] };
function rollTable(t) { let x = Math.random() * 1e6; for (const [m, w] of t) { x -= w; if (x < 0) return m; } return 0; }
const tableEV = t => t.reduce((s, [m, w]) => s + m * w / 1e6, 0);
const SLOT_RTP = tableEV(SLOT_BASE) + tableEV(SLOT_BONUS) / SLOT_GOAL;
function rowRun(row) { let n = 1; while (n < 5 && row[n] === row[0]) n++; return n; }
function buildReels(mult) {
  for (let tries = 0; tries < 200; tries++) {
    const g = Array.from({ length: 15 }, () => pick(SYM));
    let line = -1;
    if (mult > 0) {
      const [sym, k] = WINMAP[mult]; line = rnd(0, 2);
      for (let i = 0; i < 5; i++) g[line * 5 + i] = i < k ? sym : pick(SYM.filter(x => x !== sym));
    }
    let ok = true;
    for (let r = 0; r < 3; r++) { if (r !== line && rowRun(g.slice(r * 5, r * 5 + 5)) >= 3) ok = false; }
    if (ok) return { g, line, k: mult > 0 ? WINMAP[mult][1] : 0 };
  }
  return { g: Array.from({ length: 15 }, (_, i) => SYM[(i * 5 + i) % 12]), line: -1, k: 0 };
}
let reels = null, winCells = [], lastWin = null, slotBonus = null;
function endIntro() { if (slotBonus && slotBonus.intro) { slotBonus.intro = false; if (cur().name === 'slots') render(); } }
function slotBonusUI() {
  const b = slotBonus;
  if (b.intro) return `<div onclick="endIntro()" style="text-align:center;padding:90px 10px"><div style="font-size:70px">🎁</div><div class="winban" style="font-size:26px;padding:20px">БОНУСНА ГРА!</div><div class="small">Приз: від x2 до x1000 від вашої ставки!</div><div class="small">(натисни, щоб пропустити)</div></div>`;
  const cells = Array.from({ length: 9 }, (_, i) => {
    if (b.picked === i) return `<div class="cell winner" style="height:70px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:18px"><b>x${b.mult}</b><span class="small">${fmt(b.pay)} 🎟</span></div>`;
    if (b.picked != null) return `<div class="cell" style="height:70px;display:flex;align-items:center;justify-content:center;opacity:.5">x${b.others[i]}</div>`;
    return `<button style="height:70px;font-size:26px" onclick="openSlotChest(${i})">🧰</button>`;
  }).join('');
  return `<h2>🎁 БОНУСНА ГРА!</h2><div class="winban ${b.mult >= 100 ? 'me' : ''}">${b.picked == null ? 'ОБЕРИ СКРИНЮ ТА ЗАБЕРИ ПРИЗ!' : (b.mult >= 100 ? '🔥 ДЖЕКПОТ x' + b.mult + '! 🔥' : 'ПРИЗ x' + b.mult + '!')}<div class="small">Приз = множник × ставка (${fmt(b.avg)} 🎟)</div></div>
  <div class="grid g3" style="margin:8px 0">${cells}</div>
  <div class="box small">${b.picked == null ? 'Можливі множники: x2 … x1000' : '✔ Бонус забрано. Повертаємось до слотів…'}</div>`;
}
function openSlotChest(i) {
  const b = slotBonus; if (!b || b.picked != null) return;
  b.picked = i; b.others = {}; const pool = SLOT_BONUS.map(x => x[0]);
  for (let k = 0; k < 9; k++) if (k !== i) b.others[k] = pick(pool);
  bump('bonusWon', b.pay); give({ chips: b.pay }, 'БОНУС x' + b.mult); pushHist({ bet: 0, win: b.pay, mult: b.mult, bonus: true });
  setTimeout(() => { slotBonus = null; if (cur().name === 'slots') render(); }, 3200);
  render();
}
SCREENS.slots = () => {
  if (slotBonus) return slotBonusUI();
  if (!reels) reels = buildReels(0).g;
  return `<div class="bar sp"><h2 style="margin:4px 0">🎰 СЛОТИ</h2><button class="y" onclick="slotFaq()">❓ FAQ</button></div>${ctabs('slots')}<div class="reel">${reels.map((s, i) => `<div class="${winCells.includes(i) ? 'win' : ''}">${s}</div>`).join('')}</div>
  <div class="${lastWin ? 'winban ' + (lastWin.mult >= 20 ? 'me' : '') : 'small'}" style="${lastWin ? '' : 'text-align:center;padding:10px'}">${lastWin ? (lastWin.mult >= 20 ? '🔥 ВЕЛИКИЙ ВИГРАШ ' : 'ВИГРАШ ') + 'x' + lastWin.mult + ': +' + fmt(lastWin.pay) + ' 🎟' : 'Крутни барабани'}</div>
  <div class="bar" style="justify-content:center;margin:8px 0"><button onclick="S.slots.bet=Math.max(10,S.slots.bet-10);render()">−</button><b>${S.slots.bet} 🎟</b><button onclick="S.slots.bet=Math.min(200,S.slots.bet+10);render()">+</button>
  <button class="y" style="padding:10px 24px;font-size:18px" onclick="spin()">ГРАТИ</button>
  <label><input type="checkbox" id="auto" ${autoOn ? 'checked' : ''} onchange="autoSpin(this.checked)"> АВТО</label></div>
  <div class="box small">🎁 Бонусна гра випадає випадково під час обертів: приз від x2 до x1000 від ставки.</div>
  <div class="box small">🔞 18+. Фішки не купуються й не обмінюються на інші валюти. Денний ліміт ставок ${fmt(SLOT_DAY_CAP)} 🎟 (сьогодні ${fmt(S.daily.sb || 0)}).</div>
  <div class="box"><div class="bar sp"><b>Історія спінів</b><span class="small">${slotStats()}</span></div>${slotHistory()}</div>`;
};
function slotFaq() {
  modal(`<h3>FAQ: Слоти</h3><b>Таблиця виплат</b> (множник на ставку)
  <table style="width:100%;border-collapse:collapse;font-size:12px;margin:4px 0">${SLOT_BASE.map(([m, w]) => `<tr style="border-bottom:1px solid #ddd"><td>${WINMAP[m][0].repeat(WINMAP[m][1])}</td><td><b>x${m}</b></td><td class="small">шанс 1 до ${fmt(Math.round(1e6 / w))}</td></tr>`).join('')}</table>
  <p class="small">Виграє збіг символів зліва направо в одному рядку.</p>
  <b>Бонусна гра</b><p class="small">Випадає випадково під час обертів (в середньому раз на ~${SLOT_GOAL} спінів). Приз від x2 до x1000 від ставки.</p>`);
}
function slotStats() {
  const h = S.slots.hist || []; if (!h.length) return '';
  const spent = h.reduce((s, x) => s + x.bet, 0), got = h.reduce((s, x) => s + x.win, 0);
  return `за ${h.length}: ${got - spent >= 0 ? '+' : ''}${fmt(got - spent)} 🎟`;
}
function slotHistory() {
  const h = S.slots.hist || []; if (!h.length) return '<div class="small">Поки порожньо. Крутни барабани.</div>';
  return h.map(x => { const net = x.win - x.bet, w = x.win > 0;
    return `<div class="bar sp" style="font-size:12px;padding:3px 4px;margin:2px 0;border-radius:3px;background:${x.bonus ? '#ffe9a8' : w ? '#d8f5d8' : '#f6dede'}">
      <span>${x.bonus ? '🎁 БОНУС' : w ? '✔ x' + x.mult : '✖ нічого'}</span><span class="small">ставка ${fmt(x.bet)}</span><b style="color:${net >= 0 ? '#090' : '#c00'}">${net >= 0 ? '+' : ''}${fmt(net)} 🎟</b></div>`; }).join('');
}
function pushHist(e) { if (!S.slots.hist) S.slots.hist = []; S.slots.hist.unshift(e); S.slots.hist.length = Math.min(S.slots.hist.length, 20); }
const SLOT_DAY_CAP = 2000;
let spinning = false, autoOn = false;
function animReels(final, done) {
  spinning = true;
  const cells = [...document.querySelectorAll('.reel div')];
  if (cells.length !== 15) { spinning = false; done(); return; }
  const stopAt = [650, 1000, 1350, 1750, 2250], t0 = Date.now(), stopped = [0, 0, 0, 0, 0];
  cells.forEach(c => c.classList.remove('win'));
  const tick = () => {
    if (cur().name !== 'slots') { spinning = false; done(); return; }
    const el = Date.now() - t0; let all = true;
    for (let c = 0; c < 5; c++) {
      if (el >= stopAt[c]) {
        if (!stopped[c]) { stopped[c] = 1; for (let r = 0; r < 3; r++) { const d = cells[r * 5 + c]; d.textContent = final[r * 5 + c]; d.classList.remove('spin'); d.classList.add('stop'); } }
      } else { all = false; for (let r = 0; r < 3; r++) { const d = cells[r * 5 + c]; d.textContent = pick(SYM); d.classList.add('spin'); } }
    }
    if (all) { spinning = false; setTimeout(done, 250); return; }
    const next = stopAt.find((x, k) => !stopped[k]), left = next - el;
    setTimeout(tick, left < 200 ? 170 : left < 450 ? 110 : 55);
  };
  tick();
}
function spin() {
  if (slotBonus || spinning) return;
  const bet = S.slots.bet;
  if (!S.daily.sb) S.daily.sb = 0;
  if (S.daily.sb + bet > SLOT_DAY_CAP) { autoSpin(false); return toast('Денний ліміт ставок у слотах ' + fmt(SLOT_DAY_CAP) + ' 🎟 вичерпано'); }
  if (!pay('chips', bet)) { autoSpin(false); return toast('Фішки закінчились. Нові: щоденні фішки в клубі'); }
  S.daily.sb += bet;
  const mult = rollTable(SLOT_BASE), R = buildReels(mult), bonusHit = Math.random() < 1 / SLOT_GOAL;
  lastWin = null; winCells = [];
  animReels(R.g, () => {
    reels = R.g; winCells = mult ? Array.from({ length: R.k }, (_, i) => R.line * 5 + i) : [];
    S.daily.casino++; bump('spins'); bump('slotBet', bet); if (mult >= 10) bump('slotX10'); if (mult >= 50) bump('slotX50'); clubPt();
    pushHist({ bet, win: bet * mult, mult });
    if (!mult) bump('slotLost', bet); if (mult) { bump('slotWins'); bump('slotBig', mult, 'max'); bump('slotWon', bet * mult); lastWin = { mult, pay: bet * mult }; give({ chips: bet * mult }, 'Виграш x' + mult); }
    if (bonusHit) {
      const m = rollTable(SLOT_BONUS) || 2; bump('slotBonus');
      slotBonus = { picked: null, mult: m, avg: bet, pay: bet * m, intro: true }; autoSpin(false); setTimeout(endIntro, 2200);
    }
    render();
    if (autoOn && !slotBonus && cur().name === 'slots') setTimeout(() => { if (autoOn && cur().name === 'slots') spin(); }, 600);
  });
}
function autoSpin(on) { autoOn = !!on; if (on) spin(); }

// --- БОНУСНА ГРА (скрині)
const BONUS_POOL = [['🎟 x100', { chips: 100 }], ['🔫 патрони x30', { ammo: 30 }], ['🎟 x250', { chips: 250 }], ['💣 граната x1', { grenades: 1 }], ['🎟 x50', { chips: 50 }], ['🎟 x500', { chips: 500 }]];

// --- ПОКЕР (спрощений техаський холдем, 1 гравець + 4 боти)
const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const HAND_N = ['Старша карта', 'Пара', 'Дві пари', 'Трійка', 'Стріт', 'Флеш', 'Фул-хаус', 'Каре', 'Стріт-флеш'];
function deck() { const d = []; SUITS.forEach(s => RANKS.forEach((r, i) => d.push({ r: i, s }))); for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; } return d; }
function score5(c) {
  const rs = c.map(x => x.r).sort((a, b) => b - a), fl = c.every(x => x.s === c[0].s);
  const u = [...new Set(rs)]; let st = -1;
  if (u.length === 5) { if (u[0] - u[4] === 4) st = u[0]; else if (u[0] === 12 && u[1] === 3) st = 3; }
  const cnt = {}; rs.forEach(r => cnt[r] = (cnt[r] || 0) + 1);
  const g = Object.entries(cnt).map(([r, n]) => [n, +r]).sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  const kick = g.map(x => x[1]);
  if (st >= 0 && fl) return [8, st]; if (g[0][0] === 4) return [7, ...kick]; if (g[0][0] === 3 && g[1][0] === 2) return [6, ...kick];
  if (fl) return [5, ...rs]; if (st >= 0) return [4, st]; if (g[0][0] === 3) return [3, ...kick];
  if (g[0][0] === 2 && g[1][0] === 2) return [2, ...kick]; if (g[0][0] === 2) return [1, ...kick]; return [0, ...rs];
}
function cmp(a, b) { for (let i = 0; i < Math.max(a.length, b.length); i++) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0); } return 0; }
function best7(c) { let best = null; for (let a = 0; a < 7; a++) for (let b = a + 1; b < 7; b++) { const h = score5(c.filter((_, i) => i !== a && i !== b)); if (!best || cmp(h, best) > 0) best = h; } return best; }
function cardH(c, hide) { if (hide) return '<span class="card back"></span>'; return `<span class="card ${c.s === '♥' || c.s === '♦' ? 'red' : ''}">${RANKS[c.r]}${c.s}</span>`; }
let PK = null;
let STAKE = 10; const POKER_DAY = 25;
const PK_TABLES = [[10, '🟢 Стіл новачків', 'Для щоденних завдань і досягнень'], [50, '🔵 Звичайний стіл', 'Трохи більші ставки'], [500, '🟣 Стіл гравців', 'Для тих, хто любить пограти по-справжньому'], [1000, '🔴 VIP-стіл', 'Найвищі ставки']];
let PKT = null, PKR = 0;
function pkSit(i) { const t = PK_TABLES[i]; if (S.chips < t[0]) return toast('Для цього столу треба мінімум ' + fmt(t[0]) + ' 🎟'); PKT = i; STAKE = t[0]; render(); }
function pokerNew() {
  if ((S.daily.pk || 0) >= POKER_DAY) return toast('Ліміт покеру на сьогодні: ' + POKER_DAY + ' партій. Завтра нові');
  if (S.chips < STAKE) return toast('Мінімум ' + STAKE + ' 🎟. Нові фішки: щоденні в клубі');
  const d = deck();
  PK = { d, me: [d.pop(), d.pop()], bots: ['Тоні', 'Сеньйор', 'Лисий', 'Ла Ріка'].map((n, i) => ({ n, c: [d.pop(), d.pop()], fold: false, stack: STAKE * 10, th: [0.42, 0.38, 0.3, 0.45][i], bl: [0.05, 0.03, 0.12, 0.04][i] })), board: [d.pop(), d.pop(), d.pop(), d.pop(), d.pop()], st: 0, bank: 0, over: false, msg: '', owe: 0, raises: 0 };
  S.daily.pk = (S.daily.pk || 0) + 1; S.chips -= STAKE; bump('pokerSpent', STAKE); bump('chipsSpent', STAKE); PK.bank = STAKE * 5; S.daily.casino++; bump('pokerPlayed'); clubPt(); render();
}
SCREENS.poker = () => {
  let h = `<h2>🃏 ПОКЕР</h2>${ctabs('poker')}<div class="box small">Шлях гравця: ${Array.from({ length: 10 }, (_, i) => i < S.pokerPath ? '■' : '□').join('')} ${S.pokerPath}/10 (кожна перемога +1, на 10 — скриня)</div>`;
  if (!PK && PKT == null) return h + `<div class="box small">Обери стіл. Мінімальний вхід дорівнює ставці за стіл. Партій на добу: ${S.daily.pk || 0}/${POKER_DAY}.</div>` + PK_TABLES.map((t, i) => `<div class="row"><div class="f"><b>${t[1]}</b><div class="small">Вхід від ${fmt(t[0])} 🎟 · ${t[2]}</div></div><button class="${S.chips >= t[0] ? 'y' : 'dis'}" onclick="pkSit(${i})">Сісти ›</button></div>`).join('');
  if (!PK) return h + `<div class="box"><b>${PK_TABLES[PKT][1]}</b><br>Ставка за стіл: ${fmt(STAKE)} 🎟 (з кожного гравця). Боти: 4. Партій сьогодні: ${S.daily.pk || 0}/${POKER_DAY}.</div><button class="y" style="width:100%;padding:12px" onclick="pokerNew()">СІСТИ ЗА СТІЛ</button>`;
  const show = [0, 3, 4, 5][PK.st] ?? 5;
  const WN = PK.over ? PK.win : null;
  const banner = WN ? `<div class="winban ${WN === 'Ви' ? 'me' : ''}">${WN === 'Ви' ? '🏆 ВИ ПЕРЕМОГЛИ! +' + fmt(PK.bank) + ' 🎟' : '🏆 ПЕРЕМОЖЕЦЬ: ' + WN.toUpperCase()}</div>` : '';
  h += banner + `<div class="grid g2">${PK.bots.map(b => `<div class="cell ${WN === b.n ? 'winner' : ''}">${WN === b.n ? '<div class="crown">🏆 ПЕРЕМОЖЕЦЬ</div>' : ''}${b.n} ${b.fold ? '(скинув)' : ''}<br>${b.c.map(c => cardH(c, !PK.over)).join('')}<br><span class="small">${PK.over && PK.hands && PK.hands[b.n] ? PK.hands[b.n] + ' · ' : ''}${fmt(b.stack)}</span></div>`).join('')}</div>
  <div class="box" style="text-align:center"><b>БАНК: ${fmt(PK.bank)} 🎟</b><br>${PK.board.map((c, i) => i < show || PK.over ? cardH(c) : cardH(c, true)).join('')}</div>
  <div class="${WN === 'Ви' ? 'winner' : ''}" style="text-align:center;padding:4px;border-radius:4px">${WN === 'Ви' ? '<div class="crown">🏆 ПЕРЕМОЖЕЦЬ</div>' : ''}<b>Ви:</b> ${PK.me.map(c => cardH(c)).join('')}${PK.over && PK.hands && PK.hands['Ви'] ? '<div class="small">' + PK.hands['Ви'] + '</div>' : ''}</div>
  ${PK.msg ? `<div class="box">${PK.msg}</div>` : ''}`;
  if (PK.over) return h + `<button class="y" style="width:100%" onclick="pokerNew()">Нова роздача</button> <button style="width:100%;margin-top:4px" onclick="PK=null;PKT=null;render()">Встати з-за столу</button>`;
  const mn = Math.max(5, Math.round(STAKE / 2)), mx = Math.max(mn, Math.min(S.chips - (PK.owe || 0), STAKE * 10)), stp = mn;
  PKR = Math.max(mn, Math.min(mx, PKR || mn)); PKR = Math.round(PKR / stp) * stp || mn;
  return h + `<div class="box"><div class="bar sp"><b>Підняти ставку</b><b id="rv">+${fmt(PKR)} 🎟</b></div><input type="range" min="${mn}" max="${mx}" step="${stp}" value="${PKR}" style="width:100%" oninput="PKR=+this.value;$('rv').textContent='+'+fmt(PKR)+' 🎟'"><div class="bar sp small"><span>мін. ${fmt(mn)}</span><span>макс. ${fmt(mx)}</span></div></div>
  <div class="grid g4" style="margin-top:6px"><button onclick="pkAct('fold')">↶ СКИНУТИ</button><button class="g" onclick="pkAct('call')">${PK.owe ? '✓ КОЛ ' + PK.owe : '✓ ЧЕК'}</button><button class="y" onclick="pkAct('raise',PKR)">ПІДНЯТИ</button><button style="background:#f99" onclick="pkAct('all')">УСЕ В БАНК</button></div>`;
};
// --- ШІ ботів: оцінка сили руки, скидають слабкі, сильні ставлять і піднімають, рідкі блефи
function best5(cs) { let best = null; const n = cs.length; (function rec(st, pk) { if (pk.length === 5) { const h = score5(pk.map(i => cs[i])); if (!best || cmp(h, best) > 0) best = h; return; } for (let i = st; i < n; i++) { pk.push(i); rec(i + 1, pk); pk.pop(); } })(0, []); return best; }
function pkStr(hole, board, k) {
  const cl = x => Math.max(0, Math.min(1, x));
  if (k < 3) {
    const [a, b] = hole.map(c => c.r).sort((x, y) => y - x);
    if (a === b) return cl(0.55 + 0.4 * a / 12);
    return cl(0.1 + 0.5 * (a * 2 + b) / 36 + (hole[0].s === hole[1].s ? 0.06 : 0) + (a - b <= 2 ? 0.04 : 0));
  }
  const vis = board.slice(0, k), h = best5([...hole, ...vis]), cat = h[0];
  let v = [0.12, 0.42, 0.72, 0.8, 0.86, 0.9, 0.95, 0.98, 1][cat];
  if (cat === 0) v += 0.15 * h[1] / 12;
  if (cat === 1) { v += 0.15 * h[1] / 12; if (!hole.some(c => c.r === h[1])) v -= 0.2; }
  if (cat < 5 && k < 5) { const cnt = {}; [...hole, ...vis].forEach(c => cnt[c.s] = (cnt[c.s] || 0) + 1); if (Object.entries(cnt).some(([su, n]) => n >= 4 && hole.some(c => c.s === su))) v += 0.12; }
  return cl(v);
}
const pkK = () => [0, 3, 4, 5][PK.st] ?? 5;
// face: скільки фішок треба доплатити, щоб лишитись у грі
function botDecide(b, face, canRaise) {
  const sv = pkStr(b.c, PK.board, pkK());
  if (face > 0) {
    const need = 0.12 + 1.2 * face / (PK.bank + face) + (b.th - 0.4) * 0.5;
    if (sv < need) return 'fold';
    if (canRaise && sv > 0.78 && Math.random() < 0.45) return 'raise';
    return 'call';
  }
  if (canRaise && sv > 0.76 && Math.random() < 0.6) return 'raise';
  if (canRaise && sv < 0.4 && Math.random() < b.bl) return 'raise';
  return 'check';
}
// face: ставка, яку мають зрівняти боти (від гравця); повертає суму підвищень ботів
function botsRound(face) {
  const log = []; let raiseAmt = 0;
  PK.bots.forEach(b => {
    if (b.fold) return;
    const act = botDecide(b, face, PK.raises < 2 && !raiseAmt);
    if (act === 'fold') { b.fold = true; log.push(b.n + ': скинув'); return; }
    if (face > 0) { const p = Math.min(face, b.stack); PK.bank += p; b.stack -= p; }
    if (act === 'raise') { PK.bank += STAKE; b.stack -= STAKE; raiseAmt += STAKE; b.raised = true; log.push(b.n + ': підняв +' + STAKE); }
    else log.push(b.n + ': ' + (face > 0 ? 'кол' : 'чек'));
  });
  PK.msg = log.join(' · ');
  return raiseAmt;
}
function pkAdvance() {
  PK.owe = 0; PK.raises = 0;
  if (PK.bots.every(b => b.fold)) return showdown();
  PK.st++; if (PK.st >= 3) showdown();
}
function pkAct(a, amt) {
  if (PK.over) return;
  if (a === 'fold') {
    PK.over = true; PK.fold = true;
    const bs = PK.bots.filter(b => !b.fold), w = bs.map(b => ({ n: b.n, h: best7([...b.c, ...PK.board]) })).sort((x, y) => cmp(y.h, x.h))[0];
    PK.win = w ? w.n : PK.bots[0].n; PK.msg = 'Ви скинули карти. Банк забрав ' + PK.win + '.'; return render();
  }
  const owe = PK.owe || 0;
  if (a === 'all') {
    const add = Math.min(S.chips, STAKE * 10); if (add <= 0) return toast('Немає фішок');
    S.chips -= add; PK.bank += add;
    const log = [];
    PK.bots.forEach(b => { if (b.fold) return; const sv = pkStr(b.c, PK.board, pkK()); if (sv < 0.12 + 1.2 * add / (PK.bank + add) + (b.th - 0.4) * 0.5) { b.fold = true; log.push(b.n + ': скинув'); } else { const p = Math.min(add, b.stack); PK.bank += p; b.stack -= p; log.push(b.n + ': кол'); } });
    PK.msg = log.join(' · '); PK.st = 3; return showdown(), render();
  }
  const ramt = a === 'raise' ? Math.max(Math.max(5, Math.round(STAKE / 2)), amt || STAKE) : 0;
  let pay = owe + ramt;
  if (pay > S.chips) { if (S.chips <= 0) return toast('Немає фішок'); pay = S.chips; }
  S.chips -= pay; PK.bank += pay;
  const face = ramt;
  if (owe > 0 && a === 'call') {
    // гравець зрівняв підвищення бота: решта ботів теж мусить зрівняти або скинути
    const log = [];
    PK.bots.forEach(b => { if (b.fold || b.raised) return; const sv = pkStr(b.c, PK.board, pkK()); if (sv < 0.12 + 1.2 * owe / (PK.bank + owe) + (b.th - 0.4) * 0.5) { b.fold = true; log.push(b.n + ': скинув'); } else { const p = Math.min(owe, b.stack); PK.bank += p; b.stack -= p; } });
    PK.bots.forEach(b => b.raised = false);
    if (log.length) PK.msg = log.join(' · ');
    pkAdvance(); return render();
  }
  const ra = botsRound(face);
  if (ra > 0) {
    PK.owe = ra; PK.raises++;
    PK.msg += ` · Вам доплатити ${ra} 🎟 або скинути.`;
    return render();
  }
  pkAdvance(); render();
}
function showdown() {
  PK.over = true;
  const all = [{ n: 'Ви', me: true, h: best7([...PK.me, ...PK.board]) }, ...PK.bots.filter(b => !b.fold).map(b => ({ n: b.n, h: best7([...b.c, ...PK.board]) }))];
  all.sort((x, y) => cmp(y.h, x.h));
  { const mh = all.find(x => x.me), kk = ['', 'pkPair', 'pkTwo', 'pkTrips', 'pkStr', 'pkFlush', 'pkFull', 'pkQuads', 'pkSF'][mh.h[0]]; if (kk) bump(kk); }
  const w = all[0]; PK.win = w.n; PK.hands = Object.fromEntries(all.map(x => [x.n, HAND_N[x.h[0]]]));
  PK.msg = all.map(x => `${x.n}: ${HAND_N[x.h[0]]}`).join('<br>') + `<br><b>Переміг: ${w.n}</b>`;
  if (w.me) {
    give({ chips: Math.floor(PK.bank * 0.92), xp: 100 }, 'Банк (комісія клубу 8%)'); S.ach.pokerWins++; bump('pokerWins'); bump('pokerWon', PK.bank); S.pokerPath++;
    if (S.pokerPath >= 10) { S.pokerPath = 0; give({ chips: 20 }, 'Шлях гравця пройдено'); }
  }
}

// --- ГОНКИ
SCREENS.races = p => {
  const rt = p.rt || 'solo';
  const hd = `<h2>🏁 ГОНКИ</h2>` + tabs([['solo', 'Заїзд'], ['group', '👥 Групові 5×5']], rt, 'rt');
  if (rt === 'group') return hd + grScreen();
  const ti = p.tr || 0, tr = TRACKS[ti], power = carPower();
  return hd + `<div class="box" style="text-align:center">🚗💨 🚕💨 <span class="small">[траса: ${tr.n}]</span></div>
  <div class="box bar sp"><button onclick="setP('tr',${(ti + TRACKS.length - 1) % TRACKS.length})">◀</button>
  <div><b>Траса: ${tr.n}</b><br>Довжина: ${tr.km} км · Кіл: ${tr.laps}${tr.req ? `<br><span class="small">Рекомендована сила авто: ${tr.req}</span>` : ''}</div>
  <button onclick="setP('tr',${(ti + 1) % TRACKS.length})">▶</button></div>
  <div class="box">Ваше авто: ${S.car.name} · сила ${power} · стан ${Math.round(carCond())}%</div>
  <button class="y" style="width:100%;padding:16px;font-size:20px" onclick="race(${ti})">СТАРТ ⚡5</button>
  <div class="grid g4" style="margin-top:6px"><button onclick="go('garage')">Гараж</button><button onclick="toast('Турніри: заглушка')">Турніри</button><button onclick="toast('Нагороди сезону гонок: заглушка')">Нагороди</button><button onclick="modal(rankTable(['Тоні','${S.name}','Козак','Бандерас','Ла Ріка'],'очок'))">Рейтинг</button></div>`;
};
function race(ti) {
  if (carCond() < 20) return toast('Авто зламане: зроби ремонт у гаражі');
  if (!pay('energy', 5)) return; wearCar(6);
  const me = carPower(), tr = TRACKS[ti];
  const opp = [0, 1, 2].map(() => (tr.req || 900) * (0.85 + Math.random() * 0.4));
  const myScore = me * (0.85 + Math.random() * 0.3) * (1 + clanEff('raceSpd') / 100);
  const place = 1 + opp.filter(o => o > myScore).length;
  S.week.races++; bump('racesN');
  const rew = [[15000, 1], [8000, 0], [4000, 0], [1500, 0]][place - 1]; // ≈1500 💵 на 1 ⚡ (гонка 5 ⚡)
  if (place === 1) { S.ach.raceWins++; bump('raceWins'); }
  if (place <= 3) bump('raceTop3');
  give({ money: Math.round(rew[0] * clanMul('raceRew')), crystals: Math.round(rew[1] * clanMul('raceRew')), xp: 60 }, `Місце ${place}`);
  modal(`<h3>Фініш!</h3><p>Ви прийшли <b>${place}-м</b> з 4.</p>`); render();
}

// --- ГРУПОВІ ЗАЇЗДИ 5×5 (15 хв)
const GR_MIN = 15, GR_EN = 5, GR_NAMES = ['Козак', 'Ла Ріка', 'Бандерас', 'Тоні', 'Віталік', 'Рокі', 'Мамба', 'Кобра', 'Дрифтер', 'Шторм', 'Нітро', 'Ґрінго'];
function grMake() {
  const me = carPower(), pool = GR_NAMES.slice().sort(() => Math.random() - 0.5);
  const mk = n => ({ n, pw: Math.round(me * (0.7 + Math.random() * 0.6)), me: false });
  const A = [{ n: S.name, pw: me, me: true }, ...pool.slice(0, 4).map(mk)], B = pool.slice(4, 9).map(mk);
  S.gr = { st: 'lobby', A, B };
}
function grSum(t) { return t.reduce((a, x) => a + x.pw, 0); }
function grStart() {
  if (carCond() < 20) return toast('Авто зламане: зроби ремонт у гаражі');
  if (!pay('energy', GR_EN)) return; wearCar(10);
  S.gr.A[0].pw = carPower(); S.gr.st = 'run'; S.gr.end = Date.now() + GR_MIN * 60000; S.gr.t0 = Date.now(); render();
}
function grFinish() {
  const g = S.gr, sc = t => t.reduce((a, x) => a + x.pw * (0.85 + Math.random() * 0.3), 0), a = sc(g.A), b = sc(g.B), win = a >= b;
  const all = [...g.A, ...g.B].map(x => ({ n: x.n, v: x.pw * (0.85 + Math.random() * 0.3), me: x.me })).sort((x, y) => y.v - x.v), place = all.findIndex(x => x.me) + 1;
  const rew = win ? { money: 20000, crystals: 1, xp: 80 } : { money: 6000, xp: 30 };
  if (place === 1) rew.money += 8000;
  S.week.races++; bump('racesN'); if (win) { S.ach.raceWins++; bump('raceWins'); }
  give({ money: Math.round(rew.money * clanMul('raceRew')), crystals: rew.crystals ? Math.round(rew.crystals * clanMul('raceRew')) : 0, xp: rew.xp }, win ? 'Перемога команди' : 'Заїзд завершено');
  g.st = 'done'; g.res = { win, a: Math.round(a), b: Math.round(b), place };
}
function grTick() { if (S.gr && S.gr.st === 'run' && Date.now() >= S.gr.end) { grFinish(); return true; } return false; }
const grSlot = x => `<div class="cell" style="${x.me ? 'outline:2px solid #000;font-weight:bold' : ''}">${x.n}<br>⚙️ ${x.pw}</div>`;
function grScreen() {
  grTick();
  if (!S.gr) return `<div class="box">Груповий заїзд: дві команди по 5 гравців, видно силу авто кожного. Заїзд триває <b>${GR_MIN} хв</b>, потім нагорода всій команді-переможцю.</div><div class="box">Твоє авто: сила <b>${carPower()}</b> · стан ${Math.round(carCond())}%</div><button class="y" style="width:100%;padding:14px" onclick="grMake();render()">Знайти заїзд</button>`;
  const g = S.gr, sa = grSum(g.A), sb = grSum(g.B);
  const win = `<div style="display:flex;gap:6px"><div style="flex:1"><div class="small" style="text-align:center">🟦 Твоя команда · ⚙️ ${sa}</div>${g.A.map(grSlot).join('')}</div><div style="flex:1"><div class="small" style="text-align:center">🟥 Суперники · ⚙️ ${sb}</div>${g.B.map(grSlot).join('')}</div></div>`;
  if (g.st === 'lobby') return win + `<div class="box small">Шанс команди: ${Math.round(sa / (sa + sb) * 100)}%. Ремонт перед стартом підвищує силу.</div><button class="y" style="width:100%;padding:14px" onclick="grStart()">СТАРТ ⚡${GR_EN}</button><div class="grid g3" style="margin-top:5px"><button onclick="go('garage')">Гараж</button><button onclick="grMake();render()">Інший склад</button><button onclick="S.gr=null;render()">Вийти</button></div>`;
  if (g.st === 'run') {
    const left = Math.max(0, g.end - Date.now()), pr = 1 - left / (GR_MIN * 60000), m = Math.floor(left / 60000), sec = Math.floor(left / 1000) % 60;
    return win + `<div class="box" style="text-align:center">🏁 Заїзд іде · залишилось <b>${m}:${String(sec).padStart(2, '0')}</b><div class="prog"><i style="width:${pr * 100}%"></i></div><div class="small">Повернись пізніше: результат підрахується автоматично.</div></div>`;
  }
  const r = g.res;
  return win + `<div class="box" style="text-align:center"><h3>${r.win ? '🏆 Перемога!' : 'Поразка'}</h3>Команда ${r.a} : ${r.b} · твоє місце ${r.place}-е з 10</div><button class="y" style="width:100%" onclick="S.gr=null;render()">Ок</button>`;
}

// --- СЕКОНД-ХЕНД
// --- ПЕРЕКУП АВТО: купи сток, огляд, ремонт/тюнінг, продай найкращому покупцю. Сліпий перекуп у мінусі, обізнаний у плюсі.
const CAR_CLS = [
  { id: 'eco', n: 'Бюджетні', base: [15000, 30000], need: 1, names: ['Хетчбек «Міккі»', 'Седан «Рута»', 'Універсал «Дніпро»', 'Фургон «Бджілка»'] },
  { id: 'mid', n: 'Середні', base: [45000, 90000], need: 2, names: ['Седан «Ґранд»', 'Кросовер «Атлас»', 'Купе «Сієста»', 'Мінівен «Сафарі»'] },
  { id: 'sport', n: 'Спорткари', base: [120000, 250000], need: 4, names: ['Спорткар «Блискавка»', 'Купе «Фурія»', 'Родстер «Сирена»', 'Купе «Шторм»'] },
  { id: 'lux', n: 'Преміум', base: [300000, 700000], need: 6, names: ['Лімузин «Маестро»', 'Седан «Імператор»', 'Кабріолет «Люкс»', 'Кросовер «Резиденція»'] },
];
const CAR_COND = [['Ідеальний', 0.15, 1.10], ['Нормальний', 0.55, 1.0], ['Потертий', 0.20, 0.88], ['Проблемний', 0.10, 0.72]];
const CAR_UP = [
  { id: 'wash', n: '🧽 Мийка і полірування', cost: 0.02, gain: 0.03, en: 2, d: 'Дешево, невеликий плюс до ціни' },
  { id: 'fix', n: '🔧 Капремонт', cost: 0.08, en: 4, d: 'Лише для потертих і проблемних: стан стає нормальним', need: c => c.cond >= 2 },
  { id: 'body', n: '🎨 Кузов і фарба', cost: 0.06, gain: 0.07, en: 3, d: 'Середній плюс до ціни' },
  { id: 'chip', n: '⚙️ Чіп-тюнінг', cost: 0.09, gain: 0.11, en: 4, d: 'Потрібен рівень перекупа 3', lvl: 3 },
  { id: 'kit', n: '🏁 Спорт-пакет', cost: 0.12, gain: 0.15, en: 5, d: 'Потрібен рівень перекупа 5', lvl: 5 },
];
const FLIP_XP = [0, 30, 80, 150, 250, 400, 600, 900, 1300, 1800, 2500, 3400, 4500, 5800, 7500];
function fl() { if (!S.flip) S.flip = { xp: 0, lots: null, cars: [], uid: 1, dDay: '', demand: {} }; if (S.flip.dDay !== today()) { S.flip.dDay = today(); S.flip.demand = {}; CAR_CLS.forEach(c => S.flip.demand[c.id] = +(0.92 + Math.random() * 0.2).toFixed(2)); } return S.flip; }
const flLvl = () => { const x = fl().xp; let l = 1; FLIP_XP.forEach((v, i) => { if (x >= v) l = i + 1; }); return l; };
const flFee = () => Math.max(2, 6 - 0.4 * (Math.min(flLvl(), 10) - 1));
const flSlots = () => 2 + shTier().flips;
function genCar() {
  const avail = CAR_CLS.filter(c => c.need <= flLvl()), cls = pick(avail.length > 2 ? avail.slice(-3) : avail);
  let r = Math.random(), cond = 0, a = 0; CAR_COND.forEach((c, i) => { a += c[1]; if (r >= a - c[1] && r < a) cond = i; });
  const norm = Math.round(rnd(cls.base[0], cls.base[1]) / 100) * 100;
  return { id: fl().uid++, cls: cls.id, name: pick(cls.names), norm, cond, seen: false, ask: Math.round(norm * (0.92 + Math.random() * 0.14) / 100) * 100, up: [], paid: 0 };
}
const carVal = c => Math.round(c.norm * (c.up.includes('fix') ? 1 : CAR_COND[c.cond][2]) * (1 + c.up.reduce((s, u) => s + (CAR_UP.find(x => x.id === u).gain || 0), 0)) * fl().demand[c.cls]);
function flLots() { const f = fl(); if (!f.lots) f.lots = Array.from({ length: 4 }, genCar); return f.lots; }
function flRefresh() { if (!pay('energy', 3)) return; fl().lots = null; render(); }
function flInspect(id, where) { const c = (where === 'lot' ? flLots() : fl().cars).find(x => x.id === id); if (!c || c.seen) return; if (!pay('energy', 1)) return; c.seen = true; render(); }
function flBuy(id) {
  const f = fl(), c = flLots().find(x => x.id === id); if (!c) return;
  if (CAR_CLS.find(x => x.id === c.cls).need > flLvl()) return toast('Потрібен вищий рівень перекупа');
  if (f.cars.length >= flSlots()) return toast('Усі місця в гаражі зайняті (' + flSlots() + '). Продай авто або підписка додасть місце');
  if (shLeft('flips') < 1) return toast('Ліміт купівель авто на сьогодні вичерпано. Завтра нові або докупи за 💎');
  if (!pay('money', c.ask)) return;
  shS().flips++; c.paid = c.ask; f.lots = f.lots.filter(x => x !== c); f.cars.push(c); toast('Куплено: ' + c.name); render();
}
function flUp(id, u) {
  const c = fl().cars.find(x => x.id === id), U = CAR_UP.find(x => x.id === u); if (!c || c.up.includes(u)) return;
  if (U.lvl && flLvl() < U.lvl) return toast('Потрібен рівень перекупа ' + U.lvl);
  if (U.need && !U.need(c)) return toast('Цьому авто це не потрібно');
  const cost = Math.round(c.norm * U.cost); if (!pay('money', cost)) return; if (!pay('energy', U.en)) { S.money += cost; return; }
  c.up.push(u); c.paid += cost; c.seen = true; render();
}
function flOffers(c) { c.offers = [0, 1, 2].map(() => Math.round(carVal(c) * (0.90 + Math.random() * 0.18) / 100) * 100); }
function flStartSell(id) { const c = fl().cars.find(x => x.id === id); if (!c) return; c.rr = 0; flOffers(c); c.sell = true; render(); }
function flReroll(id) { const c = fl().cars.find(x => x.id === id); if (c.rr >= 2) return toast('Нових покупців більше немає'); if (!pay('energy', 2)) return; c.rr++; flOffers(c); render(); }
function flAccept(id, k) {
  const f = fl(), c = f.cars.find(x => x.id === id), gross = c.offers[k], fee = Math.round(gross * flFee() / 100), net = gross - fee, profit = net - c.paid;
  f.cars = f.cars.filter(x => x !== c); const old = flLvl(); f.xp += 10 + 5 * CAR_CLS.findIndex(x => x.id === c.cls) + (profit > 0 ? 5 : 0); if (flLvl() > old) lvGrant('fl', old, flLvl());
  bump('flipN'); if (profit > 0) bump('flipProfit', profit); give({ money: net }, 'Продано авто');
  modal(`<h3>Угоду закрито</h3><p>${c.name}: продано за ${fmt(gross)}, податок ${flFee().toFixed(1)}% (${fmt(fee)}).<br>Вкладено ${fmt(c.paid)} → отримано ${fmt(net)}.<br><b style="color:${profit >= 0 ? '#090' : '#c00'}">${profit >= 0 ? 'Прибуток' : 'Збиток'}: ${fmt(Math.abs(profit))} 💵</b>${flLvl() > old ? '<br>🎉 Новий рівень перекупа ' + flLvl() + '!' : ''}</p>`); render();
}
function carCard(c, lot) {
  const cl = CAR_CLS.find(x => x.id === c.cls), locked = cl.need > flLvl(), dm = fl().demand[c.cls];
  const st = c.seen ? `Стан: <b>${CAR_COND[c.cond][0]}${c.up.includes('fix') ? ' → відремонтовано' : ''}</b>` : 'Стан: ❓ невідомий (огляд ⚡1)';
  let h = `<div class="box"><b>${c.name}</b> <span class="small">${cl.n}</span><div class="small">Ціна в нормальному стані ≈ ${fmt(c.norm)} · ${st}${c.up.length ? '<br>Покращення: ' + c.up.map(u => CAR_UP.find(x => x.id === u).n).join(', ') : ''}</div>`;
  if (lot) return h + `<div class="bar" style="margin-top:4px">${c.seen ? '' : `<button onclick="flInspect(${c.id},'lot')">🔍 Огляд ⚡1</button>`}<button class="y" ${locked ? 'disabled' : ''} onclick="flBuy(${c.id})">${locked ? '🔒 рівень ' + cl.need : 'Купити ' + fmt(c.ask) + ' 💵'}</button></div></div>`;
  h += `<div class="small">Вкладено: ${fmt(c.paid)} · зараз оцінюють ≈ <b>${c.seen ? fmt(carVal(c)) : '? (потрібен огляд)'}</b> · попит ${dm >= 1.05 ? '🔥' : dm <= 0.96 ? '❄' : ''}×${dm}</div>`;
  if (c.sell) return h + `<div class="small" style="margin-top:4px"><b>Пропозиції покупців</b> (податок ${flFee().toFixed(1)}%):</div>${c.offers.map((o, k) => `<div class="row"><div class="f">Покупець ${k + 1}: <b>${fmt(o)}</b><div class="small">на руки ${fmt(o - Math.round(o * flFee() / 100))} · ${o - Math.round(o * flFee() / 100) >= c.paid ? '<span style="color:#090">у плюс</span>' : '<span style="color:#c00">у збиток</span>'}</div></div><button class="y" onclick="flAccept(${c.id},${k})">Продати</button></div>`).join('')}<div class="bar"><button onclick="flReroll(${c.id})">Шукати покупців ⚡2 (${2 - c.rr} з 2)</button><button onclick="fl().cars.find(x=>x.id==${c.id}).sell=false;render()">Передумав</button></div></div>`;
  return h + `<div class="bar" style="margin-top:4px">${c.seen ? '' : `<button onclick="flInspect(${c.id},'car')">🔍 Огляд ⚡1</button>`}${CAR_UP.filter(u => !c.up.includes(u.id) && (!u.need || u.need(c)) && (!u.lvl || flLvl() >= u.lvl)).map(u => `<button onclick="flUp(${c.id},'${u.id}')" title="${u.d}">${u.n}<br><span class="small">${fmt(c.norm * u.cost)} 💵 · ⚡${u.en}</span></button>`).join('')}</div><button class="y" style="width:100%;margin-top:4px" onclick="flStartSell(${c.id})">💰 Продати</button></div>`;
}
function flipTab() {
  const f = fl(), l = flLvl(), nx = FLIP_XP[l];
  return `<div class="box"><b>🚗 Перекуп авто</b> · рівень ${l}${nx ? `<div class="prog"><i style="width:${(f.xp - FLIP_XP[l - 1]) / (nx - FLIP_XP[l - 1]) * 100}%"></i></div><span class="small">${f.xp}/${nx} досвіду</span>` : ' (максимум)'}
  <div class="small">Як це працює: <b>1)</b> купи авто з оголошень <b>2)</b> огляд ⚡1 покаже справжній стан <b>3)</b> за потреби відремонтуй і прокачай <b>4)</b> продай найкращому покупцеві. Купиш наосліп і можеш втратити гроші: ідеальні й ремонтопридатні авто дають прибуток. Рівень відкриває дорожчі класи й знижує податок (зараз ${flFee().toFixed(1)}%).</div></div>
  ${lvTable('fl')}
  <div class="grid g3"><div class="cell"><b>Покупок</b><br>${shLeft('flips')} з ${shMax('flips')}</div><div class="cell"><b>Гараж</b><br>${f.cars.length} з ${flSlots()}</div><div class="cell"><b>Попит сьогодні</b><br>${CAR_CLS.map(c => `${f.demand[c.id] >= 1.05 ? '🔥' : f.demand[c.id] <= 0.96 ? '❄' : '•'}`).join(' ')}</div></div>
  <div class="bar" style="margin:4px 0">${shBuyBtn('flips')}</div>
  <h3>Мої авто в роботі</h3>${f.cars.length ? f.cars.map(c => carCard(c, false)).join('') : '<div class="box small">Порожньо. Купи авто з оголошень нижче.</div>'}
  <h3>Оголошення</h3>${flLots().map(c => carCard(c, true)).join('')}<button style="width:100%" onclick="flRefresh()">🔄 Нові оголошення ⚡3</button>`;
}
SCREENS.jobs = jobsScreen;
function jobsScreen(p) {
  const t = p.tab || 'sh';
  return `<h2>💼 РОБОТА</h2>${tabs([['sh', '🧥 Секонд-хенд'], ['car', '🚗 Перекуп авто']], t)}` + (t === 'car' ? (lockOf('flip') ? `<div class="box" style="text-align:center"><div style="font-size:40px">🔒</div><b>Перекуп авто</b><div class="small">${lockOf('flip')}</div></div>` : flipTab()) : `<div class="box"><b>Початкова робота</b><div class="small">Зміни, завезення й полиці секонд-хенду. Підходить для старту, без вкладень.</div></div><button class="y" style="width:100%;padding:12px" onclick="go('secondhand')">Відкрити секонд-хенд ▶</button>${swHead()}${shHead()}<div class="box small">💡 Коли назбираєш грошей, переходь на 🚗 Перекуп авто: більше вкладень, більший прибуток.</div>`);
}
// --- ПІДРОБІТОК: денні ліміти (free-to-play базові, pay-to-play більше + бонус доходу)
const SH_BASE = { bags: 5, shifts: 4, search: 2, flips: 3 };
const SH_PACK = { bags: { n: 3, c: 40, max: 3, t: 'завезень' }, shifts: { n: 2, c: 25, max: 3, t: 'змін' }, search: { n: 2, c: 15, max: 3, t: 'оновлень' }, flips: { n: 2, c: 30, max: 3, t: 'купівель авто' } };
const SH_TIER = { start: { flips: 1, bags: 1, shifts: 1, search: 1, inc: 10, rar: 0.05 }, street: { flips: 2, bags: 2, shifts: 2, search: 2, inc: 20, rar: 0.10 }, boss: { flips: 3, bags: 4, shifts: 3, search: 3, inc: 35, rar: 0.20 } };
const JOBS = [
  { id: 'sort', n: '📦 Сортувальник', lvl: 1, xp: 8, cr: 1, en: 4, pay: [600, 1100], find: 0.10, rar: 0, d: 'Легка робота. Мало грошей, іноді знахідка.' },
  { id: 'truck', n: '🚚 Розвантаження фури', lvl: 2, xp: 14, cr: 2, en: 7, pay: [1200, 2400], find: 0.20, rar: 1, d: 'Важче, але платять більше. Частіше знахідки.' },
  { id: 'night', n: '🌙 Нічна зміна', lvl: 4, xp: 22, cr: 3, key: 0.35, en: 10, pay: [2500, 5000], find: 0.35, rar: 3, d: 'Найдохідніша. Шанс на рідкісну річ.' },
];
function shS() { if (S.sh && S.sh.ext && S.sh.ext.flips === undefined) { S.sh.ext.flips = 0; S.sh.flips = 0; } if (!S.sh || S.sh.day !== today()) S.sh = { day: today(), bags: 0, shifts: 0, search: 0, flips: 0, ext: { bags: 0, shifts: 0, search: 0, flips: 0 } }; return S.sh; }
const shTier = () => SH_TIER[subTier()] || { flips: 0, bags: 0, shifts: 0, search: 0, inc: 0, rar: 0 };
const shMax = k => SH_BASE[k] + shTier()[k] + shS().ext[k] * SH_PACK[k].n + (k === 'shifts' ? clanEff('shifts') : 0);
const shLeft = k => shMax(k) - shS()[k];
function shBuy(k) { const s = shS(), P = SH_PACK[k]; if (s.ext[k] >= P.max) return toast('Сьогодні більше докупити не можна'); if (!pay('crystals', P.c)) return; s.ext[k]++; toast('+' + P.n + ' ' + P.t + ' на сьогодні'); render(); }
function shBuyBtn(k) { const s = shS(), P = SH_PACK[k]; return s.ext[k] >= P.max ? '<span class="small">докупівлі вичерпано</span>' : `<button onclick="shBuy('${k}')">+${P.n} за ${P.c} 💎 <span class="small">(${s.ext[k]}/${P.max})</span></button>`; }
function doJob(id) {
  const j = JOBS.find(x => x.id === id), s = shS(), T = shTier();
  if (swLvl() < j.lvl) return toast('Потрібен рівень складу ' + j.lvl);
  if (shLeft('shifts') < 1) return toast('Зміни на сьогодні закінчились. Завтра нові або докупи за 💎');
  if (!pay('energy', j.en)) return;
  s.shifts++; bump('shifts');
  const inc = Math.round(rnd(j.pay[0], j.pay[1]) * (1 + T.inc / 100) * clanMul('jobInc') * swInc());
  const w = sw(), ol = swLvl(); w.xp += j.xp; if (swLvl() > ol) lvGrant('sw', ol, swLvl()); w.crates += j.cr; let key = 0; if (j.key && Math.random() < j.key) { w.keys++; key = 1; }
  let msg = `Зміна відпрацьована: +${fmt(inc)} 💵 · +${j.cr} 📦${key ? ' · +1 🔑' : ''}${swLvl() > ol ? ' · 🎉 рівень складу ' + swLvl() : ''}`;
  const o = { money: inc };
  if (Math.random() < 0.06) { o.money += 5000; msg += ' · 🍀 знайшов гаманець +5 000'; }
  if (Math.random() < j.find + luckB()) { let r = Math.random() < 0.15 ? j.rar : Math.min(j.rar, 1); if (Math.random() < T.rar) r = Math.min(4, r + 1); const pool = ITEMS.filter(x => x.rar === r); const it = pick(pool.length ? pool : ITEMS); addItem(it.id, rollG()); msg += ' · знайшов «' + it.name + '»'; }
  S.week.bags = S.week.bags || 0; bump('jobEarn', o.money); give(o, 'Підробіток'); lastJob = msg; render();
}
let lastJob = '';
// Зв'язок: зміни дають досвід (рівень складу), ящики 📦 і ключі 🔑 для завезень. Рівень знижує ціну завезень, піднімає дохід і шанс рідкісних речей.
const SW_XP = [0, 30, 90, 200, 350, 550, 800, 1100, 1500, 2000, 2600, 3300, 4100, 5000, 6000];
function sw() { if (!S.sw) S.sw = { xp: 0, crates: 0, keys: 0 }; return S.sw; }
const swLvl = () => { let l = 1; SW_XP.forEach((v, i) => { if (sw().xp >= v) l = i + 1; }); return l; };
const swE = () => Math.min(swLvl(), 10) - 1; // ефект рівня росте до 10, далі лише нагороди
const swDisc = () => 0.02 * swE(), swInc = () => 1 + 0.03 * swE(), swRar = () => 0.015 * swE();
// Одноразові нагороди за рівні професій: чим вище рівень, тим більша нагорода
const SW_TITLES = ['Новачок', 'Сортувальник', 'Вантажник', 'Старший зміни', 'Бригадир', 'Завскладу', 'Логіст', 'Менеджер складу', 'Директор складу', 'Магнат складу', 'Король складів', 'Барон складів', 'Імператор логістики', 'Тіньовий магнат', 'Легенда складів'];
const FL_TITLES = ['Новачок', 'Підприємець', 'Шукач авто', 'Автоторговець', 'Перекуп', 'Знавець угод', 'Майстер угод', 'Автодилер', 'Магнат авторинку', 'Король перекупів', 'Барон гаражів', 'Автоімператор', 'Тіньовий дилер', 'Легенда ринку', 'Бог перекупів'];
function lvRew(l) { const r = { money: Math.round(3000 * Math.pow(l, 1.6) / 100) * 100 }; if (l >= 3) r.crystals = Math.round((l - 2) * 1.5); if (l === 5) r.gold = 5; if (l === 10) r.gold = 15; if (l === 15) r.gold = 40; if (l % 5 === 0) r.energy = 30; return r; }
const lvTxt = r => Object.entries(r).map(([k, v]) => fmt(v) + ' ' + ({ money: '💵', crystals: '💎', gold: '🟡', energy: '⚡' }[k])).join(' · ');
function lvGrant(kind, from, to) { if (!S.lvDone) S.lvDone = {}; for (let l = from + 1; l <= to; l++) { const k = kind + l; if (S.lvDone[k]) continue; S.lvDone[k] = 1; give(lvRew(l), (kind === 'sw' ? 'Склад' : 'Перекуп') + ' рівень ' + l); } }
function profBox() {
  const sl = swLvl(), fl_ = flLvl(), swx = sw().xp, flx = fl().xp, main = swx >= flx ? 'sw' : 'fl';
  const row = (ic, n, l, T, x, XP, kind) => `<div class="small">${ic} <b>${n}</b>: рівень ${l} «${T[l - 1]}»${XP[l] ? ` · ${x}/${XP[l]} досвіду` : ' (максимум)'}</div>`;
  return `<div class="box"><b>💼 Робота</b><div class="small">Основна професія: <b>${main === 'sw' ? SW_TITLES[sl - 1] : FL_TITLES[fl_ - 1]}</b></div>${row('🏭', 'Склад', sl, SW_TITLES, swx, SW_XP)}${row('🚗', 'Перекуп авто', fl_, FL_TITLES, flx, FLIP_XP)}</div>`;
}
function lvTable(kind) {
  const L = kind === 'sw' ? swLvl() : flLvl(), n = kind === 'sw' ? SW_XP.length : FLIP_XP.length, XP = kind === 'sw' ? SW_XP : FLIP_XP;
  return `<details class="box"><summary><b>🎁 Нагороди за рівні</b> <span class="small">(одноразово, далі складніше)</span></summary>${Array.from({ length: n - 1 }, (_, i) => i + 2).map(l => `<div class="bar sp small" style="${l <= L ? 'color:#090' : ''}"><span>${l <= L ? '✓' : '🔒'} Рівень ${l} (${XP[l - 1]} досв.)</span><span>${lvTxt(lvRew(l))}</span></div>`).join('')}</details>`;
}
function swHead() {
  const l = swLvl(), nx = SW_XP[l], w = sw();
  return `<div class="box"><b>🏭 Склад: рівень ${l}</b>${nx ? `<div class="prog"><i style="width:${(w.xp - SW_XP[l - 1]) / (nx - SW_XP[l - 1]) * 100}%"></i></div><span class="small">${w.xp}/${nx} досвіду</span>` : ' (максимум)'}
  <div class="bar sp"><span>📦 Ящики: <b>${w.crates}</b></span><span>🔑 Ключі: <b>${w.keys}</b></span></div>
  <div class="small">Рівень дає: +${Math.round((swInc() - 1) * 100)}% до заробітку, −${Math.round(swDisc() * 100)}% до ціни завезень за гроші, +${(swRar() * 100).toFixed(1)}% шанс рідкіснішої речі. Зміни приносять ящики (і ключі з нічної), а за ящики відкриваються завезення на вкладці «👜 Завезення».</div></div>`;
}
function shHead() {
  const T = subTier(), cap = (k, n) => `<div class="cell"><b>${n}</b><br><span style="font-size:15px">${shLeft(k)}</span> з ${shMax(k)}</div>`;
  return `<div class="grid g3">${cap('shifts', 'Зміни')}${cap('bags', 'Завезення')}${cap('flips', 'Купівлі авто')}</div>
  <div class="small" style="text-align:center;margin:3px 0">Ліміти оновлюються щодня. ${T ? `Твоя підписка «${TIERS[T].n}»: +${shTier().shifts} змін, +${shTier().bags} завезень, +${shTier().inc}% до заробітку, кращі знахідки.` : `Без підписки це базові ліміти. <a href="#" onclick="go('shop',{tab:'prem'});return false">Підписка</a> дає більше змін, +% до заробітку й кращі знахідки.`}</div>`;
}
function workTab() {
  return swHead() + lvTable('sw') + shHead() + (lastJob ? `<div class="winban" style="font-size:13px">${lastJob}</div>` : '') +
    JOBS.map(j => `<div class="row"><div class="f"><b>${j.n}</b><div class="small">${j.d}<br>Платять ${fmt(j.pay[0] * (1 + shTier().inc / 100))}–${fmt(j.pay[1] * (1 + shTier().inc / 100))} 💵 · витрата ${j.en} ⚡ · дає ${j.cr} 📦${j.key ? ' і шанс на 🔑' : ''} · +${j.xp} досвіду</div></div>${swLvl() < j.lvl ? `<button disabled>🔒 рівень ${j.lvl}</button>` : `<button class="y" onclick="doJob('${j.id}')">Працювати</button>`}</div>`).join('') +
    `<div class="box"><b>Не вистачає змін?</b><div class="small">Докупи на сьогодні за кристали:</div><div class="bar">${shBuyBtn('shifts')}</div></div>
    <div class="box small">💡 Підробіток доступний усім і дає стабільний дохід. Знахідки можна залишити, продати одразу чи виставити на аукціоні дорожче.</div>`;
}
const BAGS = [{ id: 'basic', n: 'Звичайне завезення', cur: 'money', price: 4500, cnt: [3, 5], rw: [60, 30, 9, 1, 0], crates: 4, keys: 0 },
  { id: 'better', n: 'Покращене завезення', cur: 'money', price: 12000, cnt: [5, 8], rw: [35, 40, 18, 6, 1], crates: 10, keys: 0 },
  { id: 'rare', n: 'Рідкісне завезення', cur: 'crystals', price: 50, cnt: [6, 10], rw: [10, 30, 35, 20, 5], crates: 20, keys: 1 }];
let bagRes = null;
SCREENS.secondhand = p => {
  const t = p.tab || 'work';
  let h = `<h2>🧥 СЕКОНД-ХЕНД</h2><div class="small" style="text-align:center">Підробіток для початківця</div>${tabs([['work', '💼 Робота'], ['my', '👜 Завезення'], ['search', '🔍 Полиці'], ['auc', '🏪 Аукціон']], t)}`;
  if (t === 'work') return h + workTab();
  if (t === 'my') {
    if (bagRes && bagRes.loading) return h + `<div class="box" style="text-align:center;padding:40px 5px"><b>Завезення відкрито!</b><div style="font-size:50px">👜</div>⏳ Визначаємо знайдені речі...</div>`;
    if (bagRes) {
      const sum = bagRes.items.reduce((a, i) => a + sellPrice(i), 0);
      return h + `<div class="box" style="text-align:center"><b>Результат завезення</b><br>${bagRes.n} → Відкрито! Отримано речей: <b>${bagRes.items.length}</b></div>
      <div class="grid g4">${bagRes.items.map(i => `<div class="cell r${IT[i].rar}">${ico(i)}${IT[i].name}<br>x1<br><span class="small">${RAR[IT[i].rar]}</span></div>`).join('')}</div>
      <div class="grid g2" style="margin-top:6px"><button onclick="bagKeep()">Залишити в інвентарі</button><button class="y" onclick="bagSell(${sum})">Продати все<br>${fmt(sum)} 💵</button></div>`;
    }
    h += swHead() + shHead() + `<div class="box" style="text-align:center"><b>Мої завезення</b><div class="small">Відкривай баули, отримуй випадкові речі та вирішуй: залишити собі чи продати на аукціоні!</div></div>
    <div class="grid g3">${BAGS.map(b => `<div class="cell">👜<br><b>${b.n}</b><br>${b.cnt[0]}-${b.cnt[1]} речей<button class="y" style="width:100%" onclick="openBag('${b.id}')">${fmt(b.cur === 'money' ? Math.round(b.price * (1 - swDisc())) : b.price)} ${b.cur === 'money' ? '💵' : '💎'}</button><button style="width:100%;margin-top:2px" class="${sw().crates >= b.crates && sw().keys >= b.keys ? 'g' : ''}" onclick="openBag('${b.id}','crates')">${b.crates} 📦${b.keys ? ' + ' + b.keys + ' 🔑' : ''}</button></div>`).join('')}</div>
    <div class="box"><div class="small">Лишилось завезень сьогодні: <b>${shLeft('bags')}</b></div><div class="bar">${shBuyBtn('bags')}</div></div>
    <div class="box"><b>Знахідки в інвентарі:</b> ${S.inv.length} шт. <button onclick="stack=[{name:'home',p:{}}];go('inventory')">Відкрити інвентар</button></div>`;
  } else if (t === 'search') {
    stallCheck();
    const q = (p.q || '').toLowerCase();
    h += `<div class="bar"><input id="sq" placeholder="Пошук…" value="${p.q || ''}" style="flex:1"><button onclick="setP('q',$('sq').value)">🔍</button><button onclick="newStall()">Оновити зараз 20 💎</button></div>
    <div class="box small">⏱ Полиці оновлюються раз на 24 години, наступне оновлення через <b>${stallLeft()}</b>.<br>Шанс речі: ${STALL_W.map((w, i) => RAR[i] + ' ' + w + '%').join(' · ')}</div>
    ${S.stall.map((id, i) => ({ id, i })).filter(x => IT[x.id].name.toLowerCase().includes(q)).map(({ id, i }) => `<div class="row r${IT[id].rar}"><div class="f">${ico(id)}${IT[id].name} ${rarBadge(IT[id].rar)}</div><button class="y" onclick="buyStall(${i})">${fmt(stallPrice(id))} 💵</button></div>`).join('') || '<div class="box small">Нічого</div>'}`;
  } else {
    h += `<div class="box">Аукціон працює як біржа: живі свічкові графіки, стакан заявок, свої лоти на продаж і заявки на купівлю.<br>Ваших активних заявок: <b>${(S.orders || []).length}</b></div>
    <button class="y" style="width:100%;padding:12px" onclick="go('market',{tab:'sell',sub:'lot'})">📈 Відкрити аукціон (лоти)</button>`;
  }
  return h;
};
const STALL_W = [69, 22, 6, 2.6, 0.4], STALL_N = 8;
const stallPrice = id => Math.round(IT[id].base * (0.7 + 0.05 * IT[id].rar));
function genStall() { return Array.from({ length: STALL_N }, () => { let x = Math.random() * 100, r = 0; for (let i = 0; i < 5; i++) { x -= STALL_W[i]; if (x < 0) { r = i; break; } } const pool = ITEMS.filter(i => i.rar === r); return pick(pool.length ? pool : ITEMS).id; }); }
function stallCheck() { if (!S.stall || !S.stallTs || Date.now() - S.stallTs >= 864e5) { S.stall = genStall(); S.stallTs = Date.now(); } }
function stallLeft() { const m = Math.max(0, Math.ceil((S.stallTs + 864e5 - Date.now()) / 60000)); return Math.floor(m / 60) + ' год ' + (m % 60) + ' хв'; }
function newStall() { if (!pay('crystals', 20)) return; S.stall = genStall(); S.stallTs = Date.now(); render(); }
function newStallOld() { if (shLeft('search') > 0) shS().search++; else if (!pay('money', 500)) return; S.stall = null; render(); }
function rollRar(w) { let x = Math.random() * 100; for (let i = 0; i < 5; i++) { x -= w[i]; if (x < 0) return i; } return 0; }
function openBag(id, mode) {
  const b = BAGS.find(x => x.id === id); if (shLeft('bags') < 1) return toast('Завезення на сьогодні закінчились. Завтра нові або докупи за 💎');
  if (mode === 'crates') { const w = sw(); if (w.crates < b.crates || w.keys < b.keys) return toast('Не вистачає ящиків 📦' + (b.keys ? ' або ключів 🔑' : '') + '. Працюй на змінах'); w.crates -= b.crates; w.keys -= b.keys; }
  else if (!pay(b.cur, b.cur === 'money' ? Math.round(b.price * (1 - swDisc())) : b.price)) return;
  shS().bags++;
  const n = rnd(b.cnt[0], b.cnt[1]); const items = [];
  for (let i = 0; i < n; i++) { let r = rollRar(b.rw); if (Math.random() < shTier().rar + swRar() + luckB()) r = Math.min(4, r + 1); const pool = ITEMS.filter(x => x.rar === r); items.push(pick(pool.length ? pool : ITEMS).id); }
  S.week.bags++; S.ach.bags++; bump('bags');
  bagRes = { n: b.n, items, loading: true }; render();
  setTimeout(() => { if (bagRes) bagRes.loading = false; if (cur().name === 'secondhand') render(); }, 1500);
}
function bagKeep() { bagRes.items.forEach(id => addItem(id, rollG())); toast('Речі в інвентарі (одяг → кнопка «У гардероб»)'); bagRes = null; render(); }
function bagSell(sum) { give({ money: sum }, 'Продано все'); bagRes = null; render(); }
function buyStall(i) { const id = S.stall[i]; if (!pay('money', stallPrice(id))) return; addItem(id, rollG()); S.stall.splice(i, 1); toast('Куплено: ' + IT[id].name); render(); }
function putLot(uid) { bump('lotsPosted'); const i = S.inv.find(x => x.uid === uid); S.inv = S.inv.filter(x => x.uid !== uid); S.lots.push({ id: i.id, price: IT[i.id].base, end: Date.now() + 30000 }); render(); }
function checkLots() { const now = Date.now(); S.lots.filter(l => l.end <= now).forEach(l => sendMail('Ринок', 'Предмет продано', `Ваш лот «${IT[l.id].name}» успішно продано.`, { money: l.price })); S.lots = S.lots.filter(l => l.end > now); }

/*CHAT*/
// --- ЧАТ: світовий, групування, куплю, продам, особисті. Кожне повідомлення = 2 💎.
const CHAT_COST = 2;
const CH_TABS = [['world', '🌍 Світовий'], ['group', '👥 Клан'], ['buy', '🛒 Куплю'], ['sell', '🏷 Продам'], ['dm', '✉ Особисті']];
const CH_NPC = ['Козак', 'Ла Ріка', 'Бандерас', 'Тоні', 'Віталік', 'Мікі', 'Дон Карло', 'Сніжана'];
const CH_BOT = {
  world: ['Хто на рейд Даунтаун?', 'Вчора виграв x50 у слотах!', 'Набираю в клан, пишіть в особисті', 'Гонки сьогодні топ', 'Вітаю нових гравців в місті'],
  group: ['Всім привіт, вносимо в клан по можливості', 'Хто качає гілку гонщиків?', 'Сьогодні бос тижня, всі на бій', 'Дякую за внески, рівень росте'],
  buy: ['Куплю кепку польову, дорого', 'Куплю рідкісні речі, ціна договірна', 'Куплю спорт-авто, звертайтесь'],
  sell: ['Продам ремінь шкіряний за 1200', 'Продам брухт, дешево', 'Продам набір рідкісних речей, пишіть'],
};
function chS() { if (!S.chat) S.chat = { world: [], group: [], buy: [], sell: [], dm: {}, unread: 0 }; const c = S.chat; if (!c.world.length && !c.seeded) { c.seeded = 1; ['world', 'buy', 'sell'].forEach(k => { for (let i = 0; i < 3; i++) c[k].push({ n: pick(CH_NPC), t: pick(CH_BOT[k]), w: '' }); }); } return c; }
const nowT = () => new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
function chUn() { const c = chS(); if (!c.un) c.un = { world: 0, group: 0, buy: 0, sell: 0, dm: {} }; return c.un; }
function chTotal() { const u = chUn(); return u.world + u.group + u.buy + u.sell + Object.values(u.dm).reduce((a, b) => a + b, 0); }
function chIncoming(ch, m) { const u = chUn(), p = cur().p, seen = chatVisible() && (p.ch || 'world') === ch && (ch !== 'dm' || p.to === m.to); if (seen) return; if (ch === 'dm') u.dm[m.to] = (u.dm[m.to] || 0) + 1; else u[ch]++; }
function chPush(ch, m) { const c = chS(); if (!m.me) chIncoming(ch, m); if (ch === 'dm') { (c.dm[m.to] = c.dm[m.to] || []).push(m); c.dm[m.to] = c.dm[m.to].slice(-40); } else { c[ch].push(m); c[ch] = c[ch].slice(-40); } }
function chSend() {
  const p = cur().p, ch = p.ch || 'world', el = $('chIn'), txt = (el ? el.value : '').trim().slice(0, 120);
  if (!txt) return toast('Напиши повідомлення');
  if (ch === 'group' && !S.group.member) return toast('Спочатку вступи в групування');
  if (ch === 'dm' && !p.to) return toast('Обери співрозмовника');
  bump('chatMsgs');
  if (!pay('crystals', CHAT_COST)) return;
  chPush(ch, { n: S.name, t: txt, w: nowT(), me: 1, to: p.to });
  if (ch === 'dm') { const to = p.to; setTimeout(() => { chPush('dm', { n: to, t: pick(['Привіт! Що пропонуєш?', 'Зараз зайнятий, напишу пізніше', 'Давай, цікаво', 'Домовились']), w: nowT(), to }); if (chatVisible()) render(); }, 3000); }
  if (el) el.value = ''; render();
}
function chTabs(ch) {
  const u = chUn(), cnt = k => k === 'dm' ? Object.values(u.dm).reduce((a, b) => a + b, 0) : u[k];
  return `<div class="tabs">${CH_TABS.map(([k, t]) => `<button class="${ch === k ? 'y' : ''}" style="position:relative" onclick="setP('ch','${k}')">${t}${cnt(k) ? `<span class="badge" style="top:-8px;right:-2px;border-radius:3px;font-size:10px;min-width:16px;height:16px;line-height:16px">${cnt(k)}</span>` : ''}</button>`).join('')}</div>`;
}
function tickChat() {
  if (Math.random() > 0.07) return false; const c = chS(), ch = pick(['world', 'world', 'buy', 'sell', 'group']);
  if (ch === 'group' && !S.group.member) return false;
  chPush(ch, { n: pick(CH_NPC), t: pick(CH_BOT[ch]), w: nowT() });
  return true;
}
const chatVisible = () => cur().name === 'chat' || (cur().name === 'home' && cur().p.chat);
SCREENS.chat = p => chatPanel(p, false);
function chatPanel(p, over) {
  const c = chS(), ch = p.ch || 'world', u = chUn(); if (ch === 'dm') { if (p.to) u.dm[p.to] = 0; } else u[ch] = 0;
  let list = ch === 'dm' ? (p.to ? (c.dm[p.to] || []) : []) : c[ch];
  let h = over ? `<div class="bar sp" style="margin:2px 0"><b>💬 Чат</b><button onclick="cur().p.chat=false;render()">✕ Закрити</button></div>${chTabs(ch)}` : `<h2>💬 Чат</h2>${chTabs(ch)}`;
  if (ch === 'dm') h += `<div class="bar" style="margin:3px 0">${CH_NPC.slice(0, 5).map(n => `<button class="${p.to === n ? 'sel' : ''}" style="position:relative" onclick="cur().p.to='${n}';render()">${n}${(c.dm[n] || []).length ? ' ●' : ''}${u.dm[n] ? `<span class="badge" style="top:-8px;border-radius:3px">${u.dm[n]}</span>` : ''}</button>`).join('')}</div>${p.to ? '' : '<div class="box small">Обери гравця зверху, щоб написати особисто.</div>'}`;
  if (ch === 'group' && !S.group.member) return h + `<div class="box">Ти не в групуванні. <button class="y" onclick="go('group')">До групувань</button></div>`;
  h += `<div class="box" id="chBox" style="height:${over ? 120 : Math.max(160, Math.round(window.innerHeight * 0.4))}px;overflow-y:auto;background:#fff">${list.length ? list.map(m => `<div style="margin:3px 0;${m.me ? 'text-align:right' : ''}"><span class="small">${m.n}${m.w ? ' · ' + m.w : ''}</span><div style="display:inline-block;max-width:85%;background:${m.me ? '#ffe98a' : '#eee'};border-radius:6px;padding:3px 6px;text-align:left">${m.t.replace(/</g, '&lt;')}</div></div>`).join('') : '<div class="small">Поки порожньо.</div>'}</div>
  <div class="bar"><input id="chIn" maxlength="120" placeholder="${ch === 'buy' ? 'Куплю: що саме і за скільки' : ch === 'sell' ? 'Продам: що саме і за скільки' : 'Повідомлення…'}" style="flex:1" onkeydown="if(event.key==='Enter')chSend()"><button class="y" onclick="chSend()">Надіслати ${CHAT_COST} 💎</button></div>
  <div class="small">Кожне повідомлення коштує ${CHAT_COST} 💎. У тебе ${fmt(S.crystals)} 💎.</div>`;
  after.push(() => { const b = $('chBox'); if (over && b) b.style.height = Math.max(70, $('app').clientHeight - $('homeBox').offsetHeight - 168) + 'px'; if (b) b.scrollTop = b.scrollHeight; });
  return h;
}

// --- РИНОК + АУКЦІОН (БІРЖА)
// Ціни живі: кожні 2 секунди рухаються, свічки оновлюються, заявки виконуються.
const PER = { live: ['Live', 30], d: ['24 год', 24], w: ['7 днів', 28], m: ['30 днів', 30] };
const MK = {};
function seedRand(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
function mk(id) {
  if (MK[id]) return MK[id];
  const it = IT[id]; let seed = 7; for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) % 233280; const r = seedRand(seed);
  const m = { c: {}, trades: [], ticks: 0 };
  for (const k in PER) {
    const n = PER[k][1], vol = { live: 0.006, d: 0.015, w: 0.03, m: 0.05 }[k];
    let p = it.base * (0.88 + r() * 0.12); const arr = [];
    for (let i = 0; i < n; i++) {
      const o = p, c = o * (1 + (r() - 0.46) * vol * 2);
      arr.push({ o, c, h: Math.max(o, c) * (1 + r() * vol * 0.6), l: Math.min(o, c) * (1 - r() * vol * 0.6), v: Math.round(5 + r() * 40) }); p = c;
    }
    const f = it.base / arr[n - 1].c; arr.forEach(x => { x.o *= f; x.h *= f; x.l *= f; x.c *= f; });
    m.c[k] = arr;
  }
  m.price = it.base; m.open24 = m.c.d[0].o;
  for (let i = 0; i < 6; i++) m.trades.push({ p: Math.round(it.base * (0.99 + r() * 0.02)), q: 1 + Math.floor(r() * 3), side: r() < 0.5 ? 'b' : 's', t: '—' });
  MK[id] = m; return m;
}
const price = id => Math.round(mk(id).price);
const chg = id => (mk(id).price / mk(id).open24 - 1) * 100;
const chgH = id => { const v = chg(id); return `<span style="color:${v >= 0 ? '#090' : '#c00'}">${v >= 0 ? '▲ +' : '▼ '}${v.toFixed(2)}%</span>`; };
const ask = id => Math.round(price(id) * 1.01), bid = id => Math.round(price(id) * 0.99);
function tickMarket() {
  ITEMS.forEach(it => {
    const m = mk(it.id);
    const np = Math.max(it.base * 0.7, Math.min(it.base * 1.3, m.price * (1 + (Math.random() - 0.5) * 0.006 + (it.base - m.price) / it.base * 0.01)));
    m.price = np; m.ticks++;
    for (const k in PER) { const a = m.c[k], last = a[a.length - 1]; last.c = np; last.h = Math.max(last.h, np); last.l = Math.min(last.l, np); if (Math.random() < 0.3) last.v++; }
    if (m.ticks % 5 === 0) { const a = m.c.live; a.push({ o: np, h: np, l: np, c: np, v: 1 }); if (a.length > 40) a.shift(); }
    if (Math.random() < 0.25) { m.trades.unshift({ p: Math.round(np), q: rnd(1, 3), side: Math.random() < 0.5 ? 'b' : 's', t: new Date().toLocaleTimeString('uk-UA') }); m.trades.length = Math.min(m.trades.length, 8); }
  });
  fillOrders();
}
function fillOrders() {
  if (!S.orders) S.orders = [];
  const keep = [];
  S.orders.forEach(o => {
    const p = price(o.id), m = mk(o.id), t = new Date().toLocaleTimeString('uk-UA');
    if (o.side === 'sell' && p >= o.price) {
      sendMail('Аукціон', 'Лот продано', `«${IT[o.id].name}» продано за ${fmt(p)}, комісія ${mkFeePct()}%: на руки ${fmt(net(p))}.`, { money: net(p) }); tradeLog('sell', o.id, 1, net(p));
      toast('Ваш лот продано: ' + IT[o.id].name + ' (гроші в пошті)'); m.trades.unshift({ p, q: 1, side: 's', t: 'ваш' });
    } else if (o.side === 'buy' && p <= o.price) {
      addItem(o.id); tradeLog('buy', o.id, 1, p); S.money += o.price - p; S.daily.market++; toast('Заявку виконано: куплено ' + IT[o.id].name + ' за ' + fmt(p)); m.trades.unshift({ p, q: 1, side: 'b', t: 'ваш' });
    } else keep.push(o);
  });
  S.orders = keep;
}

// Свічковий графік на canvas (як на криптобіржі)
function drawCandles(cid, arr, opt) {
  opt = opt || {};
  after.push(() => {
    const c = $(cid); if (!c) return;
    const W = c.width = c.clientWidth * 2, H = c.height = c.clientHeight * 2, x = c.getContext('2d');
    const mini = opt.mini, padR = mini ? 2 : 110, padT = mini ? 2 : 16, volH = mini ? 0 : H * 0.18, chartH = H - padT - volH - (mini ? 2 : 30);
    const mn = Math.min(...arr.map(a => a.l)), mx = Math.max(...arr.map(a => a.h)), rng = mx - mn || 1;
    const Y = v => padT + (mx - v) / rng * chartH, bw = (W - padR) / arr.length;
    x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
    if (!mini) {
      x.strokeStyle = '#e5e5e5'; x.lineWidth = 1; x.fillStyle = '#555'; x.font = '20px sans-serif';
      for (let i = 0; i <= 4; i++) { const v = mx - rng * i / 4, y = Y(v); x.beginPath(); x.moveTo(0, y); x.lineTo(W - padR, y); x.stroke(); x.fillText(fmt(v), W - padR + 8, y + 7); }
      const vmax = Math.max(...arr.map(a => a.v));
      arr.forEach((a, i) => { x.fillStyle = '#ccc'; const vh = a.v / vmax * volH; x.fillRect(i * bw + bw * 0.15, H - 30 - vh, bw * 0.7, vh); });
      x.fillStyle = '#777'; x.font = '18px sans-serif';
      if (opt.labels) [0, Math.floor(arr.length / 2), arr.length - 1].forEach(i => x.fillText(opt.labels(i, arr.length), Math.min(i * bw, W - padR - 70), H - 6));
    }
    arr.forEach((a, i) => {
      const up = a.c >= a.o, cx = i * bw + bw / 2; x.strokeStyle = x.fillStyle = up ? '#16a34a' : '#dc2626'; x.lineWidth = mini ? 1 : 2;
      x.beginPath(); x.moveTo(cx, Y(a.h)); x.lineTo(cx, Y(a.l)); x.stroke();
      const top = Y(Math.max(a.o, a.c)), hh = Math.max(2, Math.abs(Y(a.o) - Y(a.c)));
      x.fillRect(cx - bw * 0.35, top, bw * 0.7, hh);
    });
    if (!mini) {
      const last = arr[arr.length - 1].c, y = Y(last);
      x.setLineDash([6, 6]); x.strokeStyle = '#16a34a'; x.beginPath(); x.moveTo(0, y); x.lineTo(W - padR, y); x.stroke(); x.setLineDash([]);
      x.fillStyle = '#16a34a'; x.fillRect(W - padR + 2, y - 15, padR - 4, 30); x.fillStyle = '#fff'; x.font = 'bold 20px sans-serif'; x.fillText(fmt(last), W - padR + 8, y + 7);
    }
  });
  return `<canvas id="${cid}" style="height:${opt.h || 170}px;${opt.mini ? 'width:90px;border:0' : ''}"></canvas>`;
}
function drawArea(cid, data) {
  after.push(() => {
    const c = $(cid); if (!c) return; const W = c.width = c.clientWidth * 2, H = c.height = 200, x = c.getContext('2d');
    const mn = Math.min(...data), mx = Math.max(...data), P = (v, i) => [i / (data.length - 1) * (W - 90) + 5, 12 + (mx - v) / (mx - mn || 1) * (H - 30)];
    x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.font = '18px sans-serif'; x.fillStyle = '#555';
    for (let i = 0; i <= 3; i++) { const v = mx - (mx - mn) * i / 3; x.fillText(fmt(v), W - 80, P(v, 0)[1] + 6); }
    x.beginPath(); data.forEach((v, i) => { const [px, py] = P(v, i); i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.lineTo(P(0, data.length - 1)[0], H); x.lineTo(5, H); x.closePath(); x.fillStyle = 'rgba(22,163,74,.2)'; x.fill();
    x.beginPath(); data.forEach((v, i) => { const [px, py] = P(v, i); i ? x.lineTo(px, py) : x.moveTo(px, py); }); x.strokeStyle = '#16a34a'; x.lineWidth = 3; x.stroke();
    data.forEach((v, i) => { const [px, py] = P(v, i); x.beginPath(); x.arc(px, py, 5, 0, 7); x.fillStyle = '#16a34a'; x.fill(); });
  });
  return `<canvas id="${cid}" style="height:100px"></canvas>`;
}
function perLabel(per) {
  return (i, n) => {
    const back = n - 1 - i;
    if (per === 'live') return back ? `-${back * 10}с` : 'зараз';
    if (per === 'd') return back ? `-${back} год` : 'зараз';
    const d = new Date(Date.now() - back * (per === 'w' ? 6 : 24) * 3600000); return d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
  };
}
function perStats(id, per) { const a = mk(id).c[per]; return { mn: Math.min(...a.map(x => x.l)), mx: Math.max(...a.map(x => x.h)), vol: a.reduce((s, x) => s + x.v, 0) }; }
function perBtns(per) { return Object.entries(PER).map(([k, [t]]) => `<button class="${per === k ? 'y' : ''}" style="padding:3px 6px" onclick="setP('per','${k}')">${t}</button>`).join(''); }
function rangeBar(mn, mx, cur) {
  const pos = v => Math.max(0, Math.min(100, (v - mn) / (mx - mn || 1) * 100)), a = pos(cur * 0.98), b = pos(cur * 1.03);
  return `<div class="small">Діапазон ринкових цін · <span style="color:#090">Рекомендована: ${fmt(cur * 0.98)} – ${fmt(cur * 1.03)}</span></div>
  <div class="bar" style="flex-wrap:nowrap"><span class="small">${fmt(mn)}</span><div style="flex:1;height:8px;background:#ddd;border-radius:4px;position:relative"><div style="position:absolute;left:${a}%;width:${Math.max(2, b - a)}%;top:0;bottom:0;background:#16a34a;border-radius:4px"></div></div><span class="small">${fmt(mx)}</span></div>`;
}

function tradeLog(side, id, qty, total) {
  if (!S.trades) S.trades = [];
  if (side === 'sell') S.rep = (S.rep || 0) + Math.round(total);
  bump(side === 'sell' ? 'sellN' : 'buyN', qty); if (side !== 'sell') bump('buySum', Math.round(total)); if (side === 'sell') bump('sellSum', Math.round(total));
  S.trades.unshift({ side, id, qty, total: Math.round(total), day: today(), t: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) });
  S.trades.length = Math.min(S.trades.length, 100);
}
function tradePanel() {
  const all = S.trades || [], day = all.filter(x => x.day === today());
  const spent = day.filter(x => x.side === 'buy').reduce((s, x) => s + x.total, 0), earned = day.filter(x => x.side === 'sell').reduce((s, x) => s + x.total, 0), net = earned - spent;
  return `<div class="box" style="margin-top:10px"><b>Підсумок за сьогодні</b>
  <div class="grid g3" style="margin:4px 0"><div class="cell">Витрачено<br><b style="color:#c00">−${fmt(spent)}</b></div><div class="cell">Зароблено<br><b style="color:#090">+${fmt(earned)}</b></div><div class="cell" style="background:${net >= 0 ? '#d8f5d8' : '#f6dede'}">Чистий результат<br><b style="color:${net >= 0 ? '#090' : '#c00'}">${net >= 0 ? '+' : ''}${fmt(net)} 💵</b></div></div>
  <div class="small">Угод за день: ${day.length}</div></div>
  <div class="box"><b>Історія покупок і продажів</b>${all.length ? all.slice(0, 30).map(x => `<div class="bar sp" style="font-size:12px;padding:3px 4px;margin:2px 0;border-radius:3px;background:${x.side === 'buy' ? '#f6dede' : '#d8f5d8'}"><span>${x.side === 'buy' ? '🛒 Куплено' : '🏷 Продано'} ${IT[x.id].name}${x.qty > 1 ? ' ×' + x.qty : ''}</span><span class="small">${x.day === today() ? x.t : x.day.slice(5)}</span><b style="color:${x.side === 'buy' ? '#c00' : '#090'}">${x.side === 'buy' ? '−' : '+'}${fmt(x.total)}</b></div>`).join('') : '<div class="small">Поки немає угод.</div>'}</div>`;
}
const MK_BAND = 0.10, BASE_FEE = 20, BASE_LIM = 5, BASE_ORD = 3, MIN_FEE = 5, RING_BONUS = 3;
// Підписки (як Value Pack у Black Desert): менша комісія, більше лімітів і слотів ордерів, щоденна виплата
const TIERS = {
  start:  { n: 'Старт',    stars: 300,  fee: 15, lim: 8,  ord: 5,  daily: 9, regen: 0.9, en: 30, chips: 200, boss: 1, who: 'Для новачка: до 14 млн 💵 продажів на місяць' },
  street: { n: 'Вуличний', stars: 800,  fee: 11, lim: 12, ord: 8,  daily: 25, regen: 0.8, en: 60, chips: 450, boss: 2, who: 'Для активного торговця: 14-25 млн 💵 на місяць' },
  boss:   { n: 'Бос',      stars: 1800, fee: 7,  lim: 20, ord: 12, daily: 55, regen: 0.7, en: 120, chips: 900, boss: 3, who: 'Для великого торговця: понад 25 млн 💵 на місяць' },
};
function subTier() { if (S.sub && S.sub.until > Date.now()) return S.sub.tier; return null; }
const subDays = () => S.sub ? Math.max(0, Math.ceil((S.sub.until - Date.now()) / 864e5)) : 0;
const ringOn = () => S.ring && S.ring > Date.now();
const repBonus = () => Math.min(2.5, Math.floor((S.rep || 0) / 1000000) * 0.5);
function mkFeePct() { const t = subTier(); return Math.max(MIN_FEE, (t ? TIERS[t].fee : BASE_FEE) - (ringOn() ? RING_BONUS : 0) - repBonus() - clanFee()); }
const mkFee = () => mkFeePct() / 100;
const mkLimit = () => (() => { const t = subTier(); return t ? TIERS[t].lim : BASE_LIM; })() + clanEff('lim');
const mkOrd = () => (() => { const t = subTier(); return t ? TIERS[t].ord : BASE_ORD; })() + clanEff('ord');
function feeBreakdown() {
  const t = subTier();
  return `База ${BASE_FEE}%${t ? ' − підписка «' + TIERS[t].n + '» ' + (BASE_FEE - TIERS[t].fee) + '%' : ''}${ringOn() ? ' − Перстень торговця ' + RING_BONUS + '%' : ''}${repBonus() ? ' − репутація ' + repBonus() + '%' : ''} = <b>${mkFeePct()}%</b>`;
}
function tradeStatus() {
  const t = subTier();
  return `<div class="box"><div class="bar sp"><b>Ваш торговий статус</b><span class="small">${t ? '⭐ ' + TIERS[t].n + ', ' + subDays() + ' дн.' : 'без підписки'}</span></div>
  <div class="small">Комісія з продажу: ${feeBreakdown()}</div>
  <div class="small">Ліміт: ${mkLimit()} купівель і ${mkLimit()} продажів на товар/день · активних заявок: ${(S.orders || []).length}/${mkOrd()} · репутація: ${fmt(S.rep || 0)} 💵 (кожен 1 млн = −0.5% комісії, макс. −2.5%)</div>
  <button class="y" style="width:100%;margin-top:4px" onclick="go('shop',{tab:'prem'})">⭐ Знизити комісію: підписка і Перстень</button></div>`;
}
function buySub(k) {
  const T = TIERS[k];
  modal(`<h3>Підписка «${T.n}», 30 днів</h3><p class="small">Комісія аукціону ${T.fee}% (замість ${BASE_FEE}%), ліміт ${T.lim}/день, ${T.ord} активних заявок, щоденно ${T.daily} 💎.</p>
  <p>До сплати: <b>⭐ ${fmt(T.stars)}</b></p><p class="note">Симуляція Telegram Stars. У грі тут буде щомісячна підписка.</p>
  <button class="y" onclick="activateSub('${k}')">Оформити ⭐ ${fmt(T.stars)}</button>`);
}
function activateSub(k) {
  const base = (S.sub && S.sub.until > Date.now() && S.sub.tier === k) ? S.sub.until : Date.now();
  S.sub = { tier: k, until: base + 30 * 864e5, claimed: S.sub && S.sub.claimed || '' }; S.starsSpent += TIERS[k].stars; closeModal(); toast('Підписка «' + TIERS[k].n + '» активна'); render();
}
function buyRing() { if (!pay('crystals', 300)) return; S.ring = Math.max(Date.now(), S.ring || 0) + 30 * 864e5; toast('Перстень торговця: −' + RING_BONUS + '% комісії на 30 днів'); render(); }
function claimSub() { const t = subTier(); if (!t || S.sub.claimed === today()) return; S.sub.claimed = today(); give({ crystals: TIERS[t].daily, energy: TIERS[t].en, chips: TIERS[t].chips }, 'Виплата підписки'); S.daily.collect++; render(); }
function mlim() { if (!S.mlim || S.mlim.day !== today()) S.mlim = { day: today(), buy: {}, sell: {} }; return S.mlim; }
const mLeft = (side, id) => mkLimit() - (mlim()[side][id] || 0);
const mUse = (side, id, n) => { const l = mlim(); l[side][id] = (l[side][id] || 0) + n; };
const net = v => Math.round(v * (1 - mkFee()));
const limHtml = id => `<div class="small" style="margin:3px 0">Ліміт на сьогодні для цього товару: купівля <b>${mLeft('buy', id)}</b>/${mkLimit()}, продаж <b>${mLeft('sell', id)}</b>/${mkLimit()} · комісія з продажу ${mkFeePct()}%</div>`;
function marketRules() {
  modal(`<h3>❓ Аукціон</h3>
  <p class="small">• <b>Купити:</b> лоти гравців або біржа (звичайні речі рангу C). Фільтри за категорією й рангом.</p>
  <p class="small">• <b>Продати:</b> виставляєш лот зі своєю ціною або швидко продаєш звичайну річ. Гроші приходять у пошту.</p>
  <p class="small">• Ціна лота: від ${LOT_MIN * 100}% до ${LOT_MAX * 100}% типової ціни рангу. Лот діє ${LOT_DAYS} доби, потім річ повертається. Збір за виставлення ${LOT_FEE * 100}%.</p>
  <p class="small">• Біржові заявки: ціна ±${MK_BAND * 100}% від ринкової. На один товар до ${mkLimit()} покупок і ${mkLimit()} продажів на день.</p>
  <p class="small">• З кожного продажу комісія ${mkFeePct()}%. Підписка знижує її.</p>`);
}
// --- ДОШКА ЛОТІВ (як у GTA Online): лот стоїть, поки його не куплять
const SELLERS = ['Козак', 'Ла Ріка', 'Бандерас', 'Тоні', 'Лисий', 'Сеньйор', 'Мамба', 'Філін', 'Рокі', 'Дикий'];
const LOT_MIN = 0.5, LOT_MAX = 3, LOT_FEE = 0.02, LOT_DAYS = 3;
function newNpcLot() { const it = pick(ITEMS.filter(x => x.rar >= 1)), g = rollG(); return { uid: Math.random().toString(36).slice(2, 9), id: it.id, g, price: Math.round(price(it.id) * GM_PR[g] * (0.8 + Math.random() * 0.6)), seller: pick(SELLERS) }; }
function lotChance(id, pr, g) { const r = pr / (price(id) * GM_PR[g == null ? 1 : g]); return r <= 0.95 ? 0.08 : 0.04 * Math.exp(-6 * (r - 0.95)); } // шанс продажу за 2 с
function lotSpeed(id, pr, g) { const c = lotChance(id, pr, g), min = 1 / c * 2 / 60; return c >= 0.07 ? '⚡ швидко (до 1 хв)' : min < 5 ? '🙂 помірно (≈' + Math.round(min) + ' хв)' : min < 30 ? '🐢 довго (≈' + Math.round(min) + ' хв)' : '🧊 дуже довго'; }
function tickLots(steps) {
  steps = steps || 1;
  if (!S.board) S.board = Array.from({ length: 12 }, newNpcLot);
  if (!S.myLots) S.myLots = [];
  for (let k = 0; k < steps; k++) {
    if (Math.random() < 0.03 && S.board.length > 8) S.board.splice(rnd(0, S.board.length - 1), 1);
    if (Math.random() < 0.05 && S.board.length < 14) S.board.push(newNpcLot());
    S.myLots = S.myLots.filter(l => {
      if (!l.until) l.until = Date.now() + LOT_DAYS * 864e5;
      if (l.until <= Date.now()) { addItem(l.id, l.g); toast('Лот «' + IT[l.id].name + '» не продався за ' + LOT_DAYS + ' доби. Річ повернулась в інвентар'); return false; }
      if (Math.random() < lotChance(l.id, l.price, l.g)) {
        const got = net(l.price); sendMail('Дошка лотів', 'Лот продано', `«${IT[l.id].name}» куплено гравцем ${pick(SELLERS)} за ${fmt(l.price)}. Комісія ${mkFeePct()}%, на руки ${fmt(got)}.`, { money: got });
        tradeLog('sell', l.id, 1, got); bump('lotsSold'); toast('Ваш лот купили: ' + IT[l.id].name + ' (+' + fmt(got) + ', гроші в пошті)'); return false;
      } return true;
    });
  }
  S.lotTs = Date.now();
}
function catchUpLots() { if (!S.lotTs) { S.lotTs = Date.now(); return; } const n = Math.min(900, Math.floor((Date.now() - S.lotTs) / 2000)); if (n > 0) tickLots(n); }
function lotsBoard(p, part) {
  if (!S.board) tickLots(0);
  const inv = {}; S.inv.forEach(i => { const k = i.id + '|' + itG(i); inv[k] = (inv[k] || 0) + 1; });
  const ids = Object.keys(inv), sel = ids.includes(p.lotItem) ? p.lotItem : ids[0];
  const my = S.myLots || [], free = mkOrd() - my.length;
  let h = '';
  if (part === 'sell') {
    h += `<div class="box"><b>Виставити лот</b> <span class="small">(вільних місць: ${free} з ${mkOrd()})</span>`;
    if (!sel) h += `<div class="small" style="margin-top:4px">У тебе немає речей для продажу.</div></div>`;
    else {
      const sid = sel.split('|')[0], sgr = +sel.split('|')[1], fp = Math.round(price(sid) * GM_PR[sgr]), lp = p.lotPrice || Math.round(fp * 1.05), r = lp / fp * 100;
      const verdict = r < 95 ? '⚡ Продасться дуже швидко' : r <= 110 ? '🙂 Продасться за кілька хвилин' : r <= 150 ? '🐢 Чекатимеш довго' : '🧊 Дуже дорого, можливо ніхто не купить';
      h += `<select id="lotSel" style="width:100%;margin:6px 0 3px" onchange="cur().p.lotItem=this.value;cur().p.lotPrice=0;this.blur();render()">${ids.map(i => `<option value="${i}" ${i === sel ? 'selected' : ''}>${IT[i.split('|')[0]].name} [${GRD[+i.split('|')[1]]}] (у тебе ${inv[i]} шт.)</option>`).join('')}</select>
      <div class="small">Типова ціна цієї речі: <b>${fmt(fp)} 💵</b></div>
      <div class="small">За рангами: ${GRD.map((x, g) => `<span style="${g === sgr ? 'font-weight:bold;text-decoration:underline' : ''}">${x} ${fmt(Math.round(price(sid) * GM_PR[g]))}</span>`).join(' · ')}</div>
      <div class="bar" style="margin:4px 0;justify-content:center"><button onclick="cur().p.lotPrice=${Math.max(1, Math.round(lp * 0.9))};render()">−10%</button><input id="lotPrice" type="number" value="${lp}" style="width:110px;text-align:center;font-size:16px" onchange="cur().p.lotPrice=+this.value;render()"><button onclick="cur().p.lotPrice=${Math.round(lp * 1.1)};render()">+10%</button></div>
      <div class="bar" style="justify-content:center;margin-bottom:4px"><button onclick="cur().p.lotPrice=${Math.round(fp * 0.9)};render()">Швидко</button><button onclick="cur().p.lotPrice=${Math.round(fp)};render()">Як усі</button><button onclick="cur().p.lotPrice=${Math.round(fp * 1.3)};render()">Дорожче</button></div>
      <div class="box" style="margin:4px 0">${verdict}<br>Збір за виставлення ${LOT_FEE * 100}%: <b>${fmt(Math.round(lp * LOT_FEE))} 💵</b> · комісія з продажу ${mkFeePct()}%.<br><b>Тобі прийде: ${fmt(net(lp))} 💵</b><br><span class="small">Лот діє ${LOT_DAYS} доби, потім річ повертається.</span></div>
      <button class="y" style="width:100%;padding:12px;font-size:15px" onclick="listLot('${sel}')">🏷 ВИСТАВИТИ НА ПРОДАЖ</button></div>`;
    }
    h += `<div class="box"><b>Мої лоти</b>${my.length ? my.map((l, k) => { const left = Math.max(0, Math.ceil(((l.until || Date.now()) - Date.now()) / 36e5)); return `<div class="row"><div class="f"><b>${IT[l.id].name}</b> ${gB(l.g == null ? 1 : l.g)}<div class="small">Ціна ${fmt(l.price)} 💵 · ${lotSpeed(l.id, l.price, l.g)} · ще ${left >= 24 ? Math.floor(left / 24) + ' д ' + (left % 24) + ' год' : left + ' год'}</div></div><button onclick="cancelLot(${k})">Зняти</button></div>`; }).join('') : '<div class="small">Поки порожньо.</div>'}</div>`;
    return h + `<details class="box"><summary class="small">Моя комісія та ліміти</summary>${tradeStatus()}</details>`;
  }
  const lc = p.lc || 'Усі товари', lr = p.lr ?? -1, ls = p.ls || 'pct';
  const lr_ = l => l.price / (price(l.id) * GM_PR[itG(l)]);
  let list = S.board.filter(l => (lc === 'Усі товари' || IT[l.id].cat === lc) && (lr < 0 || itG(l) === lr));
  list.sort((a, b) => ls === 'pr' ? a.price - b.price : ls === 'rk' ? itG(b) - itG(a) : lr_(a) - lr_(b));
  h += `<div class="bar"><select onchange="cur().p.lc=this.value;this.blur();render()">${['Усі товари', ...CAT].map(x => `<option ${x === lc ? 'selected' : ''}>${x}</option>`).join('')}</select>
  <select onchange="cur().p.lr=+this.value;this.blur();render()"><option value="-1">Ранг: усі</option>${GRD.map((g, i) => `<option value="${i}" ${lr === i ? 'selected' : ''}>${g}</option>`).join('')}</select>
  <select onchange="cur().p.ls=this.value;this.blur();render()"><option value="pct" ${ls === 'pct' ? 'selected' : ''}>Вигідні</option><option value="pr" ${ls === 'pr' ? 'selected' : ''}>Ціна ↑</option><option value="rk" ${ls === 'rk' ? 'selected' : ''}>Ранг ↓</option></select></div>
  <div class="small">Зелений % означає дешевше, ніж зазвичай для цього рангу.</div>
  ${list.map(l => { const r = lr_(l) * 100; return `<div class="row r${IT[l.id].rar}"><div class="f">${ico(l.id)}<b>${IT[l.id].name}</b> ${gB(itG(l))} ${rarBadge(IT[l.id].rar)}<div class="small">від ${l.seller} · <span style="color:${r < 100 ? '#090' : '#c00'}">${r < 100 ? 'дешевше на ' + (100 - r).toFixed(0) : 'дорожче на ' + (r - 100).toFixed(0)}%</span></div></div><button class="y" onclick="buyLot('${l.uid}')">Купити<br>${fmt(l.price)} 💵</button></div>`; }).join('') || '<div class="box small">Лотів за цими фільтрами немає</div>'}`;
  return h;
}
function listLot(key) {
  const id = key.split('|')[0], gr = +key.split('|')[1];
  const pr = Math.round(+($('lotPrice') ? $('lotPrice').value : 0)), fp = Math.round(price(id) * GM_PR[gr]);
  if (!(pr > 0)) return toast('Вкажи ціну');
  if (pr < fp * LOT_MIN || pr > fp * LOT_MAX) return toast('Ціна поза межами: ' + fmt(fp * LOT_MIN) + ' – ' + fmt(fp * LOT_MAX));
  if ((S.myLots || []).length >= mkOrd()) return toast('Усі слоти лотів зайняті (' + mkOrd() + '). Підписка додає слоти.');
  if (mLeft('sell', id) < 1) return toast('Ліміт продажів на сьогодні вичерпано для цього товару');
  const i = S.inv.find(x => x.id === id && itG(x) === gr); if (!i) return toast('Немає такої речі');
  if (!pay('money', Math.round(pr * LOT_FEE))) return;
  S.inv = S.inv.filter(x => x !== i); mUse('sell', id, 1); S.myLots.push({ id, price: pr, g: gr, until: Date.now() + LOT_DAYS * 864e5 }); cur().p.lotPrice = 0; toast('Лот виставлено за ' + fmt(pr) + ' на ' + LOT_DAYS + ' доби'); render();
}
function cancelLot(k) { const l = S.myLots[k]; addItem(l.id, l.g); S.myLots.splice(k, 1); toast('Лот знято, річ повернулась в інвентар'); render(); }
function buyLot(uid) {
  const l = S.board.find(x => x.uid === uid); if (!l) return toast('Лот уже купили');
  if (mLeft('buy', l.id) < 1) return toast('Ліміт покупок на сьогодні вичерпано для цього товару');
  if (!pay('money', l.price)) return; mUse('buy', l.id, 1); addItem(l.id, l.g); tradeLog('buy', l.id, 1, l.price); S.daily.market++;
  S.board = S.board.filter(x => x !== l); toast('Куплено: ' + IT[l.id].name + ' у ' + l.seller); render();
}
SCREENS.market = p => marketMain(p) + tradePanel();
function marketMain(p) {
  const t = p.tab || 'buy', c = p.cat || 'Усі товари', pg = p.pg || 0, rar = p.rar ?? -1, sort = p.sort || 'price';
  let h = `<div class="bar sp"><h2 style="margin:4px 0">🏪 Аукціон</h2><button class="y" onclick="marketRules()">❓ FAQ</button></div>${tabs([['buy', '🛒 Купити'], ['sell', '🏷 Продати'], ['auc', '📊 Біржа (графіки)']], t)}`;
  if (t === 'auc') return h + auction(p);
  if (p.item) return h + marketItem(p);
  const bsub = ['lots', 'ex'].includes(p.sub) ? p.sub : 'lots', ssub = ['lot', 'fast'].includes(p.sub) ? p.sub : 'lot';
  if (t === 'buy') h += tabs([['lots', '🏪 Лоти гравців'], ['ex', '📦 Біржа (ранг C)']], bsub, 'sub');
  else h += tabs([['lot', '🏷 Виставити лот'], ['fast', '⚡ Швидко (ранг C)']], ssub, 'sub');
  if (t === 'buy' && bsub === 'lots') return h + lotsBoard(p, 'buy');
  if (t === 'sell' && ssub === 'lot') return h + lotsBoard(p, 'sell');
  if (t === 'buy') {
    let list = ITEMS.filter(i => (c === 'Усі товари' || i.cat === c) && (rar < 0 || i.rar === rar));
    list.sort((a, b) => sort === 'price' ? price(a.id) - price(b.id) : sort === 'pricd' ? price(b.id) - price(a.id) : sort === 'chg' ? chg(b.id) - chg(a.id) : b.rar - a.rar);
    const pages = Math.max(1, Math.ceil(list.length / 6)), shown = list.slice(pg * 6, pg * 6 + 6);
    h += `<div class="bar"><select onchange="cur().p.cat=this.value;cur().p.pg=0;this.blur();render()">${['Усі товари', ...CAT].map(x => `<option ${x === c ? 'selected' : ''}>${x}</option>`).join('')}</select>
    <select onchange="cur().p.rar=+this.value;cur().p.pg=0;this.blur();render()"><option value="-1">Рідкість: Усі</option>${RAR.map((r, i) => `<option value="${i}" ${rar === i ? 'selected' : ''}>${r}</option>`).join('')}</select>
    <select onchange="this.blur();setP('sort',this.value)"><option value="price" ${sort === 'price' ? 'selected' : ''}>Ціна ↑</option><option value="pricd" ${sort === 'pricd' ? 'selected' : ''}>Ціна ↓</option><option value="chg" ${sort === 'chg' ? 'selected' : ''}>Зростання 24г</option><option value="rar" ${sort === 'rar' ? 'selected' : ''}>Рідкість</option></select></div>
    ${shown.map(i => { const st = perStats(i.id, 'w'), tr = mk(i.id).trades[0]; return `<div class="row r${i.rar}" onclick="setP('item','${i.id}')"><div class="f"><b>${i.name}</b> ${rarBadge(i.rar)}<div class="small">${i.stat} · Остання: ${fmt(tr.p)}</div><div class="small">Мін: ${fmt(st.mn)} · Макс: ${fmt(st.mx)} · Обсяг: ${st.vol}</div></div>
      ${drawCandles('mc_' + i.id, mk(i.id).c.w.slice(-14), { mini: true, h: 36 })}
      <div style="text-align:center"><b>${fmt(price(i.id))} 💵</b><br><span class="small">${chgH(i.id)}</span><br><button class="y">Купити</button></div></div>`; }).join('') || '<div class="box small">Немає товарів</div>'}
    <div class="bar" style="justify-content:center"><button onclick="setP('pg',${Math.max(0, pg - 1)})">◀</button> ${pg + 1} / ${pages} <button onclick="setP('pg',${Math.min(pages - 1, pg + 1)})">▶</button></div>`;
  } else {
    h += `<div class="small">Швидкий продаж звичайних речей [C] за найкращою заявкою. Речі інших рангів продаються лотом.</div>` +
      (S.inv.filter(i => itG(i) === 1).map(i => `<div class="row r${IT[i.id].rar}"><div class="f">${ico(i.id)}${IT[i.id].name}<div class="small">Ринок: ${fmt(price(i.id))} ${chgH(i.id)}</div></div>
        <button class="y" onclick="marketSell(${i.uid})">Продати ${fmt(net(bid(i.id)))}</button><button onclick="go('market',{tab:'sell',sub:'lot',lotItem:'${i.id}|1'})">Лот ›</button></div>`).join('') || '<div class="box small">Нічого продавати</div>');
  }
  return h;
}
function marketItem(p) {
  const i = IT[p.item], per = p.per || 'w', q = p.q || 1, st = perStats(i.id, per), m = mk(i.id), pr = price(i.id);
  return `<div class="box"><div class="bar sp"><b>${i.name}</b><button onclick="setP('item','')">✕</button></div><div class="small">${RAR[i.rar]} · ${i.cat} · ${i.stat} · Міцність 100/100</div></div>
  <div class="box"><div class="bar sp"><b>Динаміка ціни</b><span>${perBtns(per)}</span></div>${drawCandles('ch1', m.c[per], { labels: perLabel(per) })}
  <div class="grid g5 small" style="margin-top:4px"><div class="cell">Поточна<br><b>${fmt(pr)}</b><br>${chgH(i.id)}</div><div class="cell">Остання угода<br>${fmt(m.trades[0].p)}</div><div class="cell">Мін. за період<br>${fmt(st.mn)}</div><div class="cell">Макс. за період<br>${fmt(st.mx)}</div><div class="cell">Обсяг угод<br>${st.vol}</div></div></div>
  <div class="box"><b>Графік продажів (добовий)</b>${drawArea('ch2', m.c.w.filter((_, k) => k % 4 === 3).map(x => x.c))}</div>
  <div class="box"><b>Купити зараз</b>${limHtml(i.id)}<div class="bar sp"><span>Кількість: <button onclick="setP('q',${Math.max(1, q - 1)})">−</button> ${q} <button onclick="setP('q',${q + 1})">+</button></span><span>Ціна за 1 шт: <b>${fmt(pr)}</b></span></div>
  ${rangeBar(st.mn, st.mx, pr)}
  <button class="y" style="width:100%;padding:10px;margin-top:5px" onclick="marketBuy('${i.id}',${q})">🛒 Купити за ${fmt(pr * q)} 💵</button>
  <button style="width:100%;margin-top:4px" onclick="go('market',{tab:'auc',aid:'${i.id}'})">📊 Торгувати на аукціоні (своя ціна)</button></div>`;
}
function marketBuy(id, q) { const pr = price(id); if (q > mLeft('buy', id)) return toast('Ліміт покупок на сьогодні: залишилось ' + mLeft('buy', id) + ' шт. цього товару'); if (!pay('money', pr * q)) return; mUse('buy', id, q); tradeLog('buy', id, q, pr * q); for (let k = 0; k < q; k++) addItem(id); S.daily.market++; toast('Куплено: ' + IT[id].name + ' x' + q); render(); }
function marketSell(uid) { const i = S.inv.find(x => x.uid === uid); if (itG(i) !== 1) return toast('Біржа приймає лише звичайні речі [C]. Інші ранги: аукціон-дошка лотів'); if (mLeft('sell', i.id) < 1) return toast('Ліміт продажів на сьогодні вичерпано для цього товару'); mUse('sell', i.id, 1); const got = net(bid(i.id)); tradeLog('sell', i.id, 1, got); S.inv = S.inv.filter(x => x.uid !== uid); give({ money: got }, 'Продано ' + IT[i.id].name + ' (комісія ' + mkFeePct() + '%)'); render(); }

// АУКЦІОН: стакан, свічки, свої заявки
function auction(p) {
  const id = p.aid || 'i_cap', it = IT[id], per = p.per || 'live', side = p.side || 'buy', m = mk(id), pr = price(id), st = perStats(id, 'd');
  const myOrd = (S.orders || []).filter(o => o.id === id), owned = S.inv.filter(x => x.id === id).length;
  const lp = p.lp || (side === 'buy' ? Math.round(pr * 0.97) : Math.round(pr * 1.03));
  const asks = [5, 4, 3, 2, 1].map(k => ({ p: Math.round(pr * (1 + 0.006 * k)), q: 1 + ((k * 7 + m.ticks) % 6) }));
  const bids = [1, 2, 3, 4, 5].map(k => ({ p: Math.round(pr * (1 - 0.006 * k)), q: 1 + ((k * 5 + m.ticks) % 6) }));
  myOrd.forEach(o => (o.side === 'sell' ? asks : bids).push({ p: o.price, q: 1, mine: true }));
  asks.sort((a, b) => b.p - a.p); bids.sort((a, b) => b.p - a.p);
  const row = (o, col) => `<div class="bar sp" style="font-size:11px;${o.mine ? 'background:#ffe9a8;font-weight:bold' : ''}" onclick="cur().p.lp=${o.p};render()"><span style="color:${col}">${fmt(o.p)}</span><span>${o.q}${o.mine ? ' (ви)' : ''}</span></div>`;
  return tradeStatus() + `<div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:4px">${ITEMS.filter(x => x.rar > 0).map(x => `<button style="flex:0 0 auto;font-size:11px;${x.id === id ? 'background:#333;color:#fff' : ''}" onclick="go('market',{tab:'auc',aid:'${x.id}'})">${ico(x.id)}<br>${x.name}<br>${fmt(price(x.id))} ${chgH(x.id)}</button>`).join('')}</div>
  <div class="box"><div class="bar sp"><div>${ico(id)}<b>${it.name}</b> ${rarBadge(it.rar)}<br><span style="font-size:20px;font-weight:bold">${fmt(pr)} 💵</span> ${chgH(id)} <span class="small">за 24 год</span></div>
    <div class="small" style="text-align:right">24г макс: ${fmt(st.mx)}<br>24г мін: ${fmt(st.mn)}<br>Обсяг: ${st.vol}</div></div>
  <div class="bar" style="margin:4px 0">${perBtns(per)}<span class="small">● оновлення кожні 2 с</span></div>
  ${drawCandles('auc_ch', m.c[per], { labels: perLabel(per), h: 180 })}</div>
  <div class="grid g2">
    <div class="box"><b>Стакан</b><div class="small bar sp"><span>Ціна</span><span>К-сть</span></div>${asks.map(o => row(o, '#c00')).join('')}
      <div style="text-align:center;font-weight:bold;border-top:1px solid #999;border-bottom:1px solid #999;margin:2px 0">${fmt(pr)}</div>${bids.map(o => row(o, '#090')).join('')}</div>
    <div class="box"><b>Останні угоди</b>${m.trades.slice(0, 10).map(tr => `<div class="bar sp" style="font-size:11px"><span style="color:${tr.side === 'b' ? '#090' : '#c00'}">${fmt(tr.p)}</span><span>${tr.q}</span><span class="small">${tr.t}</span></div>`).join('')}</div>
  </div>
  <div class="box">${tabs([['buy', 'Купити'], ['sell', 'Продати (лот)']], side, 'side')}
    <div class="bar sp"><span>Ціна за 1 шт:</span><span><button onclick="cur().p.lp=${Math.max(1, lp - Math.ceil(pr * 0.005))};render()">−</button>
    <input id="lp" type="number" value="${lp}" style="width:90px" onchange="cur().p.lp=+this.value"> <button onclick="cur().p.lp=${lp + Math.ceil(pr * 0.005)};render()">+</button></span></div>
    <div class="small">Допустимий коридор цін: <b>${fmt(pr * (1 - MK_BAND))} – ${fmt(pr * (1 + MK_BAND))}</b> (±${MK_BAND * 100}%)</div>${limHtml(id)}
    ${side === 'sell' ? `<div class="small">На руки після комісії ${mkFeePct()}%: <b>${fmt(net(lp))}</b> 💵</div><div class="small">У вас є: ${owned} шт. Ціна лота має бути <b>вище ринкової</b>, лот продасться, коли ринок підросте до неї. Гроші прийдуть у Пошту.</div>` : `<div class="small">Гроші резервуються. Ціна заявки має бути <b>нижче ринкової</b>, вона виконається, коли ринок впаде до неї.</div>`}
    <div class="grid g2" style="margin-top:5px">
      <button class="y" onclick="placeOrder('${id}','${side}')">${side === 'buy' ? 'Виставити заявку' : 'Виставити лот'}</button>
      <button class="g" onclick="${side === 'buy' ? `marketBuy('${id}',1)` : `sellNow('${id}')`}">${side === 'buy' ? 'Купити по ринку ' + fmt(pr) : 'Продати по ринку ' + fmt(net(bid(id)))}</button>
    </div></div>
  <div class="box"><b>Мої заявки</b>${(S.orders || []).length ? S.orders.map((o, k) => `<div class="row"><div class="f"><span style="color:${o.side === 'buy' ? '#090' : '#c00'}">${o.side === 'buy' ? 'Купівля' : 'Продаж'}</span> · ${IT[o.id].name}<div class="small">Ваша ціна ${fmt(o.price)} · ринок ${fmt(price(o.id))}</div></div><button onclick="cancelOrder(${k})">Скасувати</button></div>`).join('') : '<div class="small">Немає</div>'}</div>`;
}
function placeOrder(id, side) {
  const inp = $('lp'); const pr = Math.round(+(inp ? inp.value : 0)); if (!(pr > 0)) return toast('Вкажи ціну');
  if (!S.orders) S.orders = [];
  const mp = price(id);
  if (pr > mp * (1 + MK_BAND) || pr < mp * (1 - MK_BAND)) return toast('Ціна поза коридором ±' + MK_BAND * 100 + '%: допустимо ' + fmt(mp * (1 - MK_BAND)) + ' – ' + fmt(mp * (1 + MK_BAND)));
  if ((S.orders || []).length >= mkOrd()) return toast('Ліміт активних заявок: ' + mkOrd() + '. Підписка збільшує його.');
  if (mLeft(side, id) < 1) return toast('Ліміт ' + (side === 'buy' ? 'покупок' : 'продажів') + ' на сьогодні вичерпано (' + mkLimit() + ')');
  if (side === 'buy') {
    if (pr >= mp) return toast('Ціна заявки має бути НИЖЧЕ ринкової (' + fmt(mp) + '). Хочеш купити зараз — «Купити по ринку».');
    if (!pay('money', pr)) return; mUse('buy', id, 1); S.orders.push({ id, side, price: pr }); toast('Заявку на купівлю виставлено: чекає ціни ' + fmt(pr));
  } else {
    if (pr <= mp) return toast('Ціна лота має бути ВИЩЕ ринкової (' + fmt(mp) + '). Хочеш продати зараз — «Продати по ринку».');
    const i = S.inv.find(x => x.id === id); if (!i) return toast('Немає такої речі в інвентарі');
    S.inv = S.inv.filter(x => x !== i); mUse('sell', id, 1); S.orders.push({ id, side, price: pr }); toast('Лот виставлено: чекає ціни ' + fmt(pr));
  }
  cur().p.lp = 0; render();
}
function sellNow(id) { const i = S.inv.find(x => x.id === id); if (!i) return toast('Немає такої речі в інвентарі'); marketSell(i.uid); }
function cancelOrder(k) { const o = S.orders[k]; if (o.side === 'buy') S.money += o.price; else addItem(o.id); S.orders.splice(k, 1); toast('Заявку скасовано'); render(); }

// --- НАЛАШТУВАННЯ

// ---------- ПРИМІРКА ОДЯГУ (інструмент розробника) ----------
function fitKeys(id) { const g = cur().p.g || S.gender; return WEAR[id].slot === 'feet' && !(WEAR[id].layer && WEAR[id].layer[g] && !Array.isArray(WEAR[id].layer[g])) ? [id + ':L', id + ':R'] : [id]; }
function fitDoll() {
  const p = cur().p, g = p.g || S.gender, id = p.id || 'hoodie';
  const eq = Object.assign({}, p.all ? S.equipped : {}, { [WEAR[id].slot]: id });
  return doll(Math.round(470 * (p.zoom || 1)), g, eq);
}
function fitSel() { const p = cur().p; return p.key || fitKeys(p.id || 'hoodie')[0]; }
function fitUpd(field, v, soft) {
  if (field === 'r') v = ((+v + 180) % 360 + 360) % 360 - 180;
  const p = cur().p, g = p.g || S.gender, key = fitSel();
  const old = fitOf(g, key)[field];
  (FIT[g] = FIT[g] || {})[key] = Object.assign(fitOf(g, key), { [field]: +v });
  if (p.link) { const ks = fitKeys(p.id || 'hoodie'); if (ks.length > 1) { const ok = ks.find(k => k !== key); if (ok) { const of = fitOf(g, ok); fitEnt(g, ok)[field] = field === 's' ? +(of.s * (+v / (old || 1))).toFixed(3) : +(of[field] + (+v - old)).toFixed(2); } } }
  fitSave();
  if (soft) { fitRefresh(); } else render();
}
function fitRefresh() {
  const p = cur().p, g = p.g || S.gender, f = fitOf(g, fitSel());
  $('fitBox').innerHTML = fitDoll(); fitOverlay();
  const sb = $('fitSaveBtn'); if (sb) { sb.className = fitDirty() ? 'y' : 'g'; sb.textContent = '💾 Зберегти ' + (fitDirty() ? '(є незбережені зміни)' : '(усе збережено ✓)'); }
  ['dx', 'dy', 's', 'r', 'z', 'o'].forEach(k => { const e = $('fv_' + k), s = $('fs_' + k); if (e) e.textContent = k === 's' ? Math.round(f.s * 100) + '%' : k === 'o' ? f.o + '%' : f[k]; if (s) s.value = f[k]; });
}
function inPoly(u, v, P) { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > v) !== (yj > v) && u < (xj - xi) * (v - yi) / (yj - yi) + xi) c = !c; } return c; }
function fitLoc(e, keyOv) {
  const p = cur().p, key = keyOv || fitSel(), g = p.g || S.gender, d = $('fitBox').querySelector('.doll'); if (!d) return null;
  const el = d.querySelector(`img[data-k="${key}"]`); if (!el) return null;
  const rc = d.getBoundingClientRect(), f = fitOf(g, key), w = el.offsetWidth, h = el.offsetHeight, cx = el.offsetLeft + w / 2, cy = el.offsetTop + h / 2;
  const vx = e.clientX - rc.left - cx, vy = e.clientY - rc.top - cy, an = -f.r * Math.PI / 180, rx = vx * Math.cos(an) - vy * Math.sin(an), ry = vx * Math.sin(an) + vy * Math.cos(an);
  return { u: (rx / f.s + w / 2) / w, v: (ry / f.s + h / 2) / h, w, h, cx, cy, f };
}
function fitPick(e) {
  const d = $('fitBox').querySelector('.doll'); if (!d) return null;
  const els = [...d.querySelectorAll('img[data-k]')].reverse();
  for (const el of els) {
    const L = fitLoc(e, el.dataset.k); if (!L || L.u < 0 || L.u > 1 || L.v < 0 || L.v > 1) continue;
    let hit = true;
    try { const c = document.createElement('canvas'); c.width = el.naturalWidth; c.height = el.naturalHeight; const x = c.getContext('2d'); x.drawImage(el, 0, 0); const px = Math.min(c.width - 1, Math.floor(L.u * c.width)), py = Math.min(c.height - 1, Math.floor(L.v * c.height)); hit = x.getImageData(px, py, 1, 1).data[3] > 25; } catch (er) { }
    if (hit) return el.dataset.k;
  }
  return null;
}
function fitFwd(L, u, v) { const lx = (u * L.w - L.w / 2) * L.f.s, ly = (v * L.h - L.h / 2) * L.f.s, an = L.f.r * Math.PI / 180; return [L.cx + lx * Math.cos(an) - ly * Math.sin(an), L.cy + lx * Math.sin(an) + ly * Math.cos(an)]; }
function fitOverlay() {
  const p = cur().p, ov = $('fitOv'), d = $('fitBox') && $('fitBox').querySelector('.doll'); if (!ov || !d) return;
  ov.setAttribute('viewBox', `0 0 ${d.offsetWidth} ${d.offsetHeight}`);
  const key = fitSel(), el = d.querySelector(`img[data-k="${key}"]`); let s = '';
  const poly = (P, dash) => { if (!P || P.length < 2 || !el) return ''; const L = { w: el.offsetWidth, h: el.offsetHeight, cx: el.offsetLeft + el.offsetWidth / 2, cy: el.offsetTop + el.offsetHeight / 2, f: fitOf(p.g || S.gender, key) }; return `<polygon points="${P.map(([u, v]) => fitFwd(L, u, v).join(',')).join(' ')}" fill="rgba(255,200,0,.18)" stroke="#fc0" stroke-width="1.5" ${dash ? 'stroke-dasharray="5 3"' : ''}/>`; };
  if (p.tool === 'mesh' && el) {
    const ent = fitEnt(p.g || S.gender, key), n = MESHN, L = { w: el.offsetWidth, h: el.offsetHeight, cx: el.offsetLeft + el.offsetWidth / 2, cy: el.offsetTop + el.offsetHeight / 2, f: fitOf(p.g || S.gender, key) };
    const P2 = (i, j) => { const q = ent.mesh ? (ent.mesh.d[j * (n + 1) + i] || [0, 0]) : [0, 0]; return fitFwd(L, meshG(i) + q[0], meshG(j) + q[1]); };
    for (let j = 0; j <= n; j++) { s += `<polyline fill="none" stroke="#0ff" stroke-width="1" points="${Array.from({ length: n + 1 }, (_, i) => P2(i, j).join(',')).join(' ')}"/>`; }
    for (let i = 0; i <= n; i++) { s += `<polyline fill="none" stroke="#0ff" stroke-width="1" points="${Array.from({ length: n + 1 }, (_, j) => P2(i, j).join(',')).join(' ')}"/>`; }
    for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const q = P2(i, j); s += `<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="#fff" stroke="#08f"/>`; }
  }
  if (p.tool === 'erase' && p.cur && el) { const f2 = fitOf(p.g || S.gender, key), rr = (p.brush || 10) / 300 * el.offsetWidth * f2.s; s += `<circle cx="${p.cur.x}" cy="${p.cur.y}" r="${rr}" fill="rgba(255,60,60,.18)" stroke="#fff" stroke-width="1.5"/><circle cx="${p.cur.x}" cy="${p.cur.y}" r="${rr}" fill="none" stroke="#e00" stroke-width="1" stroke-dasharray="3 3"/>`; }
  ov.innerHTML = s;
}
function fitClearMesh() { const g = cur().p.g || S.gender; delete fitEnt(g, fitSel()).mesh; fitSave(); fitRefresh(); }
function fitZoom(m, mx, my) {
  const P = cur().p, v = $('fitView'), z0 = P.zoom || 1, z1 = Math.max(0.5, Math.min(8, +(z0 * m).toFixed(3)));
  if (mx == null) { mx = v.clientWidth / 2; my = v.clientHeight / 2; }
  const cx = (v.scrollLeft + mx) / z0, cy = (v.scrollTop + my) / z0; P.zoom = z1; fitRefresh();
  v.scrollLeft = cx * z1 - mx; v.scrollTop = cy * z1 - my; const e = $('fitZ'); if (e) e.textContent = Math.round(z1 * 100) + '%';
}
function fitUndo() { const g = cur().p.g || S.gender, e = fitEnt(g, fitSel()); if (e.ops && e.ops.length) e.ops.pop(); cur().p.sel = null; fitSave(); fitRefresh(); }
function fitClearOps() { const g = cur().p.g || S.gender; delete fitEnt(g, fitSel()).ops; cur().p.sel = null; fitSave(); fitRefresh(); }
function fitNudge(field, d) { const g = cur().p.g || S.gender, f = fitOf(g, fitSel()); let v = +(f[field] + d).toFixed(2); fitUpd(field, v, true); }
function fitReset() { const g = cur().p.g || S.gender; if (FIT[g]) delete FIT[g][fitSel()]; fitSave(); render(); }
function fitExport() {
  const j = JSON.stringify(FIT);
  try { navigator.clipboard.writeText(j); } catch (e) { }
  modal(`<h3>Експорт підгонки</h3><div class="small">Скопійовано в буфер. Надішли цей текст у чат, я вшию його в гру назавжди.</div><textarea style="width:100%;height:140px" readonly onclick="this.select()">${j}</textarea>`);
}
function fitImport() {
  modal(`<h3>Імпорт</h3><textarea id="fitIn" style="width:100%;height:140px" placeholder="Встав JSON"></textarea><button class="y" style="width:100%" onclick="try{FIT=JSON.parse($('fitIn').value);fitSave();closeModal();render()}catch(e){toast('Невірний JSON')}">Застосувати</button>`);
}
SCREENS.fit = p => {
  const g = p.g || S.gender, id = p.id || 'hoodie', keys = fitKeys(id), key = p.key && keys.includes(p.key) ? p.key : keys[0];
  p.key = key; const f = fitOf(g, key);
  if ((p.tool || 'move') !== 'move') fitEnt(g, key).pad = true;
  after.push(() => {
    const wrap = $('fitWrap'); if (!wrap) return; fitOverlay();
    const view = $('fitView'); view.onwheel = e => { if (e.ctrlKey && e.altKey) { e.preventDefault(); const r = view.getBoundingClientRect(); fitZoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top); } };
    let drag = null;
    wrap.onpointerdown = e => {
      const P0 = cur().p; if ((P0.tool || 'move') === 'move') { const k = fitPick(e); if (k && k !== fitSel()) { P0.key = k; const wid = k.split(':')[0]; if (WEAR[wid]) P0.id = wid; P0.pickChanged = true; } }
      const L = fitLoc(e); if (!L) return; const P = cur().p, tool = P.tool || 'move', key = fitSel(), ent = fitEnt(g, key); ent.ops = ent.ops || [];
      wrap.setPointerCapture(e.pointerId);
      if (tool === 'mesh') {
        const n = MESHN; ent.mesh = ent.mesh || { d: Array.from({ length: (n + 1) * (n + 1) }, () => [0, 0]) }; let best = 0, bd = 9;
        for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const q = ent.mesh.d[j * (n + 1) + i]; const dd = Math.hypot(meshG(i) + q[0] - L.u, meshG(j) + q[1] - L.v); if (dd < bd) { bd = dd; best = j * (n + 1) + i; } }
        drag = { mesh: ent.mesh, gi: best % (n + 1), gj: Math.floor(best / (n + 1)), u0: L.u, v0: L.v, base: ent.mesh.d.map(q => q.slice()) };
      } else if (tool === 'erase') { const op = { t: 'erase', r: (P.brush || 10) / 300, pts: [[+L.u.toFixed(4), +L.v.toFixed(4)]] }; ent.ops.push(op); drag = { op }; fitRefresh(); }
      else if (tool === 'lasso') {
        if (P.sel && P.sel.key === key && inPoly(L.u, L.v, P.sel.poly)) { const op = { t: 'move', poly: P.sel.poly.map(q => q.slice()), dx: 0, dy: 0 }; ent.ops.push(op); drag = { mv: op, u0: L.u, v0: L.v, poly0: P.sel.poly.map(q => q.slice()) }; }
        else { P.sel = null; P.lassoTmp = [[L.u, L.v]]; drag = { lasso: true }; }
      } else drag = { x: e.clientX, y: e.clientY, f: fitOf(g, key) };
    };
    wrap.onpointermove = e => {
      { const P1 = cur().p, d1 = $('fitBox').querySelector('.doll'); if (P1.tool === 'erase' && d1) { const rc = d1.getBoundingClientRect(); P1.cur = { x: e.clientX - rc.left, y: e.clientY - rc.top }; fitOverlay(); } }
      if (!drag) return; const P = cur().p, L = fitLoc(e); if (!L) return;
      if (drag.mesh) {
        const n = MESHN, rad = P.rad || 1.6, du = L.u - drag.u0, dv = L.v - drag.v0;
        for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const dist = Math.hypot(i - drag.gi, j - drag.gj), w0 = Math.max(0, 1 - dist / rad), w = w0 * w0 * (3 - 2 * w0), q = drag.base[j * (n + 1) + i]; drag.mesh.d[j * (n + 1) + i] = [q[0] + du * w, q[1] + dv * w]; }
        fitRefresh();
      } else if (drag.op) { const o = drag.op, q = o.pts[o.pts.length - 1]; if (Math.hypot(L.u - q[0], L.v - q[1]) > o.r / 3) { o.pts.push([+L.u.toFixed(4), +L.v.toFixed(4)]); fitRefresh(); } }
      else if (drag.mv) { drag.mv.dx = +(L.u - drag.u0).toFixed(4); drag.mv.dy = +(L.v - drag.v0).toFixed(4); P.sel.poly = drag.poly0.map(q => [q[0] + drag.mv.dx, q[1] + drag.mv.dy]); fitRefresh(); }
      else if (drag.lasso) { const t = P.lassoTmp, q = t[t.length - 1]; if (Math.hypot(L.u - q[0], L.v - q[1]) > 0.01) { t.push([L.u, L.v]); fitOverlay(); } }
      else { const k = 470 * (P.zoom || 1) / 900; fitUpd('dx', Math.round(drag.f.dx + (e.clientX - drag.x) / k), true); fitUpd('dy', Math.round(drag.f.dy + (e.clientY - drag.y) / k), true); }
    };
    wrap.onpointerleave = () => { cur().p.cur = null; fitOverlay(); };
    wrap.onpointerup = () => {
      if (!drag) return; const P = cur().p;
      if (drag.lasso) { if (P.lassoTmp && P.lassoTmp.length >= 3) P.sel = { key: fitSel(), poly: P.lassoTmp }; P.lassoTmp = null; fitOverlay(); }
      else if (drag.mv && Math.abs(drag.mv.dx) + Math.abs(drag.mv.dy) < 0.002) { const e2 = fitEnt(g, fitSel()); e2.ops.pop(); }
      fitSave(); drag = null; if (P.pickChanged) { P.pickChanged = false; render(); }
    };
  });
  const row = (k, label, min, max, step, val, disp) => `<div class="row" style="gap:4px"><div style="width:62px">${label}</div>
    <button onclick="fitNudge('${k}',${-step})">−</button><input id="fs_${k}" type="range" min="${min}" max="${max}" step="${step}" value="${val}" style="flex:1" oninput="fitUpd('${k}',this.value,true)"><button onclick="fitNudge('${k}',${step})">+</button><b id="fv_${k}" style="width:44px;text-align:right">${disp}</b></div>`;
  const vh = Math.max(430, $('app').clientHeight - 150), tl = p.tool || 'move';
  if (!p.zoom) p.zoom = +Math.min(1.8, (vh - 14) / 470).toFixed(2);
  const sb = (cls, oc, txt, ttl) => `<button class="${cls}" ${ttl ? `title="${ttl}"` : ''} onclick="${oc}">${txt}</button>`;
  return `<div class="bar" style="justify-content:center;gap:4px;margin:0"><b>👔</b><button class="${g === 'm' ? 'sel' : ''}" onclick="setP('g','m')">♂</button><button class="${g === 'f' ? 'sel' : ''}" onclick="setP('g','f')">♀</button>
  <button class="${p.all ? 'sel' : ''}" onclick="setP('all',!cur().p.all)">+ весь одяг</button>${keys.length > 1 ? keys.map(k => `<button class="${k === key ? 'sel' : ''}" onclick="setP('key','${k}')">${k.endsWith('L') ? 'Лівий' : 'Правий'}</button>`).join('') + `<button class="${p.link ? 'sel' : ''}" onclick="setP('link',!cur().p.link)">🔗 обидві разом</button>` : ''}</div>
  <div style="display:flex;gap:4px;margin-top:4px;height:${vh}px">
    <div class="fside">${Object.keys(WEAR).map(w => `<button class="${w === id ? 'y' : ''}" title="${WEAR[w].name}" onclick="cur().p.id='${w}';cur().p.key=null;render()">${wearIcon(w, 'fico')}<span>${WEAR[w].name.split(' ')[0]}</span></button>`).join('')}</div>
    <div id="fitView" style="flex:1;touch-action:none;background:rgba(0,0,0,.08);border-radius:6px;padding:4px;overflow:auto;height:100%"><div id="fitWrap" style="user-select:none;-webkit-user-select:none;position:relative;display:table;margin:0 auto;touch-action:none"><div id="fitBox">${fitDoll()}</div><svg id="fitOv" style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:200"></svg></div></div>
    <div class="fside">
      ${sb(tl === 'move' ? 'sel' : '', "setP('tool','move')", '✋<span>Рух</span>')}
      <label class="${tl === 'mesh' ? 'selL' : ''}"><input type="checkbox" ${tl === 'mesh' ? 'checked' : ''} onchange="setP('tool',this.checked?'mesh':'move')">🕸<span>Сітка</span></label>
      ${sb(tl === 'erase' ? 'sel' : '', "setP('tool','erase')", '🧽<span>Ластик</span>')}
      ${sb('', 'fitUndo()', '↶<span>Назад</span>')}
      ${sb('', 'fitZoom(1.3)', '🔍+<span>Ближче</span>')}
      <div id="fitZ" style="text-align:center;font-size:11px;font-weight:bold">${Math.round((p.zoom || 1) * 100)}%</div>
      ${sb('', 'fitZoom(1/1.3)', '🔍−<span>Далі</span>')}
      ${sb('', 'fitClearOps()', '🧽✕<span>Скинути стир.</span>')}
      ${sb('', 'fitClearMesh()', '🕸✕<span>Скинути сітку</span>')}
      ${sb('', 'fitReset()', '↺<span>Скинути річ</span>')}
    </div>
  </div>
  ${tl === 'erase' ? `<div class="row"><div style="width:90px">Розмір гумки</div><input type="range" min="2" max="80" value="${p.brush || 10}" style="flex:1" oninput="cur().p.brush=+this.value;document.getElementById('brushV').textContent=this.value"><b id="brushV" style="width:30px;text-align:right">${p.brush || 10}</b></div>` : ''}
  ${tl === 'mesh' ? `<div class="row"><div style="width:90px">М'якість</div><input type="range" min="0.8" max="4" step="0.1" value="${p.rad || 1.6}" style="flex:1" oninput="cur().p.rad=+this.value"></div>` : ''}
  <div class="small" style="margin:2px 0">Ctrl+Alt+колесо: зум. Сітка: тягни за будь-яке місце, рухається найближча точка й сусідні.</div>
  <div class="box">${row('dx', 'Ліво/право', -200, 200, 1, f.dx, f.dx)}${row('dy', 'Верх/низ', -200, 200, 1, f.dy, f.dy)}${row('s', 'Розмір', 0.3, 2.5, 0.02, f.s, Math.round(f.s * 100) + '%')}${row('r', 'Поворот', -180, 180, 1, f.r, f.r)}
    <div class="bar" style="justify-content:center"><button onclick="fitNudge('r',-90)">⟲ −90°</button><button onclick="fitNudge('r',-15)">−15°</button><button onclick="fitUpd('r',0,true)">0°</button><button onclick="fitNudge('r',15)">+15°</button><button onclick="fitNudge('r',90)">⟳ +90°</button></div>
    ${row('z', 'Шар (над/під)', -9, 9, 1, f.z, f.z)}${row('o', 'Прозорість', 0, 100, 5, f.o, f.o + '%')}</div>
  <div class="box" style="text-align:center"><button id="fitSaveBtn" class="${fitDirty() ? 'y' : 'g'}" style="width:100%;padding:12px;font-size:16px" onclick="fitCommit()">💾 Зберегти ${fitDirty() ? '(є незбережені зміни)' : '(усе збережено ✓)'}</button>${fitDirty() ? `<button style="width:100%;margin-top:6px" onclick="fitRevert()">↩ Відкинути зміни до останнього збереження</button>` : ''}<div class="small">Збережене положення діє скрізь, де герой одягнений.</div></div>
  <div class="grid g2"><button class="y" onclick="fitExport()">📤 Експорт</button><button onclick="fitImport()">📥 Імпорт</button><button onclick="FIT={};fitSave();render()">Скинути все</button></div>`;
};
SCREENS.settings = p => {
  const t = p.tab || 'main';
  let h = `<h2>⚙ Налаштування</h2>${tabs([['main', 'Основні'], ['dev', '🛠 Розробник']], t)}`;
  if (t === 'dev') return h + `<div class="note">Тестові кнопки для перевірки прототипу. У грі їх не буде.</div>
  <div class="box"><button class="${S.devAll ? 'g' : ''}" style="width:100%;padding:10px;margin-bottom:6px" onclick="S.devAll=!S.devAll;render()">🔓 Відкрити все (тест): ${S.devAll ? 'УВІМК' : 'вимк'}</button><button class="y" style="width:100%;padding:10px" onclick="go('fit')">👔 Примірка одягу (підгонка речей на герої)</button></div>
  <div class="box"><b>Валюта</b><div class="grid g2">
    <button class="y" onclick="give({money:1000000},'Розробник');render()">+1 000 000 💵</button>
    <button class="y" onclick="give({crystals:5000},'Розробник');render()">+5 000 💎</button>
    <button class="y" onclick="give({gold:500},'Розробник');render()">+500 🟡</button>
    <button class="y" onclick="give({chips:500},'Розробник');render()">+500 🎟</button>
    <button onclick="give({money:1000000,crystals:5000,gold:500,chips:500},'Розробник');render()">+ усе разом</button>
    <button onclick="S.energy=60;render()">⚡ 60</button>
    <button onclick="spS().pts+=300;render()">+300 очок сезону</button><button onclick="spS();S.sprem=S.sprem?0:1;render()">⭐ Преміум пропуск вкл/вимк</button>
    <button class="y" onclick="give({ammo:200,grenades:10},'Розробник');render()">+200 🔫 +10 💣</button></div></div>
  <div class="box"><b>Ліміти й день</b><div class="grid g2">
    <button onclick="S.daily.pk=0;S.daily.sb=0;S.daily.cp=0;S.daily.cpc={};S.daily.cs={};S.daily.chipsClaim=false;toast('Ліміти казино скинуто');render()">Скинути ліміти казино</button>
    <button onclick="S.day='';save();load();render()">Новий день</button>
    <button onclick="DISTS.forEach(D=>dRate(D.id,20000));render()">+ рейтинг районів</button>
    <button onclick="S.xp+=xpNeed(S.lvl);lvlCheck();render()">+1 рівень</button></div></div>`;
  return h + `<div class="box">Звук: <button onclick="toast('Заглушка')">Увімк</button> Музика: <button onclick="toast('Заглушка')">Увімк</button></div>
  <div class="box">Мова: Українська</div>
  <div class="box"><b>Перенос збереження</b><div class="small">Одне посилання: скопіюй тут, відкрий у Telegram, і прогрес з’явиться там.</div><div class="grid g2"><button class="y" onclick="saveExport()">🔗 Посилання</button><button onclick="saveImport()">📥 Вставити</button></div></div>
  <button style="background:#f99;width:100%" onclick="if(confirmReset()){}">Скинути прогрес (почати з нуля)</button>
  <div class="note">Прототип зберігає прогрес у браузері (localStorage).</div>`;
};
const b64u = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 8192) s += String.fromCharCode.apply(null, u8.subarray(i, i + 8192)); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
const unb64u = t => { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; const s = atob(t), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
async function zip(str, mode) { const st = mode === 'c' ? new Blob([str]).stream().pipeThrough(new CompressionStream('deflate-raw')) : new Blob([str]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return new Uint8Array(await new Response(st).arrayBuffer()); }
const BOT = 'PotuzhneMisto_bot', PAGE = 'https://stasiya408-dev.github.io/tg-miniapp/';
async function saveExport() {
  const o = Object.assign({}, S, { mail: [] }), t = b64u(await zip(JSON.stringify(o), 'c'));
  const link = t.length <= 480 ? `https://t.me/${BOT}?startapp=PM${t}` : `${PAGE}#pm=${t}`;
  window._lnk = link;
  modal(`<h3>Посилання з прогресом</h3><div class="small">${t.length <= 480 ? 'Скопійовано. Встав у чат Telegram і відкрий: прогрес з’явиться в Mini App.' : 'Скопійовано. Надішли собі в Telegram (наприклад, «Збережене»), потім у Mini App: Налаштування → «Вставити» → встав це посилання.'}</div>
  <textarea id="lnkT" style="width:100%;height:70px" readonly onclick="this.select()">${link}</textarea>
  <button class="y" style="width:100%;margin-top:6px" id="lnkB" onclick="lnkCopy()">📋 Копіювати</button><button style="width:100%;margin-top:6px" onclick="closeModal()">Готово</button>`);
  setTimeout(lnkCopy, 50);
}
function lnkCopy() {
  const ta = $('lnkT'), b = $('lnkB'); let ok = false;
  try { ta.focus(); ta.select(); ok = document.execCommand('copy'); } catch (e) { }
  if (!ok) { try { navigator.clipboard.writeText(window._lnk); ok = true; } catch (e) { } }
  if (b && ok) b.textContent = '✓ Скопійовано';
}
function saveImport() {
  modal(`<h3>Вставити посилання</h3><div class="small">Встав посилання з прогресом. Поточний прогрес буде замінено.</div><textarea id="saveIn" style="width:100%;height:80px"></textarea><button class="y" style="width:100%;margin-top:6px" onclick="saveApply()">Застосувати</button><button style="width:100%;margin-top:6px" onclick="closeModal()">Скасувати</button>`);
}
function payOf(txt) { const m = String(txt).match(/(?:startapp=PM|pm=)([A-Za-z0-9_-]{20,})/); return m ? m[1] : null; }
async function applyPay(t) { const o = JSON.parse(new TextDecoder().decode(await zip2(unb64u(t)))); if (!o || !o.created) throw 0; o.savedAt = Date.now(); localStorage.setItem('pm_state', JSON.stringify(o)); localStorage.setItem('pm_imp', t); }
async function saveApply() {
  try { const t = payOf($('saveIn').value); if (!t) throw 0; await applyPay(t); location.reload(); } catch (e) { toast('Не вдалося: посилання неповне або пошкоджене'); }
}
async function zip2(u8) { return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()); }
function confirmReset() { modal(`<p>Скинути весь прогрес?</p><button style="background:#f99" onclick="localStorage.removeItem('pm_state');load();closeModal();stack=[{name:'create',p:{}}];render()">Так, скинути</button>`); }

// ---------- СТАРТ ----------
// @@SEED@@ (підставляється при деплої в Telegram: стан гри з артефакта; null = немає)
const SEED = null;
(function applySeed() { try { if (!SEED || localStorage.getItem('pm_seedver') === String(SEED.ver)) return; const o = JSON.parse(SEED.state); o.savedAt = Date.now(); localStorage.setItem('pm_state', JSON.stringify(o)); localStorage.setItem('pm_seedver', String(SEED.ver)); } catch (e) { } })();
const PAY = (() => { try { const sp = TGW && TGW.initDataUnsafe && TGW.initDataUnsafe.start_param; if (sp && sp.startsWith('PM')) return sp.slice(2); return payOf(location.hash.slice(1)); } catch (e) { return null; } })();
function boot() {
load();
catchUpLots();
stack = [{ name: S.created ? 'home' : 'create', p: {} }];
if (CS) {
  $('app').innerHTML = '<div style="text-align:center;padding:120px 10px"><div style="font-size:40px">⏳</div><b>Завантаження прогресу…</b></div>';
  cloudRestore().catch(() => false).then(ok => { restoring = false; if (ok) { load(); catchUpLots(); stack = [{ name: S.created ? 'home' : 'create', p: {} }]; } lastJ = stateJ(); render(); if (S.created) schedCloud(); });
} else { lastJ = stateJ(); render(); }
}
if (PAY && localStorage.getItem('pm_imp') !== PAY) {
  $('app').innerHTML = '<div style="text-align:center;padding:120px 10px"><div style="font-size:40px">⏳</div><b>Переношу прогрес…</b></div>';
  applyPay(PAY).then(() => { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } location.reload(); }).catch(() => { restoring = false; boot(); });
} else boot();
if (S && S.chips == null) S.chips = 450;
setInterval(() => {
  if (!S || !stack.length) return;
  distDaily(); tickMarket(); tickLots(1); const newMsg = tickChat(); const grDone = grTick(); if (grDone) toast('🏁 Груповий заїзд завершено!'); save();
  const ae = document.activeElement, typing = ae && ['INPUT', 'SELECT'].includes(ae.tagName);
  if (cur().name === 'market' && !typing && $('modal').style.display !== 'flex') render();
  if (cur().name === 'races' && S.gr && S.gr.st === 'run' && !($('modal').style.display === 'flex')) render();
  if (newMsg && chatVisible() && !typing && $('modal').style.display !== 'flex') render();
}, 2000);
// Не перемальовуємо екран, поки гравець вводить текст (в Telegram клавіатура міняє розмір вікна й закривала поле)
const isTyping = () => { const ae = document.activeElement; return !!(ae && ['INPUT', 'TEXTAREA', 'SELECT'].includes(ae.tagName)); };
let rzT = null, rzPend = false;
window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { if (isTyping()) { rzPend = true; return; } render(); }, 200); });
document.addEventListener('focusout', () => { if (rzPend) setTimeout(() => { if (!isTyping()) { rzPend = false; render(); } }, 300); });
