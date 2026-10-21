// DOCX = a zip of XML files. We translate the text inside paragraphs and leave
// everything else (styles, tables, images, layout) untouched. Runs in the browser.
const PARA = /<w:p[\s>][\s\S]*?<\/w:p>/g;
const TEXT = /(<w:t(?:\s[^>]*)?>)([\s\S]*?)(<\/w:t>)/g;
const FILES = /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/;

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const encode = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function paraText(p: string) {
  let t = "";
  for (const m of p.matchAll(TEXT)) t += decode(m[2]);
  return t;
}

// Put the translation in the paragraph's first text run and empty the others.
export function replaceParaText(p: string, translated: string) {
  let first = true;
  return p.replace(TEXT, (_m, open: string, _c: string, close: string) => {
    if (!first) return open + close;
    first = false;
    if (!open.includes("xml:space")) open = open.replace("<w:t", '<w:t xml:space="preserve"');
    return open + encode(translated) + close;
  });
}

export type Segment = { file: string; index: number; text: string };

export async function extractDocx(buf: ArrayBuffer) {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(buf);
  const segments: Segment[] = [];
  for (const name of Object.keys(zip.files).filter((n) => FILES.test(n))) {
    const xml = await zip.file(name)!.async("string");
    let i = 0;
    for (const m of xml.matchAll(PARA)) {
      const text = paraText(m[0]);
      if (text.trim()) segments.push({ file: name, index: i, text });
      i++;
    }
  }
  return { zip, segments };
}

export async function buildDocx(zip: Awaited<ReturnType<typeof extractDocx>>["zip"], segments: Segment[], translations: string[]) {
  const byFile = new Map<string, Map<number, string>>();
  segments.forEach((s, k) => {
    if (!byFile.has(s.file)) byFile.set(s.file, new Map());
    byFile.get(s.file)!.set(s.index, translations[k]);
  });
  for (const [file, map] of byFile) {
    const xml = await zip.file(file)!.async("string");
    let i = 0;
    zip.file(file, xml.replace(PARA, (p) => {
      const t = map.get(i++);
      return t === undefined ? p : replaceParaText(p, t);
    }));
  }
  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
