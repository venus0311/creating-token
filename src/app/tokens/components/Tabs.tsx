import { TabItem } from './tabTypes';

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ items, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px space-x-8">
        {items.map((tab) => (
          <button
            key={tab.id}
            className={`py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-b-2 border-[#f17b2c] text-[#f17b2c]'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:bg-[#fffaf3]'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
