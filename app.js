/* =========================================================
   Modal + Tarot (Mobile Friendly) — app.js
   ========================================================= */

/* ---------- เปิด/ปิด Modal (ใช้หลายอันร่วมกัน) ---------- */
const overlay = document.getElementById('overlay');
let activeModal = null, lastFocused = null;

function openModal(id){
  const m = document.getElementById(id);
  if(!m) return;
  lastFocused = document.activeElement;

  // ล็อกสกรอลล์พื้นหลังเฉพาะตอนเปิดโมดัล
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  overlay.hidden = false;
  m.hidden = false;
  requestAnimationFrame(()=>{
    overlay.classList.add('show');
    m.classList.add('show');
  });
  activeModal = m;
  m.querySelector('.modal__panel')?.focus();

  document.addEventListener('keydown', onEsc);
  document.addEventListener('focus', trap, true);
}

function closeModal(){
  if(!activeModal) return;
  overlay.classList.remove('show');
  activeModal.classList.remove('show');

  setTimeout(()=>{
    overlay.hidden = true;
    activeModal.hidden = true;

    // ปลดล็อกสกรอลล์พื้นหลังเมื่อปิด
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    lastFocused?.focus();
    activeModal = null;
  }, 200);

  document.removeEventListener('keydown', onEsc);
  document.removeEventListener('focus', trap, true);
}


function onEsc(e){ if(e.key === 'Escape') closeModal(); }
function trap(e){
  if(!activeModal || activeModal.hidden) return;
  if(!activeModal.contains(e.target)){
    e.stopPropagation();
    activeModal.querySelector('.modal__panel')?.focus();
  }
}

