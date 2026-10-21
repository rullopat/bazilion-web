// Engine versions belong in detailed docs, never in homepage copy or metadata.
const piVersion = /\bpi(?:['’]s)?(?:[\s:,;()—–-]+(?:version|engine|runtime|coding|agent))*[\s:,;()—–-]*v?\s*\d+\.\d+(?:\.\d+)?/i;

export function hasPiVersion(value) {
  const decoded = value.replace(/&nbsp;/gi, ' ').replace(/&#(x[0-9a-f]+|\d+);/gi, (entity, code) => {
    const point = code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code);
    return point <= 0x10ffff ? String.fromCodePoint(point) : entity;
  });
  return piVersion.test(decoded) || piVersion.test(decoded.replace(/<[^>]*>/g, ' '));
}
