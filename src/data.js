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
    id: "ru_Lago", 
    nome: "RU - Restaurante Universitário - Lago", 
    lat: -32.07306634990571,  
    lng: -52.16590916190858, 
    descricao: "Segunda a Sexta (exceto feriados):\n☀️ Almoço: 11h00 às 14h00\n🌙 Jantar: 18h00 às 21h00",
    cardapio: {
      segunda: "Arroz Branco, Arroz Integral, Feijão Preto, Frango Cubos Bovinos ao Molho, Grão de Bico com Molho Vermelho, Ovo Pochê, Parafuso Alho e Óleo, Alface, Cenoura Ralada, Mix de Grãos, Maçã",
      terca: "Arroz Branco, Arroz Integral com Linhaça, Feijão Preto, Strogonoff de Frango, Bife Acebolado, Cogumelos Refogados, Ovo Cozido, Batata Palha, Alface, Repolho, Macarronese, Melão",
      quarta: "Arroz Branco, Arroz Integral, Feijão Preto, Frango à Xadrez, Carne Moída, PTS ao Molho, Ovo Pochê, Legumes Sauteé, Alface, Beterraba Cozida, Tomate com Cebola, Melancia",
      quinta: "Arroz Branco, Arroz Integral com Linhaça, Feijão Carioca, Frango ao Molho, Carré Acebolado, Pastel de Brócolis com Cenoura, Ovo Cozido, Farofa Colorida, Alface, Pepino, Cenoura Cozida, Laranja",
      sexta: "Arroz Branco, Arroz Integral, Feijão Preto, Carne Moída ao Molho, Peixe Empanado, PST ao Molho, Ovo Pochê, Purê de Batata, Alface, Chuchu, Beterraba Ralada, Banana",
    }
  },
  // Restaurante Universitário - CC - Requer atualização presencial semanal
  { 
    id: "ru_CC", 
    nome: "RU - Restaurante Universitário - Centro de Convivência", 
    lat: -32.075120, 
    lng: -52.166576, 
    descricao: "Segunda a Sexta:\n☕ Café: 07h15 às 09h00\n☀️ Almoço: 11h00 às 14h00\n🌙 Jantar: 18h00 às 21h00\n\nSábados, Domingos e Feriados:\n☕ Café: 08h30 às 09h45\n☀️ Almoço: 12h00 às 13h45\n🌙 Jantar: 18h30 às 20h00",
    cardapio: {
      segunda: "Arroz Branco, Arroz Integral, Feijão Preto, Strogonoff de Carne Bovina, Filé de Frango ao Molho Mostarda, PTS com Moranga, Batata Palha, Couve Chinesa, Cenoura Cozida, Pepino, Laranja",
      terca: "Arroz Branco, Arroz Integral com Linhaça, Feijão Preto, Pastel de Carne, Cubos de Frango à Xadrez, Grão de Bico Crocante, Cenoura Sautê, Alface, Maionese de Beterraba, Rabanete em Conserva, Maçã",
      quarta: "Arroz Branco, Arroz Integral, Feijão Preto, Cubos de Suínos ao Molho BBQ, Fricassê de Frango, Legumes Sauteados, Massa Espaguete ao Alho e Óleo, Alface, Chuchu com Milho, Salada Caicó, Melão",
      quinta: "Arroz Branco, Arroz Integral, Lentilha, Bife Bovino Acebolado, Peixe à Milanesa, Tomate Recheado com PTS, Purê de Batatas Especial, Mix de Folhas, Cenoura Cozida, Rabanete Ralado, Banana",
      sexta: "Arroz Branco, Arroz Integral, Feijão Carioca, Lasanha à Bolonhesa, Bife de Frango Crocante, Strogonoff de Cogumelos, Jardineira de Legumes, Alface, Soja em Grãos Refogado com Tempero Verde, Salada Naútica, Laranja",
      sábado: "Arroz Branco, Arroz Integral, Feijão Preto, Bisteca Suína ao Molho Madeira, Cubos de Frango à Xadrez, Bolinho de Grão de Bico, Bolinho de Cenoura, Alface, Berinjela Cozida com Tempero Verde, Tomate com Cebola, Maçã",
      domingo: "Arroz Branco, Arroz Integral, Feijão Carioca, Carne de Panela, Coxa com Sobrecoxa Assada no Forno, Hambúrguer de Lentilha, Farofa com Legumes, Chicória, Beterraba Cozida, Pepino com Cebola, Creme de Baunilha com Calda de Maçã",
    }
  },     
    
  // Horários Interno
    { 
      id: "interno", 
      nome: "Ônibus Interno - FURG", 
      lat: -32.0755005530394,
      lng: -52.15362642286624,
      descricao: "🚌 Transporte circular gratuito dentro do Campus Carreiros.\n\n* Vai até o OCEANTEC (parada de 2 min).\n** Saída da EQA.\n✉️ viaturas@furg.br",
      interno: {
        "Manhã": "06:50 • 07:10 • 07:30 • 07:50* • 08:15 • 08:50 • 09:30 • 10:25 • 11:05 • 11:30 • 12:00* • 12:15",
        "Tarde": "12:45* • 13:15 • 13:40* • 14:00 • 14:50 • 15:30 • 16:00 • 16:50 • 17:30 • 18:05*",
        "Noite": "18:30 • 18:55* • 19:20 • 20:25 • 20:40 • 21:35** • 22:20** • 22:45** • 23:15**"
      }
    },
  // C3 - Centro de Ciências Computacionais
    { 
    id: "c3", 
    nome: "C3 - Centro de Ciências Computacionais", 
    lat: -32.072865, 
    lng: -52.168750, 
    descricao: "Núcleo de tecnologia, salas de aula e laboratórios de informática.",
    projetos: [
      { nome: "PET C3", sala: "114", link: "https://instagram.com/petc3furg" },
      { nome: "LAMSA", sala: "Sala Y" }, // Sem link
      { nome: "FBOT", sala: "Sala Z", link: "https://instagram.com/furgbot" }
    ]
  },