/* ---------- รอ DOM โหลดเสร็จแล้วค่อยผูกปุ่ม/ฟอร์ม ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // ปุ่มเปิด/ปิดโมดัล
  document.querySelectorAll('[data-open]').forEach(b =>
    b.addEventListener('click', ()=>openModal(b.dataset.open))
  );
  document.querySelectorAll('[data-close]').forEach(b =>
    b.addEventListener('click', closeModal)
  );
  overlay.addEventListener('click', closeModal);// ฟอร์มลงทะเบียนสินค้า
document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');
  if (productForm) {
    productForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(productForm);

      const name = formData.get('productName');
      const price = formData.get('price');
      const image = formData.get('productImage');

      alert(`บันทึกสินค้าแล้ว:\nชื่อ: ${name}\nราคา: ${price} บาท\nไฟล์รูป: ${image.name}`);

      // TODO: เก็บสินค้าใน array / localStorage ได้ตามต้องการ
      productForm.reset();
      closeModal();
    });
  }
});

  document.addEventListener('click', e => { if(e.target === activeModal) closeModal(); });

  // ฟอร์มลงทะเบียน (เดโม)
  document.getElementById('regForm')?.addEventListener('submit', e=>{
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target).entries());
    alert(`ลงทะเบียนสำเร็จ\nชื่อ: ${d.name}\nอีเมล: ${d.email}`);
    closeModal(); e.target.reset();
  });

  // ปุ่มสุ่มไพ่ / คัดลอกคำทำนาย
  document.getElementById('drawCard')?.addEventListener('click', drawRandomCard);
  document.getElementById('copyReading')?.addEventListener('click', copyReading);
});

/* ---------- ชุดไพ่ทาโร่ 78 ใบ (ไฟล์ภาพอยู่ในโฟลเดอร์ tarot/) ---------- */
const TAROT = [
  // ===== Major Arcana (0–21) =====
  {img:'major_00_fool.webp',        name:'The Fool (0)',         up:'การเริ่มต้นใหม่ โอกาส กล้าลองสิ่งใหม่',                                  rev:'ความหุนหันพลันแล่น ขาดการวางแผน เสี่ยงเกินไป'},
  {img:'major_01_magician.webp',    name:'The Magician (I)',     up:'พลังแห่งการลงมือทำ มีทรัพยากรครบ ความมั่นใจ',                           rev:'พลังที่ใช้ผิดทาง หลอกลวง ขาดโฟกัส'},
  {img:'major_02_hightpriestess.webp',name:'The High Priestess (II)', up:'สัญชาตญาณ ความลับ การรับรู้ลึกซึ้ง',                              rev:'เพิกเฉยต่อสัญชาตญาณ ความลับปกปิด ความสับสน'},
  {img:'major_03_empress.webp',     name:'The Empress (III)',    up:'ความอุดมสมบูรณ์ ความรัก การดูแลเอาใจใส่ การเติบโต',                       rev:'ความฟุ่มเฟือย บทบาทดูแลที่หนักเกินไป ความคิดสร้างสรรค์ติดขัด'},
  {img:'major_04_emperor.webp',     name:'The Emperor (IV)',     up:'โครงสร้าง อำนาจ ความมั่นคง การเป็นผู้นำ',                                rev:'เผด็จการ แข็งทื่อ ขาดความยืดหยุ่น'},
  {img:'major_05_hierophant.webp',  name:'The Hierophant (V)',   up:'ประเพณี ผู้รู้/ครู ระบบ กฎเกณฑ์ การเรียนรู้',                             rev:'ตั้งคำถามกับกรอบเดิม ๆ ความไม่เข้าพวก'},
  {img:'major_06_lovers.webp',      name:'The Lovers (VI)',      up:'ความรัก ความร่วมมือ การตัดสินใจตามคุณค่า',                               rev:'ความลังเล ข้อขัดแย้งในความสัมพันธ์ ทางเลือกที่ขัดกับคุณค่า'},
  {img:'major_07_chariot.webp',     name:'The Chariot (VII)',    up:'ชัยชนะจากวินัยและการควบคุม ตะลุยไปข้างหน้า',                             rev:'ทิศทางไม่ชัด ควบคุมอารมณ์ไม่ได้ พ่ายแพ้เพราะวอกแวก'},
  {img:'major_08_strength.webp',    name:'Strength (VIII)',      up:'ความกล้าหาญ ความอ่อนโยนที่ทรงพลัง ควบคุมตนเอง',                         rev:'ขาดความมั่นใจ โกรธง่าย กดทับตนเอง'},
  {img:'major_09_hermit.webp',      name:'The Hermit (IX)',      up:'การใคร่ครวญภายใน ผู้ชี้ทาง เวลาพักจากความวุ่นวาย',                       rev:'โดดเดี่ยวเกินไป เอาแต่ตัวเอง ไม่ฟังคำแนะนำ'},
  {img:'major_10_wheel.webp',       name:'Wheel of Fortune (X)', up:'วัฏจักร โอกาสเปลี่ยนแปลง ดวงขึ้น โชคช่วย',                               rev:'จังหวะไม่เป็นใจ วุ่นวาย ควบคุมอะไรไม่ได้'},
  {img:'major_11_justice.webp',     name:'Justice (XI)',         up:'ความยุติธรรม ความจริง การตัดสินอย่างเที่ยงตรง',                           rev:'ความไม่ยุติธรรม หลีกเลี่ยงความจริง การรับผิดชอบ'},
  {img:'major_12_hangedman.webp',   name:'The Hanged Man (XII)', up:'มุมมองใหม่ การหยุดรอเพื่อเข้าใจ การเสียสละที่มีความหมาย',                 rev:'ติดค้าง ไม่ยอมปล่อยผ่าน เสียสละโดยไม่จำเป็น'},
  {img:'major_13_death.webp',       name:'Death (XIII)',         up:'การสิ้นสุดเพื่อเริ่มใหม่ เปลี่ยนผ่านครั้งใหญ่',                           rev:'ยื้อไม่ยอมเปลี่ยน กลัวการปิดฉาก วนลูปเดิม'},
  {img:'major_14_temperance.webp',  name:'Temperance (XIV)',     up:'ความพอดี การผสมผสาน สมดุล เยียวยา',                                       rev:'สุดโต่ง ขาดดุลยภาพ การประนีประนอมที่พัง'},
  {img:'major_15_devil.webp',       name:'The Devil (XV)',       up:'พันธนาการ ความยึดติด ความสุขสั้น ๆ/สิ่งล่อใจ',                           rev:'ปลดล็อกเลิกติด ข้ามผ่านข้อจำกัดภายใน'},
  {img:'major_16_tower.webp',       name:'The Tower (XVI)',      up:'เหตุการณ์ไม่คาดคิดที่ทลายของเดิม เปิดทางสู่ความจริง',                      rev:'ความเสียหายที่เลี่ยงได้ ชะลอการล่มสลาย ยึดของเก่า'},
  {img:'major_17_star.webp',        name:'The Star (XVII)',      up:'ความหวัง การฟื้นตัว ความสงบและแรงบันดาลใจ',                               rev:'หมดไฟ สงสัยในตนเอง ต้องเยียวยาภายใน'},
  {img:'major_18_moon.webp',        name:'The Moon (XVIII)',     up:'ความคลุมเครือ ภาพฝัน อารมณ์ลึก ฟังสัญชาตญาณ',                           rev:'สับสน/หวาดกลัวเกินจริง ความจริงเริ่มชัด'},
  {img:'major_19_sun.webp',         name:'The Sun (XIX)',        up:'ความสำเร็จ ความสุข ความชัดเจน ออร่าเปล่ง',                                 rev:'ดีแต่ช้าหรือชั่วคราว รู้สึกโดดเดี่ยว แม้ทุกอย่างดูดี'},
  {img:'major_20_judgement.webp',   name:'Judgement (XX)',       up:'ตื่นรู้ การประเมินใหม่ การให้อภัย/ชุบชีวิต',                               rev:'ติดอดีต วิจารณ์ตนเองแรง เกรงการตัดสิน'},
  {img:'major_21_world.webp',       name:'The World (XXI)',      up:'บทสรุปสมบูรณ์ การบรรลุเป้าหมาย วงจรที่ครบถ้วน',                          rev:'ค้างคา ปิดโปรเจกต์ไม่ลง วนซ้ำรอบเดิม'},

  // ===== Wands =====
  {img:'wands_ace.webp', name:'Ace of Wands', up:'ประกายไอเดียใหม่ แรงบันดาลใจ จุดเริ่มต้นสร้างสรรค์', rev:'แรงบันดาลใจหาย ผัดวันประกันพรุ่ง'},
  {img:'wands_2.webp',   name:'Two of Wands', up:'วางแผนมองไกล เลือกเส้นทางใหม่', rev:'ลังเล กลัวออกจากคอมฟอร์ตโซน'},
  {img:'wands_3.webp',   name:'Three of Wands', up:'ขยายผล เฝ้ารอผลลัพธ์ เดินทาง/โอกาสกว้างขึ้น', rev:'แผนชะงัก ต้องปรับทิศ'},
  {img:'wands_4.webp',   name:'Four of Wands', up:'ฉลอง ความมั่นคงในบ้าน/ทีม', rev:'ความตึงเครียดในบ้าน/ทีม ยังไม่มั่นคง'},
  {img:'wands_5.webp',   name:'Five of Wands', up:'แข่งขัน ถกเถียงเพื่อพัฒนา', rev:'ขัดแย้งไร้สาระ พลังงานแตกแยก'},
  {img:'wands_6.webp',   name:'Six of Wands', up:'ชัยชนะ การยอมรับ สปอตไลต์', rev:'ความคาดหวังสูงเกิน/อีโก้'},
  {img:'wands_7.webp',   name:'Seven of Wands', up:'ยืนหยัดปกป้องจุดยืน', rev:'เหนื่อยล้า ป้องกันมากไป'},
  {img:'wands_8.webp',   name:'Eight of Wands', up:'ข่าวดี/ความคืบหน้าเร็ว เดินทางเร็ว', rev:'ล่าช้า ติดขัดในการสื่อสาร'},
  {img:'wands_9.webp',   name:'Nine of Wands', up:'อดทนช่วงโค้งสุดท้าย ตั้งการ์ด', rev:'หมดแรง ระวังปิดกั้นเกินไป'},
  {img:'wands_10.webp',  name:'Ten of Wands', up:'แบกภาระมาก งานล้น ต้องจัดลำดับ', rev:'ปล่อยวาง แบ่งเบาภาระ'},
  {img:'wands_page.webp',name:'Page of Wands', up:'ข่าว/ไอเดียใหม่ ความตื่นเต้น', rev:'ขาดความต่อเนื่อง เบื่อง่าย'},
  {img:'wands_knight.webp',name:'Knight of Wands', up:'ลงมืออย่างกล้าได้กล้าเสีย การผจญภัย', rev:'หุนหันผลีผลาม เปลี่ยนใจเร็ว'},
  {img:'wands_queen.webp',name:'Queen of Wands', up:'เสน่ห์ มั่นใจ ภาวะผู้นำที่อบอุ่น', rev:'ขาดความมั่นใจ อิจฉา/ควบคุม'},
  {img:'wands_king.webp', name:'King of Wands', up:'วิสัยทัศน์ กล้าเสี่ยง ผู้ชี้นำ', rev:'เผด็จการ ดันทุรัง ความเสี่ยงเกินไป'},

  // ===== Cups =====
  {img:'cups_ace.webp', name:'Ace of Cups', up:'เริ่มอารมณ์/ความรักใหม่ หัวใจเปิดรับ', rev:'อารมณ์อั้น ไม่กล้าเปิดใจ'},
  {img:'cups_2.webp',   name:'Two of Cups', up:'พันธมิตร/รักที่สมดุล การจับมือ', rev:'ไม่ลงรอย เข้าใจผิด'},
  {img:'cups_3.webp',   name:'Three of Cups', up:'มิตรภาพ เฉลิมฉลอง ทีมเวิร์ก', rev:'ซุบซิบ/วงแตก ใช้เวลาส่วนตัวเพิ่ม'},
  {img:'cups_4.webp',   name:'Four of Cups', up:'เบื่อหน่าย พลาดโอกาสเพราะใจลอย', rev:'มองเห็นโอกาสใหม่ ตื่นตัว'},
  {img:'cups_5.webp',   name:'Five of Cups', up:'เสียใจ เสียดาย แต่ยังมีสิ่งดีเหลืออยู่', rev:'ยอมรับและก้าวต่อ เยียวยา'},
  {img:'cups_6.webp',   name:'Six of Cups', up:'ความทรงจำวัยเด็ก หวนคืนสิ่งคุ้นเคย', rev:'ติดอดีต ไม่ก้าวไปข้างหน้า'},
  {img:'cups_7.webp',   name:'Seven of Cups', up:'ตัวเลือกมาก จินตนาการสูง ต้องโฟกัส', rev:'สับสนลดลง ตัดสินใจชัด'},
  {img:'cups_8.webp',   name:'Eight of Cups', up:'เดินจากสิ่งที่ไม่เติมเต็ม แสวงหาความหมาย', rev:'ลังเลจะจาก กลัวสูญเสีย'},
  {img:'cups_9.webp',   name:'Nine of Cups', up:'ความสมปรารถนา พอใจในสิ่งที่มี', rev:'ความสุขผิวเผิน ฟุ่มเฟือย'},
  {img:'cups_10.webp',  name:'Ten of Cups', up:'ครอบครัวอบอุ่น สุขภาพใจดี', rev:'ตึงเครียดในครอบครัว/ความคาดหวังสูง'},
  {img:'cups_page.webp',name:'Page of Cups', up:'ข่าวดีเรื่องใจ ความคิดสร้างสรรค์', rev:'ขี้อาย/เพ้อฝันเกินจริง'},
  {img:'cups_knight.webp',name:'Knight of Cups', up:'โรแมนติก เสน่ห์ ข้อเสนอที่งดงาม', rev:'อ่อนไหวเกินไป เปลี่ยนอารมณ์เร็ว'},
  {img:'cups_queen.webp',name:'Queen of Cups', up:'เข้าอกเข้าใจ ลึกซึ้ง เยียวยา', rev:'อ่อนไหวเกินดูแลตัวเองน้อย'},
  {img:'cups_king.webp', name:'King of Cups', up:'สงบนิ่ง ครองอารมณ์เก่ง ผู้ไกล่เกลี่ย', rev:'กดอารมณ์/เฉยชา เก็บกด'},

  // ===== Swords =====
  {img:'swords_ace.webp', name:'Ace of Swords', up:'ความจริง/ไอเดียคมชัด ตัดสินใจชัด', rev:'สับสน ข่าวลือ ความจริงบิดเบือน'},
  {img:'swords_2.webp',   name:'Two of Swords', up:'ชั่งใจ ปิดใจชั่วคราว รอข้อมูลเพิ่ม', rev:'ปลดบังตา เลือกทาง'},
  {img:'swords_3.webp',   name:'Three of Swords', up:'เจ็บปวด ผิดหวัง แยกจาก', rev:'เยียวยา ให้อภัย ปลดปล่อย'},
  {img:'swords_4.webp',   name:'Four of Swords', up:'พักฟื้น พักสมอง วางดาบก่อน', rev:'กระสับกระส่าย ต้องพักจริง ๆ'},
  {img:'swords_5.webp',   name:'Five of Swords', up:'ชนะที่สูญเสียความสัมพันธ์ อีโก้ชน', rev:'ประนีประนอม ขอโทษ/ยอมถอย'},
  {img:'swords_6.webp',   name:'Six of Swords', up:'ย้ายผ่านพ้นสิ่งยาก สู่ที่สงบกว่า', rev:'ย้ายไม่ได้/ยื้ออดีต'},
  {img:'swords_7.webp',   name:'Seven of Swords', up:'ลับ ๆ ล่อ ๆ กลยุทธ์ ระวังการโกง', rev:'เปิดเผย ยอมรับความจริง'},
  {img:'swords_8.webp',   name:'Eight of Swords', up:'ติดกับความคิด ขังตนเอง', rev:'ปลดปล่อย เปลี่ยนมุมมอง'},
  {img:'swords_9.webp',   name:'Nine of Swords', up:'กังวล นอนไม่หลับ ความกลัว', rev:'คลายกังวล ช่วยเหลือจากคนรอบข้าง'},
  {img:'swords_10.webp',  name:'Ten of Swords', up:'ถึงจุดจบสุด ๆ แต่รุ่งอรุณใหม่กำลังมา', rev:'ฟื้นตัว ช้ำน้อยลง เริ่มใหม่'},
  {img:'swords_page.webp',name:'Page of Swords', up:'อยากรู้อยากเห็น สื่อสารเร็ว', rev:'พูดก่อนคิด จับผิดคนอื่น'},
  {img:'swords_knight.webp',name:'Knight of Swords', up:'พุ่งไปสู่เป้าหมาย ตรงไปตรงมา', rev:'หุนหัน/ทื่อเกิน ขาดไหวพริบ'},
  {img:'swords_queen.webp',name:'Queen of Swords', up:'เหตุผลคมชัด พูดตรง ยุติธรรม', rev:'เย็นชา ตัดสินแรง'},
  {img:'swords_king.webp', name:'King of Swords', up:'สติปัญญาเป็นผู้นำ กฎหมาย/กฎเกณฑ์', rev:'เข้มงวดเกิน โต้เถียงเก่ง'},

  // ===== Pentacles =====
  {img:'pentacles_ace.webp', name:'Ace of Pentacles', up:'โอกาสทางการเงิน/รูปธรรมใหม่ ๆ', rev:'พลาดโอกาส ใช้ทรัพยากรไม่คุ้ม'},
  {img:'pentacles_2.webp',   name:'Two of Pentacles', up:'บาลานซ์งาน/เงินหลายเรื่อง จัดเวลา', rev:'โอเวอร์โหลด จัดการไม่ลง'},
  {img:'pentacles_3.webp',   name:'Three of Pentacles', up:'ร่วมมือทีม งานช่าง/ทักษะก้าวหน้า', rev:'ทำงานคนเดียวจนตัน ไม่ฟัง feedback'},
  {img:'pentacles_4.webp',   name:'Four of Pentacles', up:'ยึดติดความมั่นคง ออมระวังตัว', rev:'เปิดใจ ใช้จ่ายเพื่อการเติบโต'},
  {img:'pentacles_5.webp',   name:'Five of Pentacles', up:'ลำบากชั่วคราว ขอความช่วยเหลือได้', rev:'ฟื้นตัว พบที่พึ่ง'},
  {img:'pentacles_6.webp',   name:'Six of Pentacles', up:'ให้-รับอย่างสมดุล การกุศล', rev:'ให้เกินตัว หรือคาดหวังผลตอบแทน'},
  {img:'pentacles_7.webp',   name:'Seven of Pentacles', up:'รอผลจากสิ่งที่ลงทุน อดทน', rev:'ทบทวนว่าคุ้มไหม ปรับกลยุทธ์'},
  {img:'pentacles_8.webp',   name:'Eight of Pentacles', up:'ฝึกฝนชำนาญ ทำงานละเอียด', rev:'ทำงานแบบอัตโนมัติ ไร้ใจ'},
  {img:'pentacles_9.webp',   name:'Nine of Pentacles', up:'ความสำเร็จส่วนตัว ความเป็นอิสระ สุขสงบ', rev:'พึ่งพิงมากไป โดดเดี่ยว'},
  {img:'pentacles_10.webp',  name:'Ten of Pentacles', up:'ทรัพย์สินมั่นคง ครอบครัวรุ่นสู่รุ่น', rev:'ประเด็นทรัพย์สิน/มรดกขัดแย้ง'},
  {img:'pentacles_page.webp',name:'Page of Pentacles', up:'ข่าว/โอกาสเรียน-งาน-เงิน เริ่มต้นจริงจัง', rev:'ขาดวินัย สมาธิสั้น'},
  {img:'pentacles_knight.webp',name:'Knight of Pentacles', up:'ขยัน อดทน ทำตามแผน', rev:'ยึดติดขั้นตอน ช้าเกินไป'},
  {img:'pentacles_queen.webp',name:'Queen of Pentacles', up:'ดูแลความเป็นอยู่ เก่งทั้งบ้านและงาน', rev:'ลืมดูแลตัวเอง วุ่นวายเรื่องบ้าน'},
  {img:'pentacles_king.webp', name:'King of Pentacles', up:'มั่นคงทางการเงิน ผู้นำที่สร้างผลลัพธ์', rev:'ยึดติดวัตถุ อวดฐานะ'}
];

