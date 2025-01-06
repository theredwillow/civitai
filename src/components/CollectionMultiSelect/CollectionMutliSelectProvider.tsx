import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Button, Checkbox } from '@mantine/core';

type CollectionMultiSelectState = {
  MultiSelectButton: React.FC;
  MultiSelectDropdown: React.FC;
  MultiSelectCheckbox: React.FC;
  selectedMode: boolean;
  setSelectedMode: (mode: boolean) => void;
  selectedCollection: string;
  setSelectedCollection: (collection: string) => void;
};

const CollectionMultiSelectContext = createContext<CollectionMultiSelectState | null>(null);

export const useCollectionMultiSelectContext = () => {
  const context = useContext(CollectionMultiSelectContext);
  // FIXME This error should not be catastrophic
  if (!context) throw new Error('CollectionMultiSelectContext not in tree');
  return context;
};

export const CollectionMultiSelectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMode, setSelectedMode] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  // TODO Get collections from backend using trpc like AddToCollectionModal does
  const options = ['Collection 1', 'Collection 2', 'Collection 3'];

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCollection(event.target.value);

  // TODO Create toggling architecture for images vs posts
  const MultiSelectButton: React.FC = () => (
    <Button onClick={() => setSelectedMode(!selectedMode)} color={!selectedMode ? 'green' : 'red'}>
      {!selectedMode ? 'Enter' : 'Exit'} Multi Select Mode
    </Button>
  );

  const MultiSelectDropdown: React.FC = () => {
    if (!selectedMode) return null;

    // TODO Fix styling of dropdown
    return (
      <div style={{ height: '36px', backgroundColor: 'blue' }}>
        <select
          value={selectedCollection}
          onChange={handleSelectionChange}
          style={{ width: '100%', padding: '5px' }}
        >
          <option value="">Select a collection</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {/* TODO Fix styling of close button */}
        <button onClick={() => setSelectedMode(false)}>X</button>
      </div>
    );
  };

  // TODO Get checked status from backend, useEffect on selectedCollection change
  const MultiSelectCheckbox: React.FC = () => {
    if (selectedMode) return <Checkbox size="xl" />;
    return null;
  };

  return (
    <CollectionMultiSelectContext.Provider
      value={{
        MultiSelectButton,
        MultiSelectDropdown,
        MultiSelectCheckbox,
        selectedMode,
        setSelectedMode,
        selectedCollection,
        setSelectedCollection,
      }}
    >
      {children}
    </CollectionMultiSelectContext.Provider>
  );
};
