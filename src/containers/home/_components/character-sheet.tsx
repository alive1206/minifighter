import { Hero } from "@/types";
import { Tooltip } from "antd";

type Props = {
  hero: Hero;
};

export const CharacterSheet: React.FC<Props> = ({ hero }) => {
  return (
    <div className="flex-1 hero transition-all duration-300 ease-in-out grayscale group cursor-pointer">
      <Tooltip
        title={
          <>
            <h6 className="text-center font-bold">Ultimate</h6>
            <img src={hero.skill} alt="" />
          </>
        }
        trigger="click"
      >
        <img className="h-40 w-56 " src={hero.image} alt="" />
      </Tooltip>
      <div
        className="text-white text-center w-full capitalize mt-2 opacity-0 transition-opacity group-hover:opacity-100 drop-shadow-2xl"
        style={{ textShadow: "1px 1px 2px pink" }}
      >
        {hero.name}
      </div>
    </div>
  );
};
