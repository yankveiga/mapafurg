const removerAcentos = (texto = '') =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const normalizarTextoBusca = (texto = '') =>
  removerAcentos(texto.toLowerCase())
    .replace(/[^a-z0-9\s]/g, '') // AQUI: o \s preserva os espaços
    .trim();

const normalizarConsulta = (texto = '') =>
  removerAcentos(texto.toLowerCase())
    .replace(/\b(sala|predio|pavilhao)\b/g, '')
    .replace(/[^a-z0-9]/g, '') // AQUI: sem o \s para garantir chaves exatas no dicionário
    .trim();

export const traduzirBusca = (query) => {
  const textoNormalizado = normalizarTextoBusca(query);
  const textoLimpo = normalizarConsulta(query);

  if (!textoLimpo) return { idsExtras: [], termosBusca: [] };

  const rotas = {
    // Restaurantes
    ru: ['ru_CC', 'ru_Lago'],
    rucc: ['ru_CC'],
    rulago: ['ru_Lago'],
    restaurante: ['ru_CC', 'ru_Lago'],
    restauranteuniversitario: ['ru_CC', 'ru_Lago'],
    bandejao: ['ru_CC', 'ru_Lago'],
    
    // C3
    c3: ['c3'],
    computacao: ['c3'],
    automacao: ['c3'],
    robotica: ['c3'],
    sistemasdeinformacao: ['c3'],
    petc3: ['c3'],
    petcienciascomputacionais: ['c3'],
    pet: ['c3', 'anexo_2'],
    furgbot: ['c3'],
    tecnologiadegeoinformacao: ['c3'],
    

    //Bibiloteca
    biblioteca: ['sib'],
    sib: ['sib'],

    // Casa do estudante
    casa: ['ceu_1', 'ceu_2', 'ceu_3', 'ceu_4', 'hotel'],
    ceu: ['ceu_1', 'ceu_2', 'ceu_3', 'ceu_4', 'hotel'],
    casadoestudante: ['ceu_1', 'ceu_2', 'ceu_3', 'ceu_4', 'hotel'],

    // Pavilhão 1
    diretoriaacademicoeq: ['pavilhao_1'],
    diretoriaacademicoengenhariaquimica: ['pavilhao_1'],

    // Anexo 2
    // PET Civil — K22
    petcivil: ["k22"],
    civil: ["k22"],
    petciv: ["k22"],

    // PET SabEst — J05
    petsabest: ["j05"],
    sabest: ["j05"],

    // Atena Jr — J07
    atenajr: ["j07"],
    atena: ["j07"],

    // Pérola Negra — Q06
    perolanegranautica: ["q06"],
    perolanegra: ["q06"],
    perola: ["q06"],
    pn: ["q06"],

    // LabEst — J06
    labest: ["j06"],
    laboratorioestatistica: ["j06"],
    estatistica: ["j06"],

    // GETrans — J10
    getrans: ["j10"],
    geotransportes: ["j10"],
    transportes: ["j10"],

    // GATC — J13
    gatc: ["j13"],
    astrocomputacional: ["j13"],
    astrofisicateorica: ["j13"],
    grupoastrofisica: ["j13"],
    grupoteorica: ["j13"],

    // C3D — J16
    ciencia3d: ["j16"],
    impressao3d: ["j16"],
    // DAECE — O03
    daece: ["o03"],
    diretoriodeengenharia: ["o03"],
    centroestudantilengenharia: ["o03"],
    // PH Consultoria Jr. — O06
    phconsultoria: ["o06"],
    phjr: ["o06"],
    // AeroFURG — O07
    aerofurg: ["o07"],
    aero: ["o07"],
    aeronautica: ["o07"],
    // Laboratório de Sistemas Térmicos (LST) — O07
    lst: ["o07"],
    sistemastermicos: ["o07"],
    termicos: ["o07"],
    // LETRON — O09
    letron: ["o09"],
    roboticaletron: ["o09"],
    robolet: ["o09"],
    // Observatório Astronômico — sem sala
    obsastro: [""],
    observatorioastronomico: [""],
    astronomia: [""],
    observatorio: [""],
    // LANSD — sem sala
    lansd: [""],
    nucleodesoftdev: [""], // suposição
    softwaredevelopment: [""],
    // AstroSul — P14
    astrosul: ["p14"],
    astroesul: ["p14"],
    astrolab: ["p14"]
  } 

  let alvos = [];

  // Checagem parcial: previne o sumiço enquanto o usuário digita
  for (const chave in rotas) {
    if (chave.includes(textoLimpo)) {
      alvos = [...alvos, ...rotas[chave]];
    }
  }

  const prefixos = {
    eg: 'expressao_grafica',
  };

  const matchLetras = textoLimpo.match(/^([a-z]+)\d+$/);
  if (matchLetras && prefixos[matchLetras[1]]) {
    alvos.push(prefixos[matchLetras[1]]);
  }

  const pavilhaoExplicito = textoNormalizado.match(/^(?:pav|pavilhao|predio)(\d+)$/);
  if (pavilhaoExplicito) {
    alvos.push(`pavilhao_${pavilhaoExplicito[1]}`);
  }

  const numeroDaSala = textoLimpo.match(/^(\d)\d{3}$/);
  if (numeroDaSala) {
    alvos.push(`pavilhao_${numeroDaSala[1]}`);
  }

  return {
    idsExtras: [...new Set(alvos)],
    termosBusca: [textoNormalizado], // AQUI: Retornamos o texto com os espaços de volta para a busca do App.jsx
  };
};
