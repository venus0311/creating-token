import React, { useState } from 'react';
import RadioGroup from './RadioGroup';

const BurnFeeForm: React.FC = () => {
  const [feeType, setFeeType] = useState('every');
  const [taxPercentage, setTaxPercentage] = useState('');

  return (
    <div className="pt-6 sm:rounded-xl sm:border sm:border-background-300 sm:p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="block text-sm/[1.5] font-medium text-text-500">Burn Fee</h3>
          <p className="block text-text-300 text-sm/[1.5]">A fee is collected in your token and permanently removed (burned).</p>
        </div>
        <div className="space-y-2">
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
          <label data-optional={false} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="burn-tax-percentage">
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
              id="burn-tax-percentage"
            />
            <p className="block text-sm/[1.5] absolute right-4 top-1/2 -translate-y-1/2 font-medium text-text-500">%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnFeeForm;
