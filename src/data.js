/**
 * Base de dados dos pontos de interesse do Campus Carreiros.
 * Estrutura:
 * - id: Identificador único (usado para busca e ícones).
 * - nome: Título exibido no mapa e nos detalhes.
 * - lat/lng: Coordenadas geográficas decimais.
 * - descricao: Texto informativo sobre o local.
 * - cardapio: (Opcional) Objeto contendo os pratos da semana para RUs.
 */
export const predios = [

// Restaurante Universitário - Lago - Requer atualização presencial semanal
  { 
    id: "ru Lago", 
    nome: "RU - Restaurante Universitário - Lago", 
    lat: -32.07306634990571,  
    lng: -52.16590916190858, 
    descricao: "Almoço: 11h00 - 14h00 | Janta: 18h00 - 21h.",
    cardapio: {
      segunda: "Aguardando atualização...",
      terca: "Aguardando atualização...",
      quarta: "Aguardando atualização...",
      quinta: "Aguardando atualização...",
      sexta: "Aguardando atualização...",
    }
  },
  // Restaurante Universitário - CC - Requer atualização presencial semanal
  { 
    id: "ru CC", 
    nome: "RU - Restaurante Universitário - Centro de Convivência", 
    lat: -32.075120, 
    lng: -52.166576, 
    descricao: "Almoço: 11h00 - 14h00 | Janta: 18h00 - 21h.",
    cardapio: {
      segunda: "Aguardando atualização...",
      terca: "Aguardando atualização...",
      quarta: "Aguardando atualização...",
      quinta: "Aguardando atualização...",
      sexta: "Aguardando atualização...",
    }
  },

  // Centro de Ciências Computacionais - Prédio administrativo e acadêmico
  { 
    id: "c3", 
    nome: "C3 - Centro de Ciências Computacionais", 
    lat: -32.072865, 
    lng: -52.168750, 
    descricao: "Núcleo de tecnologia, salas de aula e laboratórios de informática." 
  },

  // Biblioteca Central - Unidade de acervo e estudo silencioso
  { 
    id: "sib", 
    nome: "Biblioteca Central - FURG", 
    lat: -32.07514,
    lng: -52.16794,
    descricao: "Espaço para pesquisa, empréstimo de livros e áreas de estudo." 
  },

  // Bolha - Espaço de práticas esportivas e recreativas
  { 
    id: "bolha", 
    nome: "Bolha - Quadra Poliesportiva Coberta", 
    lat: -32.07230683403758,  
    lng: -52.165204703721756,
    descricao: "Espaço para práticas esportivas e recreativas, incluindo quadras de futsal, vôlei e basquete." 
  },  

 // Centro de Convivência do Centro Esportivo
  { 
    id: "CCzinho", 
    nome: "Centro de Convivência do Centro Esportivo", 
    lat: -32.07209355821569,   
    lng: -52.16487053086666,
    descricao: "Espaço para confraternizações." 
  },  

 //Centro Esportivo
  { 
    id: "CE", 
    nome: "Centro Esportivo", 
    lat: -32.07201260512735,    
    lng: -52.164416243272825,
    descricao: "Centro Esportivo - Prédio da Educação Física." 
  },  

 //Ginásio da FURG
  { 
    id: "Ginásio", 
    nome: "Ginásio da FURG", 
    lat: -32.07030444435608,    
    lng: -52.16368412717432,
    descricao: "Ginásio da FURG" 
  },  



  // DCE - Diretório Central dos Estudantes - Espaço de representação estudantil e eventos
  { 
    id: "dce", 
    nome: "DCE - Diretório Central dos Estudantes", 
    lat: -32.07355120519164, 
    lng: -52.16620407860406,
    descricao: "Espaço de representação estudantil e eventos." 
  },

  // CIDEC - Centro de Integração e Desenvolvimento de Competências
  { 
    id: "cidec", 
    nome: "CIDEC - Centro de Integração e Desenvolvimento de Competências", 
    lat: -32.07356374718664, 
    lng: -52.16092094351752,
    descricao: "Espaço de desenvolvimento de habilidades, cursos e eventos para a comunidade acadêmica." 
  },

  // Reitoria - Administração central do campus
  { 
    id: "reitoria", 
    nome: "Reitoria", 
    lat: -32.07200442983928,  
    lng: -52.16118404867057,
    descricao: "Administração central do campus." 
  },
  // Pavilhão 1 - Pavilhão de aulas teóricas
  { 
    id: "pav.1", 
    nome: "Pavilhão 1", 
    lat: -32.074699393757385, 
    lng: -52.16877498604861, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus." 
  },

  // Pavilhão 2 - Pavilhão de aulas teóricas
  { 
    id: "pav.2", 
    nome: "Pavilhão 2", 
    lat: -32.074486678988016, 
    lng: -52.167919257529874, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus." 
  },

  // Pavilhão 3 - Pavilhão de aulas teóricas
  { 
    id: "pav.3", 
    nome: "Pavilhão 3", 
    lat: -32.075131527231974,
    lng: -52.168823228656315, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus." 
  },

  // Pavilhão 4 - Pavilhão de aulas teóricas
  { 
    id: "pav.4", 
    nome: "Pavilhão 4", 
    lat: -32.075816497097094, 
    lng: -52.166162588417414, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus." 
  },

  // FADIR - Faculdade de Direito - Prédio acadêmico e administrativo
  { 
    id: "fadir", 
    nome: "FADIR - Faculdade de Direito", 
    lat: -32.075570048966476,  
    lng: -52.167056076190825, 
    descricao: "Prédio acadêmico e administrativo da Faculdade de Direito." 
  },

  // ICEAC - Instituto de Ciências Econômicas, Administrativas e Contábeis - Prédio acadêmico e administrativo
  { 
    id: "iceac", 
    nome: "ICEAC - Instituto de Ciências Econômicas, Administrativas e Contábeis", 
    lat: -32.07603143913811, 
    lng: -52.16691791985317,
    descricao: "Prédio acadêmico e administrativo do Instituto de Ciências Econômicas, Administrativas e Contábeis." 
  },

  // Pavilhão 5 - Pavilhão de aulas teóricas
  { 
    id: "pav.5", 
    nome: "Pavilhão 5", 
    lat: -32.07132498551156, 
    lng: -52.16220866318655, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus." 
  },

  // Pavilhão 6 - Pavilhão de aulas teóricas
  { 
    id: "pav.6", 
    nome: "Pavilhão 6", 
    lat: -32.07620023329867,  
    lng: -52.16775650890125, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus." 
  },  

  // Instituto de Ciências Humanas e da Informação - Prédio acadêmico e administrativo
  { 
    id: "ICHI", 
    nome: "Instituto de Ciências Humanas e da Informação", 
    lat: -32.07534387832739,  
    lng: -52.17025866516805,
    descricao: "Instituto dedicado às ciências humanas, com salas de aula, laboratórios e administração." 
  },

  // ILA - Instituto de Letras e Artes - Prédio acadêmico e administrativo
  { 
    id: "ILA", 
    nome: "Instituto de Letras e Artes", 
    lat: -32.07719400395277,  
    lng: -52.16678479568807, 
    descricao: "Instituto dedicado às ciências humanas, com salas de aula, laboratórios e administração." 
  },

    //ILA - Prédio Artes Visuais - Prédio acadêmico e administrativo
  { 
    id: "Artes", 
    nome: "ILA - Prédio Artes Visuais", 
    lat: -32.07679189775128, 
    lng: -52.16678003592912  ,
    descricao: "Instituto dedicado às ciências humanas, com salas de aula, laboratórios e administração." 
  },

  // PRAE - Assistência e suporte ao estudante
  { 
    id: "prae", 
    nome: "PRAE - Assuntos Estudantis", 
    lat: -32.07656630397785, 
    lng: -52.1648646495357,
    descricao: "Gestão de auxílios, bolsas e apoio psicossocial aos alunos." 
  },

  // Casa do Estudante - Hotel de Trânsito e moradia estudantil
  { 
    id: "hotel", 
    nome: "Casa do Estudante - Hotel de Trânsito", 
    lat: -32.07729093747684, 
    lng: -52.16557515720279,
    descricao: "Hotel de Trânsito." 
  },

  // Casa do Estudante 1
  { 
    id: "ceu 1", 
    nome: "Casa do Estudante - 1", 
    lat: -32.07769106768267,    
    lng: -52.1701271431193,
    descricao: "Casa do Estudante - 1." 
  },

  // Casa do Estudante 2
  { 
    id: "ceu 2", 
    nome: "Casa do Estudante - 2", 
    lat: -32.07751698311312,   
    lng: -52.16967316305177,
    descricao: "Casa do Estudante - 2." 
  },

  // Casa do Estudante 3
  { 
    id: "ceu 3", 
    nome: "Casa do Estudante - 3", 
    lat: -32.07796637853579,   
    lng: -52.170144828788274,
    descricao: "Casa do Estudante - 3." 
  },

  // Casa do Estudante 4
  { 
    id: "ceu 4", 
    nome: "Casa do Estudante - 4", 
    lat: -32.078259648049354, 
    lng: -52.17003767259812,
    descricao: "Casa do Estudante - 4." 
  },

// EQA - Escola de Química e Alimentos - Prédio acadêmico e laboratorial
  { 
    id: "eqa", 
    nome: "EQA - Escola de Química e Alimentos", 
    lat: -32.072538119777725,  
    lng: -52.16744869308113,
    descricao: "Escola dedicada à formação em química e alimentos, com laboratórios e instalações modernas." 
  },

// EE - Escola de Engenharia - Prédio acadêmico e laboratorial
  { 
    id: "ee", 
    nome: "EE - Escola de Engenharia", 
    lat: -32.07374130193944,   
    lng: -52.16745432378393,
    descricao: "Escola dedicada à formação em engenharia, com laboratórios e instalações modernas." 
  },

// IO - Instituto de Oceanografia - Prédio acadêmico e laboratorial
  { 
    id: "io", 
    nome: "IO - Instituto de Oceanografia", 
    lat: -32.0699925825384,   
    lng: -52.161924961616435,
    descricao: "Instituto de Oceanografia" 
  },

// IE - Instituto de Educação - Prédio acadêmico e administrativo
  { 
    id: "ie", 
    nome: "IE - Instituto de Educação", 
    lat: -32.07067237002862,  
    lng: -52.16254464799544,
    descricao: "Instituto dedicado à formação em educação, com salas de aula e administração." 
  },

// IMEF - Instituto de Matemática, Estatística e Física - Prédio acadêmico e laboratorial
  { 
    id: "imef", 
    nome: "IMEF - Instituto de Matemática, Estatística e Física", 
    lat: -32.07380965123657,    
    lng: -52.166841804476455,
    descricao: "Instituto dedicado à formação em matemática, estatística e física, com laboratórios e instalações modernas." 
  },

  // CIA - Centro Integrado de Análises
  { 
    id: "cia", 
    nome: "CIA - Centro Integrado de Análises", 
    lat: -32.07224631911278,  
    lng: -52.16582618641688,
    descricao: "O CIA/FURG Tem como finalidade oferecer condições de uso de equipamentos de análises químicas, físicas e biológicas, lotados no centro, em atividades relacionadas à pesquisa, ensino, extensão e inovação." 
  },
  // Pró-Reitoria de Graduação - Coordenação acadêmica e administrativa dos cursos de graduação
  { 
    id: "prograd", 
    nome: "Pró-Reitoria de Graduação", 
    lat: -32.076517397178215,  
    lng: -52.165138136865366,
    descricao: "Coordenação acadêmica e administrativa dos cursos de graduação." 
  },
  // Pró-Reitoria de Extensão e Cultura - Coordenação acadêmica e administrativa dos cursos de extensão e cultura
  {
    id: "proexc", 
    nome: "Pró-Reitoria de Extensão e Cultura", 
    lat: -32.07681333656249,   
    lng: -52.16523216777362,
    descricao: "Coordenação acadêmica e administrativa dos cursos de extensão e cultura." 
  },

   // SEAD - Secretaria de Educação a Distância - Coordenação acadêmica e administrativa dos cursos de educação a distância
  {
    id: "sead", 
    nome: "SEAD - Secretaria de Educação a Distância", 
    lat: -32.076548497384124,   
    lng: -52.17071219314518,
    descricao: "Coordenação acadêmica e administrativa dos cursos de educação a distância." 
  } 
];