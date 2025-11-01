import Postmate from "postmate";
import { cloneDeep } from "lodash-es";
import useStore from "../store";
import { useTranspiler } from "./useTranspiler";

const handshake = new Postmate.Model({});
export const usePostmate = () => {
  const store = useStore();
  const { 
    htmlPreview, 
    optimizedHTML, 
    optimizedCSS, 
    optimizedJS, 
    environment 
  } = useTranspiler();

  const emitCode = () => {
    if (!handshake) return;
    handshake?.then(async (parent: any) => {
      console.info("🔄 Emitting optimized code to parent", {
        environment: environment.isGHLCanvas ? 'GHL Canvas' : environment.isPreview ? 'Preview' : 'Live',
        htmlSize: `${Math.round(optimizedHTML.value.length / 1024)}KB`,
        jsSize: `${Math.round(optimizedJS.value.length / 1024)}KB`
      });
      
      parent?.emit("code", {
        // Use optimized output for GHL Canvas
        html: environment.isGHLCanvas ? optimizedHTML.value : htmlPreview.value,
        js: optimizedJS.value,
        css: optimizedCSS.value,
        
        // Environment metadata for debugging
        meta: {
          environment: environment,
          generatedAt: new Date().toISOString(),
          version: '2.0.0'
        },
        
        elementStore: cloneDeep({
          // Business directory data
          businesses: store.businesses.value,
          categories: store.categories.value,
          locations: store.locations.value,
          displayOptions: store.displayOptions.value,
          layoutSettings: store.layoutSettings.value,
          cardStyles: store.cardStyles.value,
          agencySettings: store.agencySettings.value,
          
          // Environment sync metadata
          _environmentSync: {
            lastUpdated: new Date().toISOString(),
            targetEnvironment: environment.isGHLCanvas ? 'ghl-canvas' : 'general'
          }
        }),
      });
    });
  };

  return {
    handshake,
    emitCode,
  };
};
