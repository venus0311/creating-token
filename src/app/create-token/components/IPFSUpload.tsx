import React from 'react';

interface IPFSUploadProps {
  value: string;
  onChange: (value: string) => void;
}

const IPFSUpload: React.FC<IPFSUploadProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <label 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" 
        htmlFor="ipfs-url"
      >
        IPFS URL
      </label>
      <input
        type="text"
        className="flex h-10 w-full items-center rounded-[10px] border bg-bg-white-0 px-3 text-sm/[1.5] placeholder:text-text-soft-400 disabled:pointer-events-none disabled:bg-bg-weak-100 disabled:opacity-60 group-[.field]:flex-1 focus-visible:ring-2 focus-visible:ring-text-main-900/40 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-white-0"
        placeholder="ipfs://bafybeicsrc4uvtqnkriwcaxsqk5xsctjdvzdfg3kmj3ylm7toh4xdbw3ue/"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        id="ipfs-url"
      />
    </div>
  );
};

export default IPFSUpload;
