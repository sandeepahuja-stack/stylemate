import { HERO_IDS, getProductById } from "./catalog";
import { getProductDetails } from "./search";
import type { OutfitPiece } from "./types";

const DEFAULT_LOOK: { role: string; id: string; note: string }[] = [
  {
    role: "Anchor",
    id: HERO_IDS.suit,
    note: "A black suit is a canvas. Keep the cut precise and introduce warmth elsewhere.",
  },
  {
    role: "Softness",
    id: HERO_IDS.shirt,
    note: "Cream replaces stark white, warming the complexion against dark wool.",
  },
  {
    role: "Anchor at the hem",
    id: HERO_IDS.loafer,
    note: "Burgundy leather grounds the look with vintage character, never theatrical.",
  },
  {
    role: "Accents",
    id: HERO_IDS.watch,
    note: "A whisper of metallic warmth to tie cream and oxblood together.",
  },
  {
    role: "Finish",
    id: HERO_IDS.belt,
    note: "Dark brown leather, not matching-set black. Intention, not uniform.",
  },
];

export function buildOutfit(anchorId?: string): {
  pieces: OutfitPiece[];
  why: string;
} {
  const anchor = anchorId ? getProductById(anchorId) : getProductById(HERO_IDS.suit);
  const pieces: OutfitPiece[] = DEFAULT_LOOK.map((item) => ({
    role: item.role,
    product: getProductDetails(item.id),
    note: item.note,
  }));

  if (anchor && !pieces.some((p) => p.product.id === anchor.id)) {
    pieces.unshift({
      role: "Selected",
      product: anchor,
      note: "The starting point. Everything else is chosen to serve this piece.",
    });
  }

  return {
    pieces,
    why: "The success of this ensemble lies in avoiding the expected. By swapping a white shirt for cream, and black shoes for burgundy, we create a look that is sophisticated rather than uniform.",
  };
}
