import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Button, Checkbox, Center, Loader } from '@mantine/core';
import { trpc } from '~/utils/trpc';
import { CollectionContributorPermission, CollectionType } from '~/shared/utils/prisma/enums';

type CollectionMultiSelectState = {
  MultiSelectButton: React.FC;
  MultiSelectDropdown: React.FC;
  MultiSelectCheckbox: React.FC<{ imageId: number }>;
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

export const getCollectionsItemIsIn = (imageId: number) => {
  // FIXME Create a loading state for the checkbox
  const { data: collectionItems = [], isLoading: loadingStatus } =
    trpc.collection.getUserCollectionItemsByItem.useQuery({
      imageId,
      type: CollectionType.Image,
    });
  return collectionItems.map((item) => item.collectionId);
};

export const CollectionMultiSelectProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMode, setSelectedMode] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  const { data: collections = [], isLoading: loadingCollections } =
    trpc.collection.getAllUser.useQuery({
      permissions: [
        CollectionContributorPermission.ADD,
        CollectionContributorPermission.ADD_REVIEW,
        CollectionContributorPermission.MANAGE,
      ],
      type: CollectionType.Image,
    });

  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCollection(event.target.value);

  // TODO Using CollectionType, create toggling architecture for images vs posts
  const MultiSelectButton: React.FC = () => (
    <Button onClick={() => setSelectedMode(!selectedMode)} color={!selectedMode ? 'green' : 'red'}>
      {!selectedMode ? 'Enter' : 'Exit'} Multi Select Mode
    </Button>
  );

  const MultiSelectDropdown: React.FC = () => {
    if (!selectedMode) return null;

    if (loadingCollections) {
      return (
        <Center p="sm">
          <Loader />
        </Center>
      );
    }

    // TODO Fix styling of dropdown
    return (
      <div style={{ height: '36px', width: '200px', backgroundColor: 'blue' }}>
        <Center>
          <select
            value={selectedCollection}
            onChange={handleSelectionChange}
            style={{ padding: '10px' }}
          >
            <option value="">Select a collection</option>
            {collections.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          {/* TODO Fix styling of close button */}
          <button onClick={() => setSelectedMode(false)}>X</button>
        </Center>
      </div>
    );
  };

  // TODO Get checked status from backend, useEffect on selectedCollection change
  const MultiSelectCheckbox: React.FC<{ imageId: number }> = ({ imageId }) => {
    if (!selectedMode || !selectedCollection) {
      return null;
    }

    const collectionsItemIsIn = getCollectionsItemIsIn(imageId);
    const isChecked = collectionsItemIsIn.includes(Number(selectedCollection));

    const handleCheckboxChange = () => {
      if (isChecked) {
        // TODO Remove from collection
      } else {
        // TODO Add to collection
      }
    };

    return <Checkbox size="xl" checked={isChecked} onChange={handleCheckboxChange} />;
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
