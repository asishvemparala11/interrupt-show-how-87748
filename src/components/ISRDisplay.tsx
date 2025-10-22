import { Card } from "@/components/ui/card";
import { Code } from "lucide-react";

interface ISRDisplayProps {
  currentISR: string | null;
  isActive: boolean;
}

const isrCode = {
  TIMER: [
    "PUSH ACC",
    "PUSH PC",
    "MOV ACC, TIMER_VALUE",
    "CALL TIMER_HANDLER",
    "POP PC",
    "POP ACC",
    "IRET"
  ],
  "I/O": [
    "PUSH ACC",
    "PUSH PC",
    "IN ACC, PORT_A",
    "CALL IO_HANDLER",
    "POP PC",
    "POP ACC",
    "IRET"
  ],
  KEYBOARD: [
    "PUSH ACC",
    "PUSH PC",
    "IN ACC, KB_PORT",
    "CALL KB_HANDLER",
    "POP PC",
    "POP ACC",
    "IRET"
  ],
};

export const ISRDisplay = ({ currentISR, isActive }: ISRDisplayProps) => {
  const code = currentISR ? isrCode[currentISR as keyof typeof isrCode] : null;

  return (
    <Card className={`p-6 space-y-4 transition-smooth ${isActive ? 'glow-interrupt' : ''}`}>
      <div className="flex items-center gap-3">
        <Code className="w-6 h-6 text-warning" />
        <h2 className="text-xl font-bold">ISR Execution</h2>
        {isActive && (
          <span className="ml-auto text-xs bg-warning/20 text-warning px-3 py-1 rounded-full font-semibold animate-pulse-glow">
            ACTIVE
          </span>
        )}
      </div>

      <div className="bg-background/50 rounded-lg p-4 border border-border min-h-[200px] font-mono text-sm">
        {code ? (
          <div className="space-y-1">
            {code.map((line, index) => (
              <div
                key={index}
                className={`${isActive ? 'text-warning' : 'text-muted-foreground'} transition-smooth`}
              >
                <span className="text-muted-foreground mr-3">{String(index + 1).padStart(2, '0')}</span>
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No ISR currently executing
          </div>
        )}
      </div>
    </Card>
  );
};
