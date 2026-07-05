export default function PPESummaryFooter() {
  return (
    <div className="flex flex-col">
      {/* Inventory Committee */}
      <div>
        <h3 className="mb-10 uppercase text-[13px]">Inventory Committee :</h3>

        <div className="grid grid-cols-3 uppercase text-[12px]">
          <div className="text-center">
            <div className="underline font-bold">Mary V. Buendia</div>
            <div>Licensing Officer-III</div>

            <div className="underline font-bold mt-10">Roderick J. Palban</div>
            <div>Tax Mapper</div>
          </div>

          <div className="text-center items-center my-auto">
            <div className="underline font-bold">Mathan P. Lucero</div>
            <div>Engineer-III</div>
          </div>

          <div className="text-center">
            <div className="underline font-bold">Gertrudes P. Roa</div>
            <div>Aid-VI</div>

            <div className="underline font-bold mt-10">Doreen O. Evite</div>
            <div>Municipal Accountant</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-8">
        {/* Certified */}
        <div>
          <div className="mb-4 font-bold text-[13px]">
            Certified Correct by:
          </div>
          <div className="text-center text-[12px]">
            <div className="uppercase underline font-bold">
              Marcedito E. Polestico
            </div>
            <div>Supply Officer-III</div>
          </div>
        </div>

        {/* Approved */}
        <div>
          <div className="mt-18 mb-4 font-bold text-[13px]">Approved By:</div>
          <div className="text-center text-[12px]">
            <div className="uppercase underline font-bold">
              Thelma G. Lamanilao,MD.
            </div>
            <div>Municipal Mayor</div>
          </div>
        </div>
      </div>

      {/* Verified */}
      <div className="mt-1 grid grid-cols-8">
        <div className="col-2 mb-4 font-bold text-[13px]">Verified by:</div>
        <div className="border-b border-black" />
        <div className="border-b border-black" />
      </div>
    </div>
  );
}
