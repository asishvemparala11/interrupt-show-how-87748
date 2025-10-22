export type CPUState = 'idle' | 'executing' | 'interrupted' | 'handling_isr' | 'restoring';

export interface Interrupt {
  id: string;
  type: string;
  priority: number;
  timestamp: number;
  color: string;
}

export interface CPURegisters {
  PC: string;  // Program Counter
  SP: string;  // Stack Pointer
  ACC: string; // Accumulator
  IR: string;  // Instruction Register
}

export interface ExecutionState {
  currentInstruction: string;
  instructionCount: number;
  cycleCount: number;
}
