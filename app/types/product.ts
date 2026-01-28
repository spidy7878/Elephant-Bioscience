export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface Media {
  id: number;
  url: string;
  mime?: string;
  name?: string;
}

export interface chemicalProperties {
  id: number;
  molecularFormula: string;
  molecularWeight: number;
  moinostropicMass: number;
  polarArea: number;
  complexity: number;
  xLogP: number;
  atomCount: number;
  hydrogenBondCount: number;
  hydrogenAcceptCount: number;
  CID: number;
  title1: string;
  title2: string;
  title3: string;
  IUPACname: string;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  description: RichTextBlock[];
  price: number;
  quantity: string;
  purity: string;
  aplc: string;
  storage: string;
  references: RichTextBlock[];
  productVideo: Media[];
  thirdpartytesting: Media[];
  category?: string;
  chemicalProperties: chemicalProperties;
  coa: Media[];
  chemicalFormulaImg: Media[];
}
