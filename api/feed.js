// Busca o feed RSS do Deployada direto no servidor da Vercel,
// sempre atualizado, e entrega para o site.
const FEED = "https://anchor.fm/s/1180ca0e4/podcast/rss";

module.exports = async (req, res) => {
  try {
    const r = await fetch(FEED + "?t=" + Date.now(), {
      cache: "no-store",
      headers: { "User-Agent": "deployada-site" }
    });
    if (!r.ok) throw new Error("feed " + r.status);
    const xml = await r.text();
    if (xml.indexOf("<rss") < 0) throw new Error("resposta inválida");
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    // guarda por no máximo 5 minutos
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).send(xml);
  } catch (e) {
    res.setHeader("Cache-Control", "no-store");
    res.status(502).send("Não foi possível buscar o feed.");
  }
};
