'use client'

import VillageLightPoint from './VillageLightPoint'
import type { VillageHeroPlacement, Dialogue, Building, GameState } from '../../types/game'

interface VillagePlacementsListProps {
  placements: VillageHeroPlacement[]
  isPlacementMode: boolean
  hoveredIndex: number | null
  menuOpenIndex: number | null
  gameState: GameState
  onPointHover: (index: number | null) => void
  onPointClick: (index: number) => void
  onPointDelete: (index: number) => void
  onSelectDialogue: (dialogue: Dialogue) => void
  onSelectBuildingUpgrade: (building: Building) => void
  onShowHeroModal: (placement: VillageHeroPlacement) => void
  onShowBuildingModal: (placement: VillageHeroPlacement) => void
}

export default function VillagePlacementsList({
  placements,
  isPlacementMode,
  hoveredIndex,
  menuOpenIndex,
  gameState,
  onPointHover,
  onPointClick,
  onPointDelete,
  onSelectDialogue,
  onSelectBuildingUpgrade,
  onShowHeroModal,
  onShowBuildingModal
}: VillagePlacementsListProps) {
  return (
    <>
      {placements.map((placement, index) => (
        <VillageLightPoint
          key={index}
          placement={placement}
          index={index}
          isPlacementMode={isPlacementMode}
          isHovered={hoveredIndex === index}
          showMenu={menuOpenIndex === index}
          gameState={gameState}
          onHover={onPointHover}
          onClick={onPointClick}
          onDelete={onPointDelete}
          onSelectDialogue={(dialogue) => {
            onSelectDialogue(dialogue)
            onPointClick(-1) // Fermer le menu
          }}
          onSelectBuildingUpgrade={(building) => {
            onSelectBuildingUpgrade(building)
            onPointClick(-1) // Fermer le menu
          }}
          onShowHeroModal={(placement) => {
            onShowHeroModal(placement)
            onPointClick(-1) // Fermer le menu
          }}
          onShowBuildingModal={(placement) => {
            onShowBuildingModal(placement)
            onPointClick(-1) // Fermer le menu
          }}
        />
      ))}
    </>
  )
}
