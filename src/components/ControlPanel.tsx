import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

interface ControlPanelProps {
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onTriggerInterrupt: (type: string, priority: number) => void;
}

const interruptTypes = [
  { type: "TIMER", priority: 3, color: "hsl(var(--interrupt))" },
  { type: "I/O", priority: 2, color: "hsl(var(--warning))" },
  { type: "KEYBOARD", priority: 1, color: "hsl(var(--primary))" },
];

export const ControlPanel = ({
  isRunning,
  onToggleRunning,
  onReset,
  onTriggerInterrupt,
}: ControlPanelProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-6 h-6 text-interrupt" />
        <h2 className="text-xl font-bold">Control Panel</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={onToggleRunning}
            variant={isRunning ? "secondary" : "default"}
            className="flex-1 gap-2"
            size="lg"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
            Trigger Interrupt
          </h3>
          <div className="space-y-2">
            {interruptTypes.map((interrupt) => (
              <Button
                key={interrupt.type}
                onClick={() => onTriggerInterrupt(interrupt.type, interrupt.priority)}
                variant="outline"
                className="w-full justify-start gap-3 hover:glow-interrupt"
                disabled={!isRunning}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: interrupt.color }}
                />
                <span>{interrupt.type}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  P{interrupt.priority}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
