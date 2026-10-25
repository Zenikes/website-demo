/*
  DADOS DO SITE — este é o único ficheiro que precisas de editar para mudar
  empreendimentos, notícias, imagem principal e logótipo.

  No Base44 estes dados estavam na base de dados (entidades Project, FeaturedItem,
  NewsItem e SiteSetting) e NÃO foram incluídos no export. Os 4 empreendimentos
  abaixo são os exemplos que estavam no código — substitui pelos teus reais.

  Estados possíveis: em_construcao | concluido | em_projeto | em_comercializacao
  Imagens: podes usar URLs; depois corre embed_images.py para as embutir no site.
*/
window.SITE = {
  heroImage: "https://media.db.com/images/public/6a1eb119c15c574519bc9a55/407cc9530_generated_d52fc4e5.png",
  logo: null, // ex.: "https://.../logo.png" — se null, mostra "Antunes & Calisto" em texto
  email: "info@antunescalisto.pt"
};

window.PROJECTS = [
  {
    id: "residencias-aurora",
    title: "Residências Aurora",
    location: "Av. da Liberdade, Lisboa",
    status: "em_comercializacao",
    typology: "T1 a T4",
    year: "2025",
    featured: true,
    cover_image: "https://media.db.com/images/public/6a1eb119c15c574519bc9a55/08faff7bc_generated_f21e35ce.png",
    description: "",
    features: [],
    materials: "",
    total_units: null,
    area_range: "",
    floors: null,
    energy_rating: "",
    media_items: [] // ex.: [{type:"image", url:"..."}, {type:"video", url:"https://youtu.be/..."}]
  },
  {
    id: "torre-magellan",
    title: "Torre Magellan",
    location: "Parque das Nações, Lisboa",
    status: "em_construcao",
    typology: "T2 a T5",
    year: "2026",
    featured: true,
    cover_image: "https://media.db.com/images/public/6a1eb119c15c574519bc9a55/405264f5b_generated_0a4050e3.png",
    description: "", features: [], materials: "", total_units: null, area_range: "", floors: null, energy_rating: "", media_items: []
  },
  {
    id: "vista-tejo",
    title: "Vista Tejo",
    location: "Belém, Lisboa",
    status: "concluido",
    typology: "T1 a T3",
    year: "2024",
    featured: true,
    cover_image: "https://media.db.com/images/public/6a1eb119c15c574519bc9a55/842ffc4e9_generated_2ec283bd.png",
    description: "", features: [], materials: "", total_units: null, area_range: "", floors: null, energy_rating: "", media_items: []
  },
  {
    id: "jardins-do-mondego",
    title: "Jardins do Mondego",
    location: "Coimbra",
    status: "em_projeto",
    typology: "T2 a T4",
    year: "2027",
    featured: true,
    cover_image: "https://media.db.com/images/public/6a1eb119c15c574519bc9a55/afde6cfba_generated_697a5a17.png",
    description: "", features: [], materials: "", total_units: null, area_range: "", floors: null, energy_rating: "", media_items: []
  }
];

window.NEWS = [
  {
    source: "JLL Portugal", date_label: "Fevereiro 2026", tag: "Investimento",
    title: "Mercado imobiliário português mantém força em 2026",
    summary: "Após um crescimento de 21% em 2025, que elevou o volume de investimento para €2,8 mil milhões, o mercado entra em 2026 com bases sólidas. O investimento internacional, responsável por cerca de 70% das transações, mantém Portugal no radar europeu.",
    url: "https://www.jll.com/pt-pt/newsroom/mercado-imobiliario-portugues-mantem-forca"
  },
  {
    source: "Observador", date_label: "Abril 2026", tag: "Análise",
    title: "Solidez do imobiliário nacional em 2026",
    summary: "Portugal deverá crescer 2,3% em 2026, acima da média da Zona Euro, com inflação estabilizada em torno de 2% e um mercado de trabalho resiliente. A descida das taxas do BCE começa a refletir-se no custo de capital e na reativação de decisões de investimento.",
    url: "https://observador.pt/2026/04/09/mercado-imobiliario-nacional-solidez-em-2026/"
  },
  {
    source: "Casa SAPO", date_label: "Março 2026", tag: "Mercado",
    title: "Investimento imobiliário cresce em Portugal",
    summary: "O mercado imobiliário comercial registou cerca de €2.850 milhões em transações, o melhor desempenho dos últimos três anos. Foram realizadas mais de 100 transações, representando um crescimento de 17% face a 2024, com 61% de capital internacional.",
    url: "https://casa.sapo.pt/noticias/investimento-imobiliario-cresce-em-portugal/?id=34605"
  },
  {
    source: "CBRE Portugal", date_label: "2026", tag: "Perspetivas",
    title: "Perspetivas do mercado imobiliário para 2026",
    summary: "Os volumes de investimento aumentaram 17% em 2025. A escassez estrutural de oferta pressiona preços e rendas, com rendas prime a atingir €30/m² em Lisboa e €21/m² no Porto. Retalho, hotelaria e residências de estudantes lideram o interesse dos investidores.",
    url: "https://www.cbre.pt/insights-e-research/reports/19343152474"
  }
];
