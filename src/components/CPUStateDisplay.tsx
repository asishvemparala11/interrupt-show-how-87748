import { Card } from "@/components/ui/card";
import { CPUState, CPURegisters } from "@/types/interrupt";
import { Cpu } from "lucide-react";

interface CPUStateDisplayProps {
  state: CPUState;
  registers: CPURegisters;
}

const stateConfig = {
  idle: { label: "IDLE", color: "text-muted-foreground", bg: "bg-muted/30" },
  executing: { label: "EXECUTING", color: "text-secondary", bg: "bg-secondary/20" },
  interrupted: { label: "INTERRUPTED", color: "text-interrupt", bg: "bg-interrupt/20 animate-interrupt-flash" },
  handling_isr: { label: "HANDLING ISR", color: "text-warning", bg: "bg-warning/20" },
  restoring: { label: "RESTORING", color: "text-primary", bg: "bg-primary/20" },
};

export const CPUStateDisplay = ({ state, registers }: CPUStateDisplayProps) => {
  const config = stateConfig[state];

  return (
    <Card className="p-6 space-y-4 transition-smooth">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold">CPU Status</h2>
        </div>
        <div className={`px-4 py-2 rounded-lg ${config.bg} ${config.color} font-bold text-sm tracking-wider`}>
          {config.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(registers).map(([key, value]) => (
          <div key={key} className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="text-xs text-muted-foreground mb-1">{key}</div>
            <div className="font-mono text-sm text-primary font-semibold">{value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
