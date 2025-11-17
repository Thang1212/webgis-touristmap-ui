import { useState, useCallback } from "react";
import type { LayerConfig } from "../page/mappape/components/LayerControl";
import { INITIAL_LAYERS } from "../constants/map-constants";

export const useLayerManagement = () => {
  //const [layers, setLayers] = useState<LayerConfig[]>(INITIAL_LAYERS);
    const [layers, setLayers] = useState(() =>
      INITIAL_LAYERS.map((layer, index) => ({
        ...layer,
        visible: index === 0 || index === 1, // chỉ bật layer đầu tiên
      }))
    );
  const handleLayerToggle = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const handleOpacityChange = useCallback(
    (layerId: string, opacity: number) => {
      setLayers((prev) =>
        prev.map((layer) =>
          layer.id === layerId ? { ...layer, opacity } : layer
        )
      );
    },
    []
  );

  const getLayerConfig = useCallback(
    (layerId: string) => {
      return layers.find((l) => l.id === layerId);
    },
    [layers]
  );

  return {
    layers,
    handleLayerToggle,
    handleOpacityChange,
    getLayerConfig,
  };
};