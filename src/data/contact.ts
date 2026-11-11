// Contact details derived from the homepage "Store & contact" section, so the
// footer, product pages, and the mobile contact bar follow one CMS field.
import page from './pages/products.json';

const contact = page.sections.find((section) => section.type === 'contact');
const lines = (contact?.body || '').split('\n').map((line) => line.trim()).filter(Boolean);
const phoneLine = lines.find((line) => /\d[\d .]{7,}\d/.test(line));
const display = phoneLine?.match(/\d[\d .]{7,}\d/)?.[0].trim() || '0961 851 818';
const digits = display.replace(/\D/g, '');

export const contactTitle = contact?.title || 'Liên hệ';
export const contactLines = lines;
export const hotline = { display, tel: `tel:+84${digits.replace(/^0/, '')}`, zalo: `https://zalo.me/${digits}` };
