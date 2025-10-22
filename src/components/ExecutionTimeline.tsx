import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: 'instruction' | 'interrupt' | 'isr' | 'restore';
  label: string;
  timestamp: number;
}

interface ExecutionTimelineProps {
  events: TimelineEvent[];
  currentInstruction: string;
}

const eventConfig = {
  instruction: { color: "bg-secondary", label: "EXEC" },
  interrupt: { color: "bg-interrupt", label: "INT" },
  isr: { color: "bg-warning", label: "ISR" },
  restore: { color: "bg-primary", label: "RESTORE" },
};

export const ExecutionTimeline = ({ events, currentInstruction }: ExecutionTimelineProps) => {
  const recentEvents = events.slice(-20);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Execution Timeline</h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 min-h-[80px]">
        <div className="text-xs text-muted-foreground mb-2">Current Instruction</div>
        <div className="font-mono text-lg text-primary font-semibold">
          {currentInstruction || "---"}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {recentEvents.map((event) => {
          const config = eventConfig[event.type];
          return (
            <div
              key={event.id}
              className={`${config.color} min-w-[40px] h-16 rounded flex flex-col items-center justify-center text-xs font-bold transition-smooth hover:scale-110 cursor-pointer`}
              title={event.label}
            >
              <span className="text-background">{config.label}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
