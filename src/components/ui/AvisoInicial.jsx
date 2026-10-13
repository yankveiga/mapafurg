import { BellRing, X } from 'lucide-react';

export function AvisoInicial({ aviso, onClose }) {
  if (!aviso?.ativo || !aviso.mensagem?.trim()) return null;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-furg-navy/45 px-4 backdrop-blur-sm">
      <div
        className="animate-soft-pop relative w-full max-w-[390px] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_24px_70px_rgba(0,51,102,0.34)] backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aviso-inicial-titulo"
      >
        <div className="flex h-13 items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-5">
          <div className="flex items-center gap-2 text-furg-navy" aria-hidden="true">
            <BellRing size={18} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
              Aviso
            </span>
          </div>

          <span className="rounded-full bg-furg-navy px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm">
            Mapa FURG
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-[64px] z-10 flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:text-furg-navy active:scale-95"
          aria-label="Fechar aviso"
        >
          <X size={18} strokeWidth={3} aria-hidden="true" />
        </button>

        <div className="relative px-5 pb-5 pt-6">
          <div className="mb-4 flex items-start gap-3 pr-12">
            <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-inner">
              <BellRing size={25} strokeWidth={2.5} aria-hidden="true" />
            </div>

            <h2 id="aviso-inicial-titulo" className="pt-1 text-2xl font-black leading-tight text-furg-navy">
              {aviso.titulo}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3">
            <p className="whitespace-pre-wrap text-sm font-bold leading-relaxed text-slate-800">
              {aviso.mensagem}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-furg-navy px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(0,51,102,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-furg-navy-soft active:translate-y-0 active:scale-[0.99]"
          >
            {aviso.botao || 'Entendi'}
          </button>
        </div>
      </div>
    </div>
  );
}
