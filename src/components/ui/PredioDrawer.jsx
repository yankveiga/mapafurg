import { createElement, useMemo, useState } from 'react';
import { BusFront, Clock3, ExternalLink, Info, ListChecks, Utensils, X } from 'lucide-react';

const criarIconePequeno = (Icone) => createElement(Icone, {
  size: 14,
  strokeWidth: 2.4,
  'aria-hidden': 'true',
});

const criarIconeSecao = (Icone) => createElement(Icone, {
  size: 16,
  strokeWidth: 2.3,
  'aria-hidden': 'true',
});

const TabButton = ({ active, icon, label, count, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-black uppercase tracking-wide transition-all ${
      active
        ? 'bg-[#003366] text-white shadow-md'
        : 'bg-white/75 text-slate-600 hover:bg-white hover:text-[#003366]'
    }`}
  >
    {icon}
    <span className="truncate">{label}</span>
    {count !== undefined && (
      <span
        className={`rounded-full px-1.5 py-0.5 text-[8px] leading-none ${
          active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

const Section = ({ icon, title, children, note }) => (
  <section className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 shadow-sm">
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#003366] shadow-sm">
        {icon}
      </span>
      <h3 className="text-[12px] font-black uppercase tracking-wider text-[#003366]">
        {title}
      </h3>
    </div>
    {children}
    {note && (
      <p className="mt-4 text-center text-[10px] font-medium italic text-slate-500">
        {note}
      </p>
    )}
  </section>
);

const InfoRow = ({ label, value }) => (
  <div className="border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
    <span className="block text-[11px] font-black uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <span className="mt-0.5 block text-[13px] font-medium leading-snug text-slate-700">
      {value}
    </span>
  </div>
);

const normalizarProjeto = (projeto) => {
  if (typeof projeto === 'string') {
    return { nome: projeto, sigla: '', sala: '', link: '' };
  }

  return projeto;
};

const ProjetoCard = ({ projeto, index }) => {
  const item = normalizarProjeto(projeto);
  const salaLimpa = item.sala?.replace(/^Sala\s+/i, '') ?? '';
  const titulo = item.sigla || item.nome;
  const subtitulo = item.sigla ? item.nome : '';
  const temLink = Boolean(item.link);
  const conteudo = (
    <>
      <div className="flex min-w-0 items-start justify-between gap-2">
        <span className="min-w-0 truncate text-[13px] font-black leading-tight text-[#003366]">
          {titulo}
        </span>
        {temLink && (
          <ExternalLink
            size={12}
            strokeWidth={2.4}
            className="mt-0.5 flex-shrink-0 text-slate-500"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
        {subtitulo ? (
          <span className="line-clamp-2 text-[10px] font-medium leading-tight text-slate-600">
            {subtitulo}
          </span>
        ) : (
          <span className="text-[10px] font-medium text-slate-500">
            Projeto/Lab
          </span>
        )}
        {salaLimpa && (
          <span className="flex-shrink-0 rounded-full border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-black leading-none text-slate-600">
            {salaLimpa}
          </span>
        )}
      </div>
    </>
  );

  const className = 'min-h-[68px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#003366]/40 hover:shadow-md';

  return temLink ? (
    <a
      key={index}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} flex flex-col`}
    >
      {conteudo}
    </a>
  ) : (
    <div key={index} className={`${className} flex flex-col`}>
      {conteudo}
    </div>
  );
};

export function PredioDrawer({
  predio,
  onClose,
  statusOnibus,
  onibusPrincipal,
  ultimaAtualizacao,
}) {
  const abas = useMemo(() => {
    if (!predio) return [];

    const abaInfo = { id: 'info', label: 'Info', icon: criarIconePequeno(Info) };
    const abasPrincipais = [];

    if (predio.projetos?.length) {
      abasPrincipais.push({
        id: 'projetos',
        label: 'Projetos',
        icon: criarIconePequeno(ListChecks),
        count: predio.projetos.length,
      });
    }

    if (predio.horarios || predio.interno) {
      abasPrincipais.push({ id: 'horarios', label: 'Horarios', icon: criarIconePequeno(Clock3) });
    }

    if (predio.cardapio) {
      abasPrincipais.push({ id: 'cardapio', label: 'Cardapio', icon: criarIconePequeno(Utensils) });
    }

    if (abasPrincipais.length === 0) return [abaInfo];

    return [
      abasPrincipais[0],
      abaInfo,
      ...abasPrincipais.slice(1),
    ];
  }, [predio]);

  const [abaAtiva, setAbaAtiva] = useState({ predioId: null, abaId: 'info' });

  const abaInicial = abas[0]?.id ?? 'info';
  const abaAtual = abaAtiva.predioId === predio?.id ? abaAtiva.abaId : abaInicial;
  const abaExiste = abas.some((aba) => aba.id === abaAtual);
  const abaSelecionada = abaExiste ? abaAtual : abaInicial;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-[10000] flex max-h-[85vh] flex-col rounded-t-3xl border-t border-white/60 bg-white/90 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-transform duration-300 ease-out md:left-1/2 md:max-w-[480px] md:-translate-x-1/2 ${predio ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {predio && (
        <div className="flex min-h-0 flex-col">
          <div className="z-10 border-b border-white/70 bg-white/95 px-5 pb-3 pt-3 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="line-clamp-2 text-base font-black leading-tight text-[#003366]">
                  {predio.nome}
                </h2>
                <span className="mt-1 block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  {predio.id}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                aria-label="Fechar"
              >
                <X size={17} strokeWidth={2.6} aria-hidden="true" />
              </button>
            </div>

            {abas.length > 1 && (
              <div className="mt-3 flex gap-1.5 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {abas.map((aba) => (
                  <TabButton
                    key={aba.id}
                    active={abaSelecionada === aba.id}
                    icon={aba.icon}
                    label={aba.label}
                    count={aba.count}
                    onClick={() => setAbaAtiva({ predioId: predio.id, abaId: aba.id })}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 pb-8 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {abaSelecionada === 'info' && (
              <Section icon={criarIconeSecao(Info)} title="Informacoes">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                  {predio.descricao}
                </p>
              </Section>
            )}

            {abaSelecionada === 'projetos' && predio.projetos?.length > 0 && (
              <Section icon={criarIconeSecao(ListChecks)} title="Projetos e Laboratorios">
                <div className="mb-3 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-[11px] font-bold text-slate-600">
                  <span>{predio.projetos.length} itens cadastrados</span>
                  <span className="text-slate-500">Toque para abrir links</span>
                </div>
                <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
                  {predio.projetos.map((projeto, index) => (
                    <ProjetoCard key={index} projeto={projeto} index={index} />
                  ))}
                </div>
              </Section>
            )}

            {abaSelecionada === 'horarios' && (
              <>
                {predio.horarios && (
                  <Section icon={criarIconeSecao(Clock3)} title="Horario de Funcionamento">
                    <div className="space-y-2.5">
                      {Object.entries(predio.horarios).map(([dia, hora]) => (
                        <InfoRow key={dia} label={dia} value={hora} />
                      ))}
                    </div>
                  </Section>
                )}

                {predio.interno && (
                  <Section
                    icon={criarIconeSecao(BusFront)}
                    title="Horarios de Partida"
                    note="Horarios sujeitos a atrasos de acordo com o transito do campus."
                  >
                    <div className="mb-3 rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-slate-600">
                      Localizacao em tempo real: {statusOnibus}
                      {onibusPrincipal.timestamp && (
                        <span className="block pt-1 text-slate-500">
                          Ultima atualizacao: {ultimaAtualizacao}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2.5">
                      {Object.entries(predio.interno).map(([turno, horarios]) => (
                        <InfoRow key={turno} label={turno} value={horarios} />
                      ))}
                    </div>
                  </Section>
                )}
              </>
            )}

            {abaSelecionada === 'cardapio' && predio.cardapio && (
              <Section
                icon={criarIconeSecao(Utensils)}
                title="Cardapio da Semana"
                note="Atualizado presencialmente toda segunda as 07:45."
              >
                <div className="space-y-2.5">
                  {Object.entries(predio.cardapio).map(([dia, prato]) => (
                    <InfoRow key={dia} label={dia} value={prato} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
