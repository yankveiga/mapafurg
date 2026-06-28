const STATUS_VISUAL = {
  conectado: {
    dot: 'bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.14)]',
    label: 'text-emerald-700',
    descricao: 'Rastreamento recebido',
  },
  conectando: {
    dot: 'bg-amber-400 shadow-[0_0_0_5px_rgba(245,158,11,0.14)]',
    label: 'text-amber-700',
    descricao: 'Tentando conectar',
  },
  erro: {
    dot: 'bg-red-500 shadow-[0_0_0_5px_rgba(239,68,68,0.14)]',
    label: 'text-red-700',
    descricao: 'Falha na conexao',
  },
  desconectado: {
    dot: 'bg-slate-400 shadow-[0_0_0_5px_rgba(100,116,139,0.14)]',
    label: 'text-slate-600',
    descricao: 'Sem sinal ao vivo',
  },
};

export function StatusOnibus({
  status,
  statusLabel,
  quantidadeAtivos,
  ultimaAtualizacao,
}) {
  const visual = STATUS_VISUAL[status] ?? STATUS_VISUAL.desconectado;
  const textoAtivos = quantidadeAtivos === 1 ? '1 onibus ativo' : `${quantidadeAtivos} onibus ativos`;
  const textoAtivosCurto = quantidadeAtivos === 1 ? '1 ativo' : `${quantidadeAtivos} ativos`;

  return (
    <div
      className="absolute bottom-12 left-4 right-20 z-[9999] max-w-[360px] rounded-xl border border-white/70 bg-white/90 px-2.5 py-2 text-slate-800 shadow-lg backdrop-blur-xl md:left-6 md:right-auto md:rounded-2xl md:px-3.5 md:py-2.5"
      aria-live="polite"
    >
      <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
        <span
          className={`h-2 w-2 flex-shrink-0 rounded-full md:h-2.5 md:w-2.5 ${visual.dot}`}
          aria-hidden="true"
        />
        <span className="text-[10px] font-black uppercase tracking-wide text-[#003366] md:text-[11px]">
          Onibus
        </span>
        <span className={`text-[10px] font-black md:ml-auto md:text-[11px] ${visual.label}`}>
          {statusLabel}
        </span>
        <span className="min-w-0 truncate text-[10px] font-bold text-slate-600 md:hidden">
          {textoAtivosCurto} • {ultimaAtualizacao}
        </span>
      </div>

      <div className="mt-1.5 hidden flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-slate-600 md:flex">
        <span>{textoAtivos}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
        <span>Atualizado {ultimaAtualizacao}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" aria-hidden="true" />
        <span>{visual.descricao}</span>
      </div>
    </div>
  );
}
