import { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, X } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { calculatorInputSchema } from '../validators/schemas';

const OPERATIONS = [
  { id: '+', symbol: '+', label: 'Add' },
  { id: '-', symbol: '-', label: 'Subtract' },
  { id: '*', symbol: 'x', label: 'Multiply' },
  { id: '/', symbol: '÷', label: 'Divide' },
];

export const Calculator = ({ onCalculateSuccess, onShowToast }) => {
  const [operation, setOperation] = useState('+');
  const [numbersInput, setNumbersInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);

  // Live parsed tokens
  const parsedTokens = useMemo(() => {
    if (!numbersInput.trim()) return [];
    return numbersInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(item => {
        const num = Number(item);
        return {
          raw: item,
          isValid: !isNaN(num)
        };
      });
  }, [numbersInput]);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setValidationError('');

    // Strong client-side validation using Zod
    const validation = calculatorInputSchema.safeParse({
      operation,
      numbersStr: numbersInput
    });

    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || 'Invalid input';
      setValidationError(firstError);
      return;
    }

    // Convert comma-separated input into an array of numbers
    const numbersArray = numbersInput
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
      .map(Number);

    setLoading(true);
    try {
      const res = await fetch('/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          operation,
          numbers: numbersArray
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Calculation failed');
      }

      setCalculationResult(data.data);
      onShowToast(`Result: ${data.data.result}`, 'success');
      if (onCalculateSuccess) {
        onCalculateSuccess(data.data);
      }
    } catch (err) {
      setValidationError(err.message || 'Calculation error occurred.');
      onShowToast(err.message || 'Calculation error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (calculationResult?.result !== undefined) {
      navigator.clipboard.writeText(String(calculationResult.result));
      setCopied(true);
      onShowToast('Result copied', 'info');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setNumbersInput('');
    setValidationError('');
    setCalculationResult(null);
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Calculator</h2>
          <p className="text-xs text-slate-400">Select operation and enter comma-separated numbers</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Reset"
          id="btn-reset-calc"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Operation Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-300">
          Operation
        </label>
        <div className="grid grid-cols-4 gap-2">
          {OPERATIONS.map((op) => {
            const isSelected = operation === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => setOperation(op.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
                id={`op-select-${op.id === '+' ? 'add' : op.id === '-' ? 'sub' : op.id === '*' ? 'mul' : 'div'}`}
              >
                <span className="text-xl font-bold font-mono">{op.symbol}</span>
                <span className="text-xs mt-0.5">{op.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comma-Separated Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="numbers-input" className="block text-xs font-medium text-slate-300">
            Comma-separated numbers
          </label>
          <span className="text-xs text-slate-500 font-mono">
            {parsedTokens.length} {parsedTokens.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            id="numbers-input"
            type="text"
            className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-mono text-base rounded-lg py-2.5 pl-3.5 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g. 10, 20, 5"
            value={numbersInput}
            onChange={(e) => {
              setNumbersInput(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCalculate();
            }}
            autoComplete="off"
          />
          {numbersInput && (
            <button
              type="button"
              onClick={() => setNumbersInput('')}
              className="absolute right-3 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Validation Error Banner */}
        {validationError && (
          <p className="text-xs text-rose-400" role="alert">
            {validationError}
          </p>
        )}
      </div>

      {/* Calculate Button */}
      <Button
        type="button"
        className="w-full"
        size="lg"
        loading={loading}
        onClick={handleCalculate}
        id="btn-calculate"
      >
        Calculate
      </Button>

      {/* Result Display Card */}
      {calculationResult && (
        <div className="p-4 rounded-lg bg-slate-950 border border-indigo-500/30 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
              Status: {calculationResult.status || 'ok'}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-mono">
              {calculationResult.expression}
            </div>
            <div className="text-3xl font-bold font-mono text-white tracking-tight">
              {calculationResult.result}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
