import { Component, computed, signal } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export type Slot = { start: string; end: string; busy: boolean };

@Component({
  selector: 'app-agendar',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './agendar.html',
  styleUrls: ['./agendar.css'],
})
export class AgendarComponent {
  date = signal(new Date().toISOString().slice(0, 10));
  slots = signal<Slot[]>(this.buildSlots());
  selected = signal<Slot | null>(null);
  msg = signal<string | null>(null);

  summary = computed(() => {
    const s = this.selected();
    return s ? `Seleccionado: ${s.start} → ${s.end}` : 'Selecciona un horario.';
  });

  setDate(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.date.set(v);
    this.selected.set(null);
    this.msg.set(null);
    this.slots.set(this.buildSlots());
  }

  pick(s: Slot) {
    if (s.busy) return;

    const cur = this.selected();
    const same = cur && cur.start === s.start && cur.end === s.end;

    this.selected.set(same ? null : s);
    this.msg.set(null);
  }

  isSelected(s: Slot) {
    const cur = this.selected();
    return !!cur && cur.start === s.start && cur.end === s.end;
  }

  confirm() {
    const s = this.selected();
    if (!s) return;

    // demo (después esto llama al backend)
    this.msg.set(`Reserva lista (demo): ${this.date()} ${s.start} → ${s.end}`);
  }

  private buildSlots(): Slot[] {
    const out: Slot[] = [];
    for (let m = 8 * 60; m < 22 * 60; m += 30) {
      const start = this.hm(m);
      const end = this.hm(m + 30);
      const busy = (m % 120 === 0); // demo: ocupado cada 2 horas
      out.push({ start, end, busy });
    }
    return out;
  }

  private hm(min: number) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
}
