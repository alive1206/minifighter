import { Hero } from "@/types";
import { Tooltip } from "antd";

type Props = {
  hero: Hero;
};

export const CharacterSheet: React.FC<Props> = ({ hero }) => {
  return (
    <div className="flex-1 transition-all duration-300 ease-in-out group cursor-pointer grayscale hover:grayscale-0 ">
      <Tooltip
        title={
          <>
            <h6 className="text-center font-bold">Ultimate</h6>
            <img src={hero.skill} alt="" />
          </>
        }
        trigger="click"
      >
        <img
          className="h-60 w-72 max-sm:h-40 max-sm:w-56"
          src={hero.image}
          alt=""
        />
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
