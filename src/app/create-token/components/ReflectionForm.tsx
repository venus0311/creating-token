import React, { useState } from 'react';
import RadioGroup from './RadioGroup';

const ReflectionForm: React.FC = () => {
  const [feeType, setFeeType] = useState('every');
  const [taxPercentage, setTaxPercentage] = useState('');

  return (
    <div className="pt-6 sm:rounded-xl sm:border sm:border-background-300 sm:p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="block text-sm/[1.5] font-medium text-text-500">Reflection</h3>
          <p className="block text-text-300 text-sm/[1.5]">A fee is collected in your token and redistributed to all holders based on their amount.</p>
        </div>
        <div className="space-y-2">
          <div className="flex w-fit items-center gap-2 rounded-lg bg-[#EBF1FF] px-2.5 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#375DFB" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-[#EBF1FF]">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p className="block font-normal tracking-[-0.006em] text-[14px]/[1.42]">Once set, the reflection tax can't be removed, only adjusted.</p>
          </div>
          <RadioGroup
            options={[
              { value: 'every', label: 'On every transfer' },
              { value: 'swaps', label: 'Only for DEX Swaps' }
            ]}
            selectedValue={feeType}
            onChange={setFeeType}
          />
        </div>
        <div className="space-y-2">
          <label data-optional={false} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="reflection-tax-percentage">
            Tax Percentage
          </label>
          <div className="relative">
            <input
              type="text"
              className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
              placeholder="0"
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(e.target.value)}
              id="reflection-tax-percentage"
            />
            <p className="block text-sm/[1.5] absolute right-4 top-1/2 -translate-y-1/2 font-medium text-text-500">%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionForm;
