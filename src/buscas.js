export const traduzirBusca = (query) => {
  const texto = query.toLowerCase().trim();

  // Dicionário Estático
  const rotas = {
    'ru': 'ru_cc', 
    'restaurante': 'ru_cc',
    'c3': 'c3', 
    'pet c3': 'c3',
    'pet': 'c3',
    'biblioteca': 'sib'
  };

  if (rotas[texto]) return rotas[texto];

  // Regras de Salas (RegEx)
  if (/^12\d{2}$/.test(texto)) return 'pavilhao_1'; 
  if (/^13\d{2}$/.test(texto)) return 'pavilhao_2'; 
  if (/^21\d{2}$/.test(texto)) return 'pavilhao_3'; 

  return texto;
};