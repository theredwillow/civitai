import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Button } from '@mantine/core';

type CollectionMultiSelectState = {
  MultiSelectButton: React.FC;
  MultiSelectDropdown: React.FC;
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

  const options = ['Collection 1', 'Collection 2', 'Collection 3'];

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCollection(event.target.value);

  const MultiSelectButton: React.FC = () => (
    <Button onClick={() => setSelectedMode(!selectedMode)}>
      {!selectedMode ? 'Enter' : 'Exit'} Multi Select Mode
    </Button>
  );

  const MultiSelectDropdown: React.FC = () => {
    if (!selectedMode) return null;

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
        <button onClick={() => setSelectedMode(false)}>X</button>
      </div>
    );
  };

  return (
    <CollectionMultiSelectContext.Provider
      value={{
        MultiSelectButton,
        MultiSelectDropdown,
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
