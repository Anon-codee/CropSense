
export type CropId =
  | "tomato"
  | "potato"
  | "rice"
  | "wheat";

export type Crop = {
  id: CropId;
  name: string;
  description: string;
  supported: boolean;
};

export const crops: Crop[] = [
  {
    id: "tomato",
    name: "Tomato",
    description: "AI-powered tomato leaf analysis",
    supported: true,
  },
  {
    id: "potato",
    name: "Potato",
    description: "Potato disease detection",
    supported: false,
  },
  {
    id: "rice",
    name: "Rice",
    description: "Rice disease detection",
    supported: false,
  },
  {
    id: "wheat",
    name: "Wheat",
    description: "Wheat disease detection",
    supported: false,
  },
];

export function getCrop(id: string) {
  return crops.find((crop) => crop.id === id);
}