/* ---------- สุ่มไพ่ + ทิศทาง + แสดงผล ---------- */
const cardView = document.getElementById('cardView');

function drawRandomCard(){
  const card = TAROT[Math.floor(Math.random()*TAROT.length)];
  const reversed = Math.random() < 0.5; // 50% กลับหัว
  const imgPath = `tarot/${card.img}`;

  cardView.innerHTML = `
    <div class="card-title">${card.name}</div>
    <div class="card-orient">${reversed ? 'กลับหัว (Reversed)' : 'ปกติ (Upright)'}</div>
    <img class="card-img" src="${imgPath}" alt="${card.name}"
         onerror="this.replaceWith(createPlaceholder('${card.name}'));">
    <div class="reading">
      <strong>คำทำนาย:</strong>
      <div id="reading-text">${reversed ? card.rev : card.up}</div>
    </div>
  `;
}

// ฟังก์ชัน placeholder เมื่อไม่มีรูป
window.createPlaceholder = function(title){
  const p = document.createElement('div');
  p.className = 'placeholder';
  p.textContent = `ไม่มีรูป: ${title}`;
  return p;
};

function copyReading(){
  const el = document.getElementById('reading-text');
  if(!el) return;
  const text = el.innerText;

  // HTTPS/localhost ถึงจะใช้ clipboard API ได้แน่นอน
  navigator.clipboard?.writeText(text).then(()=>{
    alert('คัดลอกคำทำนายแล้ว');
  }).catch(()=>{
    // fallback สำหรับกรณีเปิดไฟล์แบบ file://
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); alert('คัดลอกคำทำนายแล้ว'); }
    finally { ta.remove(); }
  });
}
