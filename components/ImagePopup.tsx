import { useState, type CSSProperties } from 'react';
import { Furniture } from '../lib/api';

interface ImagePopupProps {
  imageUrl: string;
  furniture: Furniture;
  onClose: () => void;
}

export default function ImagePopup({ imageUrl, furniture, onClose }: ImagePopupProps) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const edges: { name: 'top' | 'bottom' | 'left' | 'right'; dimension: string; style: CSSProperties }[] = [
    { name: 'top', dimension: `${furniture.height}cm`, style: { top: 0, left: '50%', transform: 'translateX(-50%)' } },
    { name: 'bottom', dimension: `${furniture.height}cm`, style: { bottom: 0, left: '50%', transform: 'translateX(-50%)' } },
    { name: 'left', dimension: `${furniture.width}cm`, style: { left: 0, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl' } },
    { name: 'right', dimension: `${furniture.width}cm`, style: { right: 0, top: '50%', transform: 'translateY(-50%)', writingMode: 'vertical-rl' } },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 z-10"
        >
          ✕
        </button>
        <div className="relative">
          <img
            src={imageUrl}
            alt={furniture.name}
            className="max-w-full max-h-[90vh] object-contain"
          />
          {edges.map((edge) => (
            <div
              key={edge.name}
              className={`absolute bg-black bg-opacity-70 text-white px-3 py-2 rounded pointer-events-none transition-opacity ${
                hoveredEdge === edge.name ? 'opacity-100' : 'opacity-0'
              }`}
              style={edge.style}
            >
              {edge.dimension}
            </div>
          ))}
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded">
            <div className="text-sm font-semibold mb-1">Dimensions:</div>
            <div className="text-xs">
              W: {furniture.width}cm × H: {furniture.height}cm × D: {furniture.depth}cm
            </div>
          </div>
          <div
            className="absolute inset-0 pointer-events-auto"
            onMouseEnter={() => setHoveredEdge('top')}
            onMouseLeave={() => setHoveredEdge(null)}
            style={{ top: 0, left: 0, right: 0, height: '10%' }}
          />
          <div
            className="absolute inset-0 pointer-events-auto"
            onMouseEnter={() => setHoveredEdge('bottom')}
            onMouseLeave={() => setHoveredEdge(null)}
            style={{ bottom: 0, left: 0, right: 0, height: '10%' }}
          />
          <div
            className="absolute inset-0 pointer-events-auto"
            onMouseEnter={() => setHoveredEdge('left')}
            onMouseLeave={() => setHoveredEdge(null)}
            style={{ left: 0, top: 0, bottom: 0, width: '10%' }}
          />
          <div
            className="absolute inset-0 pointer-events-auto"
            onMouseEnter={() => setHoveredEdge('right')}
            onMouseLeave={() => setHoveredEdge(null)}
            style={{ right: 0, top: 0, bottom: 0, width: '10%' }}
          />
        </div>
      </div>
    </div>
  );
}

