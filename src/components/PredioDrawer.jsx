export function PredioDrawer({
  predio,
  onClose,
  statusOnibus,
  onibusPrincipal,
  ultimaAtualizacao,
}) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[480px] z-[10000] bg-white/90 backdrop-blur-2xl border-t border-white/60 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out flex flex-col max-h-[85vh] ${predio ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {predio && (
        <div className="px-6 pb-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="sticky top-0 z-10 -mx-6 mb-4 flex justify-between items-center gap-4 px-6 py-3 bg-white/95 backdrop-blur-2xl border-b border-white/60">
            <div className="pr-4">
              <h2 className="text-base font-black text-[#003366] leading-tight">{predio.nome}</h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{predio.id}</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors font-bold"
            >
              &#x2715;
            </button>
          </div>

          <p className="text-sm text-slate-600 mb-5 leading-relaxed whitespace-pre-wrap">{predio.descricao}</p>

          {predio.projetos && (
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📋</span>
                  <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Projetos & Laboratórios</p>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-slate-400 border border-slate-200">
                  {predio.projetos.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {predio.projetos.map((projeto, index) => {
                  const salaLimpa = projeto.sala?.replace(/^Sala\s+/i, '') ?? '';
                  const conteudo = (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <span className="min-w-0 truncate text-[12px] font-black text-[#003366] leading-tight">
                          {projeto.sigla || projeto.nome}
                        </span>
                        {salaLimpa && (
                          <span className="flex-shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-black text-slate-500 border border-slate-200 leading-none">
                            {salaLimpa}
                          </span>
                        )}
                      </div>

                      {projeto.sigla && (
                        <span className="mt-1 line-clamp-2 text-[9px] font-medium text-slate-500 leading-tight">
                          {projeto.nome}
                        </span>
                      )}
                    </>
                  );

                  const estilosBase = 'min-h-[62px] bg-white border border-slate-200 px-3 py-2.5 rounded-xl shadow-sm flex flex-col transition-all hover:-translate-y-0.5';

                  return projeto.link ? (
                    <a
                      key={index}
                      href={projeto.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${estilosBase} hover:border-[#003366]/60 hover:shadow-md cursor-pointer`}
                    >
                      {conteudo}
                    </a>
                  ) : (
                    <div key={index} className={`${estilosBase} hover:border-[#003366]/30`}>
                      {conteudo}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {predio.horarios && (
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🕒</span>
                <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Horário de Funcionamento</p>
              </div>
              <div className="space-y-2.5">
                {Object.entries(predio.horarios).map(([dia, hora]) => (
                  <div key={dia} className="flex justify-between border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{dia}</span>
                    <span className="text-xs font-medium text-slate-700 leading-snug">{hora}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {predio.interno && (
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🚌</span>
                <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Horários de Partida</p>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 mb-3">
                Localização em tempo real: {statusOnibus}
              </p>
              <div className="space-y-2.5">
                {Object.entries(predio.interno).map(([turno, horarios]) => (
                  <div key={turno} className="flex flex-col border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{turno}</span>
                    <span className="text-xs font-medium text-slate-700 leading-snug">{horarios}</span>
                  </div>
                ))}
              </div>
              {onibusPrincipal.timestamp && (
                <p className="mt-3 text-[9px] text-slate-500 text-center">
                  Última atualização: {ultimaAtualizacao}
                </p>
              )}
              <p className="mt-4 text-[9px] text-slate-400 font-medium italic text-center">
                Horários sujeitos a atrasos de acordo com o trânsito do campus.
              </p>
            </div>
          )}

          {predio.cardapio && (
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">🍴</span>
                <p className="font-bold text-[#003366] text-[11px] uppercase tracking-wider">Cardápio da Semana</p>
              </div>
              <div className="space-y-2.5">
                {Object.entries(predio.cardapio).map(([dia, prato]) => (
                  <div key={dia} className="flex flex-col border-b border-slate-200/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{dia}</span>
                    <span className="text-xs font-medium text-slate-700 leading-snug">{prato}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[9px] text-slate-400 font-medium italic text-center">
                Atualizado presencialmente toda segunda às 07:45
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
