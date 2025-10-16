import React from 'react';
import type { SelectedRows, Artwork } from '../types';

interface SelectionPanelProps {
  selectedRows: SelectedRows;
  onClearSelection: () => void;
  onSubmit: () => void;
  artworks: Artwork[];
}

const SelectionPanel: React.FC<SelectionPanelProps> = ({
  selectedRows,
  onSubmit,
  artworks
}) => {
  const selectedCount = Object.values(selectedRows).filter(Boolean).length;


  const selectedCodes = artworks
    .filter(artwork => selectedRows[artwork.id])
    .map(artwork => artwork.id.toString());

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="selection-overlay-panel">
      <div className="flex align-items-center gap-3">

        <div className="flex align-items-center gap-2">
          <i className="pi pi-chevron-down"></i>
          <span className="font-medium">Select rows...</span>
        </div>

        <button
          className="p-button p-button-sm submit-btn"
          onClick={onSubmit}
        >
          submit
        </button>


        <div className="selected-codes">
          {selectedCodes.map((code, index) => (
            <span key={code} className="selected-code">
              {code}
              {index < selectedCodes.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;