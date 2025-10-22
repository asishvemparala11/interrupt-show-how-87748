import { useState, useEffect, useCallback } from "react";
import { CPUStateDisplay } from "@/components/CPUStateDisplay";
import { InterruptQueue } from "@/components/InterruptQueue";
import { ExecutionTimeline } from "@/components/ExecutionTimeline";
import { ControlPanel } from "@/components/ControlPanel";
import { ISRDisplay } from "@/components/ISRDisplay";
import { CPUState, CPURegisters, Interrupt } from "@/types/interrupt";
import { toast } from "sonner";

const instructions = [
  "MOV R1, #10",
  "ADD R2, R1",
  "LOAD R3, [0x100]",
  "STORE R3, [0x200]",
  "CMP R1, R2",
  "JMP LOOP",
  "NOP",
  "MUL R4, R1",
];

export default function Index() {
  const [cpuState, setCPUState] = useState<CPUState>('idle');
  const [registers, setRegisters] = useState<CPURegisters>({
    PC: "0x0000",
    SP: "0xFFFF",
    ACC: "0x00",
    IR: "---",
  });
  const [interruptQueue, setInterruptQueue] = useState<Interrupt[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentISR, setCurrentISR] = useState<string | null>(null);
  const [instructionIndex, setInstructionIndex] = useState(0);

  const addTimelineEvent = (type: string, label: string) => {
    setTimelineEvents(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      type,
      label,
      timestamp: Date.now(),
    }]);
  };

  const handleInterrupt = useCallback(() => {
    if (interruptQueue.length === 0) return;

    const interrupt = interruptQueue[0];
    
    // Save state
    setCPUState('interrupted');
    addTimelineEvent('interrupt', `${interrupt.type} INT`);
    toast.warning(`Interrupt: ${interrupt.type}`, {
      description: `Priority ${interrupt.priority} - Saving CPU state...`,
    });

    setTimeout(() => {
      // Handle ISR
      setCPUState('handling_isr');
      setCurrentISR(interrupt.type);
      addTimelineEvent('isr', `ISR: ${interrupt.type}`);
      
      setTimeout(() => {
        // Restore state
        setCPUState('restoring');
        addTimelineEvent('restore', 'Restore State');
        
        setTimeout(() => {
          setCPUState('executing');
          setCurrentISR(null);
          setInterruptQueue(prev => prev.slice(1));
          toast.success("Interrupt handled", {
            description: "Resuming normal execution...",
          });
        }, 800);
      }, 1500);
    }, 600);
  }, [interruptQueue]);

  const triggerInterrupt = (type: string, priority: number) => {
    const colors = {
      TIMER: "hsl(var(--interrupt))",
      "I/O": "hsl(var(--warning))",
      KEYBOARD: "hsl(var(--primary))",
    };

    const newInterrupt: Interrupt = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      priority,
      timestamp: Date.now(),
      color: colors[type as keyof typeof colors],
    };

    setInterruptQueue(prev => 
      [...prev, newInterrupt].sort((a, b) => b.priority - a.priority)
    );
    
    toast(`Interrupt triggered: ${type}`, {
      description: `Added to queue with priority ${priority}`,
    });
  };

  useEffect(() => {
    if (!isRunning || cpuState !== 'executing') return;

    const interval = setInterval(() => {
      if (interruptQueue.length > 0 && Math.random() > 0.3) {
        handleInterrupt();
        return;
      }

      const instruction = instructions[instructionIndex % instructions.length];
      setCurrentInstruction(instruction);
      setRegisters(prev => ({
        ...prev,
        PC: `0x${(parseInt(prev.PC, 16) + 2).toString(16).toUpperCase().padStart(4, '0')}`,
        IR: instruction,
        ACC: `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0')}`,
      }));
      
      addTimelineEvent('instruction', instruction);
      setInstructionIndex(prev => prev + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning, cpuState, instructionIndex, interruptQueue, handleInterrupt]);

  const handleToggleRunning = () => {
    if (!isRunning) {
      setCPUState('executing');
      toast.success("Simulation started", {
        description: "CPU is now executing instructions",
      });
    } else {
      setCPUState('idle');
      toast.info("Simulation paused");
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setCPUState('idle');
    setIsRunning(false);
    setInterruptQueue([]);
    setTimelineEvents([]);
    setCurrentInstruction("");
    setCurrentISR(null);
    setInstructionIndex(0);
    setRegisters({
      PC: "0x0000",
      SP: "0xFFFF",
      ACC: "0x00",
      IR: "---",
    });
    toast.info("Simulation reset");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2 pb-6 border-b border-border">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Interrupt Handling Simulator
          </h1>
          <p className="text-muted-foreground">
            Visualize how CPU handles interrupts in real-time
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CPUStateDisplay state={cpuState} registers={registers} />
            <ExecutionTimeline 
              events={timelineEvents} 
              currentInstruction={currentInstruction}
            />
            <ISRDisplay currentISR={currentISR} isActive={cpuState === 'handling_isr'} />
          </div>

          <div className="space-y-6">
            <ControlPanel
              isRunning={isRunning}
              onToggleRunning={handleToggleRunning}
              onReset={handleReset}
              onTriggerInterrupt={triggerInterrupt}
            />
            <InterruptQueue queue={interruptQueue} />
          </div>
        </div>
      </div>
    </div>
  );
}
