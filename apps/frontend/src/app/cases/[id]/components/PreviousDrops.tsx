import { Case } from "../../components/Case";

export const PreviousDrops = () => {
  return (
    <div className="flex flex-col space-y-8">
      <span className="text-white text-lg">Previous Drops</span>
      <div className="flex justify-start items-center w-full h-64 rounded-md space-x-6 overflow-auto">
        <Case
          key="Watson Power"
          name="Watson Power"
          price={4.99}
          rarity="Extrodinary"
          tag="Hot"
          image="/cases/dota_3.svg"
        />
        <Case
          key="Fire Hand Mystery"
          name="Fire Hand Mystery"
          price={4.99}
          rarity="Extrodinary"
          tag="New"
          image="/cases/case-example-2.svg"
        />
        <Case
          key="AlphaGo Challenge"
          name="AlphaGo Challenge"
          price={4.99}
          rarity="Extrodinary"
          tag="New"
          image="/cases/case-examle-3.svg"
        />
      </div>
    </div>
  );
};
