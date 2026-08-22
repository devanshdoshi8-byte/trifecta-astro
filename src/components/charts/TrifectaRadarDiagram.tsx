import React from 'react';
import { EvidenceConstellation } from './EvidenceConstellation';

interface TrifectaRadarDiagramProps {
  activePillar?: 'chromaticity' | 'morphology' | 'plausibility' | 'all';
  onSelectPillar?: (pillar: 'chromaticity' | 'morphology' | 'plausibility') => void;
}

export const TrifectaRadarDiagram: React.FC<TrifectaRadarDiagramProps> = ({
  activePillar = 'chromaticity',
  onSelectPillar
}) => {
  return (
    <EvidenceConstellation
      activePillar={activePillar === 'all' ? 'chromaticity' : activePillar}
      onSelectPillar={onSelectPillar}
    />
  );
};

