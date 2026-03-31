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
    petc3: ['c3'],
    petcienciascomputacionais: ['c3'],
    pet: ['c3'],

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
  };

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