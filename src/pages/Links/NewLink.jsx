import { useCallback, useState } from "react";
import { Frame } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { TitleBar, Toast, useAppBridge } from "@shopify/app-bridge-react";

import { PAGE_STATES } from "../../constants";
import { SkeletonLinkPage } from "../../components/SkeletonLinkPage";
import { userLoggedInFetch } from "../../helpers";
import { LinkForm } from "../../components/LinkForm";

const NewLink = () => {
  const navigate = useNavigate();
  const app = useAppBridge();
  const fetchFunction = userLoggedInFetch(app);

  const [toast, setToast] = useState(null);
  const [pageState, setPageState] = useState(PAGE_STATES.idle);

  const pageTitle = "Create checkout link";

  const handleSubmit = useCallback(async (fields) => {
    setPageState(PAGE_STATES.loading);

    let apiRes = null;
    try {
      // Create link
      apiRes = await fetchFunction(`/api/links`, {
        method: "POST",
        body: JSON.stringify(fields),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    } catch (err) {
      console.warn(err);
    }

    // Make sure successful API
    if (!apiRes || !apiRes.id) {
      setPageState(PAGE_STATES.idle);
      setToast({
        show: true,
        content: "Failed to create link. Please try again or contact support",
        error: true,
      });
      return;
    }

    // Show success toast
    setToast({
      show: true,
      content: "Link successfully created!",
    });

    // Redirect to link edit page
    const newLinkId = apiRes.id;
    navigate(`/links/${newLinkId}`, {
      state: {
        new: true,
      },
    });
  }, []);

  if (pageState === PAGE_STATES.loading) {
    return <SkeletonLinkPage />;
  }

  return (
    <Frame>
      <TitleBar
        title={pageTitle}
        breadcrumbs={[{ content: "Dashboard", url: "/" }]}
      />
      <LinkForm
        newForm={true}
        showSuccess={false}
        pageTitle={pageTitle}
        narrowWidth={true}
        pageState={pageState}
        link={{}}
        toast={toast}
        setToast={setToast}
        //
        handleSubmit={handleSubmit}
      />
    </Frame>
  );
};

export default NewLink;
