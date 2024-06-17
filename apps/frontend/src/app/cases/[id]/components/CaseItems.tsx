import { Case } from "../../components/Case";

export const CaseItems = () => {
  return (
    <div className="flex flex-col space-y-5">
      <span className="text-white text-lg">Case Items</span>
      <div className="grid grid-cols-dynamic gap-6 justify-center md:justify-start grid-flow-row-dense">
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
