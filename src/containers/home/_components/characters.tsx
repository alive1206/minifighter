"use client";

import { classNames, HEROES_FURY, HEROES_NORMAL, HEROES_POWER } from "@/utils";
import { CharacterSheet } from "./character-sheet";
import { map } from "lodash";
import { Select } from "antd";
import { useAtom } from "jotai";
import { selectedFormState } from "@/jotai";

export const Characters = () => {
  const [formSelected, setFormSelected] = useAtom(selectedFormState);
  return (
    <div className="mt-6">
      <h3
        className="text-white text-center uppercase font-bold text-4xl mb-6"
        style={{ textShadow: "1px 1px 2px pink" }}
      >
        <span className="border-b-[3px] border-orange-500">Characters</span>
      </h3>

      {/* Sheet Characters */}
      <div>
        <h4 className="text-white uppercase font-bold text-lg mb-2 text-center">
          <span className=" border-orange-500 pl-1">
            <Select
              className="custom-select md:w-1/4 w-full rounded-lg !text-center !bg-[#1E293D] !text-white hover:!border-orange-500 mb-2"
              value={formSelected}
              onChange={setFormSelected}
              options={[
                { value: "normal", label: "NORMAL CHARACTERS" },
                { value: "power", label: "POWER CHARACTERS" },
                { value: "fury", label: "FURY CHARACTERS" },
              ]}
              size="large"
            />
          </span>
        </h4>
        <div className="flex justify-center ">
          <div
            className={classNames(
              "w-3/4 grid grid-cols-8 max-sm:grid-cols-4 max-lg:w-full"
            )}
          >
            {map(
              formSelected === "normal"
                ? HEROES_NORMAL
                : formSelected === "power"
                ? HEROES_POWER
                : HEROES_FURY,
              (hero) => (
                <CharacterSheet hero={hero} key={hero.id} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
