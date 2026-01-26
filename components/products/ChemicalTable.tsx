const ChemicalTable = ({ product }: { product: any }) => {
  const cp = product?.chemicalProperties;

  function formatChemicalFormula(formula: any) {
  if (!formula || typeof formula !== "string") return "-";

  return formula
    .replace(/\\mathbf\{([^}]*)\}_\{([^}]*)\}/g, "$1$2")
    .replace(/[{}()\\]/g, "");
}



  const structureImg = product?.chemicalFormulaImg?.[0]
      ?.url
      ? `${process.env.NEXT_PUBLIC_API_URL}${product.chemicalFormulaImg[0].url}`
      : "";

  const rows = [
    ["Molecular Formula", cp?.molecularFormaula],
    ["Molecular Weight", cp?.molecularWeight],
    ["Monoisotopic Mass", cp?.moinostropicMass],
    ["Polar Area", cp?.polarArea],
    ["Complexity", cp?.complexity],
    ["XLogP", cp?.xLogP],
    ["Heavy Atom Count", cp?.atomCount],
    ["Hydrogen Bond Donor Count", cp?.hydrogenBondCount],
    ["Hydrogen Bond Acceptor Count", cp?.hydrogenAccpetCount],
    ["CID", cp?.CID],
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      
      {/* LEFT TABLE */}
      <div className="bg-white rounded-xl border p-5">
        <table className="w-full text-sm">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} className="border-b last:border-none">
                <td className="py-3 font-medium text-gray-700">
                  {label}
                </td>
                <td className="py-3 text-right text-gray-900 break-all max-w-[260px] leading-relaxed">
                  {typeof value === "string" ? formatChemicalFormula(value) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT IMAGE */}
      <div className="bg-white rounded-xl border p-5 flex items-center justify-center">
        <div className="w-[280px] h-[280px] flex items-center justify-center bg-gray-50 rounded-lg">
          {structureImg ? (
            <img
              src={structureImg}
              alt="Structure"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-sm text-gray-400">No structure image</span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ChemicalTable;


