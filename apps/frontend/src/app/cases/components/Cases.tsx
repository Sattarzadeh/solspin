import { Case } from "./Case";

const cases = [
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
  {
    name: "Watson Power",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "Hot",
    image: "/cases/dota_3.svg",
  },
  {
    name: "Fire Hand Mystery",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-example-2.svg",
  },
  {
    name: "AlphaGo Challenge",
    price: 4.99,
    rarity: "Extrodinary",
    tag: "New",
    image: "/cases/case-examle-3.svg",
  },
];

export const Cases = () => {
  return (
    <div className="grid grid-cols-dynamic gap-6 justify-center grid-flow-row-dense cases-container">
      {cases.map((item, index) => (
        <Case key={index} {...item} />
      ))}
    </div>
  );
};
