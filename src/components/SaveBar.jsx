import { useContext, useEffect, useState } from "react";
import { Context as ShopifyContext, Loading } from "@shopify/app-bridge-react";
import { ContextualSaveBar } from "@shopify/app-bridge/actions";

function useContextualSaveBar(save, discard) {
  const [shouldSave, setShouldSave] = useState(false);
  const [shouldDiscard, setShouldDiscard] = useState(false);

  useEffect(() => {
    if (shouldSave) {
      save[0]();
      setShouldSave(false);
    }
  }, [shouldSave, ...save]);

  useEffect(() => {
    if (shouldDiscard) {
      discard[0]();
      setShouldDiscard(false);
    }
  }, [shouldDiscard, ...discard]);

  return [() => setShouldSave(true), () => setShouldDiscard(true)];
}

const SaveBar = ({ showBar, showSaveLoading, disableSave, save, discard }) => {
  const options = {
    saveAction: {
      disabled: disableSave,
      loading: showSaveLoading,
    },
    discardAction: {
      disabled: false,
      loading: false,
      discardConfirmationModal: true,
    },
  };

  const [saveBar] = useState(
    ContextualSaveBar.create(useContext(ShopifyContext), options)
  );
  saveBar.set(options, true);

  const [onSave, onDiscard] = useContextualSaveBar(save, discard);

  useEffect(() => {
    const saveUnsub = saveBar.subscribe(ContextualSaveBar.Action.SAVE, onSave);

    const discardUnsub = saveBar.subscribe(
      ContextualSaveBar.Action.DISCARD,
      onDiscard
    );

    return () => {
      saveUnsub();
      discardUnsub();
    };
  }, []);

  showBar
    ? saveBar.dispatch(ContextualSaveBar.Action.SHOW)
    : saveBar.dispatch(ContextualSaveBar.Action.HIDE);

  return showSaveLoading ? <Loading /> : null;
};

export default SaveBar;
