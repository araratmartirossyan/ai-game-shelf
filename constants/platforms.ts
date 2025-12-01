export const PLATFORMS = [
  { value: "PC", label: "PC" },
  { value: "PS1", label: "PlayStation 1" },
  { value: "PS2", label: "PlayStation 2" },
  { value: "PS3", label: "PlayStation 3" },
  { value: "PS4", label: "PlayStation 4" },
  { value: "PS5", label: "PlayStation 5" },
  { value: "Xbox", label: "Xbox" },
  { value: "Xbox 360", label: "Xbox 360" },
  { value: "Xbox One", label: "Xbox One" },
  { value: "Xbox Series X/S", label: "Xbox Series X/S" },
  { value: "Nintendo Switch", label: "Nintendo Switch" },
  { value: "Nintendo Wii", label: "Nintendo Wii" },
  { value: "Nintendo Wii U", label: "Nintendo Wii U" },
  { value: "Nintendo 3DS", label: "Nintendo 3DS" },
  { value: "Nintendo DS", label: "Nintendo DS" },
  { value: "Game Boy", label: "Game Boy" },
  { value: "Mobile", label: "Mobile" },
  { value: "Other", label: "Other" },
] as const;

export const PLATFORM_OPTIONS = PLATFORMS.map((p) => ({
  value: p.value,
  label: p.label,
}));

