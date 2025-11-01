import Postmate from "postmate";
import { cloneDeep } from "lodash-es";
import useStore from "../store";
import { useTranspiler } from "./useTranspiler";

const handshake = new Postmate.Model({});
export const usePostmate = () => {
  const store = useStore();
  const { htmlPreview, js } = useTranspiler();

  const emitCode = () => {
    if (!handshake) return;
    handshake?.then(async (parent: any) => {
      console.info("Emitting code to parent", parent);
      parent?.emit("code", {
        html: htmlPreview.value,
        js: js.value,
        elementStore: cloneDeep({
          // Business directory data
          businesses: store.businesses.value,
          categories: store.categories.value,
          locations: store.locations.value,
          displayOptions: store.displayOptions.value,
          layoutSettings: store.layoutSettings.value,
          cardStyles: store.cardStyles.value,
          agencySettings: store.agencySettings.value,
        }),
      });
    });
  };

  return {
    handshake,
    emitCode,
  };
};
