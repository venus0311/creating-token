import TokenTypeSection from './components/TokenTypeSection';
import CreateTokenContainer from './components/CreateTokenContainer';

export default function CreateTokenPage() {
  return (
    <CreateTokenContainer>
      <div className="space-y-8 py-8">
        <div>
          <h1 className="block text-2xl/[1.5] font-bold text-text-500">
            Create your token…
          </h1>
          <p className="block text-text-300 text-sm/[1.5] mt-2">
            You can launch a ERC-20, ERC-721, or ERC-1155 token by selecting one of the options below.
          </p>
        </div>
        
        <TokenTypeSection showChevron={false} isExpanded={true} />
      </div>
    </CreateTokenContainer>
  );
}
