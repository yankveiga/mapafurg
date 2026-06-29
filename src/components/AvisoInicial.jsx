import { BellRing, X } from 'lucide-react';

export function AvisoInicial({ aviso, onClose }) {
  if (!aviso?.ativo || !aviso.mensagem?.trim()) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-[2px]">
      <div
        className="relative w-full max-w-[390px] overflow-hidden rounded-[18px] border-[3px] border-slate-950 bg-[#e8e8e8] shadow-[8px_8px_0_#020617]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aviso-inicial-titulo"
      >
        <div className="flex h-11 items-center justify-between border-b-[3px] border-slate-950 bg-white px-4">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-3 w-3 rounded-full border-2 border-slate-950 bg-red-400" />
            <span className="h-3 w-3 rounded-full border-2 border-slate-950 bg-amber-300" />
            <span className="h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
          </div>

          <span className="rounded-full border-2 border-slate-950 bg-[#003366] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white">
            Mapa FURG
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-[58px] z-10 flex h-9 w-9 items-center justify-center rounded-lg border-[3px] border-slate-950 bg-white text-slate-950 shadow-[3px_3px_0_#020617] transition-transform hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          aria-label="Fechar aviso"
        >
          <X size={18} strokeWidth={3} aria-hidden="true" />
        </button>

        <div className="relative px-5 pb-5 pt-6">
          <div className="mb-4 flex items-start gap-3 pr-12">
            <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-2xl border-[3px] border-slate-950 bg-amber-300 text-slate-950 shadow-[4px_4px_0_#020617]">
              <BellRing size={25} strokeWidth={3} aria-hidden="true" />
            </div>

            <h2 id="aviso-inicial-titulo" className="pt-1 text-2xl font-black leading-tight text-slate-950">
              {aviso.titulo}
            </h2>
          </div>

          <div className="rounded-2xl border-[3px] border-slate-950 bg-white px-4 py-3 shadow-[4px_4px_0_#020617]">
            <p className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-800">
              {aviso.mensagem}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl border-[3px] border-slate-950 bg-[#003366] px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[5px_5px_0_#020617] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            {aviso.botao || 'Entendi'}
          </button>
        </div>
      </div>
    </div>
  );
}
