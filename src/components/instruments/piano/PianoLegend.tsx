export function PianoLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap justify-center">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded bg-[#f59e0b]" />
        <span>Tônica</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded bg-[#8b5cf6]" />
        <span>Notas do acorde</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded bg-[#0ea5e9]" />
        <span>Baixo (slash)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0ea5e9] text-white">
          D
        </span>
        <span>Mão direita</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b] text-white">
          E
        </span>
        <span>Mão esquerda</span>
      </div>
    </div>
  );
}
