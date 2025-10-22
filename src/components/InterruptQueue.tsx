import { Card } from "@/components/ui/card";
import { Interrupt } from "@/types/interrupt";
import { AlertCircle } from "lucide-react";

interface InterruptQueueProps {
  queue: Interrupt[];
}

export const InterruptQueue = ({ queue }: InterruptQueueProps) => {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-interrupt" />
        <h2 className="text-xl font-bold">Interrupt Queue</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          {queue.length} pending
        </span>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {queue.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No interrupts in queue
          </div>
        ) : (
          queue.map((interrupt, index) => (
            <div
              key={interrupt.id}
              className="bg-muted/30 rounded-lg p-3 border border-border animate-slide-in flex items-center justify-between"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full animate-pulse-glow"
                  style={{ backgroundColor: interrupt.color }}
                />
                <div>
                  <div className="font-semibold text-sm">{interrupt.type}</div>
                  <div className="text-xs text-muted-foreground">
                    Priority: {interrupt.priority}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                #{index + 1}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
