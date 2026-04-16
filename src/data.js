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
      segunda: "Arroz Branco, Arroz Integral, Feijão Preto, Carne Moída ao Molho, Peixe Empanado, Proteína de Soja Refogada, Ovo Pochê, Polenta, Alface, Repolho Misto, Mista de Grãos, Melão",
      terca: "Arroz Branco, Arroz Integral com Linhaça, Feijão Preto, Strogonoff de Carne, Frango Assado, Grão de Bico ao Sugo, Ovo Cozido, Batata Palha, Alface, Pepino, Cenoura Cozida, Mamão com Laranja",
      quarta: "Arroz Branco, Arroz Integral, Feijão Preto, Bife ao Molho, Frango com Alho Poró, Hamburguer de Lentilha, Ovo Pochê, Espaguete a Primavera, Alface, Abobrinha, Beterraba Ralada, Banana",
      quinta: "Arroz Branco, Arroz Integral com Linhaça, Feijão Carioca, Frango ao Molho, Carré Acebolado, Cogumelos Refogados, Ovo Cozido, Espaguete Alho Óleo, Alface, Repolho Roxo, Cenoura Cozida, Laranja",
      sexta: "Arroz Branco, Arroz Integral, Feijão Preto, Frango ao Molho, Pastel de Carne com Ovos, Pastel de PTS, Ovo Pochê, Virado de Couve, Alface, Macarronese, Pepino, Maçã"
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
      segunda: "Arroz Branco, Arroz Integral, Feijão Preto, Strogonoff de Carne Bovina, Bife de Frango ao Molho Mostarda, Escondidinho de PTS com Moranga, Batata palha, Alface, Beterraba cozida, Rabanete ralado, Melão",
      terca: "Arroz Branco, Arroz Integral, Feijão Preto, Bisteca Suína ao Molho Madeira, Bife de Frango a Xadrez, Cogumelos acebolados, Massa Parafuso com Tomate e Rúcula, Couve chinesa, Salada primavera, Pepino, Maçã",
      quarta: "Arroz Branco, Arroz Integral, Feijão Carioca, Strogonoff de Carne Bovina, Cubos de Frango a Xadrez, Grão de Bico Crocante, Cenoura Sautê, Couve chinesa, Macarronese com milho, ervilha e tempero verde, Tabule, Laranja",
      quinta: "Arroz Branco, Arroz Integral, Feijão Preto, Carne de Panela, Peixe à Milanesa, PTS refogado, Purê de Batatas Especial, Alface, Cenoura cozida, Abobrinha com vinagrete, Melão",
      sexta: "Arroz Branco, Arroz Integral com linhaça, Feijão Preto, Cubos Suínos Assados ao Molho Madeira, Fricassê de Frango, Legumes salteados, Massa ao Sugo, Couve chinesa, Beterraba cozida, Salada Refrescante, Banana",
      sábado: "Arroz Branco, Arroz Integral, Feijão Carioca, Lasanha à Bolonhesa, Bife de Frango Crocante, Hambúrguer de Grão de Bico, Jardineira de Legumes, Alface, Repolho cozido com orégano, Salada Caico, Laranja",
      domingo: "Arroz Branco, Arroz Integral, Feijão Preto, Carne de Panela, Coxa com sobrecoxa assada no forno, Tomate Recheado com lentilha, Farofa com Legumes, Mix de Folhas, Chuchu com milho, Beterraba ralada, Creme de baunilha com calda de maçã"
    }
  },     
    
  // Horários Interno
    { 
      id: "interno", 
      nome: "Ônibus Interno - FURG", 
      lat: -32.07548437944093, 
      lng: -52.1536526187153084,
      descricao: "🚌 Transporte circular gratuito dentro do Campus Carreiros.\n\n* Vai até o OCEANTEC (parada de 2 min).\n** Saída da EQA.\n✉️ viaturas@furg.br",
      interno: {
        "Manhã": "06:50 • 07:10 • 07:30 • 07:50* • 08:15 • 09:25 • 10:25 • 11:20 • 12:00*",
        "Tarde": "12:45* • 13:15 • 13:40* • 14:30 • 15:20 • 16:00 • 16:50 • 17:30 • 18:05*",
        "Noite": "18:30 • 18:55* • 19:20 • 19:45 • 20:30 • 21:35** • 22:20** • 22:45** • 23:15**"
      }
    },
  // C3 - Centro de Ciências Computacionais
    { 
    id: "c3", 
    nome: "C3 - Centro de Ciências Computacionais", 
    lat: -32.072865, 
    lng: -52.168750, 
    descricao: "Núcleo de tecnologia, salas de aula e laboratórios de informática.\n📸 @c3.furg \n",
    projetos: [
      { nome: "PET C3", sala: "Sala 114", link: "https://instagram.com/petc3furg" },
      { nome: "LAMSA", sala: "Sala 108" }, // Sem link
      { nome: "E-colab", sala: "Sala 117", link: "https://www.instagram.com/ecolab.furg/" },// quando tiver sigla
      { nome: "FBOT", sala: "Sala 225", link: "https://instagram.com/furgbot" },
      { nome: "NAUTEC", sala: "Sala 226", link: "https://www.instagram.com/nautec.furg/" },
      { nome: "REHABOT", sala: "Sala 116", link: "" },
      { nome: "Safe Eye", sala: "Sala 116", link: "" },
      { sigla: "DTWIN", nome: "Digital Twin", sala: "Sala 116", link: "" },
      { nome: "WEARABLE", sala: "Sala 116", link: "" },
      { nome: "GSDE", sala: "Sala 219", link: "" },
      { nome: "BEVLOG", sala: "Sala 212", link: "" },
      { nome: "NAVMS", sala: "Sala 212", link: "" },
      { nome: "Mão Extra", sala: "Sala 213", link: "" },
      { nome: "Igapó", sala: "Sala 213", link: "" },
      { nome: "Saca Agulhas", sala: "Sala 213", link: "" },
      { nome: "GINFO", sala: "Sala 220", link: "" },
      { nome: "GFLEX", sala: "Sala 220", link: "" },
      { sigla: "SYSTEMS", nome: "Lab. Sistemas de Computação", sala: "Sala 219", link: "" },
      { sigla: "LabDigEmb", nome: "Lab. Sistemas Digitas e Embarcados", sala: "Sala 219", link: "" },
      { sigla: "LabTecEA", nome: "Lab. de Tecnologias Educacionais e Assistidas", sala: "111" },
      { sigla: "LabBioComp", nome: "Lab. de Biologia Computacional", sala: "112" },
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
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus.",
    projetos: [
      { nome: "Sala 1101", sigla: "" },
      { nome: "Sala 1102", sigla: "" },
      { nome: "Sala 1103", sigla: "" },
      { nome: "Sala 1104", sigla: "" },
      { nome: "Sala 1105", sigla: "" },
      { nome: "Sala 1106", sigla: "" },
      { nome: "Sala 1107", sigla: "" },
      { nome: "Sala 1108", sigla: "" },
      { nome: "Sala 1201", sigla: "" },
      { nome: "Sala 1202", sigla: "" },
      { nome: "Sala 1203", sigla: "" },
      { nome: "Sala 1204", sigla: "" },
      { nome: "Sala 1205", sigla: "" },
      { nome: "Sala 1206", sigla: "" },
      { nome: "Sala 1207", sigla: "" },
      { nome: "Sala 1208", sigla: "" },
      { nome: "Sala DAEQ", sigla: "" },
    ]
  },

  // Pavilhão 2 - Pavilhão de aulas teóricas
  { 
    id: "pav.2", 
    nome: "Pavilhão 2", 
    lat: -32.074486678988016, 
    lng: -52.167919257529874, 
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus.",
    projetos: [
      //Primeiro Andar
      { nome: "Sala 2101", sigla: "" },
      { nome: "Sala 2102", sigla: "" },
      { nome: "Sala 2103", sigla: "" },
      { nome: "Sala 2104", sigla: "" },
      { nome: "Sala 2105", sigla: "" },
      { nome: "Sala 2106", sigla: "" },
      { nome: "2017", sala: "SALAEST" },
      { nome: "Sala 2108", sala: "EAC - IMEF" },
      { nome: "Sala 2109", sala: "EAC - IMEF" },
      { nome: "Sala 2110", sigla: "" },
      { nome: "Sala 2111", sala: "TEMAT" },
      { nome: "Sala 2112", sala: "EAC - EQA" },
      { nome: "Sala 2113", sala: "Matemática Aplicada" },
      { nome: "Sala 2114", sigla: "" },
      { nome: "Sala 2115", sigla: "" },
      { nome: "Sala 2116", sigla: "" },
      { nome: "Sala 2117", sigla: "" },
      { nome: "Sala 2118", sigla: "" },
      { nome: "Sala 2119", sigla: "" },
      { nome: "Sala 2120", sigla: "" },
      { nome: "Sala 2121", sigla: "" },
      { nome: "Sala 2122", sigla: "" },
      { nome: "Sala 2123", sigla: "" },
      //Segundo Andar
      { nome: "Sala 2201", sigla: "" },
      { nome: "Sala 2202", sigla: "" },
      { nome: "Sala 2203", sigla: "" },
      { nome: "Sala 2204", sigla: "" },
      { nome: "Sala 2205", sigla: "" },
      { nome: "Sala 2206", sigla: "" },
      { nome: "Sala 2207", sigla: "" },
      { nome: "Sala 2208", sigla: "" },
      { nome: "Sala 2209", sigla: "" },
      { nome: "Sala 2210", sala: "LCARQ" },
      { nome: "Sala 2211", sigla: "" },
      { nome: "Sala 2212", sigla: "" },
      { nome: "Sala 2213", sala: "DA Física" },
      { nome: "Sala 2214", sala: "DA ECOMP" },
      { nome: "Sala 2215", sigla: "" },
      { nome: "Sala 2216", sigla: "" },
      { nome: "Sala 2217", sigla: "" },
      { nome: "Sala 2218", sigla: "" },
      { nome: "Sala 2219", sigla: "" },
    ] 
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
    descricao: "Bloco de salas de aula utilizado por diversos cursos do campus.", 
    projetos: [
      //Primeiro Andar
      { nome: "Sala 4101", sigla: "" },
      { nome: "Sala 4102", sigla: "" },
      { nome: "Sala 4103", sigla: "" },
      { nome: "Sala 4104", sigla: "" },
      { nome: "Sala 4105", sigla: "" },
      { nome: "Sala 4106", sigla: "" },
      { nome: "Sala 4107", sigla: "" },
      { nome: "Sala 4108", sigla: "" },
      { nome: "Sala 4109", sigla: "" },
      { nome: "Sala 4110", sigla: "" },
      { nome: "Sala 4111", sigla: "" },
      { nome: "Sala 4112", sigla: "" },
      { nome: "Sala 4113", sigla: "" },
      { nome: "Sala 4114", sigla: "" },
      { nome: "Sala 4115", sigla: "" },
      //Segundo Andar
      { nome: "Sala 4201", sigla: "" },
      { nome: "Sala 4202", sigla: "" },
      { nome: "Sala 4203", sigla: "" },
      { nome: "Sala 4204", sigla: "" },
      { nome: "Sala 4205", sigla: "" },
      { nome: "Sala 4206", sigla: "" },
      { nome: "Sala 4207", sigla: "" },
      { nome: "Sala 4208", sigla: "" },
      { nome: "Sala 4209", sigla: "" },
      { nome: "Sala 4210", sigla: "" },
      { nome: "Sala 4211", sigla: "" },
      { nome: "Sala 4212", sigla: "" },
      { nome: "Sala 4213", sigla: "" },
      { nome: "Sala 4214", sigla: "" },
      { nome: "Sala 4215", sigla: "" },
      { nome: "Sala 4216", sigla: "" },
      { nome: "Sala 4217", sigla: "" },
      { nome: "Sala CAHIS", sigla: "" },
      { nome: "Sala PAIETS", sigla: "" },
    ]
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

  // ICHI - Psicologia
  { 
    id: "psico", 
    nome: "ICHI - Psicologia", 
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

  // CEMESUL
  { 
    id: "ceme-sul", 
    nome: "Centro de Microscopia Eletrônica do Sul - CEMESUL", 
    lat:  -32.0765851057674, 
    lng: -52.167390763859046,
    descricao: "🕐Horário de Funcionamento:\nSegunda à sexta-feira: Das 08h30 às 12h e 13h30 às 17h\n📸 @ceme.sul \n✉️ cemesul@furg.br \n📞 (53) 3293-5312\n🌐 www.cemesul.furg.br\n\nO CEME-SUL é um centro da FURG dedicado ao uso e ao compartilhamento de equipamentos de microscopia eletrônica e técnicas associadas. Ele apoia pesquisas, inovação, ensino e extensão em diversas áreas, oferecendo uma estrutura multiusuária de alta complexidade. Sua missão é impulsionar a produção científica ao facilitar o acesso qualificado a análises avançadas para a comunidade acadêmica." 
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
    id: "Letras", 
    nome: "ILA - Prédio Letras", 
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
    id: "ceu_1", 
    nome: "Casa do Estudante - 1", 
    lat: -32.07769106768267,    
    lng: -52.1701271431193,
    descricao: "Casa do Estudante - 1." 
  },

  // Casa do Estudante 2
  { 
    id: "ceu_2", 
    nome: "Casa do Estudante - 2", 
    lat: -32.07751698311312,   
    lng: -52.16967316305177,
    descricao: "Casa do Estudante - 2." 
  },

  // Casa do Estudante 3
  { 
    id: "ceu_3", 
    nome: "Casa do Estudante - 3", 
    lat: -32.07796637853579,   
    lng: -52.170144828788274,
    descricao: "Casa do Estudante - 3." 
  },

  // Casa do Estudante 4
  { 
    id: "ceu_4", 
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

// Anexo 2
  {
    id: "anexo_2", 
    nome: "Anexo 2", 
    lat: -32.07400202635447,   
    lng: -52.16734807839626,
    descricao: "Salas pertencentes aos projetos do IMEF e da EE.",
    projetos: [
      { nome: "PET Civil", sala: "K22", link: "https://instagram.com/petcivilfurg" },
      { nome: "PET SabEst", sala: "J05", link: "https://instagram.com/petsabest" },
      { nome: "Pérola Negra", sala: "Q06", link: "https://instagram.com/perolanegranauti" },
      { nome: "Atena Jr", sala: "J07", link: "https://instagram.com/atenaconsultoriajr" },
      { nome: "LabEst", sala: "J06", link: "" },
      { nome: "GETrans", sala: "J10", link: "https://instagram.com/getransfurg" },
      { sigla: "GATC", nome: "Grupo de Astrofísica Teórica e Computacional", sala: "J13", link: "" },
      { sigla: "C3D", nome: "Ciência 3D Impressa", sala: "J16", link: "" },
      { nome: "DAECE", sala: "O03", link: "" },
      { nome: "PH Consultoria Jr.", sala: "O06", link: "" },
      { nome: "AeroFURG", sala: "O07", link: "https://www.instagram.com/aerofurg" },
      { sigla: "LST", nome: "Laboratório de Sistemas Térmicos", sala: "O07", link: "" },
      { nome: "LETRON", sala: "O09", link: "" },
      { sigla: "ObsAstro", nome: "Observatório Astronômico", sala: "" , link: "" },
      { nome: "LANSD", sala: "" , link: "" },
      { sigla: "AstroSul", nome: "Astro e Sul", sala: "P14", link: "" },
    ]
  },

//INÍCIO DOS PRÉDIOS DO INSTITUTO DE OCEANOLOGIA
// 
  { 
    id: "io", 
    nome: "IO - Instituto de Oceanografia", 
    lat: -32.0699925825384,   
    lng: -52.161924961616435,
    descricao: "Instituto de Oceanografia" 
  },


  // Auditório João Rocha
  { 
    id: "io_aud", 
    nome: "Auditório João Rocha", 
    lat: -32.07016308222871,   
    lng: -52.162053601864784,
    descricao: "Auditório João Rocha" 
  },

// Coordenação / Secretaria / PPGO de Oceano e Gestão
  { 
    id: "coord", 
    nome: "Coordenação / Secretaria / PPGO de Oceano e Gestão", 
    lat: -32.06988879085762,   
    lng: -52.161779724161526,
    descricao: "Coordenação, Secretaria e PPGO de Oceano e Gestão"
  },

  //IO- Núcleo de Gerenciamento Costeiro
  { 
  id: "ngc", 
  nome: "Núcleo de Gerenciamento Costeiro", 
  lat: -32.07014035068941,   
  lng: -52.161688931675805,
  descricao: "" ,
  projetos: [
    { sigla: "LabGerco", nome: "Lab. de Gerenciamento Costeiro", sala: "", link: "https://io.furg.br/pesquisa/laboratoriosio/laboratorios/153-labgerco" },
    { sigla: "LSAC", nome: "Lab. de Sustentabilidade Ambiental Corporativa", sala: "", link: "" },
    { sigla: "LMASS", nome: "Lab. de Mapeamento em Ambientes, Resistência, Sociedade e Solidariedade", sala: "", link: "" },
    { sigla: "LEES", nome: "Lab. de Ensino e Extensão em Ecodesenvolvimento", sala: "", link: "" },
    { sigla: "CALO", nome: "Futuro CALO + Sala de Estudos", sala: "", link: "" },
    { sigla: "DAGA", nome: "Futuro DAGA + Sala de Estudos", sala: "", link: "" }
  ]
  },


// IO - Laboratório de Ensino
  { 
    id: "io_lab", 
    nome: "IO - Laboratório de Ensino", 
    lat: -32.07057040328547, 
    lng: -52.160024054813086,
    descricao: "Instituto de Oceanografia - Laboratório de Ensino" 
  },


// IO - NUCLEO DE OCEANOGRAFIA BIOLOGICA
  { 
    id: "io_obio", 
    nome: "IO - Núcleo de Oceanografia Biológica", 
    lat: -32.06958998304264,     
    lng: -52.15990325314154,
    descricao: "Instituto de Oceanografia - Oceanografia Biológica", 
    projetos: [
      { sigla: "ECOMEGA", nome: "ECOMEGA", sala: "" },
      { sigla: "LEIB", nome: "Lab. de Ecologia de Invertebrados Bentônicos", sala: "", link: ""},
      { sigla: "LEVC", nome: "Lab. de Ecologia Vegetal Costeira", sala: "" },
      { sigla: "LFMM", nome: "Laboratório de Fitoplâncton e Microorganismos Marinhos", sala: "", link: "" },  
      { sigla: "Zooplancton", nome: "Lab. de Zooplancton", sala: "" },
    ]
  },
  // IO - ANEXO NUCLEO DE OCEANOGRAFIA BIOLOGICA
  { 
    id: "ceilors", 
    nome: "IO - Núcleo de Oceanografia Biológica", 
    lat: -32.0693346526857, 
    lng: -52.15939218754685,
    descricao: "Amostras e Equipamentos", 
  },

// IO - NÚCLEO DE RECURSOS RENOVAVEIS
  { 
    id: "io_rr ", 
    nome: "IO - Núcleo de Recursos Renováveis", 
    lat: -32.069334563641895,    
    lng: -52.16088363570775,
    descricao: "Instituto de Oceanografia - Recursos Renováveis",
    projetos: [
      { sigla: "LRPAME", nome: "Lab. de Recursos Pesqueiros Artesanais e Modelagem Ecológica", sala: "" },
      { sigla: "LADIPP", nome: "Lab. de Dinâmica Populacional Pesqueira", sala: "", link: "https://io.furg.br/pesquisa/laboratoriosio/laboratorios/149-laboratorio-de-dinamica-populacional-pesqueira-ladipp" },
      { sigla: "LHA", nome: "Lab. de Hidroacústica Aplicada", sala: "" },
      { sigla: "LEPR", nome: "Lab. de Estudos para a Pesca Responsável", sala: "", link: "" },   
      { sigla: "Biblio", nome: "Biblioteca Setorial Futuro NIO", sala: "", link: "https://io.furg.br/pesquisa/laboratoriosio/laboratorios/149-laboratorio-de-dinamica-populacional-pesqueira-ladipp" },
      { sigla: "LICTIO", nome: "Lab. de Ictioplâncton", sala: "" },
      { sigla: "LECMM", nome: "Lab. de Ecologia e Conservação da Megafauna Marinha", sala: "", link: "" },
    ]
  },

  //INÍCIO DO PRÉDIO GIGANTE DA OCEANO
  // IO - NÚCLEO DE OCEANOGRAFIA BIOLOGICA (Gigante)
    {
    id: "io_ict", 
    nome: "IO - Laboratório de Ictiologia", 
    lat: -32.068462734007305,
    lng: -52.160284542925595,
    descricao: "Instituto de Oceanografia - Laboratório de Ictiologia",
  },
 
    {
      id: "io_lcd", 
      nome: "IO - Laboratório de Crustáceos Decápodes", 
      lat: -32.068795443394066,   
      lng: -52.16004714607903,
      descricao: "Instituto de Oceanografia - Laboratório de Crustáceos Decápodes",
    },
  
// IO - Oceonagrafia Química
  { 
    id: "io_oq", 
    nome: "IO - Oceonagrafia Química", 
    lat: -32.06903917159527,  
    lng: -52.15993073031773,  
    descricao: "Instituto de Oceanografia - Oceonagrafia Química",
    projetos: [
      { sigla: "Lab. Hidroq 1", nome: "Lab. de Hidroquímica 1", sala: "", link: "" },
      { sigla: "Lab. Hidroq 2", nome: "Lab. de Hidroquímica 2", sala: "", link: "" },
      { sigla: "CONECO", nome: "CONECO", sala: "", link: "" },
      { sigla: "LMOEA", nome: "Lab. de Microcontaminantes Orgânicos e Ecotoxicologia Aquática", sala: "", link: "" },
      { sigla: "LCF", nome: "Lab. de Cianobactérias e Ficotoxinas", sala: "", link: "" }
    ]
  },


  //FIM DO PRÉDIO GIGANTE DA OCEANO

// CEOCEAN - Centro de Estudos dos Oceanos e Clima
  { 
    id: "ceocean", 
    nome: "CEOCEAN - Centro de Estudos dos Oceanos e Clima", 
    lat: -32.068543196414154,  
    lng: -52.1616756691524,
    descricao: "Centro de Estudos dos Oceanos e Clima" ,
    projetos: [
      { sigla: "LEOC", nome: "Lab. de Estudos de Oceanos e Clima", sala: "", link: "" },
      { sigla: "LDMO", nome: "Lab. de Dinâmica e Modelagem Oceânica", sala: "", link: "" },
      { sigla: "LODS", nome: "⁠Lab. de Oceanografia Dinâmica e por Satélites", sala: "", link: "https://io.furg.br/pesquisa/laboratoriosio/laboratorios/146-laboratorio-de-oceanografia-dinamica-e-por-satelites-lods" },
      { sigla: "LMC", nome: "⁠Lab. de Monitoramento da Criosfera", sala: "", link: "" },
    ]
  },

// ESANTAR 
  { 
    id: "esantar", 
    nome: "ESANTAR - Estação de Apoio Antártico", 
    lat: -32.06800373667353, 
    lng: -52.16290834644639,
    descricao: "Estação de Apoio Antártico" 
  },

  // IO - NÚCLEO DE OCEANOGRAFIA GEOLÓGICA
  { 
    id: "io_og", 
    nome: "IO - Oceonagrafia Geológica", 
    lat: -32.06880852223249,  
    lng: -52.16278122635756,  
    descricao: "Instituto de Oceanografia - Oceonagrafia Geológica",
    projetos: [
      { sigla: "LGeoQ", nome: "Lab. de Geoquímica", sala: "", link: "https://io.furg.br/pesquisa/laboratoriosio/laboratorios/147-laboratorio-de-geoquimica-oceanografia-geologica" },
      { sigla: "LGeopro", nome: "Lab. de Geoprocessamento", sala: "", link: "" },
      { sigla: "LGeof", nome: "Lab. de Geofísica", sala: "", link: "" },
      { sigla: "LSedim", nome: "Lab. de Sedimentologia", sala: "", link: "" },
      { sigla: "LMC", nome: "Lab. de Morfodinâmica Costeira", sala: "", link: "" },
      { sigla: "LPP", nome: "Lab. de Paleoceanografia e Palinologia", sala: "", link: "" },
      { sigla: "LMet", nome: "Lab. de Meteorologia", sala: "", link: "" }
    ]
  },

    // IO - NÚCLEO DE OCEANOGRAFIA FÍSICA
  { 
    id: "io_of", 
    nome: "IO - Oceonagrafia Física", 
    lat: -32.06909198142869,  
    lng: -52.163256996820074,  
    descricao: "Instituto de Oceanografia - Oceonagrafia Física",
    projetos: [
      { sigla: "LOCOSTE", nome: "Lab. de Oceanografia Costeira e Estuarina", sala: "", link: "" },
      { sigla: "CEILORS_2", nome: "CEILORS 2", sala: "", link: "" },
    ]
  },



  // FIM DOS PRÉDIOS DO INSTITUTO DE OCEANOLOGIA

// Galpão Crioulo - Crioulinho
  { 
    id: "galpao", 
    nome: "Galpão Crioulo - Crioulinho", 
    lat: -32.06608064485465, 
    lng: -52.16010531104867,
    descricao: "Galpão Crioulo - Crioulinho" 
  },

  // Centro de Biodiversidade Subtropical - CBS
  { 
    id: "CBS", 
    nome: "Centro de Biodiversidade Subtropical - CBS", 
    lat: -32.07770142546249, 
    lng: -52.17143196613112,
    descricao: "Centro de Biodiversidade Subtropical - CBS" 
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
