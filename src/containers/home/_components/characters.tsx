import { HEROES_FURY, HEROES_NORMAL, HEROES_POWER } from "@/utils";
import { CharacterSheet } from "./character-sheet";
import { map } from "lodash";

export const Characters = () => {
  return (
    <div className="mt-6">
      <h3
        className="text-white text-center uppercase font-bold text-4xl mb-6"
        style={{ textShadow: "1px 1px 2px pink" }}
      >
        <span className="border-b-[3px] border-orange-500">Characters</span>
      </h3>

      {/* Normal Character */}
      <div>
        <h4 className="text-white uppercase font-bold text-lg mb-2">
          <span className="border-l-[3px] border-orange-500 pl-1">
            Normal Characters
          </span>
        </h4>
        <div className="flex justify-center ">
          <div className=" w-3/4 flex max-lg:grid max-lg:grid-cols-8 max-lg:w-full">
            {map(HEROES_NORMAL, (hero) => (
              <CharacterSheet hero={hero} key={hero.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Power Character */}
      <div>
        <h4 className="text-white uppercase font-bold text-lg mb-2">
          <span className="border-l-[3px] border-orange-500 pl-1">
            Power Characters
          </span>
        </h4>
        <div className="flex justify-center ">
          <div className=" w-3/4 flex max-lg:grid max-lg:grid-cols-8 max-lg:w-full">
            {map(HEROES_POWER, (hero) => (
              <CharacterSheet hero={hero} key={hero.id} />
            ))}
          </div>
        </div>
      </div>

      {/* Fury Character */}
      <div>
        <h4 className="text-white uppercase font-bold text-lg mb-2">
          <span className="border-l-[3px] border-orange-500 pl-1">
            Fury Characters
          </span>
        </h4>
        <div className="flex justify-center ">
          <div className=" w-3/4 flex max-lg:grid max-lg:grid-cols-8 max-lg:w-full">
            {map(HEROES_FURY, (hero) => (
              <CharacterSheet hero={hero} key={hero.id} />
            ))}
          </div>
        </div>
      </div>

      <img src="/test/bonny.png" />
    </div>
  );
};