{ 
    id: "sib", 
    nome: "Biblioteca Central - FURG", 
    lat: -32.07514,
    lng: -52.16794,
    horarios: {
      "Segunda": "08h às 12h",
      "Terça": "13h às 17h",
      "Quarta": "17h às 21h",
      "Quinta": "14h às 18h",
      "Sexta": "14h às 18h"
    },
    descricao: "⚠️ Operação em horário reduzido devido à greve.\nEspaço para pesquisa e empréstimo de livros.\n📸 @sibfurg \n✉️ sib.direcao@furg.br \n📞 (53) 3293-5388",
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

    // PROPLAD - Pró-Reitoria de Planejamento e Desenvolvimento - Coordenação acadêmica e administrativa dos cursos de planejamento e desenvolvimento
  { 
    id: "proplad", 
    nome: "PROPLAD - Pró-Reitoria de Planejamento e Desenvolvimento", 
    lat: -32.075679184918364,   
    lng: -52.164463628058506,
    descricao: "Coordenação acadêmica e administrativa dos cursos de planejamento e desenvolvimento." 
  },

    // PRAE - Pró-Reitoria de Assuntos Estudantis - Assistência e suporte ao estudante
  { 
    id: "prae", 
    nome: "PRAE - Pró-Reitoria de Assuntos Estudantis", 
    lat: -32.076585787869675,    
    lng: -52.16488764742339,    
    descricao: "Assistência e suporte ao estudante.",
  },

    // PROINFA - Pró-Reitoria de Infraestrutura
  { 
    id: "proinfa", 
    nome: "PROINFA - Pró-Reitoria de Infraestrutura", 
    lat: -32.07481441043893,  
    lng: -52.16456266948454,
    descricao: "A Pró-Reitoria de Infraestrutura – PROINFRA é o órgão que coordena as ações relativas à implantação, manutenção e ampliação da infraestrutura necessária ao desenvolvimento das atividades de ensino, de pesquisa, de extensão e de administração, conservando e construindo seu patrimônio a partir de processos ambientalmente sustentáveis, em consonância com o disposto no Estatuto, no Regimento Geral e na Política Ambiental da Universidade.",
  },

    // PROGEP - Pró-Reitoria de Gestão de Pessoas
  { 
    id: "progep", 
    nome: "PROGEP - Pró-Reitoria de Gestão de Pessoas", 
    lat: -32.0737109147389,   
    lng: -52.163094213086545,
    descricao: "A PROGEP - Pró-Reitoria de Gestão de Pessoas.",
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

  // Prédio da Psicologia
  { 
    id: "psico", 
    nome: "Prédio da Psicologia", 
    lat: -32.07469157334473, 
    lng: -52.170154775984244,
    descricao: "Prédio acadêmico e administrativo de Psicologia." 
  },

 // CEAMECIM - Centro de Educação Ambiental, Ciências e Matemática
  { 
    id: "ceamecim", 
    nome: "CEAMECIM - Centro de Educação Ambiental, Ciências e Matemática", 
    lat: -32.076140944487726, 
    lng: -52.17029789473499,
    descricao: "O CEAMECIM é um centro da FURG que forma professores e desenvolve materiais e projetos para melhorar o ensino de Ciências, Matemática e Educação Ambiental. Ele começou em 1981 como um Clube de Ciências e, ao longo dos anos, virou um centro de pesquisa, extensão e formação, participando de programas nacionais, criando cursos, eventos e recursos didáticos. Hoje segue atuando como referência regional nessas áreas.\n\n🕐Horário de Funcionamento:\nSegunda à sexta-feira: 13h - 17h." 
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
    //Centro de Línguas (IsF, CELE, Nutra)
  { 
    id: "CELE", 
    nome: "Centro de Línguas (IsF, CELE, Nutra)", 
    lat: -32.07649228260792, 
    lng: -52.1697349491749,
    descricao: "🕐Horário de Funcionamento:\nQuarta à sexta-feira: 08h - 17h30.\n\nEspanhol, Francês, Inglês, Libras e Português como língua de acolhimento, estrangeira.\n\n📸 @cele.ila.furg" 
  },

      //ICB Bloco 5 - Botânica, Genética e Ecologia

  { 
    id: "ICB - 5", 
    nome: "ICB Bloco 5 - Botânica, Genética e Ecologia", 
    lat: -32.07700968748661,
    lng: -52.16949238317977,
    descricao: "Botânica, Genética e Ecologia" 
  },

  //CIEFI
  { 
    id: "ciefi", 
    nome: "CIEFI - Comunidade de Indagação em Ensino de Física Interdisciplinar", 
    lat: -32.07675627738589,  
    lng: -52.17026078228786,
    descricao: "O CIEFI é um grupo de pesquisa da FURG que estuda e desenvolve novas formas de ensinar Ciências, especialmente Física, em diálogo com escolas. Trabalha com uma abordagem sociocultural, usando metodologias qualitativas e a ideia de indagação dialógica. Desenvolve formação com professores, cria materiais abertos, apoia projetos colaborativos como a Rede SACCI e o Jardim Maker, e integra universidade e educação básica para fortalecer práticas pedagógicas inovadoras." 
  },

  //CFOP
  { 
    id: "cfop", 
    nome: "CFOP - Centro de Formação e Orientação Pedagógica", 
    lat: -32.07695627793926, 
    lng: -52.17017897491583,
    descricao: "O CFOP é um centro da FURG que oferece formação e orientação pedagógica para os alunos." 
  },
  //CFOP
  { 
    id: "cfop", 
    nome: "CFOP - Centro de Formação e Orientação Pedagógica", 
    lat: -32.07695627793926, 
    lng: -52.17017897491583,
    descricao: "O CFOP é um centro da FURG que oferece formação e orientação pedagógica para os alunos." 
  },

  // ICB - Instituto de Ciências Biológicas - Prédio acadêmico e laboratorial
  { 
    id: "icb", 
    nome: "ICB - Instituto de Ciências Biológicas", 
    lat: -32.07599472933909,  
    lng: -52.16895440683658,
    descricao: "Instituto dedicado às ciências biológicas, com laboratórios e instalações modernas." 
  },

  // ICB - ICB Bloco 1 Direção e Secretarias
  { 
    id: "icb - 1", 
    nome: "ICB Bloco 1 Direção e Secretarias", 
    lat: -32.07576582589792, 
    lng: -52.16860046068133,
    descricao: "ICB Bloco 1: Direção, Vice direção, Administração, Secretaria Geral, Secretaria de Pós Graduação, Secretaria de Graduação, sala de reuniões." 
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

// IO - Laboratório de zooplâncton
  { 
    id: "io - lab 1", 
    nome: "IO - Laboratório de zooplâncton", 
    lat: -32.0696302305501,    
    lng: -52.15995989599516,
    descricao: "Laboratório de zooplâncton" 
  },

// IO - Laboratório de Ecologia do Ictioplâncton
  { 
    id: "io - lab 2 ", 
    nome: "IO - Laboratório de Ecologia do Ictioplâncton", 
    lat: -32.069334563641895,    
    lng: -52.16088363570775,
    descricao: "Laboratório de Ecologia do Ictioplâncton" 
  },

// CEOCEAN - Centro de Estudos dos Oceanos e Clima
  { 
    id: "ceocean", 
    nome: "CEOCEAN - Centro de Estudos dos Oceanos e Clima", 
    lat: -32.068543196414154,  
    lng: -52.1616756691524,
    descricao: "Centro de Estudos dos Oceanos e Clima" 
  },

// ESANTAR 
  { 
    id: "esantar", 
    nome: "ESANTAR - Estação de Apoio Antártico", 
    lat: -32.06800373667353, 
    lng: -52.16290834644639,
    descricao: "Estação de Apoio Antártico" 
  },

// Galpão Crioulo - Crioulinho
  { 
    id: "galpao", 
    nome: "Galpão Crioulo - Crioulinho", 
    lat: -32.06608064485465, 
    lng: -52.16010531104867,
    descricao: "Galpão Crioulo - Crioulinho" 
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